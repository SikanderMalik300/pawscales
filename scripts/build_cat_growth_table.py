#!/usr/bin/env python3
"""Build the cat (kitten) weight-by-age table for PawScales (/cat-weight-chart/).

One-off data step. Never run at runtime. Writes data/cat-weight.json and
data/cat-weight-summary.md.

Sources (both CC BY 3.0, University of Liverpool DataCat; creators A J German,
C Salt, R F Butterwick):
  Neutered (MAIN table):
    Salt C, Butterwick RF, Henzel KS, German AJ. "Comparison of growth in
    neutered Domestic Shorthair kittens with growth in sexually-intact cats."
    PLoS ONE 2023;18(3):e0283016.  Data: datacat.liverpool.ac.uk/1459
    (Dataset_for_Publication_Banfield.csv; neutered healthy DSH, optimal BCS,
    USA; weights from before and after neutering, pooled neuter groups 1-4).
  Intact (comparison note):
    Salt C, German AJ, Henzel KS, Butterwick RF. "Growth standard charts for
    monitoring bodyweight in intact domestic shorthair kittens from the USA."
    PLoS ONE 2022;17(11):e0277531.  Data: datacat.liverpool.ac.uk/1456
    (KGC1_dataset.csv; 'Modelling' subset = optimal body condition).

Method (mirrors the dog build, but reports ABSOLUTE weights, not ratios):
  - Per sex, bin visits by nearest whole month (age_months in [m-0.5, m+0.5)).
  - For each cell: median, 25th and 75th centile of Weight_kg -> lb.
  - Light isotonic smoothing (non-decreasing in age) applied to EACH of p25,
    median, p75 separately, per sex, then rounded to 0.1 lb. Raw values kept.
"""
from __future__ import annotations
import json
import datetime as dt
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.isotonic import IsotonicRegression

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw" / "cat"
OUT_JSON = ROOT / "data" / "cat-weight.json"
OUT_SUMMARY = ROOT / "data" / "cat-weight-summary.md"

LB = 0.45359237
MAIN_MONTHS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18]
INTACT_MONTHS = [2, 3, 4, 5, 6, 12, 18]  # robust intact cells only


def load(path: Path, weight_col: str, dataset_filter=None) -> pd.DataFrame:
    df = pd.read_csv(path).rename(columns={weight_col: "w_kg"})
    if dataset_filter is not None:
        df = df[df["DataSet"].astype(str).str.strip().str.lower() == dataset_filter]
    df["w_kg"] = pd.to_numeric(df["w_kg"], errors="coerce")
    df["age_m"] = pd.to_numeric(df["Visit_Age_Yrs"], errors="coerce") * 12.0
    df["sexu"] = df["Sex"].astype(str).str.upper().str[0]
    return df[df["w_kg"].notna() & df["age_m"].notna() & (df["w_kg"] > 0)]


def raw_cells(df: pd.DataFrame, sex: str, months: list[int]) -> list[dict]:
    am = df["age_m"].to_numpy()
    w = df["w_kg"].to_numpy()
    sx = df["sexu"].to_numpy() == sex
    out = []
    for m in months:
        mask = sx & (am >= m - 0.5) & (am < m + 0.5)
        wv = w[mask]
        n = int(wv.shape[0])
        if n == 0:
            out.append({"month": m, "n": 0})
            continue
        out.append({
            "month": m, "n": n,
            "rawP25": round(float(np.percentile(wv, 25)) / LB, 2),
            "rawMedian": round(float(np.percentile(wv, 50)) / LB, 2),
            "rawP75": round(float(np.percentile(wv, 75)) / LB, 2),
        })
    return out


def smooth(cells: list[dict]) -> list[dict]:
    """Isotonic (non-decreasing in age) on each of p25/median/p75, rounded 0.1."""
    present = [c for c in cells if c.get("n", 0) > 0]
    xs = np.array([c["month"] for c in present], dtype=float)
    for raw_key, key in [("rawP25", "p25"), ("rawMedian", "median"), ("rawP75", "p75")]:
        ys = np.array([c[raw_key] for c in present], dtype=float)
        sm = IsotonicRegression(increasing=True).fit_transform(xs, ys)
        for c, v in zip(present, sm):
            c[key] = round(float(v), 1)
    return cells


def series(df, sex, months):
    return smooth(raw_cells(df, sex, months))


