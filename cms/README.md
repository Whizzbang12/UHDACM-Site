# UHD ACM HeadlessCMS (Powered by Strapi)
Strapi allows UHD ACM to do dynamic content updates via a headless CMS, enabling seamless site management without altering the frontend code.

*Notes on how to obtain API key is available below*

## How CMS is connected with frontend
The CMS integrates with the frontend located in the `./site` directory through a webhook (`/api/CMSUpdate`). Content is fetched via HTTP GET requests, which include:
- URL parameters to specify the requested content.
- An authorization header for secure access.

This architecture ensures efficient and secure content updates, making site management easier than ever.

## Scripts Overview
**prereqs**<br/>
Before running any scripts, ensure that the Strapi CLI is installed globally. You can install it using the following command:

```bash
npm install -g strapi
```

You'll need the following env vars to run the strapi correctly
```env
# Server
HOST=0.0.0.0
PORT=1337
APP_KEYS=yourAppKey1,yourAppKey2,yourAppKey3,yourAppKey4
API_TOKEN_SALT=yourApiTokenSalt
ADMIN_JWT_SECRET=yourAdminJwtSecret
TRANSFER_TOKEN_SALT=yourTransferTokenSalt

# Database (SQLite default)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

---
### `develop`
Starts the app with autoReload for development.  
```bash
npm run develop # or yarn develop
```

> Note: first time running it will require you to setup a "admin account".

Read strapi docs to learn more.

### `start`
Runs the app without autoReload for production.  
```bash
npm run start # or yarn start
```

### `build`
Compiles the admin panel for deployment.  
```bash
npm run build # or yarn build
```

## Obtaining API Key
Once Strapi is running, go to the admin portal and go to settings (gear icon, left side), then press API Tokens (below overview), and obtain the read only key.

If you cannot view the token, regenerate it, and save that key in your env.

It will allow the frontend (and other services) to request data from the strapiCMS.

## Registering webhooks
A webhook for the site and vector-context-manager are **required**.

Set them up by opening the strapi dashboard, then going to `settings > webhooks`.

Once there
- add a webhook for `url`
- add header `Authorization` == `cmsAuthToken` (remember this value)
- add the events `create`, `update`, and `delete`
<br/>

ENSURE SITE and VECTOR-CONTEXT-MANAGER has the `CMS_AUTH_TOKEN` and `CMS_URL` environment variables set. They will respond 403 if the header value does not match.

 `http://localhost:3000/api/CMSUpdate` (site url), and . 

Do the same thing for `http://localhost:5500/update` (vector db manager).



## Types
There are many types.

### Collection Types
- event
- gallery
- organization
- person
- qna

### Single Types
- featured-event
- leadership
- page-about
- page-contact
- page-events
- page-galleries
- page-home
- page-join
- page-media
- page-qnas
- site-info
