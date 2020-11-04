require('dotenv').config();
// console.log(`Bearer ${process.env.GRAPHQL_JWT}`);
module.exports = {
  client: {
    service: {
      name: 'margins-me-endpoint',
      url: 'http://ec2-34-232-69-157.compute-1.amazonaws.com:8080/graphql',
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