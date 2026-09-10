import { NextResponse } from 'next/server'

const fallbackImage = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80'

const getImageUrlFromHtml = (html: string, sourceUrl: string) => {
  const match = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image)["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image)["']/i)

  if (!match) return null

  try {
    return new URL(match[1], sourceUrl).toString()
  } catch {
    return null
  }
}

const fetchImage = async (imageUrl: string) => {
  const response = await fetch(imageUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 MenuImageProxy/1.0' },
    redirect: 'follow',
    next: { revalidate: 3600 }
  })
  const contentType = response.headers.get('content-type') || ''

  if (contentType.startsWith('image/')) {
    return { response, contentType }
  }

  if (contentType.includes('text/html')) {
    const html = await response.text()
    const previewImageUrl = getImageUrlFromHtml(html, imageUrl)
    if (previewImageUrl) {
      const previewResponse = await fetch(previewImageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 MenuImageProxy/1.0' },
        redirect: 'follow',
        next: { revalidate: 3600 }
      })
      const previewContentType = previewResponse.headers.get('content-type') || ''
      if (previewContentType.startsWith('image/')) {
        return { response: previewResponse, contentType: previewContentType }
      }
    }
  }

  return null
}

export async function GET(request: Request) {
  const imageUrl = new URL(request.url).searchParams.get('url')

  if (!imageUrl) return NextResponse.redirect(fallbackImage)

  try {
    const parsedUrl = new URL(imageUrl)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return NextResponse.redirect(fallbackImage)
    }

    const result = await fetchImage(parsedUrl.toString())
    if (!result) return NextResponse.redirect(fallbackImage)

    return new NextResponse(result.response.body, {
      headers: {
        'Content-Type': result.contentType,
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch {
    return NextResponse.redirect(fallbackImage)
  }
}
