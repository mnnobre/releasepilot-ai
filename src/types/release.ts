export type ReleaseStatus = 'ready' | 'attention' | 'blocked'
export type GateStatus = 'passed' | 'warning' | 'failed'
export type ExecutionStatus = 'passed' | 'failed' | 'running'

export interface QualityGate {
  name: string
  detail: string
  status: GateStatus
}

export interface TestExecution {
  id: string
  name: string
  scope: string
  status: ExecutionStatus
  duration: string
  trigger: string
}

export interface Release {
  id: string
  version: string
  environment: string
  status: ReleaseStatus
  readiness: number
  passRate: number
  coverage: number
  changeRisk: 'Low' | 'Medium' | 'High'
  totalTests: number
  passedTests: number
  branch: string
  commit: string
  updatedAt: string
  owner: string
  gates: QualityGate[]
  executions: TestExecution[]
}

export interface ReleaseAnalysis {
  recommendation: string
  headline: string
  summary: string
  risks: string[]
  nextAction: string
}
