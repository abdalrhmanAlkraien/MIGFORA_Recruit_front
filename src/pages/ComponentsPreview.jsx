import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatDuration } from '../utils/duration'

import {
    FormButton,
    FormField,
    FormAlert,
    Drawer,
    ConfirmDialog,
    Pagination,
    PasswordInput,
    SectionDivider,
    EmptyState,
    StatusBadge,
    PageHeader,
    Spinner,
    SearchInput,
    Tabs,
    SelectField, DropdownMenu, TextareaField, PromptComposer,
    CheckboxField, Toggle, RadioCardGroup, NumberField, DurationField, TagInput, UploadDropzone, FileItem,
    Modal, Tooltip, Card, DataTable, KeyValueList, Avatar, AvatarGroup,
    ProgressBar, Skeleton, CopyableText, RelativeTime
} from '../components/common'

import './styles/ComponentsPreview.css'
import useLanguageStore from '../store/useLanguageStore'

const TABS = [
    { key: 'buttons', label: 'Buttons & Inputs' },
    { key: 'feedback', label: 'Feedback' },
    { key: 'layout', label: 'Layout' },
    { key: 'data', label: 'Data' },
    { key: 'inputs', label: 'Inputs & AI' },
    { key: 'forms', label: 'Forms & Upload' },
    { key: 'display', label: 'Display & Data' },

]

const PROVIDER_OPTIONS = [
    { value: 'elevenlabs', label: 'ElevenLabs', description: 'Voice · 1000 character prompt limit' },
    { value: 'kling', label: 'Kling', description: 'Video generation' },
    { value: 'openai', label: 'OpenAI', description: 'Text generation' },
]

const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' },
    { value: 'fr', label: 'French' },
]

const ARTIFACT_OPTIONS = [
    { value: 'STORY-V5', label: 'Story Treatment v5' },
    { value: 'CHAR-004', label: 'Lead character profile' },
    { value: 'ENV-002', label: 'Control room environment' },
]

const FORMAT_OPTIONS = [
    { value: 'FILM', label: 'Film', description: 'One production with a target duration.', meta: 'e.g. 60 min' },
    { value: 'SERIES', label: 'Series', description: 'Episodes with a fixed duration each.', meta: 'e.g. 30 × 40 min' },
    { value: 'SHORT_STORIES', label: 'Short Stories', description: 'Short episodes released as a collection.', meta: 'e.g. 30 × 2 min' },
]

const MOOD_SUGGESTIONS = ['Tense', 'Noir', 'Hopeful', 'Melancholic', 'Epic', 'Intimate', 'Gritty', 'Dreamlike']

const TEAM = [
    { id: 1, name: 'Abdalrhman Alkraien' },
    { id: 2, name: 'Sara Haddad' },
    { id: 3, name: 'Omar Nasser' },
    { id: 4, name: 'Lina Fares' },
    { id: 5, name: 'Yousef Kareem' },
    { id: 6, name: 'Maya Saleh' },
]

const ARTIFACT_ROWS = [
    { id: 'STORY-001', title: 'Story Treatment', version: 5, status: 'LOCKED', updatedAt: Date.now() - 3600000 },
    { id: 'CHAR-004', title: 'Lead character', version: 3, status: 'IN_REVIEW', updatedAt: Date.now() - 600000 },
    { id: 'ENV-002', title: 'Control room', version: 2, status: 'CHANGES_REQUESTED', updatedAt: Date.now() - 86400000 },
    { id: 'SHOT-12-03', title: 'Shot 12.3', version: 1, status: 'NEEDS_REVALIDATION', updatedAt: Date.now() - 172800000 },
]

const ARTIFACT_COLUMNS = [
    { key: 'id', header: 'ID', sortable: true, render: (row) => <CopyableText value={row.id} size="sm" /> },
    { key: 'title', header: 'Title', sortable: true },
    { key: 'version', header: 'Version', sortable: true, align: 'end', render: (row) => `v${row.version}` },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'updatedAt', header: 'Updated', sortable: true, render: (row) => <RelativeTime value={row.updatedAt} /> },
]


