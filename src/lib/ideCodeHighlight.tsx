import { Fragment, type ReactNode } from 'react'

/** VS Code Dark+–style tokens */
const C = {
  key: '#9cdcfe',
  env: '#9cdcfe',
  flag: '#569cd6',
  keyword: '#c586c0',
  string: '#ce9178',
  default: '#d4d4d4',
  number: '#b5cea8',
  comment: '#6a9955',
  punct: '#d4d4d4',
} as const

let spanKey = 0
function span(text: string, color: string): ReactNode {
  if (!text) return null
  return (
    <span key={spanKey++} style={{ color }}>
      {text}
    </span>
  )
}

function resetSpanKeys() {
  spanKey = 0
}

function splitByRegex(
  s: string,
  re: RegExp,
  colorFor: (m: RegExpExecArray) => string,
): ReactNode[] {
  const out: ReactNode[] = []
  const flags = re.flags.includes('g') ? re.flags : `${re.flags}g`
  const rg = new RegExp(re.source, flags)
  let last = 0
  let m: RegExpExecArray | null
  while ((m = rg.exec(s)) !== null) {
    if (m.index > last) out.push(span(s.slice(last, m.index), C.default))
    out.push(span(m[0], colorFor(m)))
    last = m.index + m[0].length
  }
  if (last < s.length) out.push(span(s.slice(last), C.default))
  return out
}

function highlightEnvAndStringsInValue(tail: string): ReactNode[] {
  if (!tail) return []
  const nodes: ReactNode[] = []
  let i = 0
  while (i < tail.length) {
    const ch = tail[i]
    if (ch === '"' || ch === "'") {
      const q = ch
      let j = i + 1
      while (j < tail.length) {
        if (tail[j] === '\\' && j + 1 < tail.length) {
          j += 2
          continue
        }
        if (tail[j] === q) {
          j++
          break
        }
        j++
      }
      nodes.push(span(tail.slice(i, j), C.string))
      i = j
      continue
    }
    const envM = tail.slice(i).match(/^\$[A-Z][A-Z0-9_]*/)
    if (envM) {
      nodes.push(span(envM[0], C.env))
      i += envM[0].length
      continue
    }
    const nextQuote = (() => {
      const a = tail.indexOf('"', i)
      const b = tail.indexOf("'", i)
      if (a === -1) return b
      if (b === -1) return a
      return Math.min(a, b)
    })()
    const nextDollar = tail.indexOf('$', i)
    const ends = [nextQuote, nextDollar].filter((x) => x >= 0)
    const end = ends.length ? Math.min(...ends) : tail.length
    if (end > i) {
      nodes.push(span(tail.slice(i, end), C.default))
      i = end
    } else {
      break
    }
  }
  return nodes
}

function highlightYamlLine(line: string): ReactNode {
  const trimmed = line.trimStart()
  if (trimmed.startsWith('#')) {
    return span(line, C.comment)
  }
  const listM = line.match(/^(\s*)(-\s+)([A-Za-z0-9_.-]+)(\s*:\s*)(.*)$/)
  if (listM) {
    return (
      <>
        {span(listM[1] + listM[2], C.default)}
        {span(listM[3], C.key)}
        {span(listM[4], C.punct)}
        {highlightEnvAndStringsInValue(listM[5])}
      </>
    )
  }
  const m = line.match(/^(\s*)([A-Za-z0-9_.-]+)(\s*:\s*)(.*)$/)
  if (m) {
    return (
      <>
        {span(m[1], C.default)}
        {span(m[2], C.key)}
        {span(m[3], C.punct)}
        {highlightEnvAndStringsInValue(m[4])}
      </>
    )
  }
  return span(line, C.default)
}

