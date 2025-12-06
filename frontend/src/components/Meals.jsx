import { useState, useEffect } from 'react';
import { getMeals } from '../utils/api.js';
import { useCart } from '../context/CartContextComp.jsx';

export default function Meals() {
    const { handleAddItems } = useCart();
    const [mealsData, setMealsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                setIsLoading(true);
                const meals = await getMeals();
                setMealsData(meals);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to load meals');
                console.error('Error fetching meals:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeals();
    }, []);

    function addToCartHandler(event) {
        const selectedElement = mealsData.find((item) => item.id === event.target.dataset.id);
        if (selectedElement) {
            handleAddItems(selectedElement);
        }
    }

    if (isLoading) {
        return (
            <section className="p-12 text-center text-text-light">
                <p>Loading meals...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="p-12 text-center text-red-500">
                <p>Error: {error}</p>
            </section>
        );
    }

    return (
        <>
            <section>
                {mealsData && mealsData.length > 0 ? (
                    <ul
                        id="meals"
                        className="w-11/12 max-w-2xl list-none my-8 mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;"
                    >
                        {mealsData.map((item) => {
                            return (
                                <li className="meal-item" key={item.id || item._id}>
                                    <article>
                                        <img src={`/${item.image}`} alt={item.name}></img>
                                        <h3>{item.name}</h3>
                                        <p className="meal-item-price">${item.price}</p>
                                        <p className="meal-item-description">{item.description}</p>
                                        <div className="meal-item-actions">
                                            <button
                                                className="button"
                                                data-id={item.id || item._id}
                                                onClick={addToCartHandler}
                                            >
                                                Add to cart
                                            </button>
                                        </div>
                                    </article>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="p-12 text-center text-text-light">
                        <p>No meals available</p>
                    </div>
                )}
            </section>
        </>
    );
}
