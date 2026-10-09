#!/usr/bin/env python3
"""Build the puppy growth-ratio table for PawScales (/puppy-weight-calculator/).

One-off data step. Never run at runtime.

Source:
  Salt C, Morris PJ, German AJ, et al. "Growth standard charts for monitoring
  bodyweight in dogs of different sizes." PLoS ONE 2017;12(9):e0182064.
  https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/
  Open data (CC BY 4.0): https://datacat.liverpool.ac.uk/377/
  (file Final_Data_PLOS.zip; readme .../3/Salt_PuppyGrowthCharts_Readme.txt)
  2024 correction (PLoS One 2024;19(11):e0314711) fixes only the Data
  Availability statement; it does not change the data, categories or method.

Body-condition handling (v3 per-dog filter, Policy C everywhere; approved
2026-10-10 after the C-vs-B 3% guard showed Policy B runs ~4-5% heavier-for-age):
  - Drop any dog that has a RECORDED 'Thin' or 'Heavy' visit at any age.
  - Keep dogs whose body condition at 2-3 years (recorded, else predicted) is
    'Normal'; use ALL their growth visits in 0.20-2.25 y (still requiring a
    preventive/healthy visit, not-yet-neutered, valid weight).
  - Age bins: weekly 12-28 wk; then across the adolescent gap (28-52 wk) use the
    finest coarse tiling (8-week, else 12-week) whose bins all reach n>=200; then
    4-weekly 52-104 wk. Keep any bin with n>=200 as OBSERVED.
  - Build the monotone isotonic (non-decreasing, capped 1.0) median curve from
    observed points. At the reference weeks 12/16/20/24/32/40/52/78 that are not
    observed, add INTERPOLATED points (linear on the observed curve). Every point
    records source ("observed"/"interpolated") and binWeeks.

Categories by AV_BREED_WEIGHT: I <6.5; II 6.5-<9; III 9-<15; IV 15-<30; V 30-<40
kg; drop >=40. ratio = WEIGHT / AV_BREED_WEIGHT.
"""

from __future__ import annotations

import json
import datetime as dt
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.isotonic import IsotonicRegression

ROOT = Path(__file__).resolve().parent.parent
RAW_CSV = ROOT / "data" / "raw" / "Final_Data_PLOS.csv"
CACHE = ROOT / "data" / "raw" / "growth_c.pkl"  # gitignored Policy-C visit cache
OUT_JSON = ROOT / "data" / "growth-ratios.json"
OUT_SUMMARY = ROOT / "data" / "growth-ratios-summary.md"

WEEKS_PER_YEAR = 365.25 / 7.0

CATEGORIES = [("I", 0.0, 6.5), ("II", 6.5, 9.0), ("III", 9.0, 15.0),
              ("IV", 15.0, 30.0), ("V", 30.0, 40.0)]
CAT_NAMES = [c[0] for c in CATEGORIES]

MIN_N = 200
ADULT_LO, ADULT_HI = 2.0, 3.0
CHUNK = 2_000_000
REF_WEEKS = [12, 16, 20, 24, 32, 40, 52, 78]

USECOLS = ["NEUTER_DATE", "VISIT_DATE", "VISIT_AGE", "WEIGHT", "BCS_RECORDED",
           "BCS_PREDICTED", "PREVENTIVE_CARE_VISIT", "HEALTHY_PET_DIAGNOSIS",
           "AV_BREED_WEIGHT", "PET_ID"]


def category_of(av: pd.Series) -> pd.Series:
    cat = pd.Series(pd.NA, index=av.index, dtype="object")
    for name, lo, hi in CATEGORIES:
        cat = cat.mask((av >= lo) & (av < hi), name)
    return cat


def effective_bc(rec: pd.Series, pred: pd.Series) -> pd.Series:
    rec = rec.astype("string").str.strip().str.lower()
    pred = pred.astype("string").str.strip().str.lower()
    has_rec = rec.notna() & ~rec.isin(["none", "nan", ""])
    return rec.where(has_rec, pred)


