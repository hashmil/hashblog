import { tinaField } from 'tinacms/dist/react'
import type { BlogBlocksQuote } from '../../../tina/__generated__/types'

interface QuoteBlockProps {
  data: BlogBlocksQuote
  tinaFieldName: string
}

/**
 * Blockquote with optional author and source attribution
 */
export function QuoteBlock({ data, tinaFieldName }: QuoteBlockProps) {
  return (
    <blockquote
      className="my-8 border-l-4 border-pink-500 pl-6 py-2"
      data-tina-field={tinaField(data, 'quote')}
    >
      <p className="text-xl italic text-gray-200 mb-4" style={{ fontFamily: 'Libre Baskerville, serif' }}>
        "{data.quote}"
      </p>
      {(data.author || data.source) && (
        <cite className="text-gray-400 text-sm not-italic">
          {data.author && <span className="font-semibold">{data.author}</span>}
          {data.author && data.source && <span> — </span>}
          {data.source && <span>{data.source}</span>}
        </cite>
      )}
    </blockquote>
  )
}
