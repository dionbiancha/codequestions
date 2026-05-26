export type Contributor = {
  login: string
  avatar_url: string
  html_url: string
  contributions: number
}

export async function getContributors(): Promise<Contributor[]> {
  try {
    const res = await fetch(
      'https://api.github.com/repos/your-org/codequestions/contributors?per_page=30',
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data: Contributor[] = await res.json()
    return data.filter(c => !c.login.includes('[bot]'))
  } catch {
    return []
  }
}
