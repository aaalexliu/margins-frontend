import React, {Fragment} from "react"
import { RouteComponentProps } from '@reach/router';

const NotFound: React.FC<RouteComponentProps> = () => (
  <Fragment>
    <h1>404: Not Found</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </Fragment>
)

export default NotFound
