# Settlebrook: legal accuracy fixes (verified Sept 24, 2026)

Every correction below is backed by the source URL listed next to it. The full evidence is in the `discrepancies-*.md` files.
Rule: Claude Code changes TEXT and DATA only. It must not change the formulas in lib/calculations/*.

## A. Wrong or outdated facts: correct these (text, data files, and any FAQ/JSON-LD that repeats them)

### Car accident
1. Hub /car-accident-settlement-calculator/: change "In California it's 15/30/5" to "30/60/15 (since Jan 1, 2025)". Source: https://www.dmv.ca.gov/portal/vehicle-registration/insurance-requirements
2. /colorado/: the quick-fact "2-Year Filing Deadline" should say **3 years** (C.R.S. § 13-80-101(1)(n)). The page body already says 3 years; make the quick fact match.
3. /north-carolina/: change minimum liability 30/60/25 to **$50,000 / $100,000 / $50,000** for policies issued or renewed on or after July 1, 2025. Source: NC DOI (see sources JSON).
4. /california/: remove the "$350,000" MICRA dollar figure. Keep the point that MICRA's cap applies only to medical malpractice, not car accidents. (The cap is now $470k and changes every January, so a fixed number goes stale.)

### Pain & suffering
5. /california/: pure comparative fault comes from **Li v. Yellow Cab Co., 13 Cal.3d 804 (1975)**, not Civil Code § 1714. § 1714 is the general duty of care. Reword the attribution.
6. /florida/: the PIP figures ($10,000 / 80% / 60%) come from **Fla. Stat. § 627.736**. § 627.737 is the tort threshold statute. Fix the citation.
7. /nevada/: notice for claims against government entities is **2 years** (NRS 41.036), not 6 months.
8. /colorado/: remove the medical malpractice cap dollar figures ($530k / $875k). We could not verify them.
9. /michigan/: remove the 2026 cap dollar figures ($596,400 / $1,065,000), which we could not verify. Keep the description of how the cap adjusts with CPI.

### Workers comp: maximum weekly benefit (use lib/data/wcMaxBenefits2026.json as the single source for every cap on the site)
| State | Site shows | Correct | Effective |
|---|---|---|---|
| California | $1,619 | $1,764.11 | Jan 1, 2026 |
| New York | $1,145 | $1,281.50 | injuries 7/1/2026–6/30/2027 |
| North Carolina | $1,282 (and ~$1,254 elsewhere on the page) | $1,446.00 | 2026 |
| Minnesota | $1,222 | $1,536.84 | 10/1/2025–9/30/2026 (changes Oct 1, 2026) |
| New Jersey | $1,131 | $1,199 | Jan 1, 2026 |
| Virginia | $1,309 | $1,507.01 | July 1, 2026 |
| Colorado | $1,391 | $1,464.12 | July 1, 2026 |
| Texas / Florida / Illinois / Ohio / Arizona | not audited | compare to the JSON and fix any mismatch | TX changes Oct 1, 2026 |

Georgia ($800) and Pennsylvania ($1,394) are already correct.

### Workers comp: benefit rules
10. Michigan: remove the "500-week TTD cap". MCL 418.351 has no fixed cap; 500 weeks is a determination deadline in § 418.361.
11. Colorado: remove the "104-week TTD cap". Under C.R.S. § 8-42-105, TTD runs until MMI or return to work.
12. PPD method is described wrongly in 4 states:
    - Michigan: the specific-loss schedule is a fixed number of weeks per body part (MCL 418.361). There is no AMA rating and no impairment-% scaling.
    - Minnesota: impairment % (Minn. Rules ch. 5223) × the dollar schedule in Minn. Stat. § 176.101. It is not weeks-based.
    - New Jersey: the state's own schedule in R.S. 34:15-12(c), with no AMA reference.
    - Virginia: the schedule of weeks in Va. Code § 65.2-503, with no AMA reference.
    - Georgia's AMA (5th ed.) description is correct. Keep it.
    **Do not change the calculator formula.** On MI, MN, NJ and VA only, hide the PPD estimate output and replace it with a short text block that explains the state's actual method and links its statute. Rebuilding the PPD math for these states needs explicit approval first.

## B. Unsourced figures: remove them everywhere (page text, FAQ data, JSON-LD)
- Every "average settlement in [state]" or "$X–$Y range" that doesn't name a source. 8 car accident pages use the same "$15,000–$100,000".
- "Represented claimants settle 3–4x higher" (pain & suffering hub).
- "25% attorney uplift" and example settlement ranges (workers comp CA/FL/IL/hub).
- Replace each removed "average settlement" section with a **worked example**. Call the existing calculator function with clearly labeled hypothetical inputs (e.g. $12,000 medical, $4,000 lost wages, moderate severity) and apply that state's fault rule from the existing state data. Heading: "Example: how an estimate works in [State]". No new legal claims.

## C. Sources
- Render `lib/data/sources.json` (from settlebrook-sources.json) as the "Sources" section on each tool and state page. Primary sources come first. Label secondary mirrors (Justia/FindLaw) "(statute text via Justia)".
- Michigan (car accident) and Arizona (car accident) have only 1–2 sources. That is fine; render what exists.

## D. Not audited yet
The PPD methods on the other 9 workers comp state pages (CA, TX, FL, NY, IL, PA, OH, NC, AZ) were not audited line by line, only their caps. That audit comes next.