function highlightJsonValueParts(s: string): ReactNode[] {
  if (!s.trim()) return [span(s, C.default)]
  const nodes: ReactNode[] = []
  let i = 0
  const ws = s.match(/^\s*/)
  if (ws?.[0]) {
    nodes.push(span(ws[0], C.default))
    i = ws[0].length
  }
  const rest = s.slice(i)
  const strM = rest.match(/^("(?:[^"\\]|\\.)*")/)
  if (strM) {
    nodes.push(span(strM[1], C.string))
    const after = rest.slice(strM[1].length)
    const tailM = after.match(/^(\s*)(,?\s*)(.*)$/)
    if (tailM) {
      nodes.push(span(tailM[1] + tailM[2], C.punct))
      if (tailM[3]) nodes.push(...highlightJsonValueParts(tailM[3]))
    }
    return nodes
  }
  const kwM = rest.match(/^(true|false|null)(\s*,?\s*)?(.*)$/)
  if (kwM) {
    nodes.push(span(kwM[1], C.flag))
    if (kwM[2]) nodes.push(span(kwM[2], C.punct))
    if (kwM[3]) nodes.push(...highlightJsonValueParts(kwM[3]))
    return nodes
  }
  const numM = rest.match(/^(-?\d+\.?\d*)(\s*,?\s*)?(.*)$/)
  if (numM) {
    nodes.push(span(numM[1], C.number))
    if (numM[2]) nodes.push(span(numM[2], C.punct))
    if (numM[3]) nodes.push(...highlightJsonValueParts(numM[3]))
    return nodes
  }
  if (/[{}[\]},]/.test(rest)) {
    return splitByRegex(rest, /[{}[\]},]/g, () => C.punct)
  }
  return highlightEnvAndStringsInValue(rest)
}

function highlightJsonLine(line: string): ReactNode {
  const trimmed = line.trim()
  if (trimmed.startsWith('//')) {
    return span(line, C.comment)
  }
  const km = line.match(/^(\s*)("(?:[^"\\]|\\.)*")(\s*:\s*)(.*)$/)
  if (km) {
    return (
      <>
        {span(km[1], C.default)}
        {span(km[2], C.key)}
        {span(km[3], C.punct)}
        {highlightJsonValueParts(km[4])}
      </>
    )
  }
  return <>{highlightJsonValueParts(line)}</>
}

const PY_KEYWORDS =
  /\b(import|from|as|def|class|return|await|async|try|except|finally|with|if|else|elif|for|in|while|break|continue|pass|raise|lambda|yield|and|or|not|is|None|True|False|global|nonlocal|assert)\b/g

const TS_KEYWORDS =
  /\b(import|export|from|const|let|var|function|return|async|await|new|typeof|instanceof|interface|type|enum|namespace|declare|abstract|readonly|public|private|protected|static|extends|implements|infer|as|satisfies|if|else|for|of|in|while|do|break|continue|switch|case|default|try|catch|finally|throw|void|null|undefined|true|false)\b/g

function highlightPlainCodeSeg(text: string, kw: RegExp): ReactNode[] {
  const kwParts = splitByRegex(text, kw, () => C.keyword)
  return kwParts.flatMap((el) => {
    if (typeof el === 'object' && el !== null && 'props' in el) {
      const p = (el as { props?: { style?: { color?: string }; children?: unknown } }).props
      if (p?.style?.color === C.default && typeof p.children === 'string') {
        return splitByRegex(p.children, /\b\d+\.?\d*\b/g, () => C.number)
      }
    }
    return [el]
  })
}

