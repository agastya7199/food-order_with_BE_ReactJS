import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await login(formData.email, formData.password);
            } else {
                if (!formData.fullName) {
                    setError('Full name is required');
                    setIsLoading(false);
                    return;
                }
                result = await register(formData.email, formData.password, formData.fullName);
            }

            if (result.success) {
                if (isLogin) {
                    navigate('/home');
                } else {
                    setFormData({
                        email: formData.email,
                        password: formData.password,
                        fullName: '',
                    });
                    setError('');
                    // After successful signup, switch to login mode
                    setIsLogin(true);
                }
            } else {
                setError(result.message || 'An error occurred');
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            email: '',
            password: '',
            fullName: '',
        });
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-8">
            <section className="bg-dark-bg p-12 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-gold font-lato text-2xl mb-8 text-center">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>

                {error && (
                    <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="control mb-4">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                required={!isLogin}
                                value={formData.fullName}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

                    <div className="control mb-4">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="control mb-6">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            required
                            value={formData.password}
                            onChange={handleInputChange}
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="button w-full py-3 mb-4 disabled:bg-gray-600 disabled:cursor-not-allowed font-bold"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        type="button"
                        onClick={toggleMode}
                        className="text-button underline text-sm"
                    >
                        {isLogin
                            ? "Don't have an account? Sign Up"
                            : 'Already have an account? Login'}
                    </button>
                </div>
            </section>
        </div>
    );
}
