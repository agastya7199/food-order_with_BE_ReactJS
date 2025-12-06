import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getProfile, updateProfile, changePassword } from '../utils/api.js';
import Header from './Header.jsx';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        address: {
            street: '',
            city: '',
            postalCode: '',
        },
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError('');
                const data = await getProfile();
                setProfileData({
                    fullName: data.fullName || '',
                    email: data.email || '',
                    address: {
                        street: data.address?.street || '',
                        city: data.address?.city || '',
                        postalCode: data.address?.postalCode || '',
                    },
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError(err.message || 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleProfileInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'street' || name === 'city' || name === 'postalCode') {
            setProfileData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value,
                },
            }));
        } else {
            setProfileData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
        setError('');
        setSuccess('');
    };

    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setPasswordError('');
        setPasswordSuccess('');
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            const updatedData = await updateProfile(profileData.fullName, profileData.address);
            updateUser({ fullName: updatedData.fullName });
            setSuccess('Profile updated successfully!');
        } catch (err) {
            console.error('Profile update error:', err);
            const errorMsg = err.message || 'Failed to update profile';
            if (errorMsg.includes('404')) {
                setError(
                    'Backend server not found. Please ensure the backend server is running on port 3000.'
                );
            } else {
                setError(errorMsg);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsChangingPassword(true);
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match');
            setIsChangingPassword(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            setIsChangingPassword(false);
            return;
        }

        try {
            await changePassword(passwordData.currentPassword, passwordData.newPassword);
            setPasswordSuccess('Password changed successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            setPasswordError(err.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <section className="p-12 text-center text-text-light">
                    <h2 className="text-gold font-lato text-2xl">My Profile</h2>
                    <p>Loading profile...</p>
                </section>
            </>
        );
    }

    return (
        <>
            <Header />
            <section className="p-12 max-w-2xl mx-auto">
                <h2 className="text-gold font-lato text-2xl mb-8 text-center">My Profile</h2>

                {/* Profile Information Section */}
                <div className="bg-dark-bg rounded p-8 mb-8 border border-dark-border">
                    <h3 className="text-gold font-lato mb-6">Profile Information</h3>

                    {error && (
                        <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-600 text-white p-3 rounded mb-4 text-center">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleProfileSubmit}>
                        <div className="control mb-4">
                            <label htmlFor="profile-fullName">Full Name</label>
                            <input
                                type="text"
                                id="profile-fullName"
                                name="fullName"
                                required
                                value={profileData.fullName}
                                onChange={handleProfileInputChange}
                            />
                        </div>

                        <div className="control mb-4">
                            <label htmlFor="profile-email">Email (Username)</label>
                            <input
                                type="email"
                                id="profile-email"
                                name="email"
                                value={profileData.email}
                                disabled
                            />
                            <small className="text-text-muted text-sm">
                                Email cannot be changed
                            </small>
                        </div>

                        <div className="control mb-4">
                            <label htmlFor="profile-street">Street Address</label>
                            <input
                                type="text"
                                id="profile-street"
                                name="street"
                                value={profileData.address.street}
                                onChange={handleProfileInputChange}
                            />
                        </div>

                        <div className="control-row mb-4">
                            <div className="control flex-1 mr-4">
                                <label htmlFor="profile-city">City</label>
                                <input
                                    type="text"
                                    id="profile-city"
                                    name="city"
                                    value={profileData.address.city}
                                    onChange={handleProfileInputChange}
                                />
                            </div>
                            <div className="control flex-1">
                                <label htmlFor="profile-postalCode">Postal Code</label>
                                <input
                                    type="text"
                                    id="profile-postalCode"
                                    name="postalCode"
                                    value={profileData.address.postalCode}
                                    onChange={handleProfileInputChange}
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="button disabled:bg-gray-600 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Change Password Section */}
                <div className="bg-dark-bg rounded p-8 border border-dark-border">
                    <h3 className="text-gold font-lato mb-6">Change Password</h3>

                    {passwordError && (
                        <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
                            {passwordError}
                        </div>
                    )}

                    {passwordSuccess && (
                        <div className="bg-green-600 text-white p-3 rounded mb-4 text-center">
                            {passwordSuccess}
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit}>
                        <div className="control mb-4">
                            <label htmlFor="profile-currentPassword">Current Password</label>
                            <input
                                type="password"
                                id="profile-currentPassword"
                                name="currentPassword"
                                required
                                value={passwordData.currentPassword}
                                onChange={handlePasswordInputChange}
                            />
                        </div>

                        <div className="control mb-4">
                            <label htmlFor="profile-newPassword">New Password</label>
                            <input
                                type="password"
                                id="profile-newPassword"
                                name="newPassword"
                                required
                                minLength={6}
                                value={passwordData.newPassword}
                                onChange={handlePasswordInputChange}
                            />
                            <small className="text-text-muted text-sm">
                                Must be at least 6 characters
                            </small>
                        </div>

                        <div className="control mb-4">
                            <label htmlFor="profile-confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="profile-confirmPassword"
                                name="confirmPassword"
                                required
                                minLength={6}
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordInputChange}
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                className="button disabled:bg-gray-600 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isChangingPassword}
                            >
                                {isChangingPassword ? 'Changing...' : 'Change Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}
