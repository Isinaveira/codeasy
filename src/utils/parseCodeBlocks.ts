export interface ParsedCodeBlock {
  language: string;
  code: string;
  index: number;
}

const SUPPORTED_LANGUAGES = new Set(["html", "css", "js", "javascript"]);
const FENCED_BLOCK_RE = /```(\w+)\n([\s\S]*?)```/g;

export function parseCodeBlocks(markdown: string): ParsedCodeBlock[] {
  const blocks: ParsedCodeBlock[] = [];
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = FENCED_BLOCK_RE.exec(markdown)) !== null) {
    const language = match[1].toLowerCase();
    if (SUPPORTED_LANGUAGES.has(language)) {
      blocks.push({ language, code: match[2].trim(), index: idx });
      idx++;
    }
  }

  return blocks;
}
