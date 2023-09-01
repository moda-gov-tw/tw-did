import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import './global';
import App from './app/app';
import { WagmiConfig } from 'wagmi';
import { getConfig } from './config';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <WagmiConfig config={getConfig()}>
      <App />
    </WagmiConfig>
  </StrictMode>
);
