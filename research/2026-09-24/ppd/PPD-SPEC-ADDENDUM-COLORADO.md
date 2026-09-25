# PPD module addendum: Colorado (reviewed Sept 25, 2026)

Colorado has two PPD tracks under C.R.S. § 8-42-107.

## 1. Scheduled impairment: add this to `scheduledPPD`
- weeks = schedule[bodyPart] × loss%.
- Rate: a FLAT statutory weekly rate, not a share of the worker's wage. For injuries in the July 1, 2026 – June 30, 2027 benefit year it's $459.45/week (DOWC 2026 Max Benefits Order: https://codwc.box.com/s/9def89oiq7q4z24v2y4axffrgfuehf5g). AWW is not used.
- Schedule (use only these entries, all verified):

| Body part (label) | Weeks |
|---|---|
| Arm at shoulder | 208 |
| Hand below wrist | 104 |
| Thumb with metacarpal | 50 |
| Index finger with metacarpal | 26 |
| Leg at hip | 208 |
| Foot below ankle | 104 |
| Great toe with metatarsal | 26 |
| Total blindness, one eye | 104 |
| Total deafness, one ear | 35 |
| Total deafness, both ears | 139 |

- Citation: C.R.S. § 8-42-107(2) and (6). Link: https://law.justia.com/codes/colorado/title-8/labor-ii-workers-compensation-and-related-provisions/workers-compensation/article-42/section-8-42-107/ labeled "(statute text via Justia)".

## 2. Whole-person impairment: explanation only, NO calculation
Show this text: "Injuries not on the schedule (e.g. back, neck) are rated as whole-person impairment: rating % × an age factor (1.80 at age 20 or younger, down to 1.00 at 60 or older) × 400 weeks, paid at the TTD rate within a 2026–2027 range of $150.00–$804.46 per week. Combined TTD and PPD are capped at $202,297.46 (whole-person rating 19% or less) or $328,049.94 (20% or more) for 2026–2027 (C.R.S. § 8-42-107.5; DOWC 2026 Max Benefits Order)."
Don't compute it: we couldn't get the full year-by-year age-factor table verified.

## Required unit test (add to the existing 9)
| Case | Expected |
|---|---|
| CO hand below wrist, 20% loss (AWW ignored) | 20.8 weeks × $459.45 = $9,556.56 |

## Wiring
Colorado's state page gets `StatePPDSection state="colorado"`: body-part dropdown + loss %, no AWW input, and the whole-person text block under it. Replace the generic PPD output on the Colorado page, because it currently applies a wage-based rate that is wrong for Colorado scheduled injuries.
