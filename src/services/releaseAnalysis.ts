import type { Release, ReleaseAnalysis } from '../types/release'

export function analyzeRelease(release: Release): ReleaseAnalysis {
  const failedGates = release.gates.filter((gate) => gate.status === 'failed')
  const warningGates = release.gates.filter((gate) => gate.status === 'warning')
  const failedExecutions = release.executions.filter(
    (execution) => execution.status === 'failed',
  )

  if (failedGates.length > 0 || release.changeRisk === 'High') {
    return {
      recommendation: 'Hold this release',
      headline: `${failedGates.length} blocking gate${failedGates.length === 1 ? '' : 's'} require attention.`,
      summary: `${release.version} is not ready to advance. The current evidence shows ${release.passRate}% test pass rate and ${release.coverage}% coverage, with material risk concentrated in the changed flow.`,
      risks: [
        ...failedGates.slice(0, 2).map((gate) => gate.detail),
        `${failedExecutions.length} recent automated execution${failedExecutions.length === 1 ? '' : 's'} failed.`,
      ],
      nextAction:
        'Fix the blocking checks, rerun the affected suites, and request a new release assessment.',
    }
  }

  if (warningGates.length > 0) {
    return {
      recommendation: 'Ready with attention',
      headline: 'Core quality gates passed; one signal should be monitored.',
      summary: `${release.version} has a strong release profile with ${release.passRate}% pass rate and ${release.coverage}% coverage. The remaining warning is non-blocking, but it deserves explicit ownership before production approval.`,
      risks: warningGates.map((gate) => gate.detail),
      nextAction:
        'Validate the performance deviation with the owning team, then record the approval decision.',
    }
  }

  return {
    recommendation: 'Ready to promote',
    headline: 'All release policies are satisfied.',
    summary: `${release.version} meets the defined quality, security, and performance thresholds. Automated evidence indicates low delivery risk and no blocking conditions.`,
    risks: ['Continue monitoring production health during the rollout window.'],
    nextAction:
      'Promote the release using the standard deployment and post-release validation workflow.',
  }
}
