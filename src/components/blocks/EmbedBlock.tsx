import { tinaField } from 'tinacms/dist/react'
import type { BlogBlocksEmbed } from '../../../tina/__generated__/types'

interface EmbedBlockProps {
  data: BlogBlocksEmbed
  tinaFieldName: string
}

/**
 * Extract tweet ID from Twitter/X URL
 */
function getTweetId(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/)
  return match ? match[1] : null
}

/**
 * Embed block for social media and external content
 * Note: Some embeds require client-side scripts to render
 */
export function EmbedBlock({ data, tinaFieldName }: EmbedBlockProps) {
  const renderEmbed = () => {
    switch (data.type) {
      case 'twitter': {
        const tweetId = getTweetId(data.url || '')
        if (!tweetId) {
          return (
            <a
              href={data.url || ''}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:underline"
            >
              View Tweet →
            </a>
          )
        }
        // Twitter embed - requires Twitter widget.js script
        return (
          <div className="twitter-embed">
            <blockquote className="twitter-tweet" data-theme="dark">
              <a href={data.url || ''}>View Tweet</a>
            </blockquote>
          </div>
        )
      }

      case 'tiktok':
        // TikTok embeds - show as link preview
        return (
          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
              🎵
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">TikTok Video</p>
              <a
                href={data.url || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:underline text-sm"
              >
                Watch on TikTok →
              </a>
            </div>
          </div>
        )

      case 'instagram':
        return (
          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
              📷
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-400">Instagram Post</p>
              <a
                href={data.url || ''}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:underline text-sm"
              >
                View on Instagram →
              </a>
            </div>
          </div>
        )

      case 'codepen':
        // CodePen embed URL transformation
        const codepenUrl = data.url?.replace('/pen/', '/embed/') || ''
        return (
          <iframe
            src={codepenUrl}
            className="w-full h-96 rounded-lg border-0"
            loading="lazy"
            allowFullScreen
            title="CodePen Embed"
          />
        )

      case 'generic':
      default:
        return (
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <a
              href={data.url || ''}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:underline flex items-center gap-2"
            >
              <span>🔗</span>
              <span>{data.url}</span>
            </a>
          </div>
        )
    }
  }

  return (
    <div
      className="my-8"
      data-tina-field={tinaField(data, 'url')}
    >
      {renderEmbed()}
    </div>
  )
}
