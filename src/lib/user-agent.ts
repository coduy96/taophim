// Lightweight user-agent parser — no npm dependency

export interface ParsedUserAgent {
  device_type: 'mobile' | 'tablet' | 'desktop'
  browser_name: string | null
  os_name: string | null
}

export function parseUserAgent(ua: string | null): ParsedUserAgent {
  if (!ua) {
    return { device_type: 'desktop', browser_name: null, os_name: null }
  }

  // Device type detection
  const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(ua)
  const isMobile = /Mobile|iPhone|iPod|Android.*Mobile|Opera Mini|IEMobile/i.test(ua)
  const device_type: ParsedUserAgent['device_type'] = isTablet
    ? 'tablet'
    : isMobile
      ? 'mobile'
      : 'desktop'

  // Browser detection (order matters — check specific first)
  let browser_name: string | null = null
  if (/Edg\//i.test(ua)) browser_name = 'Edge'
  else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) browser_name = 'Opera'
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser_name = 'Chrome'
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser_name = 'Safari'
  else if (/Firefox\//i.test(ua)) browser_name = 'Firefox'

  // OS detection
  let os_name: string | null = null
  if (/Windows/i.test(ua)) os_name = 'Windows'
  else if (/iPhone|iPad|iPod/i.test(ua)) os_name = 'iOS'
  else if (/Mac OS|Macintosh/i.test(ua)) os_name = 'macOS'
  else if (/Android/i.test(ua)) os_name = 'Android'
  else if (/Linux/i.test(ua)) os_name = 'Linux'

  return { device_type, browser_name, os_name }
}