export default function ComponentsPreview() {
    const navigate = useNavigate()

    // Tabs
    const [activeTab, setActiveTab] = useState('buttons')
    const { t } = useTranslation()
    const { lang } = useLanguageStore()
    // FormField
    const [textVal, setTextVal] = useState('')
    const [emailVal, setEmailVal] = useState('')
    const [passVal, setPassVal] = useState('')

    // Search
    const [search, setSearch] = useState('')

    // Drawer
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerSize, setDrawerSize] = useState('md')

    // ConfirmDialog
    const [confirmOpen, setConfirmOpen] = useState(false)

    // Pagination
    const [page, setPage] = useState(0)

    const [provider, setProvider] = useState('')
    const [languages, setLanguages] = useState(['en'])
    const [notes, setNotes] = useState('')
    const [promptContext, setPromptContext] = useState([{ id: 'STORY-V5', label: 'Story Treatment v5' }])
    const [promptStatus, setPromptStatus] = useState('idle')

    const [agreed, setAgreed] = useState(false)
    const [autoQc, setAutoQc] = useState(true)
    const [format, setFormat] = useState('SERIES')
    const [episodes, setEpisodes] = useState(30)
    const [episodeDuration, setEpisodeDuration] = useState(2400)
    const [moods, setMoods] = useState(['Tense', 'Noir'])
    const [uploads, setUploads] = useState([])

    const [modalOpen, setModalOpen] = useState(false)
    const [lockOpen, setLockOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [tableLoading, setTableLoading] = useState(false)

    const handlePromptSend = () => {
        setPromptStatus('streaming')
        setTimeout(() => setPromptStatus('idle'), 2500)
    }

    const handleFiles = (files) => {
        const items = files.map((file) => ({
            id: `${file.name}-${file.size}-${Date.now()}`,
            file,
            previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
            status: 'uploading',
            progress: 0,
        }))

        setUploads((prev) => [...prev, ...items])

        items.forEach((item) => {
            let progress = 0
            const timer = setInterval(() => {
                progress += 20
                setUploads((prev) => prev.map((u) => (
                    u.id === item.id ? { ...u, progress, status: progress >= 100 ? 'done' : 'uploading' } : u
                )))
                if (progress >= 100) clearInterval(timer)
            }, 300)
        })
    }

    const removeUpload = (id) => {
        const target = uploads.find((u) => u.id === id)
        if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
        setUploads((prev) => prev.filter((u) => u.id !== id))
    }

    return (
        <div className="cp">

            <PageHeader
                title="Components Preview"
                subtitle="Temporary page — verify design then delete."
                action={
                    <FormButton variant="ghost" onClick={() => navigate('/dashboard')}>
                        {lang === 'ar' ? '→' : '←'} {t('common.back')}
                    </FormButton>
                }
            />

            <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

            {/* ── BUTTONS & INPUTS ───────────────────────────────── */}
            {activeTab === 'buttons' && (
                <div className="cp__sections">

                    <section className="cp__section">
                        <SectionDivider label="FormButton — variants" />
                        <div className="cp__row">
                            <FormButton variant="primary">Primary</FormButton>
                            <FormButton variant="ghost">Ghost</FormButton>
                            <FormButton variant="outline">Outline</FormButton>
                            <FormButton variant="secondary">Secondary</FormButton>
                            <FormButton variant="danger">Danger</FormButton>
                        </div>
                        <div className="cp__row">
                            <FormButton variant="primary" loading loadingText="Saving…">Primary</FormButton>
                            <FormButton variant="primary" disabled>Disabled</FormButton>
                        </div>
                        <div className="cp__row cp__row--full">
                            <FormButton variant="primary" fullWidth>Full Width Primary</FormButton>
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="FormField" />
                        <div className="cp__grid">
                            <FormField
                                label="Text field"
                                name="text"
                                value={textVal}
                                onChange={(e) => setTextVal(e.target.value)}
                                placeholder="Type something…"
                            />
                            <FormField
                                label="Required field"
                                name="email"
                                type="email"
                                value={emailVal}
                                onChange={(e) => setEmailVal(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                            <FormField
                                label="Field with error"
                                name="error-demo"
                                value=""
                                onChange={() => { }}
                                placeholder="This field has an error"
                                error="This field is required."
                            />
                            <FormField
                                label="Disabled field"
                                name="disabled"
                                value="Cannot edit this"
                                onChange={() => { }}
                                disabled
                            />
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="PasswordInput" />
                        <div className="cp__grid cp__grid--narrow">
                            <div className="cp__field-wrap">
                                <label className="cp__label">Password</label>
                                <PasswordInput
                                    placeholder="Enter your password"
                                    value={passVal}
                                    onChange={(e) => setPassVal(e.target.value)}
                                    className="cp__pwd-field"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="SearchInput" />
                        <div className="cp__grid cp__grid--narrow">
                            <SearchInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClear={() => setSearch('')}
                                placeholder="Search targets…"
                            />
                        </div>
                    </section>

                </div>
            )}

            {/* ── FEEDBACK ───────────────────────────────────────── */}
            {activeTab === 'feedback' && (
                <div className="cp__sections">

                    <section className="cp__section">
                        <SectionDivider label="FormAlert" />
                        <div className="cp__stack">
                            <FormAlert type="error" message="Something went wrong. Please try again." />
                            <FormAlert type="success" message="Your changes have been saved successfully." />
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="StatusBadge" />
                        <div className="cp__row cp__row--wrap">
                            <StatusBadge status="DONE" />
                            <StatusBadge status="ACTIVE" />
                            <StatusBadge status="COMPLETED" />
                            <StatusBadge status="SCHEDULED" />
                            <StatusBadge status="PENDING" />
                            <StatusBadge status="RUNNING" />
                            <StatusBadge status="FAILED" />
                            <StatusBadge status="MISSED" />
                            <StatusBadge status="CRITICAL" />
                            <StatusBadge status="HIGH" />
                            <StatusBadge status="MEDIUM" />
                            <StatusBadge status="LOW" />
                            <StatusBadge status="DRAFT" />
                            <StatusBadge status="BASIC" />
                            <StatusBadge status="GROWTH" />
                            <StatusBadge status="ENTERPRISE" />
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="Spinner" />
                        <div className="cp__row">
                            <div className="cp__spinner-cell">
                                <Spinner size="sm" />
                                <span className="cp__spinner-label">sm</span>
                            </div>
                            <div className="cp__spinner-cell">
                                <Spinner size="md" />
                                <span className="cp__spinner-label">md</span>
                            </div>
                            <div className="cp__spinner-cell">
                                <Spinner size="lg" />
                                <span className="cp__spinner-label">lg</span>
                            </div>
                            <div className="cp__spinner-cell cp__spinner-cell--dark">
                                <Spinner size="md" color="white" />
                                <span className="cp__spinner-label cp__spinner-label--light">white</span>
                            </div>
                            <div className="cp__spinner-cell">
                                <Spinner size="md" color="navy" />
                                <span className="cp__spinner-label">navy</span>
                            </div>
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="ConfirmDialog" />
                        <div className="cp__row">
                            <FormButton variant="primary" onClick={() => setConfirmOpen(true)}>
                                Open Confirm Dialog
                            </FormButton>
                        </div>
                        <ConfirmDialog
                            isOpen={confirmOpen}
                            title="Delete target"
                            message="Are you sure you want to delete this target? This action cannot be undone."
                            confirmLabel="Delete"
                            isDanger
                            onConfirm={() => setConfirmOpen(false)}
                            onCancel={() => setConfirmOpen(false)}
                        />
                    </section>

                </div>
            )}

            {/* ── LAYOUT ─────────────────────────────────────────── */}
            {activeTab === 'layout' && (
                <div className="cp__sections">

                    <section className="cp__section">
                        <SectionDivider label="PageHeader — variants" />
                        <div className="cp__stack">
                            <div className="cp__preview-box">
                                <PageHeader
                                    title="Targets"
                                    subtitle="Manage the domains and IPs you want to scan."
                                    action={<FormButton variant="primary">+ Add Target</FormButton>}
                                />
                            </div>
                            <div className="cp__preview-box">
                                <PageHeader title="Scan Results" />
                            </div>
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="SectionDivider" />
                        <div className="cp__stack">
                            <SectionDivider label="With label" />
                            <SectionDivider />
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="Drawer — sizes" />
                        <div className="cp__row">
                            {['sm', 'md', 'lg'].map((size) => (
                                <FormButton
                                    key={size}
                                    variant="ghost"
                                    onClick={() => { setDrawerSize(size); setDrawerOpen(true) }}
                                >
                                    Open {size.toUpperCase()}
                                </FormButton>
                            ))}
                        </div>
                        <Drawer
                            open={drawerOpen}
                            title={`Drawer — ${drawerSize.toUpperCase()}`}
                            onClose={() => setDrawerOpen(false)}
                            size={drawerSize}
                            error={drawerSize === 'sm' ? 'This is what a drawer error banner looks like.' : ''}
                            footer={
                                <>
                                    <FormButton variant="ghost" onClick={() => setDrawerOpen(false)} fullWidth>Cancel</FormButton>
                                    <FormButton variant="primary" onClick={() => setDrawerOpen(false)} fullWidth>Save Changes</FormButton>
                                </>
                            }
                        >
                            <FormField
                                label="Full Name"
                                name="drawer-name"
                                value=""
                                onChange={() => { }}
                                placeholder="John Doe"
                                required
                            />
                            <FormField
                                label="Email"
                                name="drawer-email"
                                type="email"
                                value=""
                                onChange={() => { }}
                                placeholder="john@example.com"
                            />
                            <SectionDivider label="Additional info" />
                            <FormField
                                label="Phone"
                                name="drawer-phone"
                                type="tel"
                                value=""
                                onChange={() => { }}
                                placeholder="+966 5X XXX XXXX"
                            />
                        </Drawer>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="EmptyState — variants" />
                        <div className="cp__row cp__row--stretch">
                            <div className="cp__preview-box cp__preview-box--half">
                                <EmptyState
                                    title="No targets yet"
                                    subtitle="Add your first target to start scanning your infrastructure."
                                    action={<FormButton variant="primary">+ Add Target</FormButton>}
                                />
                            </div>
                            <div className="cp__preview-box cp__preview-box--half">
                                <EmptyState
                                    title="No results found"
                                    subtitle="Try adjusting your search or filters."
                                />
                            </div>
                        </div>
                    </section>

                </div>
            )}

            {/* ── DATA ───────────────────────────────────────────── */}
            {activeTab === 'data' && (
                <div className="cp__sections">

                    <section className="cp__section">
                        <SectionDivider label="Tabs" />
                        <div className="cp__preview-box">
                            <Tabs
                                tabs={[
                                    { key: 'overview', label: 'Overview' },
                                    { key: 'findings', label: 'Findings', count: 12 },
                                    { key: 'load', label: 'Load Test', count: 3 },
                                    { key: 'report', label: 'Report' },
                                ]}
                                activeTab="findings"
                                onChange={() => { }}
                            />
                            <p className="cp__hint">Tab content renders here based on activeTab.</p>
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="Pagination" />
                        <div className="cp__preview-box">
                            <Pagination
                                page={page}
                                totalPages={8}
                                totalElements={76}
                                itemLabel="scans"
                                onPageChange={setPage}
                            />
                        </div>
                    </section>

                </div>
            )}

            {activeTab === 'inputs' && (
                <div className="cp__sections">

                    <section className="cp__section">
                        <SectionDivider label="SelectField" />
                        <div className="cp__grid">
                            <SelectField label="Provider" name="provider" value={provider}
                                onChange={setProvider} options={PROVIDER_OPTIONS} required />
                            <SelectField label="Languages" name="languages" value={languages}
                                onChange={setLanguages} options={LANGUAGE_OPTIONS} multiple />
                            <SelectField label="With error" name="select-error" value=""
                                onChange={() => { }} options={PROVIDER_OPTIONS} error="Choose a provider." />
                            <SelectField label="Disabled" name="select-disabled" value="kling"
                                onChange={() => { }} options={PROVIDER_OPTIONS} disabled />
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="DropdownMenu" />
                        <div className="cp__row">
                            <DropdownMenu items={[
                                { key: 'compare', label: 'Compare versions', onClick: () => { } },
                                { key: 'duplicate', label: 'Duplicate', onClick: () => { } },
                                { key: 'div', divider: true },
                                { key: 'delete', label: 'Delete', danger: true, onClick: () => setConfirmOpen(true) },
                            ]} />
                            <DropdownMenu items={[{ key: 'csv', label: 'CSV', onClick: () => { } }]}>
                                Export
                            </DropdownMenu>
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="TextareaField" />
                        <div className="cp__grid">
                            <TextareaField label="Voice prompt" name="voice-prompt" value={notes}
                                onChange={(e) => setNotes(e.target.value)} maxLength={1000}
                                helperText="Describe tone, age, accent and pacing." />
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="PromptComposer" />
                        <div className="cp__stack">
                            <PromptComposer
                                status={promptStatus}
                                onSend={handlePromptSend}
                                onStop={() => setPromptStatus('idle')}
                                context={promptContext}
                                onRemoveContext={(id) => setPromptContext((prev) => prev.filter((c) => c.id !== id))}
                                mentionOptions={ARTIFACT_OPTIONS}
                                onAddContext={(o) => setPromptContext((prev) => [...prev, { id: o.value, label: o.label }])}
                                maxLength={4000}
                            />
                            <PromptComposer variant="compact" placeholder="Regenerate this section with instructions…"
                                onSend={() => { }} />
                            <PromptComposer disabled disabledReason="You need the paid-generation permission to run this."
                                onSend={() => { }} />
                        </div>
                    </section>

                </div>
            )}

            {activeTab === 'forms' && (
                <div className="cp__sections">

                    <section className="cp__section">
                        <SectionDivider label="RadioCardGroup" />
                        <RadioCardGroup label="Project format" name="project-format" value={format}
                            onChange={setFormat} options={FORMAT_OPTIONS} columns={3} required />
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="NumberField + DurationField" />
                        <div className="cp__grid">
                            <NumberField label="Episodes" name="episodes" value={episodes}
                                onChange={setEpisodes} min={1} max={200} suffix="episodes" />
                            <DurationField label="Duration per episode" name="episode-duration"
                                value={episodeDuration} onChange={setEpisodeDuration} min={60} />
                        </div>
                        <p className="cp__hint">
                            Total runtime: {formatDuration((episodes || 0) * (episodeDuration || 0), 'hh:mm:ss')}
                        </p>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="CheckboxField + Toggle" />
                        <div className="cp__stack">
                            <CheckboxField name="rights" checked={agreed} onChange={setAgreed}
                                label="I own the rights to this material"
                                description="Required before the project can be screened." />
                            <CheckboxField name="partial" checked indeterminate label="Indeterminate (select all)" />
                            <Toggle name="auto-qc" checked={autoQc} onChange={setAutoQc} layout="row"
                                label="Run automated QC after generation"
                                description="Checks identity, lip-sync and audio before human review." />
                            <Toggle name="toggle-sm" checked size="sm" label="Small toggle" />
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="TagInput" />
                        <div className="cp__grid">
                            <TagInput label="Mood" name="mood" value={moods} onChange={setMoods}
                                suggestions={MOOD_SUGGESTIONS} maxTags={6} />
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="UploadDropzone + FileItem" />
                        <div className="cp__stack">
                            <UploadDropzone onFiles={handleFiles} accept="image/*,.pdf" maxSize={20 * 1024 * 1024} maxFiles={5} />
                            <UploadDropzone onFiles={handleFiles} accept="audio/*" compact title="Upload a voice sample" />
                            {uploads.map((u) => (
                                <FileItem key={u.id} name={u.file.name} size={u.file.size} type={u.file.type}
                                    previewUrl={u.previewUrl} status={u.status} progress={u.progress}
                                    onRemove={() => removeUpload(u.id)} />
                            ))}
                            <FileItem name="character-sheet-v2.png" size={2400000} type="image/png" meta="REF-CHAR-004-03" />
                            <FileItem name="scene-12.mp4" size={88000000} type="video/mp4" status="error"
                                error="Provider timeout" onRetry={() => { }} onRemove={() => { }} />
                        </div>
                    </section>

                </div>
            )}

            {activeTab === 'display' && (
                <div className="cp__sections">

                    <section className="cp__section">
                        <SectionDivider label="PageHeader — breadcrumbs + meta" />
                        <div className="cp__preview-box">
                            <PageHeader
                                title="Story Treatment"
                                breadcrumbs={[
                                    { label: 'Signal 27', to: '/dashboard' },
                                    { label: 'Story', to: '/dashboard' },
                                    { label: 'Treatment' },
                                ]}
                                meta={<>
                                    <CopyableText value="STORY-001" size="sm" />
                                    <StatusBadge status="LOCKED" />
                                    <StatusBadge status="FILM" />
                                </>}
                                action={<FormButton variant="outline">Compare versions</FormButton>}
                            />
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="DataTable" />
                        <div className="cp__row">
                            <FormButton variant="outline" onClick={() => {
                                setTableLoading(true)
                                setTimeout(() => setTableLoading(false), 1500)
                            }}>
                                Simulate loading
                            </FormButton>
                        </div>
                        <DataTable
                            name="artifacts"
                            columns={ARTIFACT_COLUMNS}
                            rows={ARTIFACT_ROWS}
                            loading={tableLoading}
                            selectable
                            selectedKeys={selectedRows}
                            onSelectionChange={setSelectedRows}
                            onRowClick={() => setModalOpen(true)}
                            rowActions={() => (
                                <DropdownMenu items={[
                                    { key: 'open', label: 'Open', onClick: () => setModalOpen(true) },
                                    { key: 'lock', label: 'Lock version', onClick: () => setLockOpen(true) },
                                ]} />
                            )}
                            footer={<Pagination page={0} totalPages={1} totalElements={4} itemLabel="artifacts" onPageChange={() => { }} />}
                        />
                        <DataTable name="empty" columns={ARTIFACT_COLUMNS} rows={[]} />
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="Card + KeyValueList" />
                        <div className="cp__grid">
                            <Card title="Execution record" subtitle="story.treatment@v7"
                                actions={<DropdownMenu items={[{ key: 'view', label: 'View prompt', onClick: () => { } }]} />}>
                                <KeyValueList items={[
                                    { key: 'agent', label: 'Agent', value: 'Story Writer' },
                                    { key: 'model', label: 'Model', value: 'claude-opus-5-5', mono: true },
                                    { key: 'tokens', label: 'Tokens', value: '18,240' },
                                    { key: 'cost', label: 'Cost', value: '$0.42' },
                                ]} />
                            </Card>
                            <Card title="Rows layout" variant="muted">
                                <KeyValueList layout="rows" items={[
                                    { key: 'owner', label: 'Owner', value: <Avatar name="Sara Haddad" size="xs" /> },
                                    { key: 'created', label: 'Created', value: <RelativeTime value={Date.now() - 7200000} /> },
                                    { key: 'source', label: 'Source', value: null },
                                ]} />
                            </Card>
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="Avatar + AvatarGroup + Tooltip" />
                        <div className="cp__row">
                            <Avatar name="Abdalrhman Alkraien" size="lg" showTooltip />
                            <Avatar name="Sara Haddad" />
                            <Avatar name="Omar Nasser" size="sm" />
                            <AvatarGroup users={TEAM} max={4} />
                            <Tooltip content="You need the paid-generation permission.">
                                <FormButton variant="primary" disabled>Generate</FormButton>
                            </Tooltip>
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="ProgressBar + Skeleton" />
                        <div className="cp__stack">
                            <ProgressBar label="Budget used" value={420} max={1000} valueLabel="$420 / $1,000" />
                            <ProgressBar label="Rendering" value={88} tone="success" />
                            <ProgressBar label="Waiting for provider" indeterminate tone="info" />
                            <ProgressBar value={35} size="sm" tone="danger" />
                            <div className="cp__row">
                                <Skeleton variant="circle" size="lg" />
                                <Skeleton lines={3} />
                            </div>
                            <Skeleton variant="rect" size="sm" />
                        </div>
                    </section>

                    <section className="cp__section">
                        <SectionDivider label="Modal + ConfirmDialog (requireText)" />
                        <div className="cp__row">
                            <FormButton variant="primary" onClick={() => setModalOpen(true)}>Open modal</FormButton>
                            <FormButton variant="danger" onClick={() => setLockOpen(true)}>Lock version</FormButton>
                        </div>

                        <Modal
                            open={modalOpen}
                            onClose={() => setModalOpen(false)}
                            title="Generate variants"
                            subtitle="Shot 12.3 · Kling"
                            footer={<>
                                <FormButton variant="ghost" onClick={() => setModalOpen(false)}>Cancel</FormButton>
                                <FormButton variant="primary" onClick={() => setModalOpen(false)}>Generate</FormButton>
                            </>}
                        >
                            <SelectField label="Provider" name="modal-provider" value="kling" onChange={() => { }}
                                options={[{ value: 'kling', label: 'Kling' }, { value: 'runway', label: 'Runway' }]} />
                            <NumberField label="Variants" name="modal-variants" value={3} onChange={() => { }} min={1} max={6} />
                            <FormButton variant="danger" onClick={() => setLockOpen(true)}>Confirm from inside modal</FormButton>
                        </Modal>

                        <ConfirmDialog
                            isOpen={lockOpen}
                            title="Lock Story Treatment v5?"
                            message="Locked versions become the governing source. Downstream artifacts will reference this version."
                            confirmLabel="Lock version"
                            requireText="LOCK"
                            onConfirm={() => setLockOpen(false)}
                            onCancel={() => setLockOpen(false)}
                        />
                    </section>

                </div>
            )}
        </div>
    )
}