def build_policy_c() -> pd.DataFrame:
    """One pass over the CSV; return Policy-C growth visits (PET_ID, CAT, WEEKS,
    RATIO). Cached to a pickle so assembly can be re-run without re-reading."""
    if CACHE.exists():
        print(f"Loading cached Policy-C visits from {CACHE}")
        return pd.read_pickle(CACHE)

    bad_dogs: set = set()
    adult_normal: set = set()
    parts = []
    total_raw = 0
    reader = pd.read_csv(
        RAW_CSV, usecols=USECOLS, chunksize=CHUNK,
        dtype={c: "string" for c in USECOLS if c != "PET_ID"} | {"PET_ID": "int64"})
    for i, ch in enumerate(reader):
        total_raw += len(ch)
        rec_l = ch["BCS_RECORDED"].astype("string").str.strip().str.lower()
        bad_dogs.update(ch.loc[rec_l.isin(["thin", "heavy"]), "PET_ID"].tolist())

        age = pd.to_numeric(ch["VISIT_AGE"], errors="coerce")
        bc_all = effective_bc(ch["BCS_RECORDED"], ch["BCS_PREDICTED"])
        adult = (age >= ADULT_LO) & (age < ADULT_HI)
        adult_normal.update(ch.loc[adult & (bc_all == "normal"), "PET_ID"].tolist())

        w = pd.to_numeric(ch["WEIGHT"], errors="coerce")
        av = pd.to_numeric(ch["AV_BREED_WEIGHT"], errors="coerce")
        prev = ch["PREVENTIVE_CARE_VISIT"].astype("string").str.strip().str.upper()
        heal = ch["HEALTHY_PET_DIAGNOSIS"].astype("string").str.strip().str.upper()
        neuter = ch["NEUTER_DATE"].astype("string").str.strip()
        vday = ch["VISIT_DATE"].astype("string").str.slice(0, 10)
        nday = neuter.str.slice(0, 10)
        not_neut = neuter.str.lower().eq("unknown") | neuter.isna() | (nday > vday)
        keep = (w.notna() & av.notna() & age.notna() & (w > 0) & (av > 0)
                & ((prev == "Y") | (heal == "Y")) & (age >= 0.20) & (age <= 2.25)
                & not_neut)
        g = pd.DataFrame({
            "PET_ID": ch["PET_ID"].astype("int64"),
            "CAT": category_of(av),
            "WEEKS": (age * WEEKS_PER_YEAR).astype("float32"),
            "RATIO": (w / av).astype("float32"),
        })[keep]
        parts.append(g[g["CAT"].notna()])
        print(f"  chunk {i + 1}: {total_raw:,} rows cumulative", flush=True)

    growth = pd.concat(parts, ignore_index=True)
    c_eligible = adult_normal - bad_dogs
    print(f"Total raw rows: {total_raw:,}")
    print(f"Dogs excluded (recorded Thin/Heavy): {len(bad_dogs):,}")
    print(f"Dogs Normal at 2-3y: {len(adult_normal):,}")
    print(f"Policy C eligible dogs: {len(c_eligible):,}")
    mask = np.isin(growth["PET_ID"].to_numpy(),
                   np.fromiter(c_eligible, dtype=np.int64))
    gc = growth[mask].reset_index(drop=True)
    gc["CAT"] = gc["CAT"].astype("category")
    gc.attrs["total_raw"] = total_raw
    gc.attrs["bad_dogs"] = len(bad_dogs)
    gc.attrs["adult_normal"] = len(adult_normal)
    gc.attrs["c_eligible"] = len(c_eligible)
    gc.to_pickle(CACHE)
    return gc


def stats_for(r: pd.Series) -> dict | None:
    n = int(r.shape[0])
    if n < MIN_N:
        return None
    return {"n": n, "p25": float(np.percentile(r, 25)),
            "median": float(np.percentile(r, 50)),
            "p75": float(np.percentile(r, 75))}


