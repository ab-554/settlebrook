// ─────────────────────────────────────────────────────────────────────────────
// lib/nextSteps.ts
// Builds the 2–3 contextual "next step" cards shown under every calculator
// result. Runs on the server (pages call it and pass the array down) so post
// availability matches the sitemap's build-time view of publishDate.
// Card ids are what the next_step_click GA4 event reports.
// ─────────────────────────────────────────────────────────────────────────────

import { getBlogPostBySlug, isPostPublished } from './data/blogPosts'
import { getStateBySlug } from './data/states'
import { getCarAccidentStateBySlug } from './data/carAccidentStates'
import { getWorkersCompStateBySlug, NOINDEXED_WORKERS_COMP_SLUGS } from './data/workersCompStates'
import type { ToolId } from './analytics'

export interface NextStepCard {
  id: string
  kicker: string
  title: string
  desc: string
  href: string
}

function postIfLive(slug: string): { title: string; slug: string } | null {
  const post = getBlogPostBySlug(slug)
  if (!post || !isPostPublished(post)) return null
  return { title: post.title, slug: post.slug }
}

interface BuildArgs {
  tool: ToolId
  stateSlug?: string
}

export function buildNextSteps({ tool, stateSlug }: BuildArgs): NextStepCard[] {
  const cards: NextStepCard[] = []

  if (tool === 'pain-suffering') {
    const state = stateSlug ? getStateBySlug(stateSlug) : undefined
    if (state) {
      cards.push({
        id: 'state-deadline',
        kicker: 'Your state',
        title: `${state.name}: ${state.statuteOfLimitations}-year filing deadline`,
        desc: `${state.faultRuleLabel}. See how ${state.name} law changes this number.`,
        href: '#state-law',
      })
      if (getCarAccidentStateBySlug(state.slug)) {
        cards.push({
          id: 'related-car',
          kicker: 'Related calculator',
          title: `Was a vehicle involved? ${state.name} car accident calculator`,
          desc: 'Adds vehicle damage and a policy-limit check to the same math.',
          href: `/car-accident-settlement-calculator/${state.slug}/`,
        })
      }
    } else {
      cards.push({
        id: 'choose-state',
        kicker: 'Your state',
        title: 'See your state’s filing deadline and fault rule',
        desc: 'State law can cut a deadline to two years or bar recovery for shared fault.',
        href: '#by-state',
      })
      cards.push({
        id: 'related-car',
        kicker: 'Related calculator',
        title: 'Was a vehicle involved? Car accident calculator',
        desc: 'Adds vehicle damage and a policy-limit check to the same math.',
        href: '/car-accident-settlement-calculator/',
      })
    }
    cards.push({
      id: 'guide-ps',
      kicker: 'Guide',
      title: 'How is pain and suffering calculated?',
      desc: 'The multiplier and per diem methods, and what raises or lowers your number.',
      href: '/pain-and-suffering-calculator/guide/',
    })
  }

  if (tool === 'car-accident') {
    const state = stateSlug ? getCarAccidentStateBySlug(stateSlug) : undefined
    if (state) {
      cards.push({
        id: 'state-deadline',
        kicker: 'Your state',
        title: `${state.name}: ${state.statuteOfLimitations}-year filing deadline`,
        desc: `${state.faultRuleLabel}. See how ${state.name} law changes this number.`,
        href: '#state-law',
      })
    } else {
      cards.push({
        id: 'choose-state',
        kicker: 'Your state',
        title: 'See your state’s deadline, fault rule, and no-fault status',
        desc: 'PIP thresholds and fault bars change what you can actually recover.',
        href: '#by-state',
      })
    }
    const limits = postIfLive('/blog/settlement-exceeds-policy-limits/')
    const dv = postIfLive('/blog/diminished-value-claim/')
    const guide = limits ?? dv
    if (guide) {
      cards.push({
        id: limits ? 'guide-policy-limits' : 'guide-diminished-value',
        kicker: 'Guide',
        title: guide.title,
        desc: limits
          ? 'Where the rest of the money can come from when coverage runs out.'
          : 'How a diminished value claim fits into your total settlement.',
        href: guide.slug,
      })
    }
    cards.push({
      id: 'related-ps',
      kicker: 'Related calculator',
      title: state ? `${state.name} pain and suffering calculator` : 'Pain and suffering calculator',
      desc: 'Focus on the non-economic side of the claim with both methods.',
      href: state && getStateBySlug(state.slug) ? `/pain-and-suffering-calculator/${state.slug}/` : '/pain-and-suffering-calculator/',
    })
  }

  if (tool === 'workers-comp') {
    const state = stateSlug ? getWorkersCompStateBySlug(stateSlug) : undefined
    cards.push({
      id: 'benefits-table',
      kicker: 'Reference',
      title: state ? `${state.name}’s weekly cap alongside every other state` : 'Maximum weekly benefits by state (2026)',
      desc: 'Official max and min TTD rates for all 50 states and DC, with sources.',
      href: '/workers-comp-maximum-weekly-benefits-by-state/',
    })
    if (!state) {
      cards.push({
        id: 'choose-state',
        kicker: 'Your state',
        title: 'Open your state’s workers comp page',
        desc: 'Benefit rates, caps, PPD schedules, and deadlines specific to your state.',
        href: '#by-state',
      })
    }
    const weekly = postIfLive('/blog/workers-comp-weekly-benefit-calculator/')
    const ppd = postIfLive('/blog/ppd-settlement-calculator-guide/')
    const guide = weekly ?? ppd
    if (guide) {
      cards.push({
        id: weekly ? 'guide-weekly-benefit' : 'guide-ppd',
        kicker: 'Guide',
        title: guide.title,
        desc: weekly
          ? 'Average weekly wage, the 66 2/3% rate, caps, and waiting periods.'
          : 'Impairment ratings, state formulas, and payout amounts explained.',
        href: guide.slug,
      })
    }
    if (state) {
      cards.push({
        id: 'related-ps',
        kicker: 'If a third party caused it',
        title: 'Pain and suffering calculator',
        desc: 'Workers comp excludes pain and suffering; a third-party claim may not.',
        href: '/pain-and-suffering-calculator/',
      })
    }
  }

  return cards.slice(0, 3)
}

/** Whether a workers-comp state page exists and is indexed — used by the hub to link the chosen state. */
export function workersCompStateHref(slug: string): string | null {
  if (!getWorkersCompStateBySlug(slug)) return null
  if (NOINDEXED_WORKERS_COMP_SLUGS.has(slug)) return null
  return `/workers-comp-settlement-calculator/${slug}/`
}
