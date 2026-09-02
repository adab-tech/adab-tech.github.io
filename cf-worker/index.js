/**
 * Contact-form relay for adamu.tech.
 *
 * The main site is a static export on GitHub Pages, so it has nowhere to
 * hold a Resend API key server-side. This Worker is that server: it takes
 * the contact form's POST, validates it, and calls Resend on the site's
 * behalf, keeping RESEND_API_KEY as an encrypted Worker secret that never
 * reaches the browser. CORS is locked to ALLOWED_ORIGIN (see wrangler.jsonc)
 * so no other site can use this as an open mail relay.
 */

const MAX_FIELD_LENGTH = 5000;

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://adamu.tech";

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(allowedOrigin) });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, allowedOrigin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body" }, 400, allowedOrigin);
    }

    const { name, email, subject, message, website } = payload || {};

    // Honeypot: a real browser never fills a field hidden via CSS from
    // sighted users; a bot's naive form-filler often does. Silently
    // pretend success so the bot doesn't learn to skip this field.
    if (website) {
      return jsonResponse({ success: true }, 200, allowedOrigin);
    }

    if (!name || !email || !message) {
      return jsonResponse({ error: "name, email, and message are required" }, 400, allowedOrigin);
    }
    if (
      String(name).length > MAX_FIELD_LENGTH ||
      String(email).length > MAX_FIELD_LENGTH ||
      String(message).length > MAX_FIELD_LENGTH
    ) {
      return jsonResponse({ error: "Field too long" }, 400, allowedOrigin);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: "Invalid email address" }, 400, allowedOrigin);
    }

    if (!env.RESEND_API_KEY) {
      return jsonResponse({ error: "Email relay is not configured yet" }, 503, allowedOrigin);
    }

    const escape = (s) =>
      String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Adamu Abubakar <contact@adamu.tech>",
        to: ["adamudanjuma1@outlook.com"],
        reply_to: email,
        subject: `[adamu.tech] ${subject ? escape(subject) : "New contact message"} — from ${escape(name)}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px;">
            <h2 style="margin: 0 0 16px;">New message from adamu.tech</h2>
            <p><strong>Name:</strong> ${escape(name)}</p>
            <p><strong>Email:</strong> ${escape(email)}</p>
            <p style="white-space: pre-wrap;">${escape(message)}</p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      return jsonResponse({ error: `Resend error: ${resendResponse.status} ${errText}` }, 502, allowedOrigin);
    }

    return jsonResponse({ success: true }, 200, allowedOrigin);
  },
};
