import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Boxes,
  Check,
  Cloud,
  Copy,
  Eye,
  GitBranch,
  LayoutGrid,
  MessageSquare,
  Play,
  RotateCcw,
  Search,
  Workflow,
  ArrowLeft
} from 'lucide-react'
import clsx from 'clsx'
import { useId, useMemo, useState, type ReactNode } from 'react'
import { TemplateCard } from '../components/TemplateCard'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { highlightAgentSnippet, highlightConfigCode } from '../lib/ideCodeHighlight'

const STEPS = ['Create agent', 'Configure environment', 'Start session', 'Integrate'] as const

type Template = {
  title: string
  description: string
  badge?: string
  icons: LucideIcon[]
}

const TEMPLATES: Template[] = [
  {
    title: 'Blank agent config',
    description: 'Start from an empty configuration and wire tools yourself.',
    icons: [LayoutGrid],
  },
  {
    title: 'Deep researcher',
    description: 'Multi-step research with citations and source tracking.',
    icons: [GitBranch, BarChart3],
  },
  {
    title: 'Support agent',
    description: 'Answers customer questions from your docs and knowledge base, and escalates when needed.',
    badge: 'Popular',
    icons: [MessageSquare, Boxes],
  },
  {
    title: 'Code reviewer',
    description: 'Suggests fixes and explains risk areas on pull requests.',
    icons: [GitBranch, Workflow],
  },
  {
    title: 'Data analyst',
    description: 'Answers questions over structured data and exports summaries.',
    icons: [BarChart3, LayoutGrid],
  },
  {
    title: 'Onboarding guide',
    description: 'Walks new users through setup with adaptive follow-ups.',
    icons: [MessageSquare],
  },
]

function yamlForTemplate(t: Template): string {
  return [
    `name: "${t.title}"`,
    `model: claude-sonnet-4-6`,
    `description: |`,
    `  ${t.description}`,
    `system: |`,
    `  You are "${t.title}". Stay within workspace policies and escalate when unsure.`,
    `mcp_servers:`,
    `  notion:`,
    `    type: http`,
    `  slack:`,
    `    type: http`,
    `tools:`,
    `  - type: code_execution`,
  ].join('\n')
}

function jsonForTemplate(t: Template): string {
  return JSON.stringify(
    {
      name: t.title,
      model: 'claude-sonnet-4-6',
      description: t.description,
      system: `You are "${t.title}". Stay within workspace policies.`,
      mcp_servers: { notion: { type: 'http' }, slack: { type: 'http' } },
      tools: [{ type: 'code_execution' }],
    },
    null,
    2,
  )
}

type ApiLanguage = 'curl' | 'python' | 'typescript'

function curlAgentSnippet(t: Template): string {
  const body = JSON.stringify({ name: t.title, description: t.description })
  return [
    "curl --request POST \\",
    "  --url 'https://api.anthropic.com/v1/agents' \\",
    "  --header 'Content-Type: application/json' \\",
    "  --header 'x-api-key: $ANTHROPIC_API_KEY' \\",
    "  --header 'anthropic-version: 2023-06-01' \\",
    `  --data '${body.replace(/'/g, "'\\''")}'`,
  ].join('\n')
}

function pythonAgentSnippet(t: Template): string {
  return [
    'import os',
    'import requests',
    '',
    'url = "https://api.anthropic.com/v1/agents"',
    'headers = {',
    '    "Content-Type": "application/json",',
    '    "x-api-key": os.environ.get("ANTHROPIC_API_KEY", ""),',
    '    "anthropic-version": "2023-06-01",',
    '}',
    'payload = {',
    `    "name": ${JSON.stringify(t.title)},`,
    `    "description": ${JSON.stringify(t.description)},`,
    '}',
    '',
    'response = requests.post(url, headers=headers, json=payload)',
    'response.raise_for_status()',
    'print(response.json())',
  ].join('\n')
}

function typescriptAgentSnippet(t: Template): string {
  const name = JSON.stringify(t.title)
  const desc = JSON.stringify(t.description)
  return [
    'const url = "https://api.anthropic.com/v1/agents";',
    '',
    'const response = await fetch(url, {',
    '  method: "POST",',
    '  headers: {',
    '    "Content-Type": "application/json",',
    '    "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",',
    '    "anthropic-version": "2023-06-01",',
    '  },',
    '  body: JSON.stringify({',
    `    name: ${name},`,
    `    description: ${desc},`,
    '  }),',
    '});',
    '',
    'console.log(await response.json());',
  ].join('\n')
}

