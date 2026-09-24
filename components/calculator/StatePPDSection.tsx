'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/calculator/StatePPDSection.tsx
// State-specific PPD (permanent partial disability) estimator for the 5
// states whose real statutory schedule differs from this site's generic
// AMA-schedule calculator: Michigan, Minnesota, New Jersey, Virginia, and
// Georgia. Renders on those 5 workers-comp state pages in place of the
// former "PPD hidden" text block — see PPD-MODULE-SPEC.md.
//
// Pure display component: all math comes from lib/calculations/ppdState.ts.
// New Jersey shows weeks only, by statute design (see the spec) — this
// component does not invent a dollar figure for it.
// ─────────────────────────────────────────────────────────────────────────────

import { useId, useMemo, useState } from 'react'
import CalculatorInput from './CalculatorInput'
import {
  SCHEDULED_LOSS_STATES,
  MINNESOTA_STATUTE_CITATION,
  MINNESOTA_OFFICIAL_URL,
  type ScheduledLossStateSlug,
} from '@/lib/data/ppdSchedules2026'
import { scheduledPPD, minnesotaPPD } from '@/lib/calculations/ppdState'

type PPDModuleState = ScheduledLossStateSlug | 'minnesota'

interface StatePPDSectionProps {
  state: PPDModuleState
}

// Manual overrides for schedule keys that don't title-case cleanly.
// Anything not listed here falls back to a generic underscore -> Title Case
// conversion.
const LABEL_OVERRIDES: Record<string, string> = {
  index_finger: 'Index Finger',
  first_finger_index: 'Index Finger',
  first_finger: 'Index Finger',
  second_finger: 'Middle Finger',
  second_finger_middle: 'Middle Finger',
  middle_finger: 'Middle Finger',
  third_finger: 'Ring Finger',
  third_finger_ring: 'Ring Finger',
  ring_finger: 'Ring Finger',
  fourth_finger: 'Little Finger',
  fourth_finger_little: 'Little Finger',
  little_finger: 'Little Finger',
  great_toe: 'Great Toe',
  other_toe: 'Other Toe',
  toe_other_than_great: 'Other Toe',
  eye_loss_of_vision: 'Eye (Loss of Vision)',
  eye_total_vision_loss: 'Eye (Total Vision Loss)',
  vision_one_eye: 'Eye (One Eye)',
  hearing_one_ear: 'Hearing, One Ear',
  hearing_both_ears: 'Hearing, Both Ears',
  hearing_total_loss_one_ear: 'Hearing, One Ear',
  hearing_traumatic_one_ear: 'Hearing, One Ear',
  hearing_traumatic_both_ears: 'Hearing, Both Ears',
  disability_to_body_as_a_whole: 'Body as a Whole',
}

