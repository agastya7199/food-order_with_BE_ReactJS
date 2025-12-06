import { useState, useRef, forwardRef, useImperativeHandle, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContextComp';
import { createOrder } from '../utils/api.js';
import Success from './Success.jsx';

const Checkout = forwardRef(function Checkout({ cartTotal }, ref) {
    const checkoutRef = useRef();
    const { setCartItems, items } = useCart();
    const [userDetails, setUserDetails] = useState({
        fullName: '',
        email: '',
        street: '',
        postalCode: '',
        city: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    useImperativeHandle(ref, () => {
        return {
            open: () => {
                checkoutRef.current.showModal();
            },
            close: () => {
                handleCloseCheckout();
            },
        };
    });

    function handleCloseCheckout() {
        if (isSubmitted) {
            handleOkay();
            return;
        }
        checkoutRef.current.close();
    }

    function handleInputChange(event) {
        setUserDetails((prevUserDetails) => {
            const updatedUserDetails = {
                ...prevUserDetails,
                [event.target.id]: event.target.value,
            };
            return updatedUserDetails;
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const deliveryAddress = {
                fullName: userDetails.fullName,
                email: userDetails.email,
                street: userDetails.street,
                postalCode: userDetails.postalCode,
                city: userDetails.city,
            };

            await createOrder(items, cartTotal, deliveryAddress);
            setIsSubmitted(true);
        } catch (err) {
            setError(err.message || 'Failed to submit order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleOkay() {
        setCartItems([]);
        setIsSubmitted(false);
        setUserDetails({
            fullName: '',
            email: '',
            street: '',
            postalCode: '',
            city: '',
        });
        checkoutRef.current.close();
    }

    return createPortal(
        <dialog className="modal" ref={checkoutRef} onClose={handleCloseCheckout}>
            {!isSubmitted ? (
                <section className="cart">
                    <h2>Checkout</h2>
                    <p>Total Amount: ${cartTotal}</p>
                    {error && (
                        <div className="bg-red-600 text-white p-3 rounded mb-4 text-center">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="control">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                required
                                value={userDetails.fullName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="control">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={userDetails.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="control">
                            <label htmlFor="street">Street</label>
                            <input
                                type="text"
                                id="street"
                                required
                                value={userDetails.street}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="control-row">
                            <div className="control">
                                <label htmlFor="postalCode">Postal Code</label>
                                <input
                                    type="number"
                                    id="postalCode"
                                    required
                                    value={userDetails.postalCode}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="control">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    required
                                    value={userDetails.city}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="text-button"
                                type="button"
                                onClick={handleCloseCheckout}
                            >
                                Close
                            </button>
                            <button className="button" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Order'}
                            </button>
                        </div>
                    </form>
                </section>
            ) : (
                <Success handleOkay={handleOkay}></Success>
            )}
        </dialog>,
        document.getElementById('root')
    );
});

export default Checkout;
