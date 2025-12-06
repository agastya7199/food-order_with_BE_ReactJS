import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Ensure address object exists with defaults
        const userData = {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            address: {
                street: user.address?.street || '',
                city: user.address?.city || '',
                postalCode: user.address?.postalCode || '',
            },
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        
        res.json(userData);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const { fullName, address } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (fullName) {
            user.fullName = fullName;
        }

        // Initialize address if it doesn't exist
        if (!user.address) {
            user.address = {
                street: '',
                city: '',
                postalCode: '',
            };
        }

        if (address) {
            if (address.street !== undefined) user.address.street = address.street || '';
            if (address.city !== undefined) user.address.city = address.city || '';
            if (address.postalCode !== undefined) user.address.postalCode = address.postalCode || '';
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            address: {
                street: updatedUser.address?.street || '',
                city: updatedUser.address?.city || '',
                postalCode: updatedUser.address?.postalCode || '',
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide current and new password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

