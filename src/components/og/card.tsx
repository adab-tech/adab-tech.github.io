import { ImageResponse } from 'next/og'
import { WAVE_PATH } from './wave'

// 1200x630 social-preview card in the site's colours, shared by the site
// image and the per-post images: the /a/ monogram, the title, and the /a/
// waveform used across the business card and LinkedIn banner.
export const OG_SIZE = { width: 1200, height: 630 }

const INK = '#0B132B'
const GOLD = '#D4AF37'
const PARCH = '#FDFBF7'

export function ogCard({ kicker, title, footer }: { kicker: string; title: string; footer: string }) {
  const fontSize = title.length > 90 ? 46 : title.length > 55 ? 56 : 66
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px 56px',
          background: `radial-gradient(circle at 60% 30%, #111C3D 0%, ${INK} 45%, #050914 100%)`,
          color: PARCH,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 16,
              background: '#070C18',
              border: `3px solid ${GOLD}`,
              color: GOLD,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            /a/
          </div>
          <div style={{ display: 'flex', fontSize: 24, color: GOLD, letterSpacing: 4, textTransform: 'uppercase' }}>{kicker}</div>
        </div>
        <div style={{ display: 'flex', fontSize, fontWeight: 700, lineHeight: 1.15, maxWidth: 1040, marginTop: -40 }}>{title}</div>
        <svg
          width="1200"
          height="120"
          viewBox="0 0 1200 120"
          style={{ position: 'absolute', left: 0, bottom: 96 }}
        >
          <path d="M0,60 L1200,60" stroke={GOLD} strokeOpacity="0.15" strokeWidth="1.5" />
          <path d={WAVE_PATH} fill="none" stroke={GOLD} strokeWidth="3" strokeLinejoin="round" strokeOpacity="0.9" />
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#A1A1AA' }}>
          <span style={{ color: PARCH }}>Adamu Danjuma Abubakar</span>
          <span>{footer}</span>
        </div>
      </div>
    ),
    OG_SIZE,
  )
}
