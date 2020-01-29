import React from 'react'
import ReactDOM from 'react-dom'
import App from './frontend/App'
import * as serviceWorker from './frontend/serviceWorker'
import { Auth0Provider } from './react-auth0-spa'
import config from './auth_config.json'
import { createBrowserHistory } from 'history'
import './index.css'

const history = createBrowserHistory()

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    audience="https://polaris-api.com/"
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
