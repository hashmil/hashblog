import { tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import type { BlogBlocksCallout } from '../../../tina/__generated__/types'

interface CalloutBlockProps {
  data: BlogBlocksCallout
  tinaFieldName: string
}

const calloutStyles = {
  note: {
    icon: '📝',
    title: 'Note',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  tip: {
    icon: '💡',
    title: 'Tip',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500/10',
  },
  warning: {
    icon: '⚠️',
    title: 'Warning',
    borderColor: 'border-yellow-500',
    bgColor: 'bg-yellow-500/10',
  },
  important: {
    icon: '❗',
    title: 'Important',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500/10',
  },
}

/**
 * Callout box for notes, tips, warnings, and important information
 */
export function CalloutBlock({ data, tinaFieldName }: CalloutBlockProps) {
  const style = calloutStyles[data.type as keyof typeof calloutStyles] || calloutStyles.note
  const displayTitle = data.title || style.title

  return (
    <div
      className={`my-8 rounded-lg border-l-4 ${style.borderColor} ${style.bgColor} p-4`}
      data-tina-field={tinaField(data, 'content')}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{style.icon}</span>
        <span className="font-semibold text-white" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          {displayTitle}
        </span>
      </div>
      <div className="prose-minimal text-gray-200">
        <TinaMarkdown content={data.content} />
      </div>
    </div>
  )
}
