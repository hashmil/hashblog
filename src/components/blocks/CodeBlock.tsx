import { tinaField } from 'tinacms/dist/react'
import type { BlogBlocksCode } from '../../../tina/__generated__/types'

interface CodeBlockProps {
  data: BlogBlocksCode
  tinaFieldName: string
}

/**
 * Code block with syntax highlighting (using CSS classes)
 * Note: For full syntax highlighting, integrate with Prism.js or Shiki
 */
export function CodeBlock({ data, tinaFieldName }: CodeBlockProps) {
  return (
    <div
      className="my-8"
      data-tina-field={tinaField(data, 'code')}
    >
      {data.filename && (
        <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg text-sm font-mono border-b border-gray-700">
          {data.filename}
        </div>
      )}
      <pre
        className={`bg-gray-900 p-4 overflow-x-auto ${data.filename ? 'rounded-b-lg' : 'rounded-lg'}`}
      >
        <code
          className={`text-gray-100 text-sm font-mono ${data.language ? `language-${data.language}` : ''}`}
        >
          {data.code}
        </code>
      </pre>
    </div>
  )
}
