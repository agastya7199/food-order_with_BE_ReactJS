import { useState, useEffect } from 'react';
import { getUserOrders } from '../utils/api.js';
import Header from './Header.jsx';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const ordersData = await getUserOrders();
                setOrders(ordersData);
                setError(null);
            } catch (err) {
                setError(err.message || 'Failed to load orders');
                console.error('Error fetching orders:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <section className="p-12 text-center text-text-light">
                    <h2 className="text-gold font-lato text-2xl mb-8">My Orders</h2>
                    <p>Loading orders...</p>
                </section>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <section className="p-12 text-center text-red-500">
                    <h2 className="text-gold font-lato text-2xl mb-8">My Orders</h2>
                    <p>Error: {error}</p>
                </section>
            </>
        );
    }

    return (
        <>
            <Header />
            <section className="p-12 max-w-6xl mx-auto">
                <h2 className="text-gold font-lato text-2xl mb-8 text-center">My Orders</h2>

                {orders.length === 0 ? (
                    <div className="text-center p-12 text-text-light bg-dark-bg rounded">
                        <p className="text-lg">No orders found.</p>
                        <p className="mt-4 opacity-80">
                            Start ordering to see your order history here!
                        </p>
                    </div>
                ) : (
                    <ul className="list-none p-0 m-0">
                        {orders.map((order) => (
                            <li
                                key={order._id}
                                className="bg-dark-bg rounded p-8 mb-6 border border-dark-border"
                            >
                                <div className="flex justify-between items-start mb-6 pb-4 border-b border-dark-border">
                                    <div>
                                        <h3 className="text-gold font-lato m-0 mb-2">
                                            Order #{order._id.slice(-8).toUpperCase()}
                                        </h3>
                                        <p className="text-text-light m-0 text-sm opacity-80">
                                            {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gold text-2xl font-bold m-0 font-lato">
                                            ${order.total}
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-text-light mb-4 font-lato">Items:</h4>
                                    <ul className="list-none p-0 m-0">
                                        {order.items.map((item, index) => (
                                            <li
                                                key={index}
                                                className="p-3 mb-2 bg-dark-input rounded flex justify-between items-center"
                                            >
                                                <span className="text-text-light">
                                                    {item.name} × {item.quantity}
                                                </span>
                                                <span className="text-gold font-bold">
                                                    $
                                                    {(
                                                        parseFloat(item.price) * item.quantity
                                                    ).toFixed(2)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-dark-input p-4 rounded">
                                    <h4 className="text-text-light mb-3 font-lato">
                                        Delivery Address:
                                    </h4>
                                    <div className="text-text-light leading-relaxed">
                                        <p className="m-1">
                                            <strong>{order.deliveryAddress.fullName}</strong>
                                        </p>
                                        <p className="m-1">{order.deliveryAddress.email}</p>
                                        <p className="m-1">{order.deliveryAddress.street}</p>
                                        <p className="m-1">
                                            {order.deliveryAddress.city},{' '}
                                            {order.deliveryAddress.postalCode}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </>
    );
}
