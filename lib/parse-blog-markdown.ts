/**
 * Parse simple YAML frontmatter from markdown blog files in content/blog/.
 * Expects keys like title, description, date with quoted string values.
 */

export type ParsedBlogMarkdown = {
  meta: Record<string, string>
  body: string
}

export function parseBlogMarkdownFile(raw: string): ParsedBlogMarkdown {
  const text = raw.replace(/^\uFEFF/, '').trimStart()
  if (!text.startsWith('---')) {
    return { meta: {}, body: raw.trim() }
  }

  const lines = text.split('\n')
  if (lines[0].trim() !== '---') {
    return { meta: {}, body: raw.trim() }
  }

  const meta: Record<string, string> = {}
  let end = -1
  for (let j = 1; j < lines.length; j++) {
    if (lines[j].trim() === '---') {
      end = j
      break
    }
    const line = lines[j]
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    let val = line.slice(colon + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    meta[key] = val
  }

  if (end === -1) {
    return { meta: {}, body: raw.trim() }
  }

  const body = lines.slice(end + 1).join('\n').trim()
  return { meta, body }
}

/** Matches HR + FAQ heading used in content/blog/*.md */
const FAQ_SECTION_SPLIT = /\n---\s*\n## Frequently Asked Questions\s*/i

function parseFaqBoldBlocks(section: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []
  const re = /\*\*([^*]+)\*\*\s*\n+([\s\S]*?)(?=\n\*\*|$)/g
  let match
  while ((match = re.exec(section)) !== null) {
    const question = match[1].trim()
    const answer = match[2].trim().replace(/\s*\n\s*/g, ' ')
    if (question && answer) faqs.push({ question, answer })
  }
  return faqs
}

/**
 * Splits article body from the trailing FAQ block, parses Q/A into structured faqs for DB + JSON-LD.
 * Avoids duplicating FAQs (markdown section removed when faqs are populated).
 */
export function splitMarkdownBodyAndFaqs(markdownBody: string): {
  articleBody: string
  faqs: { question: string; answer: string }[]
} {
  const m = markdownBody.match(FAQ_SECTION_SPLIT)
  if (!m || m.index === undefined) {
    return { articleBody: markdownBody.trim(), faqs: [] }
  }
  const articleBody = markdownBody.slice(0, m.index).trimEnd()
  const faqSection = markdownBody.slice(m.index + m[0].length).trim()
  const faqs = parseFaqBoldBlocks(faqSection)
  return { articleBody, faqs }
}
