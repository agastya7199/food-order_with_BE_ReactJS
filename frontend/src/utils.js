export function calculateCartTotal(cartItems) {
    const initialValue = 0;
    const total = cartItems.reduce((acc, currentValue) => {
        const price =
            typeof currentValue.price === 'string'
                ? parseFloat(currentValue.price)
                : currentValue.price;
        return acc + currentValue.quantity * price;
    }, initialValue);
    return total.toFixed(2);
}
