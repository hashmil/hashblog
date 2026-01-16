import { tinaField } from 'tinacms/dist/react'
import type { BlogBlocksVideo } from '../../../tina/__generated__/types'

interface VideoBlockProps {
  data: BlogBlocksVideo
  tinaFieldName: string
}

/**
 * Extract YouTube video ID from various URL formats
 */
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Extract Vimeo video ID from URL
 */
function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

/**
 * Video block supporting YouTube, Vimeo, and local videos
 */
export function VideoBlock({ data, tinaFieldName }: VideoBlockProps) {
  const renderVideo = () => {
    switch (data.type) {
      case 'youtube': {
        const videoId = getYouTubeId(data.url || '')
        if (!videoId) return <p className="text-red-500">Invalid YouTube URL</p>
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            className="w-full aspect-video rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )
      }

      case 'vimeo': {
        const videoId = getVimeoId(data.url || '')
        if (!videoId) return <p className="text-red-500">Invalid Vimeo URL</p>
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}`}
            title="Vimeo video"
            className="w-full aspect-video rounded-lg"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )
      }

      case 'local':
        return (
          <video
            src={data.url || ''}
            className="w-full rounded-lg"
            controls
            autoPlay={data.autoplay || false}
            muted={data.autoplay || false}
            loop={data.loop || false}
            playsInline
          />
        )

      default:
        return <p className="text-gray-500">Unknown video type</p>
    }
  }

  return (
    <figure
      className="my-8"
      data-tina-field={tinaField(data, 'url')}
    >
      {renderVideo()}
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
