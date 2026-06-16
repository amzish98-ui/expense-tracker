// SHA-256 hashing via the Web Crypto API. This demonstrates not storing plain-text
// passwords for the localStorage-based auth used in this demo. A real backend
// (e.g. Supabase Auth) would handle hashing and salting server-side.
export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
