import { tinaField } from 'tinacms/dist/react'
import { Twitter, Instagram, Linkedin, Github, Mail, Globe } from 'lucide-react'

interface SocialLink {
  platform: 'twitter' | 'instagram' | 'linkedin' | 'github' | 'email' | 'website'
  url: string
  label?: string
}

interface SocialLinksBlockProps {
  data: {
    title?: string
    links?: SocialLink[]
  }
  tinaFieldName: string
}

const iconMap = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  email: Mail,
  website: Globe,
}

/**
 * Social links block with platform icons
 */
export function SocialLinksBlock({ data, tinaFieldName }: SocialLinksBlockProps) {
  if (!data.links || data.links.length === 0) {
    return null
  }

  return (
    <div className="mt-16 pt-8" data-tina-field={tinaField(data, 'links')}>
      {data.title && (
        <h2
          className="text-2xl font-primary text-white mb-8"
          data-tina-field={tinaField(data, 'title')}
        >
          {data.title}
        </h2>
      )}

      <div className="space-y-4">
        {data.links.map((link, index) => {
          const Icon = iconMap[link.platform] || Globe
          const isEmail = link.platform === 'email'
          const href = isEmail && !link.url.startsWith('mailto:')
            ? `mailto:${link.url}`
            : link.url

          return (
            <div key={index} className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-[#a0a0a0]" />
              <a
                href={href}
                target={isEmail ? undefined : '_blank'}
                rel={isEmail ? undefined : 'noopener noreferrer'}
                className="font-text text-white hover:text-[#FF5682] transition-colors duration-200"
                style={{ borderBottom: 'dotted 1px #FF5682' }}
              >
                {link.label || link.url}
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
