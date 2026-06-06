// ─────────────────────────────────────────────────────────────────────────────
// lib/data/bodyParts.ts
// Tool #3 — Workers Comp Settlement Calculator.
// AMA Guides scheduled weeks for all major body parts / injury categories.
//
// Scheduled weeks are drawn from the federal FECA / AMA Guides 5th Edition
// scheduled-award table, which the majority of US state WC systems adopt
// directly or use as the reference baseline.
//
// isScheduled = true  → body part appears on the AMA scheduled-award table;
//                        calculate PPD as scheduledWeeks × (impairmentPct / 100) × weeklyBenefit
// isScheduled = false → whole-body / spine injuries; use the percentage-of-person
//                        formula regardless of the state's ppdMethod flag:
//                        ppdTotal = weeklyBenefit × 500 × (impairmentPct / 100)
// ─────────────────────────────────────────────────────────────────────────────

import type { BodyPartData } from '../calculations/types'

export const BODY_PARTS: BodyPartData[] = [
  // ── Upper Extremity ──────────────────────────────────────────────────────
  {
    key: 'arm',
    label: 'Arm (at or above elbow)',
    scheduledWeeks: 312,
    isScheduled: true,
    category: 'Upper Extremity',
  },
  {
    key: 'hand',
    label: 'Hand (at wrist)',
    scheduledWeeks: 244,
    isScheduled: true,
    category: 'Upper Extremity',
  },
  {
    key: 'thumb',
    label: 'Thumb',
    scheduledWeeks: 100,
    isScheduled: true,
    category: 'Upper Extremity',
  },
  {
    key: 'index_finger',
    label: 'Index Finger',
    scheduledWeeks: 46,
    isScheduled: true,
    category: 'Upper Extremity',
  },
  {
    key: 'middle_finger',
    label: 'Middle Finger',
    scheduledWeeks: 30,
    isScheduled: true,
    category: 'Upper Extremity',
  },
  {
    key: 'ring_finger',
    label: 'Ring Finger',
    scheduledWeeks: 25,
    isScheduled: true,
    category: 'Upper Extremity',
  },
  {
    key: 'little_finger',
    label: 'Little Finger (Pinky)',
    scheduledWeeks: 15,
    isScheduled: true,
    category: 'Upper Extremity',
  },

  // ── Lower Extremity ──────────────────────────────────────────────────────
  {
    key: 'leg',
    label: 'Leg (at or above knee)',
    scheduledWeeks: 288,
    isScheduled: true,
    category: 'Lower Extremity',
  },
  {
    key: 'foot',
    label: 'Foot (at ankle)',
    scheduledWeeks: 205,
    isScheduled: true,
    category: 'Lower Extremity',
  },
  {
    key: 'great_toe',
    label: 'Great Toe',
    scheduledWeeks: 38,
    isScheduled: true,
    category: 'Lower Extremity',
  },
  {
    key: 'other_toe',
    label: 'Other Toe (each)',
    scheduledWeeks: 16,
    isScheduled: true,
    category: 'Lower Extremity',
  },

  // ── Sensory ──────────────────────────────────────────────────────────────
  {
    key: 'eye',
    label: 'Eye (loss of vision)',
    scheduledWeeks: 160,
    isScheduled: true,
    category: 'Sensory',
  },
  {
    key: 'hearing_one_ear',
    label: 'Hearing Loss — One Ear',
    scheduledWeeks: 52,
    isScheduled: true,
    category: 'Sensory',
  },
  {
    key: 'hearing_both_ears',
    label: 'Hearing Loss — Both Ears',
    scheduledWeeks: 200,
    isScheduled: true,
    category: 'Sensory',
  },

  // ── Non-Scheduled (whole body / spine) ───────────────────────────────────
  // isScheduled: false — the workersComp.ts calculator forces the
  // percentage-of-person formula for these regardless of the state's ppdMethod.
  {
    key: 'back_spine',
    label: 'Back / Spine',
    // 500 is the whole-body weeks baseline used in the percentage-of-person formula.
    scheduledWeeks: 500,
    isScheduled: false,
    category: 'Non-Scheduled',
  },
  {
    key: 'whole_body',
    label: 'Whole Body / Other Non-Scheduled',
    scheduledWeeks: 500,
    isScheduled: false,
    category: 'Non-Scheduled',
  },
]

/**
 * Returns a single BodyPartData entry by its key, or undefined when the key
 * does not match any entry in BODY_PARTS.
 */
export function getBodyPartByKey(key: string): BodyPartData | undefined {
  return BODY_PARTS.find((bp) => bp.key === key)
}
