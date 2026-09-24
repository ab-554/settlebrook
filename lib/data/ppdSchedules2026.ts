// ─────────────────────────────────────────────────────────────────────────────
// lib/data/ppdSchedules2026.ts
// Typed, curated PPD (permanent partial disability) schedule data for 2026,
// built from research/2026-09-24/ppd/ppd-schedules-2026.json per
// research/2026-09-24/ppd/PPD-MODULE-SPEC.md (authoritative). Pure data only
// — no functions, no React. Consumed by lib/calculations/ppdState.ts.
//
// Only the fields the spec's formulas actually need are kept (statute
// citation, official source URL, and each state's body-part schedule in
// weeks). Full sourcing notes, edge cases, and status flags live in the
// research JSON this was built from — see that file for provenance.
// ─────────────────────────────────────────────────────────────────────────────

export type ScheduledLossStateSlug = 'michigan' | 'new-jersey' | 'virginia' | 'georgia' | 'new-york'

export interface ScheduledLossStateData {
  slug: ScheduledLossStateSlug
  name: string
  statuteCitation: string
  officialUrl: string
  // Body part -> scheduled weeks for 100% loss/use of that part. NJ's hand
  // and foot are split into two thresholds per N.J.S.A. 34:15-12(c); see
  // resolveNewJerseyMemberWeeks() in lib/calculations/ppdState.ts.
  scheduleWeeks: Record<string, number>
}

export const MICHIGAN_PPD: ScheduledLossStateData = {
  slug: 'michigan',
  name: 'Michigan',
  statuteCitation: 'MCL 418.361',
  officialUrl: 'https://www.michigan.gov/-/media/Project/Websites/leo/Documents/WDCA-Calculation-Program/wca_2011_Rate_Book.pdf',
  scheduleWeeks: {
    thumb: 65,
    index_finger: 38,
    second_finger: 33,
    third_finger: 22,
    fourth_finger_little: 16,
    great_toe: 33,
    other_toe: 11,
    hand: 215,
    arm: 269,
    foot: 162,
    leg: 215,
    eye: 162,
    // hearing_one_ear, hearing_both_ears, and disfigurement are excluded —
    // no verified week figure exists for them (see PPD-MODULE-SPEC.md and
    // the research JSON's known_data_gaps).
  },
}

export const NEW_JERSEY_PPD: ScheduledLossStateData = {
  slug: 'new-jersey',
  name: 'New Jersey',
  statuteCitation: 'N.J.S.A. 34:15-12(c)',
  officialUrl: 'https://www.nj.gov/labor/workerscompensation/assets/PDFs/Forms/2026_schedule.pdf',
  scheduleWeeks: {
    thumb: 80,
    first_finger_index: 60,
    second_finger: 50,
    third_finger: 40,
    fourth_finger_little: 30,
    great_toe: 40,
    other_toe: 15,
    hand_under_25pct_loss_of_function: 260,
    hand_25pct_or_more_loss_of_function: 300,
    arm: 330,
    foot_under_25pct_loss_of_function: 250,
    foot_25pct_or_more_loss_of_function: 285,
    leg: 315,
    eye_loss_of_vision: 200,
    hearing_one_ear: 60,
    hearing_both_ears: 200,
  },
}

export const VIRGINIA_PPD: ScheduledLossStateData = {
  slug: 'virginia',
  name: 'Virginia',
  statuteCitation: 'Va. Code § 65.2-503',
  officialUrl: 'https://law.lis.virginia.gov/vacode/title65.2/chapter5/section65.2-503/',
  scheduleWeeks: {
    thumb: 60,
    first_finger_index: 35,
    second_finger_middle: 30,
    third_finger_ring: 20,
    fourth_finger_little: 15,
    great_toe: 30,
    other_toe: 10,
    hand: 150,
    arm: 200,
    foot: 125,
    leg: 175,
    eye_total_vision_loss: 100,
    hearing_total_loss_one_ear: 50,
  },
}

// Virginia's max/min rate resets every July 1 (fiscal, not calendar year).
// Sept 25, 2026 (today) falls in the Jul 1 - Dec 31, 2026 period, so that's
// the figure used as the current default — see scheduledPPD() in
// lib/calculations/ppdState.ts.
export const VIRGINIA_RATE_PERIODS = {
  h1_2026: { period: 'Jan 1, 2026 - Jun 30, 2026', maxWeekly: 1463.10, minWeekly: 365.78 },
  h2_2026: { period: 'Jul 1, 2026 - Dec 31, 2026', maxWeekly: 1507.01, minWeekly: 376.75 },
} as const

