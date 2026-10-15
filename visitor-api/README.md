# Portfolio visitor counter

This small Vercel function records one anonymous visitor per browser for the GitHub Pages portfolio. It stores an HMAC of the browser's random UUID, a selected role, and the country code supplied by Vercel. It does not store the raw UUID or IP address. A role change updates the role counts without adding a visitor.

The API is deployed separately because GitHub Pages serves static files and cannot write visitor data. The backing Upstash Redis resource is connected to the Vercel project and provides `KV_REST_API_URL` and `KV_REST_API_TOKEN`. Set `VISITOR_HASH_SALT` in the Vercel project's production environment. The GitHub Pages build sets `NEXT_PUBLIC_VISITOR_API_URL` to the deployed `/api/visit` URL.

To run locally, use `vercel dev` after `vercel env pull`. The function accepts POST JSON `{ "visitorId": "<UUID>", "role": "Recruiter" }`. `role` may be `null`. Its response contains `total`, `ordinal`, `roleCount`, and `countries`.