function getAgentApiSnippet(t: Template, lang: ApiLanguage): string {
  switch (lang) {
    case 'curl':
      return curlAgentSnippet(t)
    case 'python':
      return pythonAgentSnippet(t)
    case 'typescript':
      return typescriptAgentSnippet(t)
  }
}

function DesktopStepper({ activeIndex }: { activeIndex: number }) {
  return (
    <nav className="flex w-full max-w-3xl flex-wrap items-center justify-center gap-y-3" aria-label="Quickstart steps">
      {STEPS.map((label, index) => {
        const done = index < activeIndex
        const active = index === activeIndex
        const pending = index > activeIndex
        return (
          <div key={label} className="flex min-w-0 items-center">
            {index > 0 ? (
              <div
                className={clsx(
                  'mx-2 h-px min-w-[1.25rem] shrink sm:mx-3',
                  activeIndex >= index - 1 ? 'bg-[var(--text-h)]' : 'bg-[var(--border)]',
                )}
                aria-hidden
              />
            ) : null}
            <div className="flex shrink-0  items-center gap-2 text-center">
              <div
                className={clsx(
                  'flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors text-[var(--text-dim)]',
                  active && 'border border-[var(--text-h)] text-[var(--text-h)]',
                  done && 'border border-[var(--text-h)] bg-[var(--surface)] text-[var(--text-h)]',
                  pending && 'border border-[#525252] bg-[var(--bg)] text-[var(--text-dim)]',
                )}
              >
                {done ? <Check className="size-4 text-emerald-500" strokeWidth={2.5} aria-hidden /> : index + 1}
              </div>
              <span
                className={clsx(
                  'max-w-[5.5rem] text-[11px] font-medium leading-tight sm:max-w-none sm:text-xs',
                  (active || done) && 'text-[var(--text-h)]',
                  pending && 'text-[var(--text-dim)]',
                )}
              >
                {label}
              </span>
            </div>
          </div>
        )
      })}
    </nav>
  )
}

function MobileCompactStepper({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="shrink-0 space-y-2 border-b border-[var(--border)] pb-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--text-dim)]">
        Step {Math.min(activeIndex + 1, 4)} of 4 · {STEPS[activeIndex] ?? STEPS[0]}
      </p>
      <div className="flex gap-1.5" role="list" aria-label="Progress">
        {STEPS.map((_, i) => (
          <div
            key={STEPS[i]}
            role="listitem"
            className={clsx('h-1 flex-1 rounded-full transition-colors', i <= activeIndex ? 'bg-[var(--text-h)]' : 'bg-[var(--border)]')}
          />
        ))}
      </div>
    </div>
  )
}

function ConfigPreviewTabs({
  value,
  onChange,
}: {
  value: 'describe' | 'preview'
  onChange: (v: 'describe' | 'preview') => void
}) {
  return (
    <div className="flex gap-8 border-b border-[var(--border)]">
      {(['describe', 'preview'] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={clsx(
            '-mb-px border-b-2 pb-2.5 text-sm font-medium capitalize transition-colors',
            value === k
              ? 'border-[var(--text-h)] text-[var(--text-h)]'
              : 'border-transparent text-[var(--text-dim)] hover:text-[var(--text)]',
          )}
        >
          {k}
        </button>
      ))}
    </div>
  )
}

function AgentPreviewTabs({
  value,
  onChange,
}: {
  value: 'config' | 'preview'
  onChange: (v: 'config' | 'preview') => void
}) {
  return (
    <div className="flex gap-8 border-b border-[var(--border)]">
      {(['config', 'preview'] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={clsx(
            '-mb-px border-b-2 pb-2.5 text-sm font-medium capitalize transition-colors',
            value === k
              ? 'border-[var(--text-h)] text-[var(--text-h)]'
              : 'border-transparent text-[var(--text-dim)] hover:text-[var(--text)]',
          )}
        >
          {k}
        </button>
      ))}
    </div>
  )
}

function QuickstartPreviewPlaceholder({ compact }: { compact?: boolean }) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center',
        compact ? 'min-h-[min(42vh,260px)] py-10' : 'min-h-[min(50vh,360px)]',
      )}
    >
      <Eye className="size-10 text-[var(--text-dim)]" strokeWidth={1.25} aria-hidden />
      <div className="space-y-1">
        <p className="m-0 text-sm font-medium text-[var(--text-h)]">Live preview</p>
        <p className="m-0 max-w-xs text-sm leading-relaxed text-[var(--text)]">
          Run a test session to see streamed responses and tool use here. Configure an environment first.
        </p>
      </div>
    </div>
  )
}

function CopyIconButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button
      type="button"
      onClick={onCopy}
      className={clsx(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--border)] text-[var(--text-h)] transition-colors hover:bg-[var(--surface)]',
        copied && 'border-emerald-600/50 text-emerald-400',
      )}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
      title={copied ? 'Copied' : 'Copy'}
    >
      <Copy className="size-4" aria-hidden />
    </button>
  )
}

function ApiAgentCallCard({
  template,
  language,
  onLanguageChange,
  codeScrollMode = 'capped',
}: {
  template: Template
  language: ApiLanguage
  onLanguageChange: (lang: ApiLanguage) => void
  /** `embedded` = fill mobile tab panel, scroll inside snippet. `capped` = fixed max-height (desktop). */
  codeScrollMode?: 'capped' | 'embedded'
}) {
  const uid = useId()
  const selectId = `${uid}-api-lang`
  const snippet = getAgentApiSnippet(template, language)
  return (
    <div
      className={clsx(
        'rounded-lg bg-transparent shadow-sm',
        codeScrollMode === 'embedded' && 'flex min-h-0 flex-1 flex-col overflow-hidden',
        codeScrollMode === 'capped' && 'overflow-hidden',
      )}
    >
      <p className="shrink-0 px-3 py-2.5 text-[13px] leading-snug text-[var(--text)]">
        Your agent is created! Here&apos;s the call that made it:
      </p>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border border-[var(--border)] bg-[var(--bg-dim)] px-2 py-1.5">
        <span className="font-mono text-[11px] font-semibold tracking-tight text-[var(--text-h)]">POST /v1/agents</span>
        <div className="flex items-center gap-1.5">
          <label className="sr-only" htmlFor={selectId}>
            Example language
          </label>
          <select
            id={selectId}
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as ApiLanguage)}
            className="rounded-md border border-[var(--border)] bg-[var(--code-bg)] px-2 py-1.5 font-mono text-[11px] font-medium text-[var(--text-h)]"
          >
            <option value="curl">cURL</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
          </select>
          <CopyIconButton text={snippet} />
        </div>
      </div>
      <div
        className={clsx(
          'border border-[var(--border)] bg-[var(--surface-raised)] p-3',
          codeScrollMode === 'capped' && 'max-h-72 overflow-y-auto sm:max-h-80',
          codeScrollMode === 'embedded' && 'min-h-0 flex-1 overflow-x-auto overflow-y-auto',
        )}
      >
        <pre className="m-0 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-[#d4d4d4]">
          <code>{highlightAgentSnippet(snippet, language)}</code>
        </pre>
      </div>
    </div>
  )
}

