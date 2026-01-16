import { tinaField } from 'tinacms/dist/react'
import type { BlogBlocksImage } from '../../../tina/__generated__/types'

interface ImageBlockProps {
  data: BlogBlocksImage
  tinaFieldName: string
}

/**
 * Image block with optional caption
 */
export function ImageBlock({ data, tinaFieldName }: ImageBlockProps) {
  return (
    <figure
      className="my-8"
      data-tina-field={tinaField(data, 'src')}
    >
      <img
        src={data.src || ''}
        alt={data.alt || ''}
        className="w-full rounded-lg shadow-lg"
        loading="lazy"
      />
      {data.caption && (
        <figcaption
          className="text-center text-gray-400 text-sm mt-3 italic"
          data-tina-field={tinaField(data, 'caption')}
        >
          {data.caption}
        </figcaption>
      )}
    </figure>
  )
}