function formatBodyPartLabel(key: string): string {
  if (LABEL_OVERRIDES[key]) return LABEL_OVERRIDES[key]
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// New Jersey's hand/foot are two schedule keys internally (the 25%
// threshold), but a single dropdown entry — the loss % the user enters
// decides which one applies (see resolveMaxScheduleWeeks in ppdState.ts).
function getBodyPartOptions(state: ScheduledLossStateSlug): { value: string; label: string }[] {
  const keys = Object.keys(SCHEDULED_LOSS_STATES[state].scheduleWeeks)
  if (state === 'new-jersey') {
    const deduped = keys
      .filter((k) => !k.startsWith('hand_') && !k.startsWith('foot_'))
      .concat(['hand', 'foot'])
    return deduped
      .map((value) => ({ value, label: formatBodyPartLabel(value) }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }
  return keys
    .map((value) => ({ value, label: formatBodyPartLabel(value) }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

const bodyStyle = { color: '#94A3B8', lineHeight: '1.7' } as const

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(99,179,237,0.10)' }}>
      <span className="text-sm" style={{ color: '#94A3B8' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>{value}</span>
    </div>
  )
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatWeeks(value: number): string {
  return `${value % 1 === 0 ? value : value.toFixed(1)} weeks`
}

export default function StatePPDSection({ state }: StatePPDSectionProps) {
  const selectId = useId()
  const dateId = useId()

  const isMinnesota = state === 'minnesota'
  const scheduledState = isMinnesota ? null : SCHEDULED_LOSS_STATES[state]
  const bodyPartOptions = useMemo(() => (scheduledState ? getBodyPartOptions(scheduledState.slug) : []), [scheduledState])

  const [bodyPart, setBodyPart] = useState(bodyPartOptions[0]?.value ?? '')
  const [lossPercent, setLossPercent] = useState('')
  const [aww, setAww] = useState('')
  const [weeklyRateOverride, setWeeklyRateOverride] = useState('')
  const [ratingPercent, setRatingPercent] = useState('')
  const [injuryDate, setInjuryDate] = useState('')

  const parsedLossPercent = parseFloat(lossPercent)
  const parsedAww = aww === '' ? undefined : parseFloat(aww)
  const parsedRateOverride = weeklyRateOverride === '' ? undefined : parseFloat(weeklyRateOverride)
  const parsedRatingPercent = parseFloat(ratingPercent)

  const scheduledResult = useMemo(() => {
    if (isMinnesota || !scheduledState) return null
    if (!bodyPart || isNaN(parsedLossPercent) || parsedLossPercent <= 0) return null
    return scheduledPPD({
      state: scheduledState.slug,
      bodyPart,
      lossPercent: Math.min(parsedLossPercent, 100),
      aww: parsedAww,
      weeklyRateOverride: parsedRateOverride,
    })
  }, [isMinnesota, scheduledState, bodyPart, parsedLossPercent, parsedAww, parsedRateOverride])

  const minnesotaResult = useMemo(() => {
    if (!isMinnesota) return null
    if (isNaN(parsedRatingPercent) || parsedRatingPercent <= 0 || !injuryDate) return null
    return minnesotaPPD({ ratingPercent: Math.min(parsedRatingPercent, 100), injuryDate })
  }, [isMinnesota, parsedRatingPercent, injuryDate])

  const citation = isMinnesota ? MINNESOTA_STATUTE_CITATION : scheduledState!.statuteCitation
  const officialUrl = isMinnesota ? MINNESOTA_OFFICIAL_URL : scheduledState!.officialUrl
  const stateName = isMinnesota ? 'Minnesota' : scheduledState!.name

  return (
    <div
      className="rounded-2xl p-5 sm:p-6 mt-4"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(99,179,237,0.15)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <h3 className="text-base font-bold mb-1" style={{ color: '#F1F5F9' }}>
        {stateName} PPD Estimator
      </h3>
      <p className="text-xs mb-4" style={{ color: '#64748B' }}>
        Uses {stateName}&apos;s own statutory schedule, not the generic AMA-based calculator above.
      </p>

      {isMinnesota ? (
        <>
          <CalculatorInput
            label="Whole-Body Impairment Rating"
            name="mn-rating"
            value={ratingPercent}
            onChange={setRatingPercent}
            suffix="%"
            placeholder="10"
            helpText="Rated under Minn. Rules ch. 5223, as a percentage of the whole body"
          />
          <div className="mb-4">
            <label htmlFor={dateId} className="block text-sm font-medium mb-1.5" style={{ color: '#94A3B8' }}>
              Date of Injury
              <span className="block text-xs mt-0.5" style={{ color: '#64748B' }}>
                Determines which 2026 benefit table applies
              </span>
            </label>
            <input
              id={dateId}
              type="date"
              value={injuryDate}
              onChange={(e) => setInjuryDate(e.target.value)}
              className="dark-input px-4 py-3 rounded-xl"
            />
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor={selectId} className="block text-sm font-medium mb-1.5" style={{ color: '#94A3B8' }}>
              Injured Body Part
            </label>
            <div className="relative">
              <select
                id={selectId}
                value={bodyPart}
                onChange={(e) => setBodyPart(e.target.value)}
                className="w-full px-4 py-3 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(99,179,237,0.22)',
                  color: '#F1F5F9',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {bodyPartOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: '#0D1526', color: '#E2E8F0' }}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: '#60A5FA' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </div>

          <CalculatorInput
            label={state === 'georgia' ? 'AMA Impairment Rating' : 'Percentage of Loss'}
            name="loss-percent"
            value={lossPercent}
            onChange={setLossPercent}
            suffix="%"
            placeholder="20"
          />

          {(state === 'virginia' || state === 'georgia' || state === 'new-york') && (
            <CalculatorInput
              label="Average Weekly Wage (AWW)"
              name="aww"
              value={aww}
              onChange={setAww}
              prefix="$"
              placeholder="900"
              helpText="Optional — leave blank to see weeks only"
            />
          )}

          {state === 'michigan' && (
            <CalculatorInput
              label="Your Weekly Compensation Rate"
              name="weekly-rate-override"
              value={weeklyRateOverride}
              onChange={setWeeklyRateOverride}
              prefix="$"
              placeholder="700"
              helpText="Shown on your benefit notice — Michigan's 80%-after-tax-wage rate can't be computed here"
            />
          )}

          {state === 'new-jersey' && (
            <p className="text-xs mb-4" style={bodyStyle}>
              New Jersey&apos;s weekly rate depends on the total weeks awarded — see the{' '}
              <a href={officialUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>
                official 2026 schedule
              </a>
              . This estimator shows weeks only.
            </p>
          )}
        </>
      )}

      {(scheduledResult || minnesotaResult) && (
        <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(99,179,237,0.15)' }}>
          {scheduledResult && (
            <>
              <ResultRow label="Scheduled Weeks" value={formatWeeks(scheduledResult.weeks)} />
              <ResultRow
                label="Weekly Rate"
                value={scheduledResult.weeklyRate !== null ? formatCurrency(scheduledResult.weeklyRate) : 'Not computed'}
              />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-semibold" style={{ color: '#94A3B8' }}>Estimated Total</span>
                <span className="text-lg font-bold" style={{ color: '#FBBF24' }}>
                  {scheduledResult.total !== null ? formatCurrency(scheduledResult.total) : 'Not computed'}
                </span>
              </div>
              {scheduledResult.notes.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1">
                  {scheduledResult.notes.map((note, i) => (
                    <li key={i} className="text-xs" style={{ color: '#64748B' }}>{note}</li>
                  ))}
                </ul>
              )}
            </>
          )}
          {minnesotaResult && (
            <>
              <ResultRow label={`Table ${minnesotaResult.table} Band Amount`} value={formatCurrency(minnesotaResult.bandAmount)} />
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-semibold" style={{ color: '#94A3B8' }}>Estimated Lump Sum</span>
                <span className="text-lg font-bold" style={{ color: '#FBBF24' }}>{formatCurrency(minnesotaResult.total)}</span>
              </div>
              <p className="mt-2 text-xs" style={{ color: '#64748B' }}>
                Minimum-rate rules not applied.
              </p>
            </>
          )}
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed" style={{ color: '#64748B' }}>
        Estimate only. Not legal advice.{' '}
        <a href={officialUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA' }}>
          {citation}
        </a>
      </p>
    </div>
  )
}