function CodeBlockWithLines({
  code,
  codeFormat,
  maxHeightClass,
  fillParent,
}: {
  code: string
  codeFormat: 'yaml' | 'json'
  maxHeightClass?: string
  /** When true, fill a flex parent and scroll internally (mobile tab panel). */
  fillParent?: boolean
}) {
  const lines = code.split('\n')
  const mh = maxHeightClass ?? 'max-h-[min(70vh,520px)]'
  return (
    <div
      className={clsx(
        'overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--code-bg)]',
        fillParent && 'flex min-h-0 flex-1 flex-col',
      )}
    >
      <div
        className={clsx(
          'min-h-0 overflow-auto',
          fillParent ? 'max-h-full flex-1' : mh,
        )}
      >
        <div className="flex min-h-[10rem] items-start">
          <div
            className="sticky left-0 shrink-0 select-none border-r border-[var(--border)] bg-[var(--code-bg)] px-2 py-3 font-mono text-[11px] leading-relaxed text-[var(--text-dim)]"
            aria-hidden
          >
            {lines.map((_, i) => (
              <div key={i} className="pr-1 text-right tabular-nums">
                {i + 1}
              </div>
            ))}
          </div>
          <pre className="m-0 min-w-0 flex-1 p-3 font-mono text-[11px] leading-relaxed text-[#d4d4d4]">
            <code>{highlightConfigCode(code, codeFormat)}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

function ConfigFormatWithCopyRow({
  codeFormat,
  onCodeFormatChange,
  yamlText,
  jsonText,
}: {
  codeFormat: 'yaml' | 'json'
  onCodeFormatChange: (v: 'yaml' | 'json') => void
  yamlText: string
  jsonText: string
}) {
  const copyPayload = codeFormat === 'yaml' ? yamlText : jsonText
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <FormatTabs value={codeFormat} onChange={onCodeFormatChange} />
      <CopyIconButton text={copyPayload} />
    </div>
  )
}

function MobileAgentWorkspaceTabs({
  value,
  onChange,
}: {
  value: 'call' | 'config' | 'preview'
  onChange: (v: 'call' | 'config' | 'preview') => void
}) {
  const tabs: { id: 'call' | 'config' | 'preview'; label: string }[] = [
    { id: 'call', label: 'Call' },
    { id: 'config', label: 'Config' },
    { id: 'preview', label: 'Preview' },
  ]
  return (
    <div className="flex gap-5 border-b border-[var(--border)] sm:gap-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={clsx(
            '-mb-px border-b-2 pb-2.5 text-sm font-medium transition-colors',
            value === tab.id
              ? 'border-[var(--text-h)] text-[var(--text-h)]'
              : 'border-transparent text-[var(--text-dim)] hover:text-[var(--text)]',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

function FormatTabs({
  value,
  onChange,
}: {
  value: 'yaml' | 'json'
  onChange: (v: 'yaml' | 'json') => void
}) {
  return (
    <div className="inline-flex rounded-lg  bg-transparent p-0.5">
      {(['yaml', 'json'] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={clsx(
            'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors',
            value === k ? 'bg-[var(--surface)] text-[var(--text-h)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]',
          )}
        >
          {k}
        </button>
      ))}
    </div>
  )
}

function MobileSegmented({
  value,
  onChange,
}: {
  value: 'describe' | 'templates'
  onChange: (v: 'describe' | 'templates') => void
}) {
  return (
    <div className="mb-4 grid shrink-0 grid-cols-2 gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1">
      {(['describe', 'templates'] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={clsx(
            'rounded-md py-2.5 text-sm font-medium transition-colors',
            value === k ? 'bg-[var(--surface-raised)] text-[var(--text-h)]' : 'text-[var(--text-dim)] hover:text-[var(--text)]',
          )}
        >
          {k === 'describe' ? 'Describe' : 'Templates'}
        </button>
      ))}
    </div>
  )
}

function StickyMobileActions({ children }: { children: ReactNode }) {
  return (
    <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg)] px-1 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {children}
    </div>
  )
}

function QuickstartVersionSaveTestControls() {
  const uid = useId()
  const selectId = `${uid}-version`
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <label className="sr-only" htmlFor={selectId}>
        Version
      </label>
      <select
        id={selectId}
        defaultValue="v1"
        className="rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-2.5 py-2 text-xs font-medium text-[var(--text-h)]"
      >
        <option value="v1">v1</option>
      </select>
      <button
        type="button"
        className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text-h)] hover:bg-[var(--surface)]"
      >
        Save
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--text-h)] px-3 py-2 text-sm font-medium text-[var(--bg)] hover:opacity-95"
      >
        <Play className="size-3.5" fill="currentColor" aria-hidden />
        Test run
      </button>
    </div>
  )
}

function MobileQuickstartTitleActions({ showSaveAndTestRun, showStartOver, onStartOver }: { showSaveAndTestRun: boolean, showStartOver: boolean, onStartOver: () => void }) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 pb-3">
      {showStartOver ? <button
        type="button"
        onClick={onStartOver}
        className="inline-flex items-center justify-center gap-2"
        aria-label="Start over"
        title="Start over"
      >
        <RotateCcw className="size-4" aria-hidden />
        <span className="truncate text-sm font-medium text-[var(--text-h)]">Quickstart</span>
      </button> : null}
      {showSaveAndTestRun ? <QuickstartVersionSaveTestControls /> : null}
    </div>
  )
}

