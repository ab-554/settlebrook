# Workers Comp Settlement Calculator — Discrepancy Audit
Audit date: September 24, 2026. Format: page URL | claim as written | what the source says | source URL | severity.

## Six template states (GA, MI, NJ, VA, CO, MN) — full audit

### Georgia — clean (no discrepancies found)
- Max weekly cap $800/wk and TTD duration 400 weeks both match the Georgia SBWC provisions summary and O.C.G.A. §34-9-261. PPD "AMA Scheduled Weeks method" matches O.C.G.A. §34-9-263, which explicitly incorporates the AMA Guides, 5th Edition. No WRONG/OUTDATED items.

### Michigan
- https://www.settlebrook.com/workers-comp-settlement-calculator/michigan/ | "Maximum TTD Duration: 500 weeks" | MCL 418.351 sets no fixed week cap on TTD payments (continues while disability persists); "500 weeks" appears only in MCL 418.361 as the deadline for a permanency *determination* under the specific-loss schedule, not a payment cap | https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-418-351 ; https://codes.findlaw.com/mi/chapter-418-workers-disability-compensation/mi-comp-laws-418-361/ | WRONG
- https://www.settlebrook.com/workers-comp-settlement-calculator/michigan/ | "PPD calculated using the AMA Scheduled Weeks method... AWW × benefit rate × impairment weeks × (impairment rating % / 100)" | MCL 418.361's specific-loss schedule is a fixed number of weeks per body part (thumb 65, hand 215, arm 269, etc.) with no reference to AMA Guides and not scaled by an "impairment rating %" the way the formula states | https://codes.findlaw.com/mi/chapter-418-workers-disability-compensation/mi-comp-laws-418-361/ | WRONG
- https://www.settlebrook.com/workers-comp-settlement-calculator/michigan/ | "$1,200/wk" (2026 cap) | Official 2026 Rate Book states $1,201.00 | https://www.michigan.gov/leo/-/media/Project/Websites/leo/Documents/WDCA-Calculation-Program/wca_2026_Rate_Book.pdf | Immaterial ($1 rounding) — not flagged as an error

### New Jersey
- https://www.settlebrook.com/workers-comp-settlement-calculator/new-jersey/ | "$1,131/wk" (2026 cap) | NJDOL's official 2026 rate is $1,199/wk, effective Jan 1, 2026 (up from $1,159 in 2025) | https://www.nj.gov/labor/lwdhome/press/2025/20251229_newbenefitrates2026.shtml | OUTDATED
- https://www.settlebrook.com/workers-comp-settlement-calculator/new-jersey/ | "PPD calculated using the AMA Scheduled Weeks method" | R.S. 34:15-12(c) is New Jersey's own statutory schedule of weeks per body part; the statute text does not reference the AMA Guides at all | https://nj.gov/labor/workerscompensation/assets/PDFs/Forms/wc_law.pdf ; https://www.nj.gov/labor/workerscompensation/assets/PDFs/Legal/2022_schedule.pdf | WRONG
- Maximum TTD duration "400 Weeks" — matches R.S. 34:15-12(a). No discrepancy.

### Virginia
- https://www.settlebrook.com/workers-comp-settlement-calculator/virginia/ | "$1,309/wk" (2026 cap) | Virginia Workers' Compensation Commission's official Notice of 2026 Rates sets the max at $1,507.01/wk (min $376.75), effective July 1, 2026 | https://www.workcomp.virginia.gov/news/notice-of-2026-rates | OUTDATED
- https://www.settlebrook.com/workers-comp-settlement-calculator/virginia/ | "PPD... AMA Scheduled Weeks approach" | Va. Code §65.2-503's schedule of weeks (arm 200, hand 150, thumb 60, etc.) is Virginia's own statute; the code text does not reference the AMA Guides | https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-503/ | WRONG
- Maximum TTD/total-compensation duration "500 Weeks" — matches Va. Code §65.2-518. No discrepancy.

### Colorado
- https://www.settlebrook.com/workers-comp-settlement-calculator/colorado/ | "Maximum TTD Weeks: 104 wks" | C.R.S. §8-42-105 sets no fixed week cap — TTD continues until MMI, return to work, or a written release to return to work | https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-105/ | WRONG
- https://www.settlebrook.com/workers-comp-settlement-calculator/colorado/ | "$1,391/wk" (2026 cap) | Confirmed prior-year (July 1, 2025-June 30, 2026) official rate was $1,396.85 (91% of SAWW); a new Maximum Benefits Order took effect July 1, 2026 (before today's Sept 24, 2026 audit date) and the current dollar figure could not be extracted from the Colorado DWC's JS-rendered order document, so the site's un-dated $1,391 figure cannot be confirmed as the currently effective rate | https://cdle.colorado.gov/dwc/dowc-updates ; https://assets.ctfassets.net/gau1nv66ynug/1w8ozKyHQf0IpP6UjLjJse/98b43344f57cafc939548827e83835fc/2025_Max_Benefits_Order.pdf | OUTDATED / UNVERIFIABLE (current figure)
- PPD "AMA Scheduled Weeks method" — Colorado does use AMA Guides-based impairment ratings (C.R.S. §8-42-107), but non-scheduled (whole-person) injuries use an age/AWW-adjusted formula, not a simple weeks-per-body-part table the way the generic templated formula implies for scheduled injuries. | UNVERIFIABLE (partial match; needs a Colorado-specific rewrite rather than a flat right/wrong call)