def main() -> None:
    neut = load(RAW / "neutered_banfield.csv", "Weight_KG")
    intact = load(RAW / "KGC1_intact.csv", "Weight_kg", dataset_filter="modelling")

    main_tbl = {s: series(neut, s, MAIN_MONTHS) for s in ["F", "M"]}
    intact_tbl = {s: series(intact, s, INTACT_MONTHS) for s in ["F", "M"]}

    def at18(tbl, s):
        row = next(c for c in tbl[s] if c["month"] == 18)
        return {"p25": row["p25"], "median": row["median"], "p75": row["p75"]}

    out = {
        "source": {
            "mainCitation": ("Salt C, Butterwick RF, Henzel KS, German AJ. "
                "Comparison of growth in neutered Domestic Shorthair kittens with "
                "growth in sexually-intact cats. PLoS ONE 2023;18(3):e0283016."),
            "mainArticle": "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0283016",
            "mainDataset": "https://datacat.liverpool.ac.uk/1459/",
            "mainDatasetDoi": "https://doi.org/10.17638/datacat.liverpool.ac.uk/1459",
            "intactCitation": ("Salt C, German AJ, Henzel KS, Butterwick RF. Growth "
                "standard charts for monitoring bodyweight in intact domestic "
                "shorthair kittens from the USA. PLoS ONE 2022;17(11):e0277531."),
            "intactArticle": "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0277531",
            "intactDataset": "https://datacat.liverpool.ac.uk/1456/",
            "intactDatasetDoi": "https://doi.org/10.17638/datacat.liverpool.ac.uk/1456",
            "license": "CC BY 3.0",
            "accessed": "2026-10-15",
        },
        "generatedAt": dt.date.today().isoformat(),
        "units": "lb",
        "method": ("Per sex, visits binned by nearest whole month (age in "
            "[m-0.5, m+0.5) months). Each cell is the median and 25th-75th "
            "centile of bodyweight, converted to pounds. Each column is lightly "
            "isotonic-smoothed so it never decreases with age; raw values kept."),
        "mainLabel": ("Domestic shorthair cats that were neutered (weights from "
            "before and after neutering), healthy body condition, USA "
            "(Salt et al. 2023)"),
        "mainCounts": {s: {c["month"]: c["n"] for c in main_tbl[s]} for s in ["F", "M"]},
        "main": main_tbl,
        "intactComparison": intact_tbl,
        "adult": {s: at18(main_tbl, s) for s in ["F", "M"]},
    }
    OUT_JSON.write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")

    # ---- summary ----
    sl = ["# Cat weight-by-age table - build summary\n",
          f"Generated: {dt.date.today().isoformat()}\n",
          f"Neutered rows: {len(neut):,} / {neut['Cat_ID'].nunique():,} cats.  ",
          f"Intact (Modelling) rows: {len(intact):,} / {intact['Cat_ID'].nunique():,} cats.\n",
          "## Main (neutered) - smoothed lb [raw]\n",
          "| mo | F p25 | F med | F p75 | F n | M p25 | M med | M p75 | M n |",
          "|---|---|---|---|---|---|---|---|---|"]
    for i, m in enumerate(MAIN_MONTHS):
        f = main_tbl["F"][i]; mm = main_tbl["M"][i]
        sl.append(f"| {m} | {f['p25']} [{f['rawP25']}] | {f['median']} [{f['rawMedian']}] "
                  f"| {f['p75']} [{f['rawP75']}] | {f['n']:,} "
                  f"| {mm['p25']} [{mm['rawP25']}] | {mm['median']} [{mm['rawMedian']}] "
                  f"| {mm['p75']} [{mm['rawP75']}] | {mm['n']:,} |")
    sl.append("\n## Intact comparison (median, smoothed lb)\n")
    sl.append("| mo | F median | F n | M median | M n |")
    sl.append("|---|---|---|---|---|")
    for i, m in enumerate(INTACT_MONTHS):
        f = intact_tbl["F"][i]; mm = intact_tbl["M"][i]
        sl.append(f"| {m} | {f.get('median','-')} | {f['n']:,} | {mm.get('median','-')} | {mm['n']:,} |")
    sl.append(f"\nAdult (18 mo): Female {out['adult']['F']['median']} lb "
              f"({out['adult']['F']['p25']}-{out['adult']['F']['p75']}); "
              f"Male {out['adult']['M']['median']} lb "
              f"({out['adult']['M']['p25']}-{out['adult']['M']['p75']}).\n")
    OUT_SUMMARY.write_text("\n".join(sl) + "\n", encoding="utf-8")

    # ---- console: verify monotonic ----
    print(f"Neutered {len(neut):,} rows / {neut['Cat_ID'].nunique():,} cats; "
          f"intact {len(intact):,} / {intact['Cat_ID'].nunique():,}")
    for s in ["F", "M"]:
        for key in ["p25", "median", "p75"]:
            vals = [c[key] for c in main_tbl[s]]
            ok = all(b >= a for a, b in zip(vals, vals[1:]))
            print(f"  main {s} {key} non-decreasing: {ok}  {vals}")
    print(f"\nWrote {OUT_JSON}\nWrote {OUT_SUMMARY}")


if __name__ == "__main__":
    main()
