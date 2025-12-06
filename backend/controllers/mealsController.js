import Meal from '../models/Meal.js';

// @desc    Get all meals
// @route   GET /api/meals
// @access  Public
export const getMeals = async (req, res) => {
    try {
        const meals = await Meal.find({}).sort({ createdAt: -1 });
        res.json(meals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

