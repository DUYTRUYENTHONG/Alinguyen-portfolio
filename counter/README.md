# Optional live visitor counter

The GitHub Pages site is static. Its visitor figures appear only after connecting this separate Cloudflare Worker and D1 database. The site never substitutes invented counts.

1. Create a D1 database and apply `schema.sql` with Wrangler.
2. Deploy `worker.js` with a `DB` D1 binding, a secret `VISITOR_SALT`, and `ALLOWED_ORIGINS=https://duytruyenthong.github.io,http://localhost:3000`.
3. Build the portfolio with `NEXT_PUBLIC_VISITOR_API_URL` set to the Worker URL.

Use a long random `VISITOR_SALT`; changing it starts new visitor identities. Cloudflare's country header supplies country codes. The database stores a salted hash of a browser-generated random ID, role, country code, and ordinal. It does not store an IP address. Browser storage can be cleared, so counts are approximate unique browsers, not unique people.
