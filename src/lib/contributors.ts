export type Contributor = {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

export async function getContributors(): Promise<Contributor[]> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    }
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`
    }
    const res = await fetch(
      'https://api.github.com/repos/dionbiancha/codequestions/contributors?per_page=100',
      { headers, next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data: Contributor[] = await res.json()
    return data.filter(c => !c.login.includes('[bot]'))
  } catch {
    return []
  }
}