def observed_points(sub: pd.DataFrame) -> list[dict]:
    """Observed bins for one band: weekly 12-28, coarse gap 28-52, 4-weekly 52-104."""
    weeks = sub["WEEKS"].to_numpy()
    ratio = sub["RATIO"].to_numpy()
    pts = []

    def add(lo, hi, width):
        m = (weeks >= lo) & (weeks < hi)
        s = stats_for(pd.Series(ratio[m]))
        if s:
            pts.append({"weeks": int(lo), "binWeeks": width, "source": "observed", **s})
            return True
        return False

    # weekly puppy region 12..28
    for wk in range(12, 28):
        add(wk, wk + 1, 1)

    # adolescent gap 28..52: finest tiling whose every bin reaches MIN_N
    def tiling_ok(width):
        edges = list(range(28, 52, width)) + [52]
        return all(
            pd.Series(ratio[(weeks >= a) & (weeks < b)]).shape[0] >= MIN_N
            for a, b in zip(edges[:-1], edges[1:]))

    gap_width = 8 if tiling_ok(8) else 12
    edges = list(range(28, 52, gap_width)) + [52]
    for a, b in zip(edges[:-1], edges[1:]):
        add(a, b, gap_width)  # keeps only bins with n>=MIN_N

    # 4-weekly region 52..104
    for wk in range(52, 104, 4):
        add(wk, wk + 4, 4)

    pts.sort(key=lambda p: p["weeks"])
    return pts


def smooth_and_fill(points: list[dict]) -> list[dict]:
    """Isotonic-smooth observed medians; add interpolated points at REF weeks."""
    if not points:
        return points
    xs = np.array([p["weeks"] for p in points], dtype=float)
    med = np.array([p["median"] for p in points], dtype=float)
    iso = IsotonicRegression(increasing=True, y_max=1.0)
    sm = iso.fit_transform(xs, med)
    for p, s in zip(points, sm):
        p["medianSmoothed"] = round(float(min(s, 1.0)), 5)
        p["p25"] = round(p["p25"], 5)
        p["median"] = round(p["median"], 5)
        p["p75"] = round(p["p75"], 5)

    obs_weeks = {p["weeks"] for p in points}
    sm_arr = np.array([p["medianSmoothed"] for p in points])
    p25_arr = np.array([p["p25"] for p in points])
    med_arr = np.array([p["median"] for p in points])
    p75_arr = np.array([p["p75"] for p in points])
    for wk in REF_WEEKS:
        if wk in obs_weeks:
            continue
        points.append({
            "weeks": wk, "binWeeks": None, "source": "interpolated", "n": None,
            "p25": round(float(np.interp(wk, xs, p25_arr)), 5),
            "median": round(float(np.interp(wk, xs, med_arr)), 5),
            "p75": round(float(np.interp(wk, xs, p75_arr)), 5),
            "medianSmoothed": round(float(np.interp(wk, xs, sm_arr)), 5),
        })
    points.sort(key=lambda p: p["weeks"])
    return points


