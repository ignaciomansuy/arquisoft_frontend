import { Auth0Provider } from "@auth0/auth0-react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import App from './app';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Auth0Provider
        domain="arqui-soft-grupo09.us.auth0.com"
        clientId="VhpDVF1PSTqn6Xg4lzqivIURErz0OfZs"
        redirectUri={window.location.origin}
        audience="https://arqui-soft-grupo09.us.auth0.com/api/v2/"
        scope="read:current_user update:current_user_metadata"
      > 
        <App />
      </Auth0Provider>
    </PersistGate>
  </Provider>
);

reportWebVitals();