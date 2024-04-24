# GraphQL-Cloudflare-Analytics

Uses GraphiQL to fetch data from Cloudflare Analytics API.

Authentication is done using GitHub OAuth.

## Setup

Configure the following environment variables:

- `CLOUDFLARE_ACCESS_TOKEN` - Cloudflare API Token
- `GITHUB_CLIENT_ID` - GitHub Client ID
- `GITHUB_CLIENT_SECRET` - GitHub Client Secret
- `GITHUB_USERS_AUTHORIZED` - Comma-separated list of authorized GitHub usernames
- `NEXTAUTH_SECRET` - Secret for NextAuth (e.g. created with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - URL of the NextAuth server (e.g. `https://example.com/api/auth`)
