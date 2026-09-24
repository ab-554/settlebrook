# Workers' Comp Max/Min TTD Weekly Benefit — Methodology & Notes

**Target date:** September 24, 2026 (today). For each jurisdiction, the goal was the
official max/min TTD weekly rate for whatever rate period is in effect on that date.

**Summary:** 33 VERIFIED, 3 PRIOR_PERIOD, 15 UNVERIFIED, out of 51 jurisdictions
(50 states + DC).

## Sourcing rules followed
- Only state workers' comp agency/board/commission/labor department .gov pages,
  official statute sites, or state-run WC insurer official rate notices were used
  as `source_url`. Aggregator sites, law-firm blogs, and insurer marketing pages
  were used only to *locate* where an official page might be — never cited as the
  source, and never used to fill in a number that wasn't independently confirmed
  on an official page.
- Every source_url was fetched and the fetch tool's returned text was checked to
  confirm the dollar figures and effective period actually appear on that page
  before marking VERIFIED.
- Where an official page could not be reached or did not contain the number
  (JS-rendered tables, PDFs blocked by robots.txt, image-only/scanned PDFs,
  404s on guessed filenames, etc.), the record is UNVERIFIED with null numbers —
  per instructions, null is used rather than a guessed number.
- A federal cross-check source, the SSA POMS "Chart of States' Maximum Workers'
  Compensation Benefits" (secure.ssa.gov, updated 07/10/2026), was used to
  *sanity-check* several figures and as a lead for where to look next, but was
  **not** used as the `source_url` for any record, since the task calls for each
  state's own agency page. Where SSA's figure matched a figure independently
  confirmed on the state's own page (e.g., Delaware $962.72, Montana $1,192.00,
  Nevada $1,308.86, Arizona's derived $943.23), that agreement increased
  confidence but the state page remains the cited source. Where SSA had a figure
  but the state's own page could not be confirmed (AL, CO, IL, LA, MD, MA, NH),
  the record is left UNVERIFIED and the SSA figure is only mentioned in that
  record's `notes` as an unconfirmed lead — not reported as a data field.

## Rate-period timing (why "effective period" varies so much by state)
States update TTD max/min on different cycles, and this matters a lot for a
Sept 24, 2026 snapshot:
- **Calendar year (Jan 1):** AK, AZ, CA, DC, FL, KY, MI, NJ, NM, PA, SC, ME
  effectively also uses a mid-year (July) date instead — see below.
- **State fiscal year (July 1):** AL(intended), CO, DE, ID(partly), IN, IA, KS, MO,
  MT, NV, ND, SD, TN, UT, VA, VT, WA, WY, and Maine (July 1 SAWW update despite
  otherwise looking calendar-based).
- **Oct 1:** CT, MN, RI, TX (all four landed on a period that already covers
  9/24/26 without needing a mid-2026 update).
- **Ad hoc / statute-fixed, not annually indexed:** GA (unchanged since 7/1/2023).

Because several states run July 1-June 30 fiscal years, and "today" is
September 24, 2026 — i.e., *after* the July 1, 2026 rollover — the FY2026-2027
(not FY2025-2026) figures were required. This tripped up several searches:
several vendor/law-firm pages and even some official-looking search snippets
were for the *prior* fiscal year and had to be discarded in favor of the
current one (Montana, Nevada, Missouri, Virginia, Utah, South Dakota, Tennessee
all required finding the July-2026-dated document specifically, not the
July-2025 one that ranked first in search results).

## Per-state caveats worth flagging before publishing
- **Georgia**: Not indexed annually — fixed by statute at $800/$50 since
  7/1/2023, confirmed unchanged as of a 7/1/2025 revision of the state's own
  summary document. No 2026-specific increase exists to report.
- **Arizona**: The system is monthly (Average Monthly Wage), not weekly. The
  $943.23 max_weekly is a standard calculated weekly-equivalent
  (AMW × 12/52 × 66⅔%) from the officially confirmed CY2026 statutory maximum
  AMW ($6,131/month) — not a number ICA itself labels "weekly." Flag this
  clearly if publishing a comparison table across states.
- **Washington**: Same monthly-cap issue, more severe — WA's max is a *monthly*
  amount tied to 120% of the state average monthly wage, and could only be
  confirmed for the FY2025-2026 period ($9,516/month, effective 7/1/25); the
  FY2026-2027 rate (needed for 9/24/26) was not found on an official page, so
  this record is PRIOR_PERIOD as well as being a calculated weekly-equivalent.
- **Vermont**: The historical rate table's "minimum" column is actually a
  "Minimum Dependency Benefit," not a general minimum weekly comp rate — don't
  conflate the two if citing this table. Also, only the FY2025-2026 row was
  found (PRIOR_PERIOD relative to 9/24/26).
- **Oklahoma**: Only the CY2025 max ($1,083.46) could be confirmed on the
  official OK WCC notice; the CY2026 notice (which should be current by
  9/24/26) was not located despite several attempts. PRIOR_PERIOD.
- **Maine**: Max varies by date-of-injury table, not just year — $1,561.40
  applies to injuries 1/1/2020 and later (125% SAWW); older injury cohorts use
  lower caps (e.g., 90% SAWW = $1,124.21 for 1993-2012 injuries). No flat
  minimum was found (Maine uses spendable/after-tax-earnings-based comp with
  no simple floor).
- **Michigan**: The official table's lowest entry is $0.74/week — this is the
  bottom of a wage-indexed table, not a meaningful policy "minimum," since
  Michigan doesn't have a separate flat statutory minimum.
- **Alaska**: Two maximums exist in statute — $1,627 (general TTD/PTD, AS
  23.30.175(a)) and a lower $1,424 (rehabilitation-specific, AS 23.30.041(k)).
  Used the general $1,627 figure.
- Several "no minimum found" entries (ME, MT, NE, NV, NJ, NC, PA, RI, SC, WI)
  likely do have a statutory minimum in their respective codes, but the
  specific dollar figure did not appear on the official page(s) fetched for
  the max rate — these need a follow-up targeted search specifically for the
  minimum if the min figure matters for the published piece.

## States left fully UNVERIFIED (no official number confirmed at all)
Alabama, Colorado, Illinois, Indiana, Iowa, Kansas, Louisiana, Maryland,
Massachusetts, Mississippi, New Hampshire, Ohio, Oregon, West Virginia, Wyoming.

Common blockers: robots.txt blocking (Louisiana, Maryland), JS-rendered rate
tables with no static text (Illinois), scanned/image-only PDFs (Alabama),
rate figures locked inside a Box.com/Google Drive viewer that wouldn't render
as text (Colorado, Wyoming), or simply no findable official page with the
number in the time available (Indiana, Iowa, Kansas, Massachusetts,
Mississippi, New Hampshire, Ohio, Oregon, West Virginia). These are prime
candidates for a follow-up pass with direct phone/email confirmation from the
agency, or a retry once JS-rendering/PDF-OCR tooling is available.

## Highest / lowest among VERIFIED max_weekly
- **Highest:** District of Columbia — $1,852.07/week (eff. 1/1/26)
- **Lowest:** Georgia — $800.00/week (fixed since 7/1/23)

## Data collection date
All fetches performed 2026-09-24 (session date). Figures reflect whatever was
published on each official page as of that date; some states' pages may be
updated after this date without changing historical accuracy of this snapshot.
