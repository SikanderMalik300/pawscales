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

Method (follows pawscales-build-spec.md A6.1):
  1. Load Final_Data_PLOS.csv (chunked; 14.9M rows).
  2. Keep visits where PREVENTIVE_CARE_VISIT == 'Y' or HEALTHY_PET_DIAGNOSIS == 'Y';
     drop rows missing age/weight/AV_BREED_WEIGHT; keep 0.20 <= VISIT_AGE <= 2.25;
     keep dogs not yet neutered at the visit (NEUTER_DATE 'Unknown' or after VISIT_DATE);
     drop visits whose body condition (recorded, else predicted) is not 'Normal'.
  3. Size category from AV_BREED_WEIGHT exactly as the paper:
     I <6.5; II 6.5-<9; III 9-<15; IV 15-<30; V 30-<40 kg. Drop >=40.
  4. ratio = WEIGHT / AV_BREED_WEIGHT. Weekly bins 12-52 wk, then 4-weekly to 104 wk.
     Per category/bin: n, P25, median, P75 of ratio. Drop bins with n < 200 (report).
  5. Smooth the median series per category with monotone non-decreasing isotonic
     regression and cap at 1.0.
  6. Write data/growth-ratios.json and data/growth-ratios-summary.md.
  7. Print a summary.
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
OUT_JSON = ROOT / "data" / "growth-ratios.json"
OUT_SUMMARY = ROOT / "data" / "growth-ratios-summary.md"

WEEKS_PER_YEAR = 365.25 / 7.0  # 52.178...

# Size categories by average adult breed weight (kg), per the paper (Table 1).
CATEGORIES = [
    ("I", 0.0, 6.5),
    ("II", 6.5, 9.0),
    ("III", 9.0, 15.0),
    ("IV", 15.0, 30.0),
    ("V", 30.0, 40.0),
]

# Age-bin left edges: weekly 12..51, then 4-weekly 52..100 (each bin covers
# [edge, next_edge)). Bins represented by their left edge in weeks.
BIN_EDGES = list(range(12, 53)) + list(range(56, 108, 4))  # 12..52, 56..104
BIN_LABELS = BIN_EDGES[:-1]  # 12..51, 52,56,...,100

MIN_N = 200
CHUNK = 2_000_000

USECOLS = [
    "NEUTER_DATE",
    "VISIT_DATE",
    "VISIT_AGE",
    "WEIGHT",
    "BCS_RECORDED",
    "BCS_PREDICTED",
    "PREVENTIVE_CARE_VISIT",
    "HEALTHY_PET_DIAGNOSIS",
    "AV_BREED_WEIGHT",
    "PET_ID",
]


def category_of(av: pd.Series) -> pd.Series:
    """Return category label (I..V) or NaN for AV_BREED_WEIGHT >= 40 or < 0."""
    cat = pd.Series(pd.NA, index=av.index, dtype="object")
    for name, lo, hi in CATEGORIES:
        cat = cat.mask((av >= lo) & (av < hi), name)
    return cat


def filter_chunk(df: pd.DataFrame) -> pd.DataFrame:
    # numeric coercion
    df["VISIT_AGE"] = pd.to_numeric(df["VISIT_AGE"], errors="coerce")
    df["WEIGHT"] = pd.to_numeric(df["WEIGHT"], errors="coerce")
    df["AV_BREED_WEIGHT"] = pd.to_numeric(df["AV_BREED_WEIGHT"], errors="coerce")

    # drop missing required numerics
    df = df.dropna(subset=["VISIT_AGE", "WEIGHT", "AV_BREED_WEIGHT"])
    df = df[(df["WEIGHT"] > 0) & (df["AV_BREED_WEIGHT"] > 0)]

    # preventive care OR healthy pet diagnosis
    prev = df["PREVENTIVE_CARE_VISIT"].astype("string").str.strip().str.upper()
    heal = df["HEALTHY_PET_DIAGNOSIS"].astype("string").str.strip().str.upper()
    df = df[(prev == "Y") | (heal == "Y")]

    # age window
    df = df[(df["VISIT_AGE"] >= 0.20) & (df["VISIT_AGE"] <= 2.25)]

    # not yet neutered at the visit: NEUTER_DATE 'Unknown' (date-only strings),
    # or neuter day strictly after visit day. Compare first 10 chars (YYYY-MM-DD).
    neuter = df["NEUTER_DATE"].astype("string").str.strip()
    visit_day = df["VISIT_DATE"].astype("string").str.slice(0, 10)
    neuter_day = neuter.str.slice(0, 10)
    is_unknown = neuter.str.lower().eq("unknown") | neuter.isna()
    not_neutered = is_unknown | (neuter_day > visit_day)
    df = df[not_neutered]

    # body condition: recorded if present, else predicted; keep only Normal
    rec = df["BCS_RECORDED"].astype("string").str.strip()
    pred = df["BCS_PREDICTED"].astype("string").str.strip()
    bc = rec.where(~rec.str.lower().isin(["none", "nan"]) & rec.notna(), pred)
    df = df[bc.str.lower() == "normal"]

    # size category
    df = df.assign(CAT=category_of(df["AV_BREED_WEIGHT"]))
    df = df[df["CAT"].notna()]

    # ratio and weeks
    df = df.assign(
        RATIO=df["WEIGHT"] / df["AV_BREED_WEIGHT"],
        WEEKS=df["VISIT_AGE"] * WEEKS_PER_YEAR,
    )
    df = df.assign(
        BIN=pd.cut(df["WEEKS"], bins=BIN_EDGES, right=False, labels=BIN_LABELS)
    )
    df = df[df["BIN"].notna()]

    return df[["CAT", "BIN", "RATIO", "PET_ID"]]


