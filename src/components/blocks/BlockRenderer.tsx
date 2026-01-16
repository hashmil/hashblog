import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import type { BlogBlocks } from '../../../tina/__generated__/types'

// Individual block components
import { ContentBlock } from './ContentBlock'
import { ImageBlock } from './ImageBlock'
import { VideoBlock } from './VideoBlock'
import { CodeBlock } from './CodeBlock'
import { QuoteBlock } from './QuoteBlock'
import { CalloutBlock } from './CalloutBlock'
import { EmbedBlock } from './EmbedBlock'
import { DividerBlock } from './DividerBlock'

interface BlockRendererProps {
  blocks: BlogBlocks[] | null | undefined
  parentField?: string
}

/**
 * Renders an array of content blocks with visual editing support
 * Each block gets a data-tina-field attribute for click-to-edit
 */
export function BlockRenderer({ blocks, parentField = 'blocks' }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="text-gray-500 italic py-8 text-center">
        No content blocks. Add some using the editor!
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        const blockField = `${parentField}.${index}`

        switch (block.__typename) {
          case 'BlogBlocksContent':
            return (
              <ContentBlock
                key={index}
                data={block}
                tinaFieldName={blockField}
              />
            )

          case 'BlogBlocksImage':
            return (
              <ImageBlock
                key={index}
                data={block}
                tinaFieldName={blockField}
              />
            )

          case 'BlogBlocksVideo':
            return (
              <VideoBlock
                key={index}
                data={block}
                tinaFieldName={blockField}
              />
            )

          case 'BlogBlocksCode':
            return (
              <CodeBlock
                key={index}
                data={block}
                tinaFieldName={blockField}
              />
            )

          case 'BlogBlocksQuote':
            return (
              <QuoteBlock
                key={index}
                data={block}
                tinaFieldName={blockField}
              />
            )

          case 'BlogBlocksCallout':
            return (
              <CalloutBlock
                key={index}
                data={block}
                tinaFieldName={blockField}
              />
            )

          case 'BlogBlocksEmbed':
            return (
              <EmbedBlock
                key={index}
                data={block}
                tinaFieldName={blockField}
              />
            )

          case 'BlogBlocksDivider':
            return (
              <DividerBlock
                key={index}
                data={block}
                tinaFieldName={blockField}
              />
            )

          default:
            return null
        }
      })}
    </div>
  )
}
