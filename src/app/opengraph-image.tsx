import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Taophim - Nền tảng tạo video AI hàng đầu Việt Nam'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          backgroundImage: 'radial-gradient(ellipse at top, rgba(249, 115, 22, 0.15), transparent 50%)',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-200px',
            left: '-200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
          }}
        />
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          {/* Logo placeholder - using text for simplicity */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              T
            </div>
            <span
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '-2px',
              }}
            >
              Taophim
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: '600',
                color: 'white',
                textAlign: 'center',
              }}
            >
              Dịch vụ tạo video AI #1 Việt Nam
            </span>
            <span
              style={{
                fontSize: '24px',
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center',
                maxWidth: '800px',
              }}
            >
              Ghép mặt • Tạo video từ ảnh • Công nghệ AI tiên tiến
            </span>
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
              padding: '12px 24px',
              borderRadius: '50px',
              background: 'rgba(249, 115, 22, 0.15)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#f97316',
              }}
            />
            <span
              style={{
                fontSize: '18px',
                color: '#f97316',
                fontWeight: '500',
              }}
            >
              Tiết kiệm 90% thời gian và chi phí
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