def main() -> None:
    if not RAW_CSV.exists():
        raise SystemExit(
            f"Raw data not found at {RAW_CSV}.\n"
            "Download Final_Data_PLOS.zip from https://datacat.liverpool.ac.uk/377/5/"
            " and unzip into data/raw/ (gitignored). See the module docstring."
        )

    print(f"Reading {RAW_CSV} in chunks of {CHUNK:,} rows ...")
    parts = []
    total_raw = 0
    reader = pd.read_csv(
        RAW_CSV,
        usecols=USECOLS,
        chunksize=CHUNK,
        dtype={
            "NEUTER_DATE": "string",
            "VISIT_DATE": "string",
            "BCS_RECORDED": "string",
            "BCS_PREDICTED": "string",
            "PREVENTIVE_CARE_VISIT": "string",
            "HEALTHY_PET_DIAGNOSIS": "string",
            "PET_ID": "int64",
        },
    )
    for i, chunk in enumerate(reader):
        total_raw += len(chunk)
        parts.append(filter_chunk(chunk))
        print(f"  chunk {i + 1}: read {total_raw:,} rows cumulative", flush=True)

    data = pd.concat(parts, ignore_index=True)
    data["BIN"] = data["BIN"].astype("int64")
    print(f"Total raw rows: {total_raw:,}")
    print(f"Visits passing all filters: {len(data):,}")

    total_dogs = data["PET_ID"].nunique()
    total_visits = len(data)

    categories_out = {}
    per_cat_summary = []
    dropped_bins = []

    for name, lo, hi in CATEGORIES:
        sub = data[data["CAT"] == name]
        cat_dogs = sub["PET_ID"].nunique()
        cat_visits = len(sub)

        rows = []
        for label in BIN_LABELS:
            r = sub.loc[sub["BIN"] == label, "RATIO"]
            n = int(r.shape[0])
            if n < MIN_N:
                if n > 0:
                    dropped_bins.append((name, int(label), n))
                continue
            rows.append(
                {
                    "weeks": int(label),
                    "n": n,
                    "p25": float(np.percentile(r, 25)),
                    "median": float(np.percentile(r, 50)),
                    "p75": float(np.percentile(r, 75)),
                }
            )

        # isotonic (monotone non-decreasing) smoothing of the median, capped at 1.0
        if rows:
            weeks = np.array([pt["weeks"] for pt in rows], dtype=float)
            med = np.array([pt["median"] for pt in rows], dtype=float)
            iso = IsotonicRegression(increasing=True, y_min=None, y_max=1.0)
            smoothed = iso.fit_transform(weeks, med)
            for pt, s in zip(rows, smoothed):
                pt["medianSmoothed"] = round(float(min(s, 1.0)), 5)
            # round the raw stats for a tidy file
            for pt in rows:
                pt["p25"] = round(pt["p25"], 5)
                pt["median"] = round(pt["median"], 5)
                pt["p75"] = round(pt["p75"], 5)

        categories_out[name] = {
            "minKg": lo,
            "maxKg": hi,
            "points": rows,
        }
        per_cat_summary.append((name, lo, hi, cat_dogs, cat_visits, len(rows)))

    generated_at = dt.date.today().isoformat()

    out = {
        "source": {
            "citation": (
                "Salt C, Morris PJ, German AJ, et al. Growth standard charts for "
                "monitoring bodyweight in dogs of different sizes. PLoS ONE "
                "2017;12(9):e0182064."
            ),
            "article": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5584974/",
            "dataset": "https://datacat.liverpool.ac.uk/377/",
            "datasetDoi": "https://doi.org/10.17638/datacat.liverpool.ac.uk/377",
            "license": "CC BY 4.0",
            "correction": (
                "PLoS One 2024;19(11):e0314711 corrects only the Data Availability "
                "statement; no change to data, categories or method."
            ),
            "accessed": "2026-10-10",
        },
        "generatedAt": generated_at,
        "filters": {
            "visitType": "PREVENTIVE_CARE_VISIT == 'Y' OR HEALTHY_PET_DIAGNOSIS == 'Y'",
            "ageYears": [0.20, 2.25],
            "bodyCondition": "Normal (recorded, else predicted)",
            "neuterStatus": "not yet neutered at the visit",
            "maxAdultKg": 40,
            "minBinN": MIN_N,
            "ageBins": "weekly 12-52 weeks, then 4-weekly to 104 weeks",
            "ratio": "WEIGHT / AV_BREED_WEIGHT",
            "smoothing": "monotone non-decreasing isotonic regression on median, capped at 1.0",
        },
        "totals": {"dogs": int(total_dogs), "visits": int(total_visits)},
        "categories": categories_out,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")

    # ---- summary markdown ----
    lines = []
    lines.append("# Puppy growth-ratio table — build summary\n")
    lines.append(f"Generated: {generated_at}  ")
    lines.append("Source: Salt C, Morris PJ, German AJ, et al. *Growth standard "
                 "charts for monitoring bodyweight in dogs of different sizes.* "
                 "PLoS ONE 2017;12(9):e0182064. ")
    lines.append("Data: Liverpool Data catalogue, https://datacat.liverpool.ac.uk/377/ "
                 "(CC BY 4.0). ")
    lines.append("2024 correction (PLoS One 2024;19(11):e0314711): Data Availability "
                 "statement only — no change to data, categories or method.\n")
    lines.append(f"- Raw rows read: **{total_raw:,}**")
    lines.append(f"- Visits passing all filters: **{total_visits:,}**")
    lines.append(f"- Unique dogs after filtering: **{total_dogs:,}**\n")
    lines.append("## Per size category\n")
    lines.append("| Category | Adult weight (kg) | Dogs | Visits | Age bins kept |")
    lines.append("|---|---|---|---|---|")
    for name, lo, hi, dogs, visits, nbins in per_cat_summary:
        band = f"<{hi}" if lo == 0 else f"{lo}–<{hi}"
        lines.append(f"| {name} | {band} | {dogs:,} | {visits:,} | {nbins} |")
    lines.append("")
    if dropped_bins:
        lines.append(f"## Bins dropped (n < {MIN_N})\n")
        lines.append("| Category | Weeks | n |")
        lines.append("|---|---|---|")
        for name, wk, n in dropped_bins:
            lines.append(f"| {name} | {wk} | {n} |")
        lines.append("")
    else:
        lines.append(f"## Bins dropped (n < {MIN_N})\n\nNone.\n")

    OUT_SUMMARY.write_text("\n".join(lines) + "\n", encoding="utf-8")

    # ---- console summary ----
    print("\n==== GROWTH TABLE SUMMARY ====")
    print(f"Raw rows read:          {total_raw:,}")
    print(f"Visits after filters:   {total_visits:,}")
    print(f"Unique dogs:            {total_dogs:,}")
    print("Category  Band(kg)   Dogs        Visits      Bins")
    for name, lo, hi, dogs, visits, nbins in per_cat_summary:
        band = f"<{hi}" if lo == 0 else f"{lo}-<{hi}"
        print(f"  {name:<6} {band:<10} {dogs:<11,} {visits:<11,} {nbins}")
    if dropped_bins:
        print(f"\nDropped bins (n<{MIN_N}): {len(dropped_bins)}")
        for name, wk, n in dropped_bins:
            print(f"  cat {name} week {wk}: n={n}")
    else:
        print(f"\nDropped bins (n<{MIN_N}): none")
    print(f"\nWrote {OUT_JSON}")
    print(f"Wrote {OUT_SUMMARY}")


if __name__ == "__main__":
    main()