function highlightCodeLine(line: string, kw: RegExp): ReactNode {
  const hash = line.indexOf('#')
  const codePart = hash >= 0 ? line.slice(0, hash) : line
  const commentPart = hash >= 0 ? line.slice(hash) : ''

  const segments: { type: 'str' | 'code'; text: string }[] = []
  let pos = 0
  while (pos < codePart.length) {
    const c = codePart[pos]
    if (c === '"' || c === "'") {
      const q = c
      let j = pos + 1
      while (j < codePart.length) {
        if (codePart[j] === '\\' && j + 1 < codePart.length) {
          j += 2
          continue
        }
        if (codePart[j] === q) {
          j++
          break
        }
        j++
      }
      segments.push({ type: 'str', text: codePart.slice(pos, j) })
      pos = j
    } else {
      let k = pos + 1
      while (k < codePart.length && codePart[k] !== '"' && codePart[k] !== "'") k++
      segments.push({ type: 'code', text: codePart.slice(pos, k) })
      pos = k
    }
  }

  const out: ReactNode[] = []
  for (const seg of segments) {
    if (seg.type === 'str') out.push(span(seg.text, C.string))
    else out.push(...highlightPlainCodeSeg(seg.text, kw))
  }
  if (commentPart) out.push(span(commentPart, C.comment))
  return <>{out}</>
}

function highlightPythonLine(line: string): ReactNode {
  return highlightCodeLine(line, PY_KEYWORDS)
}

function highlightTsLine(line: string): ReactNode {
  return highlightCodeLine(line, TS_KEYWORDS)
}

function nextCurlTokenIndex(line: string, i: number): number {
  for (let j = i; j < line.length; j++) {
    if (line[j] === "'") return j
    if (line[j] === '$') return j
    if (line[j] === '-' && line[j + 1] === '-') return j
    if (
      line[j] === '-' &&
      j > 0 &&
      /\s/.test(line[j - 1]!) &&
      /[a-zA-Z]/.test(line[j + 1] || '') &&
      line[j + 1] !== '-'
    ) {
      return j
    }
  }
  return line.length
}

function highlightCurlLine(line: string): ReactNode {
  const nodes: ReactNode[] = []
  let i = 0
  while (i < line.length) {
    if (line[i] === "'") {
      let j = i + 1
      while (j < line.length) {
        if (line[j] === '\\' && j + 1 < line.length) {
          j += 2
          continue
        }
        if (line[j] === "'") {
          j++
          break
        }
        j++
      }
      nodes.push(span(line.slice(i, j), C.string))
      i = j
      continue
    }
    const rest = line.slice(i)
    const longF = rest.match(/^--[a-zA-Z][a-zA-Z-]*/)
    if (longF) {
      nodes.push(span(longF[0], C.flag))
      i += longF[0].length
      continue
    }
    const atToken = i === 0 || /\s/.test(line[i - 1]!)
    if (atToken) {
      const shortF = rest.match(/^-[a-zA-Z]\b/)
      if (shortF && !rest.startsWith('--')) {
        nodes.push(span(shortF[0], C.flag))
        i += shortF[0].length
        continue
      }
    }
    const envM = rest.match(/^\$[A-Z][A-Z0-9_]*/)
    if (envM) {
      nodes.push(span(envM[0], C.env))
      i += envM[0].length
      continue
    }
    const next = nextCurlTokenIndex(line, i)
    if (next > i) {
      nodes.push(span(line.slice(i, next), C.default))
      i = next
    } else {
      nodes.push(span(line[i], C.default))
      i++
    }
  }
  return <>{nodes}</>
}

export type IdeSnippetLanguage = 'curl' | 'python' | 'typescript'

export function highlightConfigCode(code: string, format: 'yaml' | 'json'): ReactNode {
  resetSpanKeys()
  const lines = code.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {format === 'yaml' ? highlightYamlLine(line) : highlightJsonLine(line)}
          {i < lines.length - 1 ? '\n' : null}
        </Fragment>
      ))}
    </>
  )
}

export function highlightAgentSnippet(code: string, lang: IdeSnippetLanguage): ReactNode {
  resetSpanKeys()
  const lines = code.split('\n')
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {lang === 'curl' ? highlightCurlLine(line) : lang === 'python' ? highlightPythonLine(line) : highlightTsLine(line)}
          {i < lines.length - 1 ? '\n' : null}
        </Fragment>
      ))}
    </>
  )
}
