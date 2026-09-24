# State-specific PPD module: spec (reviewed Sept 25, 2026)

Data: `ppd-schedules-2026.json` (same folder). This spec is authoritative wherever it differs from that JSON.
Rule: this module is NEW and ADDITIVE. Do not modify any existing function in lib/calculations/*.

## Architecture
1. `lib/data/ppdSchedules2026.ts`: typed data built from the JSON. Keep only the fields listed below, and keep the statute citation and official URL for each state.
2. `lib/calculations/ppdState.ts`: a new file with pure functions only:
   - `scheduledPPD({ state, bodyPart, lossPercent, aww?, weeklyRateOverride? })` for MI, NJ, VA, GA, NY. Returns `{ weeks, weeklyRate | null, total | null, citation, notes[] }`.
   - `minnesotaPPD({ ratingPercent, injuryDate })` returns `{ bandAmount, total, table: "A" | "B", citation }`.
3. `components/calculator/StatePPDSection.tsx`: body-part dropdown (from the schedule), loss or impairment % input, and the rate input or injury-date input the state needs. It shows weeks, weekly rate and total, plus the statute link. Render it on the MI, MN, NJ, VA and GA workers comp state pages in place of the "PPD hidden" text block. Keep NY's existing page, but use the module for its PPD figure only if NY currently shows a PPD estimate; otherwise leave NY alone.
4. Colorado: out of scope. Leave as it is today. Its PPD method (C.R.S. 8-42-107) is not audited yet.

## Rules per state
- **New York** (WCL § 15(3)): weeks = schedule[bodyPart] × loss%. Rate = min(2/3 × AWW, NY max from wcMaxBenefits2026.json).
- **Virginia** (Va. Code § 65.2-503): weeks = schedule × loss%. Rate = min(2/3 × AWW, VA max). Note: "Paid after temporary total benefits end; combined limit of 500 weeks (§ 65.2-518)."
- **Georgia** (O.C.G.A. § 34-9-263): weeks = schedule × impairment rating % (AMA Guides 5th ed.). Rate = min(2/3 × AWW, $800).
- **Michigan** (MCL 418.361): weeks = schedule × loss%. First phalange of a digit = 1/2 of that digit. Vision: loss of 80% or more counts as total loss of the eye. The weekly rate is 80% of after-tax AWW, which needs state tax tables, so do NOT compute it. The user enters their weekly compensation rate ("shown on your benefit notice"). If it's blank, show weeks only. Hearing and disfigurement are not in the dataset, so exclude them from the dropdown.
- **New Jersey** (N.J.S.A. 34:15-12(c)): WEEKS ONLY. weeks = schedule × loss%. Hand and foot have two schedule values: use the "25% or more" value when loss% ≥ 25, otherwise the "under 25%" value. Do NOT compute dollars. The `rate_table_weeks_1_to_180` in the JSON is WRONG for 2026 (the official 2026 chart shows e.g. 90 weeks = $28,800 maximum), so don't use it. Show: "New Jersey's weekly rate depends on the total weeks awarded — see the official 2026 schedule" and link https://www.nj.gov/labor/workerscompensation/assets/PDFs/Forms/2026_schedule.pdf
- **Minnesota** (Minn. Stat. § 176.101 subd. 2a; ratings under Minn. Rules ch. 5223): lump sum = rating% × the dollar amount for the band the rating falls in. Injury date before 2026-10-01 → table A; on or after 2026-10-01 → table B. Whole-body rating is capped at 100%.
- Don't apply statutory minimum rates (say "Minimum-rate rules not applied" in notes).

## Required unit tests (hand-computed, must pass exactly)
| Case | Expected |
|---|---|
| NY hand, 50% loss, AWW $1,200 | 122 weeks × $800.00 = $97,600.00 |
| VA hand, 20% loss, AWW $900 | 30 weeks × $600.00 = $18,000.00 |
| GA arm, 10% rating, AWW $1,500 | 22.5 weeks × $800.00 (capped) = $18,000.00 |
| MI hand, 50% loss, rate override $700 | 107.5 weeks × $700 = $75,250.00 |
| MI hand, 50% loss, no rate | 107.5 weeks, total null |
| NJ hand, 30% loss | 90 weeks (300 × 30%), total null |
| NJ hand, 20% loss | 52 weeks (260 × 20%), total null |
| MN 10% rating, injury 2026-09-01 | 10% × $121,800 = $12,180.00 (table A) |
| MN 10% rating, injury 2026-10-15 | 10% × $146,297 = $14,629.70 (table B) |

## Copy rules
Every result shows "Estimate only. Not legal advice." and the statute citation link. No new legal claims beyond this spec.
