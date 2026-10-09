# Puppy growth-ratio table - build summary

Generated: 2026-10-10  
Source: Salt C, Morris PJ, German AJ, et al. *Growth standard charts for monitoring bodyweight in dogs of different sizes.* PLoS ONE 2017;12(9):e0182064.  
Data: Liverpool Data catalogue, https://datacat.liverpool.ac.uk/377/ (CC BY 4.0).  
2024 correction (PLoS One 2024;19(11):e0314711): Data Availability statement only - no change to data, categories or method.

Population: dogs confirmed lean (Normal body condition) as adults at 2-3 years, with no recorded Thin/Heavy visit at any age (Policy C). The ~28-52 week adolescent range is coarsely re-binned (8- or 12-week) and kept as observed where n>=200; remaining reference ages are interpolated on the monotone isotonic curve. Curves are normalized so 100% = the typical weight of healthy-weight dogs at 2 years (plateau = median ratio across observed 96-104 week visits).

- Raw rows read: **14,957,947**
- Total unique dogs: **60,951**
- Total visits: **199,355**

## Per size category

| Category | Adult weight (kg) | Dogs | Visits | Plateau (n) | Observed weeks | Interpolated ref weeks |
|---|---|---|---|---|---|---|
| I | <6.5 | 23,844 | 83,146 | 0.876 (n=3,433) | 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 36, 44, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100 | 32, 40, 78 |
| II | 6.5-<9.0 | 5,702 | 17,438 | 0.887 (n=760) | 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 28, 36, 44, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100 | 32, 40, 78 |
| III | 9.0-<15.0 | 8,726 | 27,734 | 0.873 (n=1,382) | 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 36, 44, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100 | 32, 40, 78 |
| IV | 15.0-<30.0 | 9,153 | 29,566 | 0.960 (n=1,313) | 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 36, 44, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100 | 32, 40, 78 |
| V | 30.0-<40.0 | 13,526 | 41,471 | 0.899 (n=1,782) | 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 36, 44, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100 | 32, 40, 78 |

## % of adult weight (at 2 years) by age

Normalized medianSmoothed x 100. * = interpolated age.

| Weeks | I | II | III | IV | V |
|---|---|---|---|---|---|
| 12 | 39.3% | 40.2% | 34.3% | 30.8% | 29.8% |
| 16 | 51.3% | 53.1% | 46.3% | 44.2% | 42.9% |
| 20 | 61.7% | 63.7% | 57.4% | 56.7% | 54.7% |
| 24 | 69.5% | 71.6% | 69.1% | 67.6% | 65.9% |
| 32* | 83.7% | 87.6% | 83.3% | 86.3% | 83.7% |
| 40* | 88.4% | 92.4% | 89.1% | 91.7% | 90.8% |
| 52 | 93.0% | 95.2% | 91.8% | 92.7% | 92.8% |
| 78* | 97.4% | 98.0% | 96.2% | 97.7% | 96.9% |

## Still rising 52 -> 100 weeks (normalized)

| Band | 52wk % | 100wk % | rise (pts) | flag |
|---|---|---|---|---|
| I | 93.0% | 100.5% | +7.5 | RISING >3pts |
| II | 95.2% | 101.3% | +6.2 | RISING >3pts |
| III | 91.8% | 101.2% | +9.4 | RISING >3pts |
| IV | 92.7% | 100.0% | +7.3 | RISING >3pts |
| V | 92.8% | 100.0% | +7.2 | RISING >3pts |

## Worked examples (normalized curve)

- Example 1: 16 wk, 20 lb (9.072 kg), size Not sure -> band IV; adult ~ 20.53 kg (45.3 lb); range 39.7-51.9 lb. Per-band estimates (kg): I=17.70, II=17.08, III=19.60, IV=20.53, V=21.13.
- Example 2: 24 wk, 9 kg, size Medium (cat III) -> adult ~ 13.03 kg (28.7 lb); range 11.33-15.47 kg (25.0-34.1 lb).

