This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



## Getting Started

**First**, add environment variables
```
NEXT_PUBLIC_CMS_URL=http://localhost:1337
NEXT_PUBLIC_SELF_URL=http://localhost:3000

STRAPI_API_TOKEN=<add-later>
CMS_AUTH_TOKEN=<add-later> # token used to tell strapi request is authorized. See CMS readme for more.


# this is used if auth is enabled. For now, its used on test server to allow whitelisted users only.
NEXT_PUBLIC_ENABLE_AUTH=false
CLERK_SECRET_KEY=<key>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<p-key>

# Real user monitoring is used here. Usually only enabled in prod.
NEXT_PUBLIC_ENABLE_RUM=false
NEXT_PUBLIC_POSTHOG_KEY=<ph-key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

NEXT_PUBLIC_CHATBOT_ENDPOINT=http://localhost:4000/chat
```

The Strapi API token is obtainable through the StrapiCMS (Set that up first)

A walkthrough of how to obtain the api key is viewable through the cms `readme.md`


**Second**, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


**Third**, when running the built version of the site (ontained via `npm run build` and `npm run start`), ensure the CMS has a **webhook** pointing registered for this site (See CMS readme for how to set that up). This is necessary to let the site's caching system work properly.



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
