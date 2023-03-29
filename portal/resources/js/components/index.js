import ReactDOM from "react-dom";
import React from "react";
import store from './store'
import {Provider} from "react-redux";
import i18n from './i18n';
import App from'./App';
import ErrorBoundary from "./ErrorBoundary";
import { init as initApm } from '@elastic/apm-rum'

const apm = initApm({
  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'LOCAL',
  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'https://apm.elastic.sting.dev',
  // Set service version (required for sourcemap feature)
  serviceVersion: '0.0',
})

if (document.getElementById("react-content")) {
  i18n.init().then(
    () =>
    ReactDOM.render(
        <ErrorBoundary>
          <Provider store={store}>
              <App/>
          </Provider>
        </ErrorBoundary>,
        document.getElementById("react-content")
    )
  );

}
