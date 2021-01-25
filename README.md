# Margins Front End

All actively developed and deployed code is in `margins-me-gatsby`. I started with an SPA in `margins-me-react` and wrapped the SPA in a Gatsby site in order to get the benefits of Static Site Generation.

## 🧐 What's inside?

```text
gatsby-starter-blog-theme
├── apollo.config.js
├── codegen.yml
├── custom-typings
├── gatsby-browser.js
├── gatsby-config.js
├── gatsby-node.js
├── gatsby-ssr.js
├── package.json
├── public
├── tsconfig.json
├── src
│   ├── amplify
│   ├── apollo
│   ├── app
│     ├── __generated__
│     ├── components
│     ├── containers
│     ├── graphql
│     └── pages
│   ├── components
│   ├── containers
│   ├── images
│   ├── pages
│     ├── app.tsx
│   └── utils
```

**`codegen.yml`**: Config for GraphQL Code Generator, which automatically generates TypeScript Typings from my GrapQL endpoint.

**`custom-typings`**: To fix TypeScript errors when importing image files.

**`gatsby-*`**: Config and files to customize the build process, server side rendering, browser APIs. Check out `gatsby-config` for config and the plugins I use to build this site, and `gatsby-node` for the code necessary to wrap a React SPA in a Gatsby page.

### `./src`

This folder is split into Gatsby static pages and the dynamic React SPA. I did this mainly to keep the core of the app, as independent as possible, so I could possbily switch to another site generator or independently deploy it under a separate domain.

The components, containers and pages at the top level, except for the entrance point to the React SPA `app.tsx`, are all components that benefit from static generation, such as the landing page and authentication pages.

Two special folders are:

- `./amplify`: Config for AWS Cognito and all authentication logic
- `./apollo`: Config and cache policies for Apollo Client

### `./src/app`
The real meat of the site is in `./src/app`, which is a React SPA written with 100% function componenents. The organization of the app is largely guided by an excellent deep dive into [Client Side Architecture](https://www.apollographql.com/blog/apollo-client-client-side-architecture-basics/) by Khlalil Stemmler at Apollo.

- `components`: Presentation components that mainly consist of jsx and GraphQL queries
- `containers`: Components that contain the interaction logic to turn user events into GraphQL mutations. Currently also contains a lot of presentation code that needs to be refactored out.
- `graphql`: In the middle of centralizing GraphQL fragments and extracting GraphQl mutations and cache manipulation code into custom hooks.
- `pages`: Top-level containers that glue together components into a full page and are served at separate routes