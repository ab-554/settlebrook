# PPD Scheduled-Loss Rules — 6 States, Injuries in 2026

Compiled 2026-09-25. Full machine-readable data: `ppd-schedules-2026.json`.

**Verification key:** VERIFIED = confirmed against an official .gov/legislative source (verbatim text obtained directly). PARTIAL = confirmed but with a gap, dated source, or unresolved currency question. UNVERIFIED / null = not found; not guessed.

---

## 1. Michigan — MCL 418.361

**Official source status: BLOCKED.** `legislature.mi.gov` rejects every URL pattern (including the raw chapter PDF) with a Check Point CloudGuard WAF "Attack blocked" response — this is bot-detection, so per policy it was not circumvented. Treated as unusable; schedule sourced from **three independent secondary reproductions** (FindLaw, Justia, a law-firm page) that agree exactly, plus one official Michigan.gov/LEO PDF confirming the rate methodology.

- **Rate:** 80% of after-tax average weekly wage — the *same* formula as TTD (not a separate lower rate). Minimum floor = 25% of SAWW (official, methodology only).
- **Paid in addition to TTD?** Yes, per secondary sources — paid even if the employee returns to work. *(PARTIAL — could not confirm against primary text.)*
- **Proration:** first phalange = 1/2 of digit; 80%+ vision loss in one eye = total loss of that eye.
- **Schedule (weeks):** thumb 65, index 38, middle 33, ring 22, little 16, great toe 33, other toe 11, hand 215, arm 269, foot 162, leg 215, eye 162.
- **Gaps:** hearing loss and disfigurement weeks — not found in any source, left **null**.

---

## 2. New Jersey — N.J.S.A. 34:15-12(c)

**VERIFIED — official.** Fetched and cross-checked: NJ DOL's official 2026 schedule PDF, NJ DOL's official compiled law text (rev. Dec 15, 2025), the NJ DOL 2026 benefit-rate press release, and Justia's verbatim statute text (all four agree).

- **Rate:** 70% of wages, but the *actual weekly dollar rate* is set by a graduated table keyed to **total weeks awarded**, not wages directly:
  - Weeks 1–180: fixed dollar brackets frozen since 1982 ($47/wk for weeks 1–90, rising in steps to $82/wk for weeks 175–180).
  - Weeks 181–600: percentage of SAWW (35% → 75% in 5%-per-30-week steps). 2026 SAWW = $1,598.66; formula checks out exactly against the official 2026 max ($1,199 = 75%×SAWW) and min ($320 = 20%×SAWW).
- **Proration:** award weeks = % loss × max weeks for that member; that total then picks the rate bracket.
- **Schedule (weeks):** thumb 80, index 60, middle 50, ring 40, little 30, great toe 40, other toe 15, hand 260 (300 if ≥25% loss of function), arm 330, foot 250 (285 if ≥25%), leg 315, eye (vision) 200, eye enucleation +25, tooth 4/each, hearing one ear 60 / both ears 200.
- **Notable quirk:** amputation awards get an extra 30% on top (not subject to attorney fees).

---

## 3. Virginia — Va. Code § 65.2-503 / § 65.2-518

**VERIFIED — official.** Fetched verbatim in full directly from `law.lis.virginia.gov` (the official VA legislative code site) and the Virginia Workers' Compensation Commission's own rate notices.

- **Rate:** 66⅔% of AWW. VA's comp-rate year runs **July 1 – June 30**, not calendar year:
  - Jan–Jun 2026: max $1,463.10 / min $365.78.
  - Jul–Dec 2026: max $1,507.01 / min $376.75.
- **Paid after TTD?** Yes — explicitly "payable after payments for temporary total incapacity." May run *simultaneously* with partial-incapacity (§65.2-502) payments, but each combined week then counts as **2 weeks** against the 500-week cap.
- **500-week cap (§65.2-518):** total comp capped at 500 weeks (or AWW×500), except permanent-total-incapacity, a specific §65.2-504 subdivision, and coal-worker pneumoconiosis deaths.
- **Schedule (weeks):** thumb 60, index 35, middle 30, ring 20, little 15 (first phalanx = 1/2), great toe 30, other toe 10, hand 150, arm 200, foot 125, leg 175, eye 100, hearing (one ear) 50, disfigurement up to 60, pneumoconiosis 50/100/300 (stage 1/2/3), byssinosis 50.

---

## 4. Georgia — O.C.G.A. § 34-9-263

**VERIFIED — official schedule/rate, secondary full text.** `legis.ga.gov` and the state's designated LexisNexis code portal are JS/search-only and couldn't be deep-linked in this session; schedule and rate figures instead confirmed via the **official** Georgia State Board of Workers' Compensation "Summary of Provisions" PDF, cross-checked against Justia's verbatim statute text (which agreed exactly, plus one extra line the SBWC summary omitted).

