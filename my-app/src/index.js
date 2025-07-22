import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { CartProvider } from './CartContextProvider'; // Correct import path
import { ClerkProvider } from '@clerk/clerk-react'; // Ensure ClerkProvider is imported correctly

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key - Make sure REACT_APP_CLERK_PUBLISHABLE_KEY is set in your .env file");
}
ReactDOM.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <CartProvider>
        <App />
      </CartProvider>
    </ClerkProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
