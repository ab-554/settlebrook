# Post 8 verification: impairment-rating-payout-calculator

Checked 2026-10-26. Quotes are the exact phrases returned by the fetched page, trimmed to 25 words or fewer. "Justia" rows are statute text only; the official Texas statute site (statutes.capitol.texas.gov) and California's leginfo site would not render in our fetch tool, so statute text comes from Justia, labeled as such in the post.

## Texas

| # | Claim in post | Source URL | Short quote | Verified |
|---|---|---|---|---|
| T1 | 3 weeks of IIBs per impairment point | https://tdi.texas.gov/wc/employee/impairmentben.html | "If you are eligible, you get three weeks of IIBs for each percentage of impairment." | yes |
| T2 | Tex. Lab. Code § 408.121(a): IIBs begin the day after MMI; end at the earlier of 3 weeks/point or death | https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-121/ (statute text via Justia) | "on the day after the date the employee reaches maximum medical improvement"; "three weeks for each percentage point of impairment" | yes |
| T3 | § 408.121(b): carrier starts paying by the 5th day after receiving the MMI report | same as T2 | "not later than the fifth day after the date on which the insurance carrier receives the doctor's report certifying maximum medical improvement" | yes |
| T4 | § 408.121(c): carrier that disputes the rating pays on its "reasonable assessment" | same as T2 | "shall pay the employee impairment income benefits for a period based on the carrier's reasonable assessment of the correct rating" | yes |
| T5 | IIB rate = 70% of AWW (§ 408.126) | https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-126/ (statute text via Justia); also https://tdi.texas.gov/wc/employee/impairmentben.html | "an impairment income benefit is equal to 70 percent of the employee's average weekly wage"; TDI: "IIBs are 70% of your average weekly wage (AWW)." | yes |
| T6 | IIB max = 70% of SAWW, rounded (§ 408.061(b)); max in effect on date of injury applies for the whole claim (§ 408.061(g)) | https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-d/section-408-061/ (statute text via Justia) | "A weekly impairment income benefit may not exceed 70 percent of the state average weekly wage"; "in effect on the date of injury is applicable for the entire time" | yes |
| T7 | Minimum = 15% of SAWW (§ 408.062(a)) | https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-d/section-408-062/ (statute text via Justia) | "The minimum weekly income benefit is 15 percent of the state average weekly wage" | yes |
| T8 | FY2027 (injuries 10/1/2026-9/30/2027): SAWW $1,314.32; IIB max $920.00; IIB min $197.00; TIB max $1,314.00 | https://tdi.texas.gov/wc/employee/maxminbens.html (page "Last updated: 9/14/2026") | Row "2027 (10/01/26-09/30/27) | $1,314.32 | $1,314.00 | $197.00 | $920.00 | $197.00" | yes (page fetched twice; arithmetic check 70% x 1,314.32 = 920.02; 15% = 197.15) |
| T9 | FY2026 (injuries 10/1/2025-9/30/2026): SAWW $1,271.05; IIB max $890.00; IIB min $191.00; TIB max $1,271.00 | same as T8 | Row "2026 (10/01/25-09/30/26) | $1,271.05 | $1,271.00 | $191.00 | $890.00 | $191.00" | yes (70% x 1,271.05 = 889.7; 15% = 190.6) |
| T10 | § 408.142(a)(1): SIBs require "an impairment rating of 15 percent or more" plus other conditions (work status, no commutation, job-search compliance) | https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-h/section-408-142/ (statute text via Justia) | "an impairment rating of 15 percent or more as determined by this subtitle from the compensable injury" | yes for the 15% threshold; other conditions summarized from a secondary fetch of the same section |
| T11 | Certifying doctor assigns the rating using § 408.124 guidelines (§ 408.123(a)) | https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-123/ (statute text via Justia) | "shall evaluate the condition of the employee and assign an impairment rating using the impairment rating guidelines described by Section 408.124" | yes |
| T12 | First valid rating final unless disputed before the 91st day after written notice (§ 408.123(e)) | same as T11 | "is final if the certification or assignment is not disputed before the 91st day after the date written notification" | yes |
| T13 | Later dispute only with compelling medical evidence (§ 408.123(f)) | same as T11 | Summarized by the fetch tool, not quoted verbatim ("compelling medical evidence", e.g. significant error applying the AMA guidelines) | yes, paraphrase level only |
| T14 | Disputed rating goes to next available designated doctor; report has presumptive weight (§ 408.125) | https://law.justia.com/codes/texas/labor-code/title-5/subtitle-a/chapter-408/subchapter-g/section-408-125/ (statute text via Justia) | "shall direct the employee to the next available doctor"; report "carries presumptive weight" (fetch tool wording) | yes, paraphrase level |
| T15 | Texas currently uses AMA Guides 4th edition (1993); DWC plans move to 6th (2025) | https://www.tdi.texas.gov/wc/hcprovider/ama-guides-sixth.html | "For over 20 years, DWC has been using the AMA Guides 4th edition, published in 1993."; "DWC plans to transition to the AMA Guides 6th edition (2025)" | yes |
| T16 | Tentative 6th-edition start Jan 1, 2028; dates tentative | https://www.tdi.texas.gov/WC/hcprovider/documents/ama-guides-0826.pdf | "January 1, 2028"; "Note: Dates are tentative and subject to change." | yes (marked tentative in post) |
| T17 | 4th edition applies to exams after 10/15/2001 | same as T16 | "4th - 1993 (1st-4th printing - applicable to exams after 10/15/2001)" | yes (not stated in post, background only) |
| T18 | Texas table: 5/10/15/20/25% = 15/30/45/60/75 weeks | derived from T1/T2 (rating x 3) | n/a | yes (arithmetic) |
| T19 | Hypothetical dollars: $700 x 15/30/45/60/75 = $10,500 / $21,000 / $31,500 / $42,000 / $52,500; 45 x $920 = $41,400; 45 x $890 = $40,050 | derived | n/a | yes (arithmetic, labeled hypothetical) |

