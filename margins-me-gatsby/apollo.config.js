// ok right now this file is pretty useless since you're
// not using apollo cli

require('dotenv').config();
// console.log(`Bearer ${process.env.GRAPHQL_JWT}`);
module.exports = {
  client: {
    service: {
      name: 'margins-me-endpoint',
      url: 'https://api.margins.me/graphql',
      // optional headers
      headers: {
        authorization: `Bearer ${process.env.GRAPHQL_JWT}`
      },
      // optional disable SSL validation check
      skipSSLValidation: true,
      includes: ['./src/client-schema.js']
    }
  }
}