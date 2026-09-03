import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './state/store';
import { Helmet } from 'react-helmet';
import { ToastProvider, ToastEventBridge } from './customer/components/Toast/ToastProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Helmet>
            <title>Loupe Jewellery | Premium Gold &amp; Diamond Jewellery Online</title>
            <meta name='description' content='Discover exquisite, handcrafted gold and diamond jewellery at Loupe Jewellery. Shop our premium collections of rings, earrings, necklaces, and bracelets. Enjoy secure transactions, lifetime buyback, and fast shipping.' />
            <meta name="keywords" content="buy gold jewellery online, diamond rings online, premium jewellery India, bespoke jewellery designs, diamond necklaces, Loupe Jewellery, luxury bracelets, engagement rings, BIS hallmarked gold, lab certified diamonds, custom jewellery design, 18k gold jewellery, silver jewellery online, timeless elegance jewellery" />
        </Helmet>
        <GoogleOAuthProvider clientId="697454810183-ob2h3lgvbd3knup1thqssb9hj99eg11n.apps.googleusercontent.com">
            <Provider store={store}>
                <ToastProvider>
                    <ToastEventBridge />
                    <App />
                </ToastProvider>
            </Provider>
        </GoogleOAuthProvider>
    </BrowserRouter>
);