## Colorado

| # | Claim in post | Source URL | Short quote | Verified |
|---|---|---|---|---|
| C1 | Hand below wrist = 104 weeks, C.R.S. § 8-42-107(2)(c) | https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-107/ (statute text via Justia) | "The loss of a hand below the wrist" (104 weeks, subsection (2)(c)) | yes |
| C2 | Partial loss = proportionate share (§ 8-42-107(7)(b)(II)) | same | "the amount of permanent partial disability shall be the proportionate share of the amount stated in the above schedule" | yes |
| C3 | Scheduled rate is a flat statutory amount adjusted each July 1 (§ 8-42-107(6)) | same | "the compensation rate established in this subsection (6) shall be modified for claims arising on and after such date" | yes |
| C4 | $459.45/week for injuries 7/1/2026-6/30/2027 | https://codwc.box.com/s/9def89oiq7q4z24v2y4axffrgfuehf5g (DOWC 2026 Max Benefits Order) | Not re-read this session (Box PDF viewer needs JavaScript). Figure taken from PPD-SPEC-ADDENDUM-COLORADO.md, which records it as read from the PDF. | yes per addendum; NOT independently re-verified by me |
| C5 | Order was issued and effective July 1, 2026; DOWC posted June 2, 2026 | https://cdle.colorado.gov/dwc/dowc-updates | "has been issued and is effective July 1, 2026" | yes |
| C6 | Scheduled vs non-scheduled injury types | https://cdle.colorado.gov/dwc/injured-workers/understand-potential-benefits | "For loss of function to your toes, feet, legs, fingers, hands, arms, eyes, vision or hearing"; "your spine, lungs, or mental function" | yes |
| C7 | 20.8 weeks x $459.45 = $9,556.56; 10.4 x $459.45 = $4,778.28 | derived from C1, C2, C4 | n/a | yes (arithmetic; matches addendum test case) |
| C8 | Whole-person: rating x age factor (1.80 at 20 or younger to 1.00 at 60+) x 400 weeks | Justia link above, § 8-42-107(8)(d)-(e) | Fetch summary: age factors "1.80 for age 20 or younger down to 1.00 for age 60 or older"; "four hundred weeks" | yes |
| C9 | Whole-person TTD-rate range $150.00-$804.46; combined caps $202,297.46 / $328,049.94 for 2026-27 | DOWC 2026 Max Benefits Order (Box link) | Not re-read. Text copied from the addendum as instructed. The statute floor of $150 was seen on Justia; the other three figures were not seen by me. | per addendum; NOT independently re-verified. Shown as explanation only, no computation. |
| C10 | Whole-person uses revised 3rd edition AMA Guides as of 7/1/1991 (§ 8-42-107(8)(c)) | Justia link above | "revised third edition" in effect as of July 1, 1991 | yes |

## California

| # | Claim in post | Source URL | Short quote | Verified |
|---|---|---|---|---|
| CA1 | Impairment converted to disability with PDRS modifiers | https://www.dir.ca.gov/dwc/workerscompensationbenefits.htm | "Whole person impairment is converted to disability using modifiers in the Permanent Disability Rating Schedule (PDRS)." | yes |
| CA2 | For injuries on/after 1/1/2013, FEC modifier replaced by 1.4; 2005 PDRS adjusts for occupation and age | same; also https://dir.ca.gov/dwc/FactSheets/FactSheet_D.pdf | "the future earning capacity (FEC) modifier is eliminated and replaced with a 1.4 modifier"; Fact Sheet: "Your occupation and age at the time of your injury affect your PD calculation." | yes |
| CA3 | Each rating corresponds to a fixed number of weeks, paid under Labor Code § 4658 | https://www.dir.ca.gov/dwc/pdr.pdf (2005 Schedule for Rating Permanent Disabilities) | "Each rating corresponds to a fixed number of weeks of compensation." | yes for the principle |
| CA4 | Percentage equals a dollar amount depending on injury date | https://dir.ca.gov/dwc/FactSheets/FactSheet_D.pdf | "Your percentage of disability equals a specific dollar amount, depending on the date of your injury" | yes |
| CA5 | Weekly PD rate min $160.00 / max $290.00 for injuries 1/1/2014 through the 2026 row | https://www.dir.ca.gov/dwc/workerscompensationbenefits.htm | Table rows 1/1/2014 to 1/1/2026: min $160.00, max $290.00 (all PD bands) | yes |
| CA6 | Weeks-per-percentage table (Labor Code § 4658) | No official dir.ca.gov / dwc.ca.gov page found that prints it. leginfo.legislature.ca.gov failed to load. Justia returned a table, but it is not an official source and the fetch summary was inconsistent with subdivision labels. | n/a | NO. Dropped. No California payout dollars or weeks table in the post. |
| CA7 | CA weekly PD rate is based on average weekly wages | https://dir.ca.gov/dwc/FactSheets/FactSheet_D.pdf | Fetch summary: percentage converts to dollars "based on injury date and average weekly wages" | yes at paraphrase level |

## Items cut or not claimed

- No averages, "typical" payouts, or settlement-multiple statistics.
- No California weeks, totals, or worked example.
- No Colorado whole-person calculation.
- Colorado $459.45 and the whole-person caps rest on the addendum; see C4 and C9. Re-open the DOWC Box PDF in a browser before publish if you want a second read.
