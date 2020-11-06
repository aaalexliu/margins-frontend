/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it

// FROM
// https://www.gatsbyjs.com/tutorial/authentication-tutorial/
// The above code (as well as the gatsby-plugin-create-client-paths plugin)
// updates the /app page at build time to add the matchPath parameter in the
// page object to make it so that the configured pages (in this case, everything
// after /app, like /app/dashboard or /app/user) can be navigated to by Reach Router.

// Without this configuration set up, a user that clicks on a link to <yoursite.com>/app/user
//  will instead be routed to the static /app page instead of the component or page you have
//  set up at /app/user.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/app/)) {
    page.matchPath = "/app/*"
    // Update the page.
    createPage(page)
  }
}