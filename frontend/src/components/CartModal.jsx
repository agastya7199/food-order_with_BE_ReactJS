import { useRef, forwardRef, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../context/CartContextComp';
import { calculateCartTotal } from '../utils.js';
import Checkout from './Checkout.jsx';

const CartModal = forwardRef(function ({}, ref) {
    const { items, handleUpdateItems } = useCart();
    const cartTotal = calculateCartTotal(items);
    const cartModal = useRef();
    const checkoutRef = useRef();
    useImperativeHandle(ref, () => {
        return {
            open: () => {
                cartModal.current.showModal();
            },
            close: () => {
                closeModalHandler();
            },
        };
    });

    function closeModalHandler() {
        cartModal.current.close();
    }

    function handleUpdateItemsOnCart(event) {
        const selectedElement = items.find((item) => item.id === event.currentTarget.dataset.id);
        handleUpdateItems(selectedElement, event.target.textContent);
    }

    function handleCheckout() {
        closeModalHandler();
        checkoutRef.current.open();
    }

    return createPortal(
        <>
            <dialog className="modal" ref={cartModal} onClose={closeModalHandler}>
                <section className="cart">
                    <h2>Your Cart</h2>
                    {!items.length ? (
                        <h3>No items in your cart.</h3>
                    ) : (
                        <div>
                            <ul>
                                {items.map((item) => {
                                    return (
                                        <li key={item.id} className="cart-item">
                                            <span>
                                                {item.name} - {item.quantity} x ${item.price}
                                            </span>
                                            <div className="cart-item-actions">
                                                <button
                                                    onClick={handleUpdateItemsOnCart}
                                                    data-id={item.id}
                                                >
                                                    -
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={handleUpdateItemsOnCart}
                                                    data-id={item.id}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <p className="cart-total">${cartTotal}</p>
                        </div>
                    )}
                    <div className="modal-actions">
                        <button className="text-button" onClick={closeModalHandler}>
                            Close
                        </button>
                        {items.length ? (
                            <button className="button" onClick={handleCheckout}>
                                Go to Checkout
                            </button>
                        ) : undefined}
                    </div>
                </section>
            </dialog>
            <Checkout ref={checkoutRef} cartTotal={cartTotal}></Checkout>
        </>,
        document.getElementById('root')
    );
});

export default CartModal;
