import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

import App from './App.jsx';
import './index.css';

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Convex client banao

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkKey}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
