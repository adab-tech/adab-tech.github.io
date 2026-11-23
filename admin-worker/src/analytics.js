const DAY = 86_400_000

// The zone's HTTP analytics already collects this data at the edge. Filter
// down to successful public HTML requests on the site's primary hostname.
const query = `
  query Visits($zoneTag: string!, $day: filter!, $week: filter!) {
    viewer {
      zones(filter: { zoneTag: $zoneTag }) {
        day: httpRequestsAdaptiveGroups(limit: 1, filter: $day) {
          count
          sum { visits }
        }
        week: httpRequestsAdaptiveGroups(limit: 1, filter: $week) {
          count
          sum { visits }
        }
      }
    }
  }
`

const json = (data, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })

function publicPageFilter(from, to) {
  return {
    datetime_geq: from,
    datetime_lt: to,
    clientRequestHTTPHost: 'adamu.tech',
    requestSource: 'eyeball',
    edgeResponseContentTypeName: 'html',
    edgeResponseStatus_in: [200, 304],
    AND: [
      { clientRequestPath_neq: '/admin' },
      { clientRequestPath_notlike: '/admin/%' },
      { clientRequestPath_neq: '/api' },
      { clientRequestPath_notlike: '/api/%' },
    ],
  }
}

function totals(rows) {
  if (!Array.isArray(rows) || rows.length > 1) throw new Error('Unexpected analytics response')
  if (!rows.length) return { visits: 0, pageViews: 0 }

  const visits = rows[0]?.sum?.visits
  const pageViews = rows[0]?.count
  if (!Number.isSafeInteger(visits) || visits < 0 || !Number.isSafeInteger(pageViews) || pageViews < 0) {
    throw new Error('Invalid analytics counts')
  }
  return { visits, pageViews }
}

export async function readAnalytics(env) {
  const token = env.CLOUDFLARE_ANALYTICS_TOKEN
  const zoneTag = env.ANALYTICS_ZONE_ID
  if (!token || !zoneTag) return json({ error: 'Cloudflare Analytics is not configured for the admin server.' }, 503)

  const end = Date.now()
  const through = new Date(end).toISOString()
  try {
    const result = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: {
          zoneTag,
          day: publicPageFilter(new Date(end - DAY).toISOString(), through),
          week: publicPageFilter(new Date(end - 7 * DAY).toISOString(), through),
        },
      }),
      signal: AbortSignal.timeout(8000),
    })
    if (!result.ok) throw new Error('Analytics request failed')
    const { data, errors } = await result.json()
    const zone = data?.viewer?.zones?.[0]
    if (errors?.length || !zone) throw new Error('Analytics unavailable for this zone')
    return json({ through, day: totals(zone.day), week: totals(zone.week) })
  } catch {
    return json({ error: 'Cloudflare Analytics is unavailable. Try refreshing in a moment.' }, 502)
  }
}
