<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> RSS Feed</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          * {
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            color: #1f2937;
          }
          
          .header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .rss-info {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
          }
          
          .rss-info h2 {
            margin: 0 0 10px 0;
            font-size: 1.5rem;
          }
          
          .rss-info p {
            margin: 5px 0;
            opacity: 0.9;
          }
          
          .feed-url {
            background: rgba(255, 255, 255, 0.1);
            padding: 8px 12px;
            border-radius: 6px;
            font-family: Monaco, Consolas, monospace;
            word-break: break-all;
            margin-top: 10px;
          }
          
          h1 {
            color: #1f2937;
            margin: 0;
            font-size: 2.25rem;
            font-weight: 700;
          }
          
          .description {
            color: #6b7280;
            font-size: 1.1rem;
            margin: 10px 0 0 0;
          }
          
          .meta {
            color: #9ca3af;
            font-size: 0.9rem;
            margin-top: 10px;
          }
          
          .posts {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          
          .post {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 20px;
            transition: all 0.2s ease;
            background: #ffffff;
          }
          
          .post:hover {
            border-color: #3b82f6;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
            transform: translateY(-1px);
          }
          
          .post h3 {
            margin: 0 0 8px 0;
            font-size: 1.4rem;
            font-weight: 600;
          }
          
          .post h3 a {
            color: #1f2937;
            text-decoration: none;
          }
          
          .post h3 a:hover {
            color: #3b82f6;
          }
          
          .post-meta {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 12px;
          }
          
          .post-description {
            color: #4b5563;
            line-height: 1.6;
            margin: 0;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 0.9rem;
          }
          
          @media (max-width: 640px) {
            body {
              padding: 15px;
            }
            
            h1 {
              font-size: 1.8rem;
            }
            
            .post {
              padding: 18px;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="description"><xsl:value-of select="/rss/channel/description"/></p>
          <div class="meta">
            <strong>Website:</strong> <a href="{/rss/channel/link}"><xsl:value-of select="/rss/channel/link"/></a>
            <br/>
            <strong>Last Updated:</strong> <xsl:value-of select="/rss/channel/lastBuildDate"/>
          </div>
        </div>
        
        <div class="rss-info">
          <h2>📡 This is an RSS Feed</h2>
          <p>RSS feeds allow you to stay updated with new posts using feed readers like Feedly, NetNewsWire, or Inoreader.</p>
          <p><strong>To subscribe, copy this URL into your RSS reader:</strong></p>
          <div class="feed-url"><xsl:value-of select="/rss/channel/atom:link/@href" xmlns:atom="http://www.w3.org/2005/Atom"/></div>
        </div>

        <ul class="posts">
          <xsl:for-each select="/rss/channel/item">
            <li class="post">
              <h3><a href="{link}" target="_blank"><xsl:value-of select="title"/></a></h3>
              <div class="post-meta">
                Published: <xsl:value-of select="pubDate"/>
              </div>
              <p class="post-description"><xsl:value-of select="description"/></p>
            </li>
          </xsl:for-each>
        </ul>

        <div class="footer">
          <p>Generated by Astro RSS • <a href="{/rss/channel/link}">Visit Website</a></p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>