export const GEORGIA_PPD: ScheduledLossStateData = {
  slug: 'georgia',
  name: 'Georgia',
  statuteCitation: 'O.C.G.A. § 34-9-263',
  officialUrl: 'https://sbwc.georgia.gov/document/publication/provisionspdf/download',
  scheduleWeeks: {
    arm: 225,
    leg: 225,
    hand: 160,
    foot: 135,
    thumb: 60,
    index_finger: 40,
    middle_finger: 35,
    ring_finger: 30,
    little_finger: 25,
    great_toe: 30,
    other_toe: 20,
    hearing_traumatic_one_ear: 75,
    hearing_traumatic_both_ears: 150,
    vision_one_eye: 150,
    disability_to_body_as_a_whole: 300,
  },
}

// Georgia's PPD rate is capped at the state's TTD/TPD statutory maximum
// (O.C.G.A. § 34-9-261), not a separate PPD-specific figure.
export const GEORGIA_MAX_WEEKLY = 800

export const NEW_YORK_PPD: ScheduledLossStateData = {
  slug: 'new-york',
  name: 'New York',
  statuteCitation: 'WCL § 15(3)',
  officialUrl: 'https://www.nysenate.gov/legislation/laws/WKC/15',
  scheduleWeeks: {
    arm: 312,
    leg: 288,
    hand: 244,
    foot: 205,
    eye: 160,
    thumb: 75,
    first_finger: 46,
    great_toe: 38,
    second_finger: 30,
    third_finger: 25,
    toe_other_than_great: 16,
    fourth_finger: 15,
    hearing_one_ear: 60,
    hearing_both_ears: 150,
  },
}

export const SCHEDULED_LOSS_STATES: Record<ScheduledLossStateSlug, ScheduledLossStateData> = {
  michigan: MICHIGAN_PPD,
  'new-jersey': NEW_JERSEY_PPD,
  virginia: VIRGINIA_PPD,
  georgia: GEORGIA_PPD,
  'new-york': NEW_YORK_PPD,
}

// ─── Minnesota: whole-body percentage, not a member schedule ──────────────────

export const MINNESOTA_STATUTE_CITATION = 'Minn. Stat. § 176.101, subd. 2a'
export const MINNESOTA_OFFICIAL_URL = 'https://www.revisor.mn.gov/statutes/cite/176.101'

// The cutoff written into 2026 Minnesota Laws ch. 103, s. 10: injuries
// before this date use table A, injuries on/after it use table B.
export const MINNESOTA_TABLE_CUTOFF_DATE = '2026-10-01'

// Keys are the impairment-percentage band exactly as published; parsed by
// parseMinnesotaBandKey() in lib/calculations/ppdState.ts.
export const MINNESOTA_TABLE_A: Record<string, number> = {
  'less_than_5.5': 114260,
  '5.5_to_less_than_10.5': 121800,
  '10.5_to_less_than_15.5': 129485,
  '15.5_to_less_than_20.5': 137025,
  '20.5_to_less_than_25.5': 139720,
  '25.5_to_less_than_30.5': 147000,
  '30.5_to_less_than_35.5': 150150,
  '35.5_to_less_than_40.5': 163800,
  '40.5_to_less_than_45.5': 177450,
  '45.5_to_less_than_50.5': 177870,
  '50.5_to_less_than_55.5': 181965,
  '55.5_to_less_than_60.5': 209475,
  '60.5_to_less_than_65.5': 237090,
  '65.5_to_less_than_70.5': 264600,
  '70.5_to_less_than_75.5': 292215,
  '75.5_to_less_than_80.5': 347340,
  '80.5_to_less_than_85.5': 402465,
  '85.5_to_less_than_90.5': 457590,
  '90.5_to_less_than_95.5': 512715,
  '95.5_up_to_and_including_100': 567840,
}

export const MINNESOTA_TABLE_B: Record<string, number> = {
  'less_than_5.5': 137240,
  '5.5_to_less_than_10.5': 146297,
  '10.5_to_less_than_15.5': 155527,
  '15.5_to_less_than_20.5': 164584,
  '20.5_to_less_than_25.5': 167821,
  '25.5_to_less_than_30.5': 176565,
  '30.5_to_less_than_35.5': 180348,
  '35.5_to_less_than_40.5': 196744,
  '40.5_to_less_than_45.5': 213139,
  '45.5_to_less_than_50.5': 213643,
  '50.5_to_less_than_55.5': 218562,
  '55.5_to_less_than_60.5': 251605,
  '60.5_to_less_than_65.5': 284774,
  '65.5_to_less_than_70.5': 317817,
  '70.5_to_less_than_75.5': 350986,
  '75.5_to_less_than_80.5': 417197,
  '80.5_to_less_than_85.5': 483409,
  '85.5_to_less_than_90.5': 549621,
  '90.5_to_less_than_95.5': 615833,
  '95.5_up_to_and_including_100': 682045,
}