- **Rate:** 66⅔% of AWW × (impairment % × max weeks for that part). Max weekly benefit = **$800**, effective July 1, 2023 — no later increase found (*PARTIAL on currency, not on the 2023 figure itself*). Reduced/limited-duty rate = $533.
- **Impairment standard:** AMA *Guides to the Evaluation of Permanent Impairment*, 5th edition — stated verbatim in the statute.
- **Paid after TTD?** Yes — PPD "shall not become payable so long as the employee is entitled to" TTD/TPD benefits for the same injury.
- **Schedule (weeks):** arm 225, leg 225, hand 160, foot 135, thumb 60, index 40, middle 35, ring 30, little 25, great toe 30, other toe 20, hearing one ear 75 / both ears 150, vision one eye 150, **body as a whole 300**.
- **Notable quirk:** Georgia does *not* compensate disfigurement alone (no scheduled-loss accompaniment) — confirmed by its own case law annotations.

---

## 5. New York — WCL § 15(3)

**VERIFIED — official.** Fetched verbatim in full directly from `nysenate.gov` (NY Senate's official Consolidated Laws host).

- **Rate:** 66⅔% of AWW. NY also resets its max every **July 1** based on the prior calendar year's NYSAWW:
  - Jan–Jun 2026: max $1,222.42 (secondary-sourced; min not found).
  - Jul 2026–Jun 2027: max $1,281.50 / min $384.45.
- **Proration:** explicit — "proportionate loss or loss of use"; first phalange = 1/2 digit; 2+ digits proportioned but capped at hand/foot compensation; 80%+ vision loss = full eye loss.
- **Schedule (weeks):** arm 312, leg 288, hand 244, foot 205, eye 160, thumb 75, first finger 46, great toe 38, second finger 30, third finger 25, other toe 16, fourth finger 15, hearing one ear 60 / both ears 150.
- **Notable quirks:** disfigurement is a flat $20,000 cap (not weeks-based); "protracted TTD" can be *added* to the schedule period if TTD outlasts per-member thresholds (e.g., arm 32 wks, leg 40 wks); non-schedule "other cases" PPD is capped at 225–525 weeks by % of lost wage-earning capacity, a wholly separate track.

---

## 6. Minnesota — Minn. Stat. § 176.101 subd. 2a

**VERIFIED — official, with a critical mid-year split.** Fetched verbatim in full from `revisor.mn.gov`, including the **2026 session law itself** (2026 Minnesota Laws ch. 103, S.F. 3720, signed May 18, 2026), which shows the old and new dollar tables side-by-side with an explicit effective date.

> **A calculator MUST branch on exact injury date within 2026** — two tables apply:
> - **Injuries Jan 1 – Sep 30, 2026:** the table in force since Oct 1, 2023.
> - **Injuries Oct 1, 2026 onward:** a new, higher table (roughly a 20% across-the-board increase), per 2026 c 103 s 10.

- **Rating standard:** whole-body percentage under Minn. Rules ch. 5223 (not the AMA Guides, and not member/weeks-based like the other 5 states).
- **Computation:** lump sum = impairment % × dollar amount for that %'s band (table below).
- **Paid after TTD?** Yes — explicitly "not payable while temporary total compensation is being paid"; lump-sum option within 30 days, discountable up to 5% present value.

| Impairment % | Table A ($, injuries through 9/30/26) | Table B ($, injuries from 10/1/26) |
|---|---|---|
| <5.5 | 114,260 | 137,240 |
| 5.5–<10.5 | 121,800 | 146,297 |
| 10.5–<15.5 | 129,485 | 155,527 |
| 15.5–<20.5 | 137,025 | 164,584 |
| 20.5–<25.5 | 139,720 | 167,821 |
| 25.5–<30.5 | 147,000 | 176,565 |
| 30.5–<35.5 | 150,150 | 180,348 |
| 35.5–<40.5 | 163,800 | 196,744 |
| 40.5–<45.5 | 177,450 | 213,139 |
| 45.5–<50.5 | 177,870 | 213,643 |
| 50.5–<55.5 | 181,965 | 218,562 |
| 55.5–<60.5 | 209,475 | 251,605 |
| 60.5–<65.5 | 237,090 | 284,774 |
| 65.5–<70.5 | 264,600 | 317,817 |
| 70.5–<75.5 | 292,215 | 350,986 |
| 75.5–<80.5 | 347,340 | 417,197 |
| 80.5–<85.5 | 402,465 | 483,409 |
| 85.5–<90.5 | 457,590 | 549,621 |
| 90.5–<95.5 | 512,715 | 615,833 |
| 95.5–100 | 567,840 | 682,045 |

---

## Summary Table

| State | Overall status | Schedule entries | Key open gap |
|---|---|---|---|
| Michigan | PARTIAL (official site unusable; secondary cross-verified) | 12 | Hearing loss, disfigurement weeks not found |
| New Jersey | VERIFIED (official) | 17 | None material |
| Virginia | VERIFIED (official) | 16 | None material |
| Georgia | VERIFIED (official schedule; PARTIAL on $800 max currency) | 15 | Unconfirmed whether $800 max has been raised since 7/1/2023 |
| New York | VERIFIED (official) | 13 | Jan–Jun 2026 minimum rate not found |
| Minnesota | VERIFIED (official) | 20 bands × 2 tables | None material — but requires date-branching logic |
