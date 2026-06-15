import { describe, expect, it } from 'vitest'
import { releases } from '../data/releases'
import { analyzeRelease } from './releaseAnalysis'

describe('analyzeRelease', () => {
  it('recommends attention when only warning gates remain', () => {
    const analysis = analyzeRelease(releases[0])

    expect(analysis.recommendation).toBe('Ready with attention')
    expect(analysis.risks).toContain(
      'Checkout p95 is 140ms above target',
    )
  })

  it('blocks a release with failed quality gates', () => {
    const analysis = analyzeRelease(releases[2])

    expect(analysis.recommendation).toBe('Hold this release')
    expect(analysis.nextAction).toContain('Fix the blocking checks')
  })
})
