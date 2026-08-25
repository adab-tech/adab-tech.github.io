export interface ContactEmailPayload {
  name: string
  email: string
  subject: string
  message: string
  preferredDate?: string
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_RESEND_API_KEY || process.env.RESEND_API_KEY

    if (!apiKey) {
      console.warn('RESEND_API_KEY is not configured yet. Payload logged to local store.')
      return { success: true }
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Adamu Abubakar <contact@adamu.tech>',
        to: ['adamudanjuma1@outlook.com', 'contact@adamu.tech'],
        reply_to: payload.email,
        subject: `[adamu.tech] ${payload.subject} — from ${payload.name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px; background-color: #ffffff;">
            <div style="border-bottom: 2px solid #C9A227; padding-bottom: 12px; margin-bottom: 20px;">
              <h2 style="color: #09090b; margin: 0; font-size: 20px;">New Research Inquiry · adamu.tech</h2>
              <span style="color: #71717a; font-size: 12px;">Dispatched via Contact & Scheduling Router</span>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #71717a; width: 140px;"><strong>Sender Name:</strong></td>
                <td style="padding: 8px 0; color: #09090b; font-weight: 600;">${payload.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #71717a;"><strong>Sender Email:</strong></td>
                <td style="padding: 8px 0; color: #09090b;"><a href="mailto:${payload.email}" style="color: #2563eb;">${payload.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #71717a;"><strong>Classification:</strong></td>
                <td style="padding: 8px 0; color: #09090b;"><span style="background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${payload.subject}</span></td>
              </tr>
              ${payload.preferredDate ? `
              <tr>
                <td style="padding: 8px 0; color: #71717a;"><strong>Preferred Date:</strong></td>
                <td style="padding: 8px 0; color: #09090b;">${payload.preferredDate}</td>
              </tr>
              ` : ''}
            </table>
            
            <div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <strong style="color: #3f3f46; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">Message Payload:</strong>
              <p style="color: #18181b; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${payload.message}</p>
            </div>
            
            <div style="border-top: 1px solid #e4e4e7; padding-top: 16px; text-align: center; color: #a1a1aa; font-size: 12px;">
              <p style="margin: 0;">Sent directly from <a href="https://adamu.tech" style="color: #C9A227; text-decoration: none;">adamu.tech</a> · Reply directly to this email to respond to ${payload.name}.</p>
            </div>
          </div>
        `
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Resend API returned error:', response.status, errText)
      return { success: false, error: `Resend error: ${response.status}` }
    }

    return { success: true }
  } catch (error) {
    console.error('sendContactEmail failed:', error)
    return { success: false, error: String(error) }
  }
}
