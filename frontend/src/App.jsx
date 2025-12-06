import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import CartContextComp from './context/CartContextComp.jsx';
import AuthContextComp from './context/AuthContext.jsx';
import Auth from './components/Auth.jsx';
import Home from './components/Home.jsx';
import Orders from './components/Orders.jsx';
import Profile from './components/Profile.jsx';

function LoadingScreen() {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                color: '#d9e2f1',
            }}
        >
            Loading...
        </div>
    );
}

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return isAuthenticated ? children : <Navigate to="/" replace />;
}

function PublicRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return !isAuthenticated ? children : <Navigate to="/home" replace />;
}

function RootLayout() {
    return (
        <AuthContextComp>
            <CartContextComp>
                <Navigate to="/" replace />
            </CartContextComp>
        </AuthContextComp>
    );
}

function AuthLayout() {
    return (
        <AuthContextComp>
            <CartContextComp>
                <PublicRoute>
                    <Auth />
                </PublicRoute>
            </CartContextComp>
        </AuthContextComp>
    );
}

function ProtectedLayout() {
    return (
        <AuthContextComp>
            <CartContextComp>
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            </CartContextComp>
        </AuthContextComp>
    );
}

function OrdersLayout() {
    return (
        <AuthContextComp>
            <CartContextComp>
                <ProtectedRoute>
                    <Orders />
                </ProtectedRoute>
            </CartContextComp>
        </AuthContextComp>
    );
}

function ProfileLayout() {
    return (
        <AuthContextComp>
            <CartContextComp>
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            </CartContextComp>
        </AuthContextComp>
    );
}

export { AuthLayout, ProtectedLayout, OrdersLayout, ProfileLayout, RootLayout };
