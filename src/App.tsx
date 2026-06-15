import { useMemo, useState } from 'react'
import {
  Activity,
  Bell,
  Bot,
  Boxes,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  CircleDashed,
  Clock3,
  Code2,
  FileCheck2,
  Gauge,
  GitBranch,
  LayoutDashboard,
  Menu,
  Play,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TestTube2,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react'
import './App.css'
import { releases } from './data/releases'
import { analyzeRelease } from './services/releaseAnalysis'
import type {
  ExecutionStatus,
  GateStatus,
  Release,
  ReleaseAnalysis,
} from './types/release'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Pipelines', icon: GitBranch },
  { label: 'Test suites', icon: TestTube2 },
  { label: 'Releases', icon: Rocket },
]

const gateIcon = {
  passed: CircleCheck,
  warning: CircleAlert,
  failed: XCircle,
} satisfies Record<GateStatus, typeof CircleCheck>

const executionIcon = {
  passed: CircleCheck,
  failed: XCircle,
  running: CircleDashed,
} satisfies Record<ExecutionStatus, typeof CircleCheck>

function ReleaseSelector({
  releases: releaseOptions,
  selected,
  onChange,
}: {
  releases: Release[]
  selected: Release
  onChange: (release: Release) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="release-selector">
      <button
        className="release-selector__trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={`status-dot status-dot--${selected.status}`} />
        <span>
          <small>Selected release</small>
          <strong>{selected.version}</strong>
        </span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {open && (
        <div className="release-selector__menu" role="listbox">
          {releaseOptions.map((release) => (
            <button
              key={release.id}
              type="button"
              role="option"
              aria-selected={release.id === selected.id}
              onClick={() => {
                onChange(release)
                setOpen(false)
              }}
            >
              <span className={`status-dot status-dot--${release.status}`} />
              <span>
                <strong>{release.version}</strong>
                <small>{release.environment}</small>
              </span>
              {release.id === selected.id && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  trend,
  accent,
}: {
  icon: typeof Gauge
  label: string
  value: string
  detail: string
  trend?: string
  accent: 'cyan' | 'violet' | 'green' | 'amber'
}) {
  return (
    <article className={`metric-card metric-card--${accent}`}>
      <div className="metric-card__top">
        <div className="metric-card__icon">
          <Icon size={19} aria-hidden="true" />
        </div>
        {trend && (
          <span className="metric-card__trend">
            <TrendingUp size={13} aria-hidden="true" />
            {trend}
          </span>
        )}
      </div>
      <span className="metric-card__label">{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  )
}

function QualityGate({
  name,
  detail,
  status,
}: {
  name: string
  detail: string
  status: GateStatus
}) {
  const Icon = gateIcon[status]

  return (
    <div className="quality-gate">
      <span className={`quality-gate__icon quality-gate__icon--${status}`}>
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="quality-gate__content">
        <strong>{name}</strong>
        <small>{detail}</small>
      </span>
      <span className={`status-label status-label--${status}`}>{status}</span>
    </div>
  )
}

function App() {
  const [selectedRelease, setSelectedRelease] = useState(releases[0])
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [analysis, setAnalysis] = useState<ReleaseAnalysis>(() =>
    analyzeRelease(releases[0]),
  )
  const [analysisState, setAnalysisState] = useState<'ready' | 'refreshed'>(
    'ready',
  )

  const failedTests = useMemo(
    () => selectedRelease.executions.filter((item) => item.status === 'failed'),
    [selectedRelease],
  )

  const selectRelease = (release: Release) => {
    setSelectedRelease(release)
    setAnalysis(analyzeRelease(release))
    setAnalysisState('ready')
  }

  const refreshAnalysis = () => {
    setAnalysis(analyzeRelease(selectedRelease))
    setAnalysisState('refreshed')
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar--open' : ''}`}>
        <div className="brand">
          <span className="brand__mark">
            <Rocket size={21} strokeWidth={2.3} aria-hidden="true" />
          </span>
          <span>
            <strong>ReleasePilot</strong>
            <small>AI</small>
          </span>
          <button
            type="button"
            className="icon-button sidebar__close"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav aria-label="Primary navigation">
          <span className="nav-label">Workspace</span>
          {navItems.map(({ label, icon: Icon }, index) => (
            <button
              className={index === 0 ? 'nav-item nav-item--active' : 'nav-item'}
              type="button"
              key={label}
              onClick={() => setMobileNavOpen(false)}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
              {label === 'Test suites' && <span className="nav-count">12</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar__bottom">
          <button className="nav-item" type="button">
            <Settings size={18} aria-hidden="true" />
            Settings
          </button>
          <div className="workspace-card">
            <span className="workspace-card__avatar">MN</span>
            <span>
              <strong>Product Engineering</strong>
              <small>Demo workspace</small>
            </span>
          </div>
        </div>
      </aside>

      {mobileNavOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <main>
        <header className="topbar">
          <div className="topbar__left">
            <button
              className="icon-button mobile-menu"
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <span className="eyebrow">Release intelligence</span>
              <h1>Good morning, Matheus</h1>
            </div>
          </div>

          <div className="topbar__actions">
            <label className="search">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Search</span>
              <input type="search" placeholder="Search releases..." />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button notification-button" type="button">
              <Bell size={19} />
              <span className="notification-dot" />
              <span className="sr-only">Notifications</span>
            </button>
            <span className="user-avatar">MN</span>
          </div>
        </header>

        <div className="dashboard">
          <section className="release-heading">
            <div>
              <div className="release-heading__title">
                <h2>Release command center</h2>
                <span className="demo-pill">Live demo data</span>
              </div>
              <p>
                One view for quality signals, delivery risk, and release
                decisions.
              </p>
            </div>
            <ReleaseSelector
              releases={releases}
              selected={selectedRelease}
              onChange={selectRelease}
            />
          </section>

          <section className="release-banner">
            <div className="release-banner__signal">
              <span className="signal-ring">
                <ShieldCheck size={24} aria-hidden="true" />
              </span>
              <div>
                <span className="eyebrow">Release recommendation</span>
                <h3>{analysis.recommendation}</h3>
                <p>{analysis.headline}</p>
              </div>
            </div>
            <div className="release-banner__meta">
              <span>
                <GitBranch size={15} aria-hidden="true" />
                {selectedRelease.branch}
              </span>
              <span>
                <Code2 size={15} aria-hidden="true" />
                {selectedRelease.commit}
              </span>
              <span>
                <Clock3 size={15} aria-hidden="true" />
                {selectedRelease.updatedAt}
              </span>
            </div>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => setReportOpen(true)}
            >
              View report
            </button>
          </section>

          <section className="metrics-grid" aria-label="Release metrics">
            <MetricCard
              icon={Gauge}
              label="Release readiness"
              value={`${selectedRelease.readiness}%`}
              detail="Across all quality gates"
              trend="+4.2%"
              accent="cyan"
            />
            <MetricCard
              icon={TestTube2}
              label="Pass rate"
              value={`${selectedRelease.passRate}%`}
              detail={`${selectedRelease.passedTests} of ${selectedRelease.totalTests} tests passed`}
              trend="+1.8%"
              accent="green"
            />
            <MetricCard
              icon={FileCheck2}
              label="Code coverage"
              value={`${selectedRelease.coverage}%`}
              detail="Target threshold: 80%"
              trend="+3.1%"
              accent="violet"
            />
            <MetricCard
              icon={Activity}
              label="Change risk"
              value={selectedRelease.changeRisk}
              detail={`${failedTests.length} failed execution${failedTests.length === 1 ? '' : 's'}`}
              accent="amber"
            />
          </section>

          <section className="dashboard-grid">
            <div className="dashboard-column">
              <article className="panel">
                <div className="panel__header">
                  <div>
                    <span className="eyebrow">Policy checks</span>
                    <h3>Quality gates</h3>
                  </div>
                  <span className="panel__summary">
                    {selectedRelease.gates.filter((gate) => gate.status === 'passed').length}
                    /{selectedRelease.gates.length} passed
                  </span>
                </div>
                <div className="quality-list">
                  {selectedRelease.gates.map((gate) => (
                    <QualityGate key={gate.name} {...gate} />
                  ))}
                </div>
              </article>

              <article className="panel">
                <div className="panel__header">
                  <div>
                    <span className="eyebrow">Automation</span>
                    <h3>Recent executions</h3>
                  </div>
                  <button className="text-button" type="button">
                    View all
                  </button>
                </div>
                <div className="execution-table">
                  <div className="execution-table__header">
                    <span>Suite</span>
                    <span>Status</span>
                    <span>Duration</span>
                    <span>Trigger</span>
                  </div>
                  {selectedRelease.executions.map((execution) => {
                    const Icon = executionIcon[execution.status]
                    return (
                      <div className="execution-row" key={execution.id}>
                        <span className="execution-name">
                          <span className="execution-name__icon">
                            <Icon size={16} aria-hidden="true" />
                          </span>
                          <span>
                            <strong>{execution.name}</strong>
                            <small>{execution.scope}</small>
                          </span>
                        </span>
                        <span
                          className={`status-label status-label--${execution.status}`}
                        >
                          {execution.status}
                        </span>
                        <span>{execution.duration}</span>
                        <span>{execution.trigger}</span>
                      </div>
                    )
                  })}
                </div>
              </article>
            </div>

            <div className="dashboard-column">
              <article className="panel ai-panel">
                <div className="ai-panel__glow" />
                <div className="panel__header">
                  <div className="ai-panel__title">
                    <span className="ai-icon">
                      <Bot size={19} aria-hidden="true" />
                    </span>
                    <div>
                      <span className="eyebrow">Release copilot</span>
                      <h3>AI analysis</h3>
                    </div>
                  </div>
                  <Sparkles size={17} className="sparkle-icon" />
                </div>

                <p className="ai-summary">{analysis.summary}</p>

                <div className="analysis-section">
                  <span className="analysis-section__label">Watch closely</span>
                  {analysis.risks.map((risk) => (
                    <div className="risk-item" key={risk}>
                      <CircleAlert size={15} aria-hidden="true" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>

                <div className="analysis-section">
                  <span className="analysis-section__label">Next action</span>
                  <div className="next-action">
                    <Play size={15} fill="currentColor" aria-hidden="true" />
                    <span>{analysis.nextAction}</span>
                  </div>
                </div>

                <button
                  className="button button--primary button--full"
                  type="button"
                  onClick={refreshAnalysis}
                >
                  <Sparkles size={16} aria-hidden="true" />
                  {analysisState === 'refreshed'
                    ? 'Analysis refreshed'
                    : 'Refresh analysis'}
                </button>
                <small className="ai-disclaimer">
                  Deterministic demo engine. LLM adapter is on the roadmap.
                </small>
              </article>

              <article className="panel delivery-panel">
                <div className="panel__header">
                  <div>
                    <span className="eyebrow">Delivery flow</span>
                    <h3>Pipeline activity</h3>
                  </div>
                  <Boxes size={18} />
                </div>
                <div className="pipeline-step">
                  <span className="pipeline-step__marker pipeline-step__marker--done">
                    <Check size={14} />
                  </span>
                  <span>
                    <strong>Build completed</strong>
                    <small>2 minutes ago</small>
                  </span>
                </div>
                <div className="pipeline-step">
                  <span className="pipeline-step__marker pipeline-step__marker--done">
                    <Check size={14} />
                  </span>
                  <span>
                    <strong>Automated tests</strong>
                    <small>{selectedRelease.passedTests} checks passed</small>
                  </span>
                </div>
                <div className="pipeline-step">
                  <span className="pipeline-step__marker pipeline-step__marker--active">
                    <CircleDashed size={14} />
                  </span>
                  <span>
                    <strong>Staging approval</strong>
                    <small>Waiting for reviewer</small>
                  </span>
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      {reportOpen && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="report-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
          >
            <div className="report-modal__header">
              <div>
                <span className="eyebrow">Release report</span>
                <h2 id="report-title">{selectedRelease.version}</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Close report"
                onClick={() => setReportOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="report-score">
              <span>{selectedRelease.readiness}</span>
              <small>readiness score</small>
            </div>
            <p>{analysis.summary}</p>
            <div className="report-details">
              <span>
                <strong>Environment</strong>
                {selectedRelease.environment}
              </span>
              <span>
                <strong>Owner</strong>
                {selectedRelease.owner}
              </span>
              <span>
                <strong>Recommendation</strong>
                {analysis.recommendation}
              </span>
            </div>
            <button
              className="button button--primary button--full"
              type="button"
              onClick={() => setReportOpen(false)}
            >
              Done
            </button>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
