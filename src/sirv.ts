/**
 * Sirv API integration for uploading card SVGs and serving as PNG via CDN.
 * SVGs are uploaded to /ccrank/cards/{slug}.svg on Sirv.
 * Sirv auto-converts to PNG when ?format=png is appended to the URL.
 */

let cachedToken: { token: string; expires: number } | null = null;

async function getToken(clientId: string, clientSecret: string): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }

  const res = await fetch('https://api.sirv.com/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, clientSecret }),
  });

  if (!res.ok) {
    throw new Error(`Sirv auth failed: ${res.status}`);
  }

  const data = await res.json() as { token: string; expiresIn: number };
  cachedToken = {
    token: data.token,
    expires: Date.now() + (data.expiresIn - 60) * 1000, // refresh 60s early
  };
  return cachedToken.token;
}

export async function uploadCardSvg(
  slug: string,
  svgContent: string,
  clientId: string,
  clientSecret: string
): Promise<void> {
  const token = await getToken(clientId, clientSecret);
  const path = `/ccrank/cards/${slug}.svg`;

  const res = await fetch(`https://api.sirv.com/v2/files/upload?filename=${encodeURIComponent(path)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'image/svg+xml',
    },
    body: svgContent,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sirv upload failed: ${res.status} ${text}`);
  }
}

export function getCardPngUrl(slug: string): string {
  return `https://imgs.kloudle.com/ccrank/cards/${slug}.svg?format=png&w=1200&h=630`;
}
