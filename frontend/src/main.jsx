import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthLayout, ProtectedLayout, OrdersLayout, ProfileLayout, RootLayout } from './App.jsx';
import './index.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthLayout />,
    },
    {
        path: '/home',
        element: <ProtectedLayout />,
    },
    {
        path: '/orders',
        element: <OrdersLayout />,
    },
    {
        path: '/profile',
        element: <ProfileLayout />,
    },
    {
        path: '*',
        element: <RootLayout />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
