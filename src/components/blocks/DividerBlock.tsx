import { tinaField } from 'tinacms/dist/react'
import type { BlogBlocksDivider } from '../../../tina/__generated__/types'

interface DividerBlockProps {
  data: BlogBlocksDivider
  tinaFieldName: string
}

/**
 * Visual divider/separator block
 */
export function DividerBlock({ data, tinaFieldName }: DividerBlockProps) {
  const style = data.style || 'line'

  switch (style) {
    case 'dots':
      return (
        <div
          className="my-12 flex justify-center gap-2"
          data-tina-field={tinaField(data, 'style')}
        >
          <span className="w-2 h-2 rounded-full bg-gray-600" />
          <span className="w-2 h-2 rounded-full bg-gray-600" />
          <span className="w-2 h-2 rounded-full bg-gray-600" />
        </div>
      )

    case 'space':
      return (
        <div
          className="my-16"
          data-tina-field={tinaField(data, 'style')}
        />
      )

    case 'line':
    default:
      return (
        <hr
          className="my-12 border-t border-gray-700"
          data-tina-field={tinaField(data, 'style')}
        />
      )
  }
}