### Minnesota
- https://www.settlebrook.com/workers-comp-settlement-calculator/minnesota/ | "$1,222/wk" (2026 cap) | Minnesota DLI's official current rate (effective Oct 1, 2025) is $1,536.84/wk; the rate effective Oct 1, 2026 rises to $1,594.08/wk. Site figure is off by $300-370+ | https://www.dli.mn.gov/business/workers-compensation/work-comp-rate-information-statewide-average-weekly-wage-saww ; https://www.dli.mn.gov/sites/default/files/pdf/comprates.pdf | WRONG/OUTDATED (largest dollar discrepancy found)
- https://www.settlebrook.com/workers-comp-settlement-calculator/minnesota/ | "PPD calculated using the AMA Scheduled Weeks method (where each body part is worth a specific number of benefit weeks)" | Minnesota PPD is NOT weeks-based at all: an impairment % (rated under Minnesota's own Rules Chapter 5223, not cited as "AMA Guides") is multiplied by a dollar-value table in Minn. Stat. §176.101 subd. 2a (ranging ~$114,260 to $567,840 by impairment tier) to produce a lump-sum dollar award | https://www.revisor.mn.gov/statutes/cite/176.101 | WRONG (confirms audit's original suspicion — most severe methodological error found)
- Maximum TTD duration "130 Weeks" — matches Minn. Stat. §176.101 exactly ("Temporary total disability compensation shall cease entirely when 130 weeks... have been paid"). No discrepancy.

## Other 9 state pages — weekly-cap and duration spot check

- https://www.settlebrook.com/workers-comp-settlement-calculator/california/ | "$1,619/wk" (2026 cap) | CA DIR's official 2026 TTD max is $1,764.11/wk (min $264.61), effective Jan 1, 2026 | https://dir.ca.gov/DIRNews/2025/2025-116.html | OUTDATED
- https://www.settlebrook.com/workers-comp-settlement-calculator/new-york/ | "$1,145/wk" (2026 cap) | NY WCB's official max is $1,281.50/wk for injury dates July 1, 2026-June 30, 2027 | https://www.wcb.ny.gov/content/main/SubjectNos/sn046_1805.jsp | OUTDATED
- https://www.settlebrook.com/workers-comp-settlement-calculator/north-carolina/ | "$1,282/wk Cap (2026)" (also internally inconsistent — page separately references ~$1,254) | NC Industrial Commission's official 2026 maximum is $1,446.00/wk (up from $1,380.00 in 2025) | https://www.ic.nc.gov/workers-compensation-claims/maximum-weekly-compensation-rates | OUTDATED
- https://www.settlebrook.com/workers-comp-settlement-calculator/pennsylvania/ | "$1,394/week" (2026) | Matches PA DLI's official 2026 SAWW/max rate of $1,394.00, effective Jan 1, 2026 | https://www.pa.gov/agencies/dli/programs-services/workers-compensation/workers--compensation-claim/statewide-average-weekly-wage-saww | Confirmed accurate — no discrepancy
- https://www.settlebrook.com/workers-comp-settlement-calculator/texas/ , /florida/ , /illinois/ , /ohio/ , /arizona/ | 2026 weekly cap figures ($1,066; $1,197; $1,897; $1,200/$1,281; $1,200) | Official agency pages exist and were fetched, but each publishes its current-year table via a JS-rendered widget/PDF that this audit's WebFetch tool could not extract text from, so the exact current dollar figures could not be independently confirmed or refuted | see sources-workers-comp.json entries for texas/florida/illinois/ohio/arizona | UNVERIFIABLE — recommend manual confirmation before the next content pass, given the pattern above shows most state pages currently understate the true 2026 max by $50-$370

## Unsourced figures (present on multiple pages, no citation given)
- "Represented workers receive higher settlements... a 25% average uplift in payout... (per NCCI data)" — appears on Michigan and Colorado pages (likely templated across others); no link, report title, or publication date given for the underlying NCCI data | UNSOURCED FIGURE
- California example settlement ranges ("$5,000-$20,000" minor; "$40,000-$90,000" moderate 15-30%; "$250,000-$500,000+" catastrophic) — presented as benchmarks with no citation | UNSOURCED FIGURE
- Florida example settlement ranges ("$18,000-$25,000" minor; "$150,000-$275,000+" severe spinal) — no citation | UNSOURCED FIGURE
- Illinois settlement tier ranges ("$12,000-$1,200,000+") — no citation | UNSOURCED FIGURE
- Main hub page: "25% average uplift in payout" for represented workers — no citation | UNSOURCED FIGURE

## Notes on scope
- All 15 required state pages were fetched, including the six mandatory template states (Georgia, Michigan, New Jersey, Virginia, Colorado, Minnesota), which were audited in full per the task's escalated scrutiny requirement.
- For the nine non-template states, this pass focused on the two figures most likely to drift (max weekly benefit, duration cap) rather than a full line-by-line audit of every PPD/waiting-period/filing-deadline claim; those pages' PPD-method and filing-deadline claims were extracted (see sources file) but not independently re-verified against statute text within this session's time budget.
