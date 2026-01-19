import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki'

let highlighterPromise: Promise<HighlighterGeneric<BundledLanguage, BundledTheme>> | null = null

export async function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import('shiki').then((shiki) =>
      shiki.createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: [
          'javascript',
          'typescript',
          'tsx',
          'jsx',
          'json',
          'html',
          'css',
          'python',
          'bash',
          'shell',
          'markdown',
          'yaml',
          'sql',
          'rust',
          'go',
        ],
      })
    )
  }
  return highlighterPromise
}

export async function highlightCode(code: string, language: string) {
  const highlighter = await getHighlighter()
  const langs = highlighter.getLoadedLanguages()
  
  if (!langs.includes(language as BundledLanguage)) {
    return null
  }

  return highlighter.codeToTokens(code, {
    lang: language as BundledLanguage,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  })
}
