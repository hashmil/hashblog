import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import type { BlogBlocks, PageBlocks } from '../../../tina/__generated__/types'

// Individual block components
import { ContentBlock } from './ContentBlock'
import { ImageBlock } from './ImageBlock'
import { VideoBlock } from './VideoBlock'
import { CodeBlock } from './CodeBlock'
import { QuoteBlock } from './QuoteBlock'
import { CalloutBlock } from './CalloutBlock'
import { EmbedBlock } from './EmbedBlock'
import { DividerBlock } from './DividerBlock'
import { SocialLinksBlock } from './SocialLinksBlock'

// Union type for all block types (Blog and Page collections share the same block structure)
type AnyBlock = BlogBlocks | PageBlocks

interface BlockRendererProps {
  blocks: AnyBlock[] | null | undefined
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

        // Handle both BlogBlocks* and PageBlocks* types
        const blockType = block.__typename?.replace(/^(Blog|Page)Blocks/, '')

        switch (blockType) {
          case 'Content':
            return (
              <ContentBlock
                key={index}
                data={block as any}
                tinaFieldName={blockField}
              />
            )

          case 'Image':
            return (
              <ImageBlock
                key={index}
                data={block as any}
                tinaFieldName={blockField}
              />
            )

          case 'Video':
            return (
              <VideoBlock
                key={index}
                data={block as any}
                tinaFieldName={blockField}
              />
            )

          case 'Code':
            return (
              <CodeBlock
                key={index}
                data={block as any}
                tinaFieldName={blockField}
              />
            )

          case 'Quote':
            return (
              <QuoteBlock
                key={index}
                data={block as any}
                tinaFieldName={blockField}
              />
            )

          case 'Callout':
            return (
              <CalloutBlock
                key={index}
                data={block as any}
                tinaFieldName={blockField}
              />
            )

          case 'Embed':
            return (
              <EmbedBlock
                key={index}
                data={block as any}
                tinaFieldName={blockField}
              />
            )

          case 'Divider':
            return (
              <DividerBlock
                key={index}
                data={block as any}
                tinaFieldName={blockField}
              />
            )

          case 'SocialLinks':
            return (
              <SocialLinksBlock
                key={index}
                data={block as any}
                tinaFieldName={blockField}
              />
            )

          default:
            console.warn('Unknown block type:', block.__typename)
            return null
        }
      })}
    </div>
  )
}
