import { useEffect, useRef, useState, type FormEvent } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import {
  Activity,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Database,
  Gauge,
  Landmark,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users2,
  type LucideIcon,
} from 'lucide-react'
import { FilesetResolver, HandLandmarker, PoseLandmarker } from '@mediapipe/tasks-vision'
import './App.css'

type Overview = {
  contributors: number
  companies: number
  datasets: number
  approved: number
  averageQuality: number
  activeCampaigns: number
}

type Dataset = {
  id: string
  name: string
  focus: string
  demos: number
  durationHours: number
  qualityScore: number
  status: string
}

type Task = {
  id: string
  title: string
  environment: string
  priority: string
  reward: number
  completionDays: number
  status: string
}

type Request = {
  id: string
  company: string
  description: string
  status: string
  progress: number
}

type QueueItem = {
  id: string
  contributor: string
  title: string
  status: string
  riskFlags: number
}

type StatItem = {
  label: string
  value: string
  hint: string
  icon: LucideIcon
}

const defaultOverview: Overview = {
  contributors: 1284,
  companies: 194,
  datasets: 86,
  approved: 41,
  averageQuality: 96.4,
  activeCampaigns: 12,
}

const initialDatasets: Dataset[] = [
  { id: 'ds-104', name: 'Pick & Place Human Demonstrations', focus: 'Household robotics', demos: 12400, durationHours: 8.7, qualityScore: 98.5, status: 'Approved' },
  { id: 'ds-215', name: 'Tool Use Benchmarks', focus: 'Manufacturing', demos: 8600, durationHours: 6.3, qualityScore: 94.8, status: 'Premium' },
  { id: 'ds-318', name: 'Kitchen Task Actions', focus: 'Home automation', demos: 15200, durationHours: 11.4, qualityScore: 97.1, status: 'Licensed' },
  { id: 'ds-422', name: 'Warehouse Movement Sequences', focus: 'Logistics', demos: 9700, durationHours: 7.9, qualityScore: 95.3, status: 'New' },
]

const initialTasks: Task[] = [
  { id: 'task-301', title: 'Pick and place household item', environment: 'Contributor studio', priority: 'High priority', reward: 45, completionDays: 3, status: 'Open' },
  { id: 'task-204', title: 'Open cabinet and retrieve tool', environment: 'Warehouse mock-up', priority: 'Required', reward: 30, completionDays: 2, status: 'Open' },
  { id: 'task-119', title: 'Stack boxes in labeled bins', environment: 'Logistics layout', priority: 'Quality gate', reward: 51, completionDays: 5, status: 'In review' },
  { id: 'task-067', title: 'Use drill with safety posture', environment: 'Training room', priority: 'Safety first', reward: 24, completionDays: 1, status: 'Open' },
]

const initialRequests: Request[] = [
  { id: 'req-440', company: 'Northstar Robotics', description: '50,000 demonstrations of assembly actions', status: 'In progress', progress: 68 },
  { id: 'req-318', company: 'Helio Labs', description: '10,000 kitchen task trajectories', status: 'Awaiting approval', progress: 32 },
  { id: 'req-201', company: 'Aster Manufacturing', description: 'Inventory handling sequences', status: 'Approved', progress: 94 },
]

const initialAdminQueue: QueueItem[] = [
  { id: 'sub-302', contributor: 'Contributor 12', title: 'Kitchen task validation', status: 'Needs review', riskFlags: 2 },
  { id: 'sub-188', contributor: 'Contributor 28', title: 'Warehouse sequence', status: 'Approved', riskFlags: 0 },
  { id: 'sub-447', contributor: 'Contributor 44', title: 'Tool handling', status: 'Flagged for compliance', riskFlags: 5 },
]

const emptySubmission = {
  contributorName: '',
  taskId: '',
  location: '',
  notes: '',
}

const featureCards = [
  { title: 'Data capture', description: 'Collect webcam demonstrations, annotate actions, and verify task compliance in one workflow.', icon: Camera },
  { title: 'Model-ready bundles', description: 'Export structured action sequences with timestamps, landmarks, and quality metadata.', icon: Database },
  { title: 'Human-in-the-loop quality', description: 'Review submissions with compliance checks and admin approvals before publication.', icon: ShieldCheck },
]