function DesktopQuickstartHeader({
  stepper,
  showStartOver,
  onStartOver,
  showSaveAndTestRun,
}: {
  stepper: ReactNode
  showStartOver: boolean
  onStartOver: () => void
  showSaveAndTestRun: boolean
}) {
  return (
    <div className="mb-6 grid w-full grid-cols-1 items-center gap-4  pb-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-3">
      <div className="flex min-w-0 items-center gap-2 md:justify-self-start">
        {showStartOver ? (
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex items-center justify-center gap-2"
            aria-label="Start over"
            title="Start over"
          >
            <RotateCcw className="size-4" aria-hidden />
            <span className="truncate text-sm font-medium text-[var(--text-h)]">Quickstart</span>
          </button>
        ) : null}

      </div>
      <div className="min-w-0 max-w-full justify-self-center overflow-x-auto">{stepper}</div>
      <div className="flex flex-wrap items-center gap-2 justify-self-stretch md:justify-self-end">
        {showSaveAndTestRun ? <QuickstartVersionSaveTestControls /> : null}
      </div>
    </div>
  )
}

function DesktopDescribeSection({ prompt, setPrompt }: { prompt: string, setPrompt: (prompt: string) => void }) {
  return (
    <section className="flex h-full flex-col lg:col-span-5">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <header className="space-y-3 flex flex-col h-full items-center justify-center text-center">
          <h3 className="m-0 text-2xl font-medium tracking-tight text-[var(--text-h)]">What do you want to build?</h3>
          <p className="m-0 max-w-md text-base leading-relaxed text-[var(--text)]">Describe your agent or start with a template.</p>
        </header>

      </div>


      <div className="mt-auto w-full">
        <div className="flex items-end gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-3 shadow-[var(--shadow)]">
          <label className="sr-only" htmlFor="agent-prompt-d">
            Describe your agent
          </label>
          <textarea
            id="agent-prompt-d"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your agent…"
            className="min-h-[5.5rem] w-full resize-none bg-transparent text-[15px] leading-relaxed text-[var(--text-h)] outline-none placeholder:text-[var(--text-dim)]"
          />
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-[var(--button-bg)] text-neutral-950 hover:bg-[var(--button-bg-hover)] disabled:cursor-not-allowed disabled:bg-[var(--button-disabled)]"
            aria-label="Submit"
            disabled={!prompt.trim()}
          >
            <ArrowUp className="size-5 text-[var(--text-h)]" strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  )


}

function MobileDescribeSection({ prompt, setPrompt }: { prompt: string, setPrompt: (prompt: string) => void }) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-4 text-center">
        <header className="flex max-w-md shrink-0 flex-col space-y-3">
          <h3 className="m-0 text-2xl font-medium tracking-tight text-[var(--text-h)]">What do you want to build?</h3>
          <p className="m-0 text-base leading-relaxed text-[var(--text)]">
            Describe your agent or start with a template.
          </p>
        </header>
      </div>
      <div className="shrink-0 px-1 pb-4 pt-2">
        <div className="flex w-full items-end gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-3 shadow-[var(--shadow)]">
          <label className="sr-only" htmlFor="qs-mobile-prompt">
            Describe your agent
          </label>
          <textarea
            id="qs-mobile-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your agent…"
            className="min-h-[5.5rem] w-full resize-none bg-transparent text-[15px] leading-relaxed text-[var(--text-h)] outline-none placeholder:text-[var(--text-dim)]"
          />
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-[var(--button-bg)] text-neutral-950 hover:bg-[var(--button-bg-hover)] disabled:cursor-not-allowed disabled:bg-[var(--button-disabled)]"
            aria-label="Submit"
            disabled={!prompt.trim()}
          >
            <ArrowUp className="size-5 text-[var(--text-h)]" strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}

