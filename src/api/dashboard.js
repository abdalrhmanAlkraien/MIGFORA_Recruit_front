import axiosInstance from './axiosInstance'

// ─── MOCK ─────────────────────────────────────────────────────
const MOCK_ENABLED = true

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60000).toISOString()

const MOCK_SUMMARY = {
  stats: {
    activeProjects:       4,
    activeProjectsChange: 1,
    pendingDecisions:     5,
    runningJobs:          2,
    queuedJobs:           6,
    spendThisMonth:       1840,
    budgetThisMonth:      5000,
  },
  projects: [
    { id: 'PRJ-001', name: 'Signal 27',          format: 'FILM',          stage: 'SHOT_PLANNING', progress: 46, updatedAt: minutesAgo(12) },
    { id: 'PRJ-003', name: 'Night Market Tales', format: 'SHORT_STORIES', stage: 'GENERATION',    progress: 63, updatedAt: minutesAgo(30) },
    { id: 'PRJ-002', name: 'Desert Lines',       format: 'SERIES',        stage: 'ASSETS',        progress: 28, updatedAt: minutesAgo(140) },
    { id: 'PRJ-004', name: 'The Last Harbor',    format: 'FILM',          stage: 'STORY',         progress: 8,  updatedAt: minutesAgo(2880) },
  ],
  decisions: [
    { id: 'STORY-004-V2', artifactType: 'Story Treatment',  project: 'The Last Harbor',    status: 'IN_REVIEW',          submittedAt: minutesAgo(25) },
    { id: 'CHAR-007-V3',  artifactType: 'Character Profile', project: 'Desert Lines',       status: 'IN_REVIEW',          submittedAt: minutesAgo(90) },
    { id: 'SHOT-12-03',   artifactType: 'Shot Card',         project: 'Signal 27',          status: 'NEEDS_REVALIDATION', submittedAt: minutesAgo(240) },
    { id: 'ENV-002-V4',   artifactType: 'Reference Plan',    project: 'Signal 27',          status: 'IN_REVIEW',          submittedAt: minutesAgo(600) },
  ],
  jobs: [
    { id: 'JOB-8812', label: 'Shot 3.2 — video',     project: 'Night Market Tales', provider: 'Kling',      status: 'RUNNING', progress: 64 },
    { id: 'JOB-8813', label: 'Scene 4 — dialogue',   project: 'Night Market Tales', provider: 'ElevenLabs', status: 'RUNNING', progress: 30 },
    { id: 'JOB-8814', label: 'Shot 3.2 — lip-sync',  project: 'Night Market Tales', provider: 'Sync',       status: 'WAITING', progress: null },
  ],
  spend: [
    { month: '2026-05', amount: 620 },
    { month: '2026-06', amount: 940 },
    { month: '2026-07', amount: 1310 },
    { month: '2026-08', amount: 1120 },
    { month: '2026-09', amount: 2260 },
    { month: '2026-10', amount: 1840 },
  ],
  activity: [
    { id: 1, actor: 'Sara Haddad',         action: 'submitted',         target: 'Story Treatment v2', project: 'The Last Harbor', at: minutesAgo(25) },
    { id: 2, actor: 'Abdalrhman Alkraien', action: 'locked',            target: 'Film Structure v3',  project: 'Signal 27',       at: minutesAgo(70) },
    { id: 3, actor: 'Omar Nasser',         action: 'requested_changes', target: 'Character Profile v2', project: 'Desert Lines',  at: minutesAgo(180) },
    { id: 4, actor: 'Lina Fares',          action: 'generated',         target: 'Shot 3.1 video',     project: 'Night Market Tales', at: minutesAgo(320) },
    { id: 5, actor: 'Abdalrhman Alkraien', action: 'invited',           target: 'Yousef Kareem',      project: 'Signal 27',       at: minutesAgo(1500) },
  ],
}

const mockGetDashboardSummary = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ data: MOCK_SUMMARY }), 800)
  })
// ──────────────────────────────────────────────────────────────

export const getDashboardSummaryApi = () => {
  if (MOCK_ENABLED) return mockGetDashboardSummary()
  return axiosInstance.get('/dashboard/summary')
}