def main() -> None:
    if not RAW_CSV.exists() and not CACHE.exists():
        raise SystemExit(
            f"Raw data not found at {RAW_CSV}. Download Final_Data_PLOS.zip from "
            "https://datacat.liverpool.ac.uk/377/5/ and unzip into data/raw/.")

    gc = build_policy_c()
    total_raw = gc.attrs.get("total_raw", 0)

    # only visits inside the curve's week range [12, 104) back the table
    gc_used = gc[(gc["WEEKS"] >= 12) & (gc["WEEKS"] < 104)]

    categories_out = {}
    per_band = []
    for name, lo, hi in CATEGORIES:
        sub = gc_used[gc_used["CAT"] == name]
        pts = smooth_and_fill(observed_points(sub))
        dogs = int(sub["PET_ID"].nunique())
        visits = int(len(sub))
        obs = [p["weeks"] for p in pts if p["source"] == "observed"]
        interp = [p["weeks"] for p in pts if p["source"] == "interpolated"]

        # Normalization (approved 2026-10-10): plateau = median ratio across the
        # observed 96-104 week visits; normalized = raw / plateau, so the curve
        # predicts weight at ~2 years rather than breed-average adult weight.
        plateau_r = sub.loc[(sub["WEEKS"] >= 96) & (sub["WEEKS"] < 104), "RATIO"]
        plateau_n = int(plateau_r.shape[0])
        plateau = float(np.median(plateau_r)) if plateau_n else 1.0
        for p in pts:
            p["normP25"] = round(p["p25"] / plateau, 5)
            p["normMedian"] = round(p["median"] / plateau, 5)
            p["normP75"] = round(p["p75"] / plateau, 5)
            p["normMedianSmoothed"] = round(p["medianSmoothed"] / plateau, 5)

        categories_out[name] = {
            "minKg": lo, "maxKg": hi, "policy": "C",
            "dogs": dogs, "visits": visits,
            "plateau": round(plateau, 5), "plateauN": plateau_n,
            "points": pts}
        per_band.append((name, lo, hi, dogs, visits, obs, interp, pts,
                         plateau, plateau_n))

    total_dogs = int(gc_used["PET_ID"].nunique())
    total_visits = int(len(gc_used))

    out = {
        "source": {
            "citation": ("Salt C, Morris PJ, German AJ, et al. Growth standard "
                         "charts for monitoring bodyweight in dogs of different "
                         "sizes. PLoS ONE 2017;12(9):e0182064."),
            "article": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/",
            "dataset": "https://datacat.liverpool.ac.uk/377/",
            "datasetDoi": "https://doi.org/10.17638/datacat.liverpool.ac.uk/377",
            "license": "CC BY 4.0",
            "correction": ("PLoS One 2024;19(11):e0314711 corrects only the Data "
                           "Availability statement; method unchanged."),
            "accessed": "2026-10-10",
        },
        "generatedAt": dt.date.today().isoformat(),
        "method": {
            "population": ("dogs confirmed lean (Normal body condition) at 2-3 "
                           "years, with no recorded Thin/Heavy visit at any age "
                           "(Policy C); all their 0.20-2.25y preventive/healthy, "
                           "not-yet-neutered visits"),
            "ratio": "WEIGHT / AV_BREED_WEIGHT",
            "ageBins": ("weekly 12-28 wk; 8- or 12-week bins across the 28-52 wk "
                        "adolescent gap; 4-weekly 52-104 wk; bins with n<200 "
                        "interpolated (isotonic), not observed"),
            "minBinN": MIN_N,
            "smoothing": "monotone isotonic regression on median, capped at 1.0",
            "normalization": ("per band, plateau = median ratio across observed "
                              "96-104 week visits; normalized = raw / plateau. "
                              "Adult weight means the typical weight of healthy-"
                              "weight dogs at 2 years; breed averages that include "
                              "older, heavier dogs run higher."),
            "predict": "adult = weight / normMedianSmoothed(age); range weight/normP75..weight/normP25",
            "referenceWeeks": REF_WEEKS,
        },
        "totals": {"dogs": total_dogs, "visits": total_visits},
        "categories": categories_out,
    }
    OUT_JSON.write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")

    # ---- helpers on normalized curve ----
    def interp_field(pts, field, wk):
        xs = [p["weeks"] for p in pts]
        ys = [p[field] for p in pts]
        return float(np.interp(wk, xs, ys))

    def pct_at(pts, wk):  # normalized % of adult (2-year) weight
        return interp_field(pts, "normMedianSmoothed", wk) * 100

    sl = ["# Puppy growth-ratio table - build summary\n",
          f"Generated: {dt.date.today().isoformat()}  ",
          "Source: Salt C, Morris PJ, German AJ, et al. *Growth standard charts "
          "for monitoring bodyweight in dogs of different sizes.* PLoS ONE "
          "2017;12(9):e0182064.  ",
          "Data: Liverpool Data catalogue, https://datacat.liverpool.ac.uk/377/ "
          "(CC BY 4.0).  ",
          "2024 correction (PLoS One 2024;19(11):e0314711): Data Availability "
          "statement only - no change to data, categories or method.\n",
          "Population: dogs confirmed lean (Normal body condition) as adults at "
          "2-3 years, with no recorded Thin/Heavy visit at any age (Policy C). "
          "The ~28-52 week adolescent range is coarsely re-binned (8- or 12-week) "
          "and kept as observed where n>=200; remaining reference ages are "
          "interpolated on the monotone isotonic curve. Curves are normalized so "
          "100% = the typical weight of healthy-weight dogs at 2 years (plateau = "
          "median ratio across observed 96-104 week visits).\n",
          f"- Raw rows read: **{total_raw:,}**" if total_raw else "- (loaded from cache)",
          f"- Total unique dogs: **{total_dogs:,}**",
          f"- Total visits: **{total_visits:,}**\n",
          "## Per size category\n",
          "| Category | Adult weight (kg) | Dogs | Visits | Plateau (n) | Observed weeks | Interpolated ref weeks |",
          "|---|---|---|---|---|---|---|"]
    for name, lo, hi, dogs, visits, obs, interp, pts, plateau, pn in per_band:
        band = f"<{hi}" if lo == 0 else f"{lo}-<{hi}"
        obs_str = ", ".join(str(w) for w in obs)
        sl.append(f"| {name} | {band} | {dogs:,} | {visits:,} | {plateau:.3f} "
                  f"(n={pn:,}) | {obs_str} | "
                  f"{', '.join(str(w) for w in interp) or 'none'} |")
    sl.append("\n## % of adult weight (at 2 years) by age\n")
    sl.append("Normalized medianSmoothed x 100. * = interpolated age.\n")
    sl.append("| Weeks | " + " | ".join(CAT_NAMES) + " |")
    sl.append("|---|" + "---|" * len(CAT_NAMES))
    for wk in REF_WEEKS:
        star = "*" if wk in (32, 40, 78) else ""
        row = [f"{wk}{star}"]
        for *_rest, pts, _p, _n in per_band:
            row.append(f"{pct_at(pts, wk):.1f}%")
        sl.append("| " + " | ".join(row) + " |")

    # rising check: still gaining >3 points of adult weight between 52 and 100 wk
    sl.append("\n## Still rising 52 -> 100 weeks (normalized)\n")
    sl.append("| Band | 52wk % | 100wk % | rise (pts) | flag |")
    sl.append("|---|---|---|---|---|")
    for name, *_r, pts, _p, _n in per_band:
        r52 = pct_at(pts, 52)
        r100 = pct_at(pts, 100)
        rise = r100 - r52
        sl.append(f"| {name} | {r52:.1f}% | {r100:.1f}% | {rise:+.1f} | "
                  f"{'RISING >3pts' if rise > 3 else 'ok'} |")

    # worked examples on the normalized curve
    def predict(cat, wk, weight_kg):
        pts = categories_out[cat]["points"]
        nm = interp_field(pts, "normMedianSmoothed", wk)
        p25 = interp_field(pts, "normP25", wk)
        p75 = interp_field(pts, "normP75", wk)
        return (weight_kg / nm, weight_kg / p75, weight_kg / p25)

    def choose_not_sure(wk, weight_kg):
        ests = {}
        for name, lo, hi, *_x in per_band:
            adult, _l, _h = predict(name, wk, weight_kg)
            ests[name] = adult
        qualifying = [n for (n, lo, hi, *_x) in per_band
                      if (categories_out[n]["minKg"] <= ests[n]
                          < categories_out[n]["maxKg"])]
        if len(qualifying) == 1:
            return qualifying[0], ests
        if len(qualifying) > 1:
            def mid_dist(n):
                lo = categories_out[n]["minKg"]; hi = categories_out[n]["maxKg"]
                return abs(ests[n] - (lo + hi) / 2)
            return min(qualifying, key=mid_dist), ests
        # none qualify: nearest band edge
        def edge_dist(n):
            lo = categories_out[n]["minKg"]; hi = categories_out[n]["maxKg"]
            return min(abs(ests[n] - lo), abs(ests[n] - hi))
        return min(CAT_NAMES, key=edge_dist), ests

    kg = 0.45359237
    ex1_kg = 20 * kg
    ex1_band, ex1_ests = choose_not_sure(16, ex1_kg)
    a1, lo1, hi1 = predict(ex1_band, 16, ex1_kg)
    ex2_kg = 9.0  # 24 wk, 9 kg, size Medium = category III
    a2, lo2, hi2 = predict("III", 24, ex2_kg)

    sl.append("\n## Worked examples (normalized curve)\n")
    sl.append(f"- Example 1: 16 wk, 20 lb ({ex1_kg:.3f} kg), size Not sure -> "
              f"band {ex1_band}; adult ~ {a1:.2f} kg ({a1 / kg:.1f} lb); "
              f"range {lo1 / kg:.1f}-{hi1 / kg:.1f} lb. "
              f"Per-band estimates (kg): "
              + ", ".join(f"{n}={ex1_ests[n]:.2f}" for n in CAT_NAMES) + ".")
    sl.append(f"- Example 2: 24 wk, 9 kg, size Medium (cat III) -> "
              f"adult ~ {a2:.2f} kg ({a2 / kg:.1f} lb); "
              f"range {lo2:.2f}-{hi2:.2f} kg ({lo2 / kg:.1f}-{hi2 / kg:.1f} lb).")
    sl.append("")
    OUT_SUMMARY.write_text("\n".join(sl) + "\n", encoding="utf-8")

    # ---- console ----
    print("\n==== GROWTH TABLE SUMMARY (Policy C, normalized) ====")
    print(f"Total dogs / visits: {total_dogs:,} / {total_visits:,}")
    print("Band  kg          Dogs      Visits    Plateau(n)      ObsBins")
    for name, lo, hi, dogs, visits, obs, interp, pts, plateau, pn in per_band:
        band = f"<{hi}" if lo == 0 else f"{lo}-<{hi}"
        print(f"  {name:<4} {band:<11} {dogs:<9,} {visits:<9,} "
              f"{plateau:.3f}(n={pn:,})".ljust(16) + f"  {len(obs)}")
    print("\n% of adult weight (at 2 years) by age:")
    print("wk   " + "  ".join(f"{n:>6}" for n in CAT_NAMES))
    for wk in REF_WEEKS:
        print(f"{wk:<4} " + "  ".join(f"{pct_at(pts, wk):>5.1f}%"
              for *_r, pts, _p, _n in per_band))
    print("\nRising 52->100 wk (pts):")
    for name, *_r, pts, _p, _n in per_band:
        rise = pct_at(pts, 100) - pct_at(pts, 52)
        print(f"  {name}: {rise:+.1f}  {'RISING>3' if rise > 3 else 'ok'}")
    print(f"\nEx1 16wk/20lb/Not sure -> band {ex1_band}: {a1 / kg:.1f} lb "
          f"({lo1 / kg:.1f}-{hi1 / kg:.1f})")
    print(f"Ex2 24wk/9kg/Medium(III) -> {a2:.2f} kg ({a2 / kg:.1f} lb), "
          f"{lo2:.2f}-{hi2:.2f} kg")
    print(f"\nWrote {OUT_JSON}")
    print(f"Wrote {OUT_SUMMARY}")


if __name__ == "__main__":
    main()
