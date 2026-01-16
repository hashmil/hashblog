import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import type { BlogBlocksContent } from '../../../tina/__generated__/types'

interface ContentBlockProps {
  data: BlogBlocksContent
  tinaFieldName: string
}

/**
 * Rich text content block with markdown support
 * Renders paragraphs, headings, lists, links, etc.
 */
export function ContentBlock({ data, tinaFieldName }: ContentBlockProps) {
  return (
    <div
      className="prose-minimal"
      data-tina-field={tinaField(data, 'body')}
    >
      <TinaMarkdown content={data.body} />
    </div>
  )
}
