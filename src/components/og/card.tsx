import { ImageResponse } from 'next/og'

// 1200x630 social-preview card in the site's colours, shared by the site
// image and the per-post images.
export const OG_SIZE = { width: 1200, height: 630 }

export function ogCard({ kicker, title, footer }: { kicker: string; title: string; footer: string }) {
  const fontSize = title.length > 90 ? 48 : title.length > 55 ? 58 : 68
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#0B1120',
          color: '#F8FAFC',
          borderTop: '12px solid #F59E0B',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#FBBF24', letterSpacing: 2, textTransform: 'uppercase' }}>
          {kicker}
        </div>
        <div style={{ display: 'flex', fontSize, fontWeight: 700, lineHeight: 1.15, maxWidth: 1040 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#A1A1AA' }}>
          <span>Adamu Danjuma Abubakar</span>
          <span>{footer}</span>
        </div>
      </div>
    ),
    OG_SIZE,
  )
}