const statCards: StatItem[] = [
  { label: 'Active contributors', value: '1,284', hint: '+18% QoQ', icon: Users2 },
  { label: 'Approved datasets', value: '41', hint: 'Across 9 domains', icon: Database },
  { label: 'Average quality', value: '96.4%', hint: 'Human review + CV checks', icon: Gauge },
  { label: 'Revenue this quarter', value: '$1.42M', hint: 'Marketplace + campaigns', icon: TrendingUp },
]

const roleCards = [
  { path: '/contributor', title: 'Contributor', summary: 'Record demos, manage submissions, and track incentives.', icon: Camera },
  { path: '/company', title: 'Company', summary: 'Browse the marketplace and order custom data campaigns.', icon: Building2 },
  { path: '/admin', title: 'Admin', summary: 'Review recordings, approve submissions, and publish data products.', icon: BriefcaseBusiness },
]

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '')

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 5000,
})

function App() {
  const [overview, setOverview] = useState<Overview>(defaultOverview)
  const [datasets, setDatasets] = useState<Dataset[]>(initialDatasets)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [requests, setRequests] = useState<Request[]>(initialRequests)
  const [adminQueue, setAdminQueue] = useState<QueueItem[]>(initialAdminQueue)

  useEffect(() => {
    void axiosClient
      .get('/api/overview')
      .then((response) => setOverview(response.data))
      .catch(() => setOverview(defaultOverview))

    void axiosClient
      .get('/api/datasets')
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setDatasets(response.data)
        }
      })
      .catch(() => setDatasets(initialDatasets))

    void axiosClient
      .get('/api/tasks')
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setTasks(response.data)
        }
      })
      .catch(() => setTasks(initialTasks))

    void axiosClient
      .get('/api/requests')
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setRequests(response.data)
        }
      })
      .catch(() => setRequests(initialRequests))

    void axiosClient
      .get('/api/queue')
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAdminQueue(response.data)
        }
      })
      .catch(() => setAdminQueue(initialAdminQueue))
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 shadow-lg shadow-cyan-500/30">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight">Actra</div>
                <div className="text-xs text-slate-400">Turn Human Actions Into Intelligence</div>
              </div>
            </div>

            <nav className="hidden items-center gap-2 md:flex">
              {[
                { to: '/', label: 'Overview' },
                { to: '/contributor', label: 'Contributor' },
                { to: '/company', label: 'Company' },
                { to: '/admin', label: 'Admin' },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'nav-item-active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button className="primary-button hidden sm:inline-flex">
              Launch campaign
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-10">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage overview={overview} datasets={datasets} />
              }
            />
            <Route path="/contributor" element={<ContributorPage tasks={tasks} />} />
            <Route path="/company" element={<CompanyPage datasets={datasets} requests={requests} />} />
            <Route path="/admin" element={<AdminPage adminQueue={adminQueue} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

function HomePage({
  overview,
  datasets,
}: {
  overview: Overview
  datasets: Dataset[]
}) {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 py-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Human demonstrations for embodied AI
          </div>

          <h1 className="mt-6 max-w-xl text-5xl font-black tracking-tight text-white lg:text-6xl">
            Capture the action. Build the model.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Actra turns real-world human activity into structured training data for robotics, computer vision, and imitation-learning systems.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="primary-button">
              Explore datasets <ArrowRight className="h-4 w-4" />
            </button>
            <button className="secondary-button">
              Start custom campaign
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-300">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Structured action labels</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Human-quality validation</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Rights-aware licensing</div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Live platform</div>
              <div className="mt-1 text-xl font-semibold">Dataset pipeline</div>
            </div>
            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300">Healthy</div>
          </div>

          <div className="space-y-4">
            {statCards.slice(0, 3).map((stat) => (
              <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-300">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                    <div className="text-lg font-semibold text-white">{stat.value}</div>
                  </div>
                </div>
                <div className="text-sm text-emerald-300">{stat.hint}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3">
              <div className="text-xs text-violet-200">Action recognition</div>
              <div className="mt-1 text-2xl font-bold text-white">{overview.averageQuality.toFixed(1)}%</div>
            </div>
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
              <div className="text-xs text-cyan-200">Campaigns live</div>
              <div className="mt-1 text-2xl font-bold text-white">{overview.activeCampaigns}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-panel p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-slate-800 p-2 text-cyan-300">
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="text-xs text-emerald-300">{stat.hint}</div>
            </div>
            <div className="mt-4 text-3xl font-bold text-white">{stat.value}</div>
            <div className="mt-1 text-sm text-slate-300">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">Platform</div>
            <h2 className="mt-2 text-3xl font-bold text-white">Why teams choose Actra</h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {featureCards.map(({ title, description, icon: Icon }) => (
            <div key={title} className="glass-panel p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-200">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-slate-300">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-violet-300">Marketplace</div>
            <h2 className="mt-2 text-3xl font-bold text-white">Popular datasets</h2>
          </div>
          <button className="secondary-button">View all</button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {datasets.map((dataset) => (
            <div key={dataset.id} className="dataset-card p-4">
              <div className="flex items-center justify-between">
                <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-200">{dataset.status}</div>
                <Landmark className="h-4 w-4 text-violet-300" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">{dataset.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{dataset.focus}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-slate-400">Demos</div>
                  <div className="mt-1 font-semibold text-white">{dataset.demos.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400">Quality</div>
                  <div className="mt-1 font-semibold text-white">{dataset.qualityScore.toFixed(1)}%</div>
                </div>
              </div>
              <button className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200">
                Explore dataset <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {roleCards.map(({ path, title, summary, icon: Icon }) => (
          <NavLink key={path} to={path} className="glass-panel block p-5 transition hover:-translate-y-1 hover:border-cyan-500/50">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-cyan-300">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-slate-300">{summary}</p>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-200">
              Open dashboard <ChevronRight className="h-4 w-4" />
            </div>
          </NavLink>
        ))}
      </section>
    </div>
  )
}

function ContributorPage({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Contributor" title="Your data collection workspace" />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="glass-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Available tasks</h3>
              <button className="secondary-button">Browse all</button>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-cyan-200">{task.id}</div>
                      <h4 className="mt-1 text-lg font-semibold text-white">{task.title}</h4>
                    </div>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">{task.status}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-300">
                    <span>{task.environment}</span>
                    <span>•</span>
                    <span>{task.priority}</span>
                    <span>•</span>
                    <span>${task.reward}/task</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <DemoCapture />
          <SubmissionForm />
          <div className="glass-panel p-5">
            <h3 className="text-xl font-semibold text-white">Submission status</h3>
            <div className="mt-4 space-y-3">
              {['Camera check passed', 'Consent verified', 'Task instructions read', 'Recording ready for review'].map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/60 p-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${index < 3 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                    {index < 3 ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs">{index + 1}</span>}
                  </div>
                  <span className="text-sm text-slate-200">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmissionForm() {
  const [form, setForm] = useState(emptySubmission)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (field: keyof typeof emptySubmission, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await axiosClient.post('/api/submissions', {
        contributorName: form.contributorName || 'Contributor',
        taskId: form.taskId || 'task-301',
        location: form.location || 'Contributor studio',
        notes: form.notes || 'New demo submission queued for review',
      })

      setSubmitMessage(response.data?.message || 'Submission accepted and queued for review.')
      setForm(emptySubmission)
    } catch (error) {
      setSubmitMessage('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="glass-panel p-5">
      <h3 className="text-xl font-semibold text-white">Submit a demo</h3>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-slate-300">
            Contributor name
            <input
              value={form.contributorName}
              onChange={(event) => handleChange('contributorName', event.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500/60"
              placeholder="e.g. Alice"
            />
          </label>
          <label className="block text-sm text-slate-300">
            Task ID
            <input
              value={form.taskId}
              onChange={(event) => handleChange('taskId', event.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500/60"
              placeholder="task-301"
            />
          </label>
        </div>

        <label className="block text-sm text-slate-300">
          Location
          <input
            value={form.location}
            onChange={(event) => handleChange('location', event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500/60"
            placeholder="Contributor studio"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Notes
          <textarea
            value={form.notes}
            onChange={(event) => handleChange('notes', event.target.value)}
            className="mt-1 min-h-[100px] w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-cyan-500/60"
            placeholder="Describe the recorded action and any safety notes"
          />
        </label>

        <div className="flex items-center justify-between gap-4">
          <button type="submit" disabled={isSubmitting} className="primary-button disabled:opacity-60">
            {isSubmitting ? 'Submitting...' : 'Submit demo'}
          </button>
          {submitMessage && <span className="text-sm text-emerald-300">{submitMessage}</span>}
        </div>
      </form>
    </div>
  )
}

function CompanyPage({
  datasets,
  requests,
}: {
  datasets: Dataset[]
  requests: Request[]
}) {
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Company" title="Acquire data for your product and research pipeline" />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="glass-panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Dataset marketplace</h3>
              <button className="secondary-button">Search</button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {datasets.map((dataset) => (
                <div key={dataset.id} className="dataset-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-violet-200">{dataset.status}</span>
                    <BarChart3 className="h-4 w-4 text-cyan-300" />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-white">{dataset.name}</h4>
                  <p className="mt-2 text-sm text-slate-300">{dataset.focus}</p>
                  <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-slate-400">Demos</div>
                      <div className="font-semibold text-white">{dataset.demos.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Avg. quality</div>
                      <div className="font-semibold text-white">{dataset.qualityScore.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5">
            <h3 className="text-xl font-semibold text-white">Custom collection requests</h3>
            <div className="mt-4 space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm text-cyan-200">{request.company}</div>
                      <div className="mt-1 text-sm text-slate-300">{request.description}</div>
                    </div>
                    <div className="text-xs text-emerald-300">{request.status}</div>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span>{request.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500" style={{ width: `${request.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminPage({ adminQueue }: { adminQueue: QueueItem[] }) {
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Admin" title="Review, approve, and publish dataset bundles" />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Submissions in review', value: '41', icon: Activity },
          { label: 'Approved this week', value: '224', icon: CheckCircle2 },
          { label: 'Compliance risk', value: '1.4%', icon: ShieldCheck },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="glass-panel p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-slate-800 p-2 text-cyan-300"><Icon className="h-5 w-5" /></div>
            </div>
            <div className="mt-4 text-3xl font-bold text-white">{value}</div>
            <div className="mt-1 text-sm text-slate-300">{label}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel p-5">
        <h3 className="text-xl font-semibold text-white">Review queue</h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Submission</th>
                <th className="px-4 py-3 font-medium">Contributor</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Risk flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-slate-950/40">
              {adminQueue.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-slate-200">{item.title}</td>
                  <td className="px-4 py-3 text-slate-300">{item.contributor}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs ${item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-300' : item.status === 'Needs review' ? 'bg-amber-500/10 text-amber-300' : 'bg-rose-500/10 text-rose-300'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">{item.riskFlags}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-bold text-white">{title}</h2>
    </div>
  )
}

function DemoCapture() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const handLandmarkerRef = useRef<HandLandmarker | null>(null)
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState('Camera idle')
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsRunning(false)
    setStatus('Camera stopped')
  }

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Media capture is not supported in this browser.')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })

      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas) {
        return
      }

      streamRef.current = stream
      video.srcObject = stream
      await video.play()

      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480

      const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm')
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      })
      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker_lite/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
      })

      const render = () => {
        const activeVideo = videoRef.current
        const activeCanvas = canvasRef.current
        if (!activeVideo || !activeCanvas) {
          return
        }

        const ctx = activeCanvas.getContext('2d')
        if (!ctx) {
          return
        }

        ctx.drawImage(activeVideo, 0, 0, activeCanvas.width, activeCanvas.height)

        const handResults = handLandmarkerRef.current?.detectForVideo(activeVideo, performance.now())
        const poseResults = poseLandmarkerRef.current?.detectForVideo(activeVideo, performance.now())

        for (const hand of handResults?.landmarks ?? []) {
          const wrist = hand[0]
          if (wrist) {
            ctx.beginPath()
            ctx.arc(wrist.x * activeCanvas.width, wrist.y * activeCanvas.height, 12, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(34, 211, 238, 0.7)'
            ctx.fill()
          }
        }

        for (const pose of poseResults?.landmarks ?? []) {
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)'
          ctx.lineWidth = 3
          for (let i = 0; i < pose.length - 1; i += 1) {
            const current = pose[i]
            const next = pose[i + 1]
            if (current && next) {
              ctx.moveTo(current.x * activeCanvas.width, current.y * activeCanvas.height)
              ctx.lineTo(next.x * activeCanvas.width, next.y * activeCanvas.height)
            }
          }
          ctx.stroke()
        }

        animationRef.current = requestAnimationFrame(render)
      }

      setStatus('Pose tracking active')
      setIsRunning(true)
      render()
    } catch (error) {
      console.error(error)
      setStatus('Browser camera access unavailable. Use a secure browser environment to test capture.')
      setIsRunning(false)
    }
  }

  return (
    <div className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Test camera</h3>
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-200">
          {isRunning ? 'Live' : 'Standby'}
        </span>
      </div>

      <div className="video-box overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
        <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-300">{status}</div>
        <div className="flex gap-2">
          <button className="primary-button" onClick={startCamera}>
            {isRunning ? 'Refresh feed' : 'Start camera'}
          </button>
          {isRunning && (
            <button className="secondary-button" onClick={stopCamera}>
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