export function Quickstart() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [prompt, setPrompt] = useState('')
  const [search, setSearch] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [createdTemplate, setCreatedTemplate] = useState<Template | null>(null)
  const [agentCreated, setAgentCreated] = useState(false)
  const [flowStep, setFlowStep] = useState(0)
  const [mobileSegment, setMobileSegment] = useState<'describe' | 'templates'>('describe')
  const [codeFormat, setCodeFormat] = useState<'yaml' | 'json'>('yaml')
  const [workspaceMainTab, setWorkspaceMainTab] = useState<'describe' | 'preview'>('preview')
  const [agentPreviewTab, setAgentPreviewTab] = useState<'config' | 'preview'>('config')
  const [apiCallLanguage, setApiCallLanguage] = useState<ApiLanguage>('curl')
  const [mobileAgentTab, setMobileAgentTab] = useState<'call' | 'config' | 'preview'>('call')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return TEMPLATES
    return TEMPLATES.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    )
  }, [search])

  const stepperIndex = flowStep

  const openTemplate = (t: Template) => {
    setSelectedTemplate(t)
    setCodeFormat('yaml')
    setWorkspaceMainTab('preview')
    setAgentPreviewTab('config')
  }

  const closeTemplate = () => {
    setSelectedTemplate(null)
    setWorkspaceMainTab('preview')
    setAgentPreviewTab('config')
  }

  const useTemplate = () => {
    if (selectedTemplate) {
      setCreatedTemplate(selectedTemplate)
    }
    setAgentCreated(true)
    setSelectedTemplate(null)
    setMobileAgentTab('call')
    setApiCallLanguage('curl')
    setAgentPreviewTab('config')
  }

  // const goConfigure = () => {
  //   setFlowStep(1)
  //   setAgentCreated(false)
  //   setSelectedTemplate(null)
  //   setWorkspaceMainTab('preview')
  //   setMobileAgentTab('call')
  // }

  const configureBack = () => {
    setFlowStep(0)
    setAgentCreated(true)
    setAgentPreviewTab('config')
  }

  const startOver = () => {
    setAgentCreated(false)
    setSelectedTemplate(null)
    setCreatedTemplate(null)
    setFlowStep(0)
    setPrompt('')
    setSearch('')
    setMobileSegment('describe')
    setCodeFormat('yaml')
    setWorkspaceMainTab('preview')
    setAgentPreviewTab('config')
    setApiCallLanguage('curl')
    setMobileAgentTab('call')
  }

  const agentSummary = createdTemplate ?? TEMPLATES[2]

  /* ——— Configure environment (mobile + desktop) ——— */
  if (flowStep === 1) {
    return (
      <div className="mx-auto flex min-h-0 w-full max-w-lg flex-1 flex-col md:max-w-xl">
        {isDesktop ? (
          <DesktopQuickstartHeader
            stepper={<DesktopStepper activeIndex={1} />}
            showStartOver
            onStartOver={startOver}
            showSaveAndTestRun
          />
        ) : (
          <div className="mb-6 shrink-0 space-y-4">
            <MobileQuickstartTitleActions showSaveAndTestRun={true} showStartOver={true} onStartOver={startOver} />
            <MobileCompactStepper activeIndex={1} />
          </div>
        )}
        <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center md:min-h-[40vh]">
          <Cloud className="size-12 text-[var(--text-dim)]" strokeWidth={1.25} aria-hidden />
          <h2 className="m-0 text-lg font-medium text-[var(--text-h)]">No environments yet</h2>
          <p className="max-w-sm text-sm leading-relaxed text-[var(--text)]">
            You&apos;ll need an environment to run a test session.
          </p>
          <button
            type="button"
            className="mt-2 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2.5 text-sm font-medium text-[var(--text-h)] hover:bg-[var(--surface)]"
          >
            + Configure environment
          </button>
        </div>
        <div className="mt-auto flex gap-2 pt-8 md:justify-end">
          <button
            type="button"
            onClick={configureBack}
            className="flex-1 rounded-lg border border-[var(--border)] py-3 text-sm font-medium text-[var(--text-h)] hover:bg-[var(--surface)] md:flex-none md:px-6"
          >
            Back
          </button>
          <button
            type="button"
            disabled
            className="flex-1 cursor-not-allowed rounded-lg bg-[var(--border)] py-3 text-sm font-medium text-[var(--text-dim)] md:flex-none md:px-6"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  /* ——— Mobile: focused workspace ——— */
  if (!isDesktop) {
    if (agentCreated) {
      const t = agentSummary
      return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 flex-col gap-4">
            <MobileQuickstartTitleActions showSaveAndTestRun={true} showStartOver={true} onStartOver={startOver} />
            <div className="flex shrink-0 flex-col gap-2">

              <MobileCompactStepper activeIndex={0} />
            </div>
          </div>
          <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden pr-0.5">
            <p className="shrink-0 rounded-xl bg-[var(--surface)] p-3 text-sm leading-relaxed text-[var(--text)]">
              {t.description}
            </p>
            <div className="mt-3 flex shrink-0 items-center gap-2 text-emerald-500">
              <Check className="size-5 shrink-0" strokeWidth={2.5} aria-hidden />
              <span className="text-sm font-medium text-[var(--text-h)]">Agent created</span>
            </div>
            <div className="mt-3 shrink-0">
              <MobileAgentWorkspaceTabs value={mobileAgentTab} onChange={setMobileAgentTab} />
            </div>
            <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden pb-2">
              {mobileAgentTab === 'preview' ? (
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
                  <QuickstartPreviewPlaceholder compact />
                </div>
              ) : null}
              {mobileAgentTab === 'call' ? (
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-6">
                  <ApiAgentCallCard
                    template={t}
                    language={apiCallLanguage}
                    onLanguageChange={setApiCallLanguage}
                    codeScrollMode="embedded"
                  />
                </div>
              ) : null}
              {mobileAgentTab === 'config' ? (
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden pb-6">
                  <div className="shrink-0">
                    <ConfigFormatWithCopyRow
                      codeFormat={codeFormat}
                      onCodeFormatChange={setCodeFormat}
                      yamlText={yamlForTemplate(t)}
                      jsonText={jsonForTemplate(t)}
                    />
                  </div>
                  <CodeBlockWithLines
                    code={codeFormat === 'yaml' ? yamlForTemplate(t) : jsonForTemplate(t)}
                    codeFormat={codeFormat}
                    fillParent
                  />
                </div>
              ) : null}
            </div>
          </div>
          <StickyMobileActions>
            <button
              type="button"
              // onClick={goConfigure}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--text-h)] py-3.5 text-sm font-medium text-[var(--bg)] hover:opacity-95"
            >
              Next: Configure environment
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </StickyMobileActions>
        </div>
      )
    }

    if (selectedTemplate) {
      const t = selectedTemplate
      return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 space-y-4">
            <MobileQuickstartTitleActions showSaveAndTestRun={false} showStartOver={false} onStartOver={startOver} />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={closeTemplate}
                className="inline-flex w-fit items-center gap-1 text-sm font-medium text-[var(--text)] hover:text-[var(--text-h)]"
              >
                <ArrowLeft className="size-4" aria-hidden />
              </button>
              <h6 className="m-0 text-sm font-medium text-[var(--text-h)]">{t.title}</h6>
              <span className="rounded-md bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--text-dim)]">Template</span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text)] mb-4">{t.description}</p>
            <ConfigPreviewTabs value={workspaceMainTab} onChange={setWorkspaceMainTab} />
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-0.5">
            {workspaceMainTab === 'preview' ? (
              <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden pb-6">
                <div className="shrink-0">
                  <ConfigFormatWithCopyRow
                    codeFormat={codeFormat}
                    onCodeFormatChange={setCodeFormat}
                    yamlText={yamlForTemplate(t)}
                    jsonText={jsonForTemplate(t)}
                  />
                </div>
                <CodeBlockWithLines
                  code={codeFormat === 'yaml' ? yamlForTemplate(t) : jsonForTemplate(t)}
                  codeFormat={codeFormat}
                  fillParent
                />
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-0.5">
                <MobileDescribeSection prompt={prompt} setPrompt={setPrompt} />
              </div>
            )}
          </div>
          {workspaceMainTab === 'preview' ? (
            <StickyMobileActions>
              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={useTemplate}
                  className="flex-1 rounded-lg bg-[var(--text-h)] px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-amber-400"
                >
                  Use this template
                </button>
              </div>
            </StickyMobileActions>
          ) : null}

        </div>
      )
    }

    return (
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        <div className="shrink-0">
          <MobileQuickstartTitleActions showSaveAndTestRun={false} showStartOver={false} onStartOver={startOver} />
          <MobileCompactStepper activeIndex={0} />
          <MobileSegmented value={mobileSegment} onChange={setMobileSegment} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-0.5">
          {mobileSegment === 'describe' ? (
            <MobileDescribeSection prompt={prompt} setPrompt={setPrompt} />
          ) : (
            <div className="flex flex-col gap-3 pb-2">
              <div className="relative shrink-0">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-dim)]"
                  aria-hidden
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search templates"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-h)] outline-none placeholder:text-[var(--text-dim)]"
                />
              </div>
              <div className="space-y-2">
                {filtered.map((t) => (
                  <TemplateCard
                    key={t.title}
                    title={t.title}
                    description={t.description}
                    badge={t.badge}
                    icons={t.icons}
                    compact
                    onClick={() => openTemplate(t)}
                  />
                ))}
                {filtered.length === 0 ? (
                  <p className="py-6 text-center text-sm text-[var(--text-dim)]">No templates match your search.</p>
                ) : null}
              </div>
            </div>
          )}
        </div>


      </div>
    )
  }

  /* ——— Desktop ——— */
  if (agentCreated) {
    const t = agentSummary
    return (
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 pb-16">
        <DesktopQuickstartHeader
          stepper={<DesktopStepper activeIndex={0} />}
          showStartOver
          onStartOver={startOver}
          showSaveAndTestRun
        />
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <section className="flex flex-col space-y-4">
            <p className="rounded-xl bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--text)]">
              {t.description}
            </p>
            <div className="flex items-center gap-2 text-emerald-500">
              <Check className="size-5" strokeWidth={2.5} aria-hidden />
              <span className="font-medium text-[var(--text-h)]">Agent created</span>
            </div>
            <ApiAgentCallCard template={t} language={apiCallLanguage} onLanguageChange={setApiCallLanguage} />
            <button
              type="button"
              // onClick={goConfigure}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--text-h)] px-5 py-2.5 text-sm font-medium text-[var(--bg)] hover:opacity-95"
            >
              Next: Configure environment
              <ArrowRight className="size-4" aria-hidden />
            </button>

          </section>
          <section className="min-w-0 space-y-4">
            <AgentPreviewTabs value={agentPreviewTab} onChange={setAgentPreviewTab} />
            {agentPreviewTab === 'preview' ? (
              <QuickstartPreviewPlaceholder />
            ) : (


              <>
                <ConfigFormatWithCopyRow
                  codeFormat={codeFormat}
                  onCodeFormatChange={setCodeFormat}
                  yamlText={yamlForTemplate(t)}
                  jsonText={jsonForTemplate(t)}
                />
                <CodeBlockWithLines
                  code={codeFormat === 'yaml' ? yamlForTemplate(t) : jsonForTemplate(t)}
                  codeFormat={codeFormat}
                />
              </>
            )}
          </section>
        </div>
      </div>
    )
  }

  if (selectedTemplate) {
    const t = selectedTemplate
    return (
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 pb-16">
        <DesktopQuickstartHeader
          stepper={<DesktopStepper activeIndex={stepperIndex} />}
          showStartOver={false}
          onStartOver={startOver}
          showSaveAndTestRun={false}
        />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <DesktopDescribeSection prompt={prompt} setPrompt={setPrompt} />
          <section className="min-w-0 space-y-4 lg:col-span-7 border border-[var(--border)] border-[0.5px] p-4 rounded-md">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={closeTemplate}
                  className="inline-flex items-center gap-0.5 text-sm text-[var(--text)] hover:text-[var(--text-h)]"
                >
                  <ArrowLeft className="size-4" aria-hidden />

                </button>
                <h6 className="m-0 text-sm font-medium text-[var(--text-h)]">{t.title}</h6>
                <span className="rounded-md bg-[var(--surface)] px-2 py-0.5 text-xs text-[var(--text-dim)]">Template</span>
              </div>
              <button
                type="button"
                onClick={useTemplate}
                className="rounded-lg bg-[var(--text-h)] px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-amber-400"
              >
                Use this template
              </button>
            </div>
            <p className="text-sm text-[var(--text)]">{t.description}</p>
            <ConfigFormatWithCopyRow
              codeFormat={codeFormat}
              onCodeFormatChange={setCodeFormat}
              yamlText={yamlForTemplate(t)}
              jsonText={jsonForTemplate(t)}
            />
            <CodeBlockWithLines
              code={codeFormat === 'yaml' ? yamlForTemplate(t) : jsonForTemplate(t)}
              codeFormat={codeFormat}
              maxHeightClass="max-h-[min(70vh,560px)]"
            />
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-10 pb-16">
      <DesktopQuickstartHeader
        stepper={<DesktopStepper activeIndex={stepperIndex} />}
        showStartOver={false}
        onStartOver={startOver}
        showSaveAndTestRun={false}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <DesktopDescribeSection prompt={prompt} setPrompt={setPrompt} />

        <section className="min-w-0 space-y-4 lg:col-span-7 border border-[var(--border)] border-[0.5px] p-4 rounded-md">
          <h5 className="mb-5 text-sm font-medium tracking-wide text-[var(--text-h)]">Browse templates</h5>
          <div className="relative ">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-dim)]"
              aria-hidden
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-h)] outline-none placeholder:text-[var(--text-dim)]"
            />
          </div>



          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((t) => (
              <TemplateCard
                key={t.title}
                title={t.title}
                description={t.description}
                badge={t.badge}
                icons={t.icons}
                onClick={() => openTemplate(t)}
              />
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-[var(--text-dim)]">No templates match your search.</p>
          ) : null}
        </section>
      </div>
    </div>
  )
}
