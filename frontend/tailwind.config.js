/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                gold: '#ffc404',
                'gold-hover': '#ffab04',
                'dark-bg': '#1a1a1a',
                'dark-card': '#1d1a16',
                'dark-input': '#2a2a2a',
                'dark-border': '#444',
                'text-light': '#d9e2f1',
                'text-muted': '#888',
            },
            fontFamily: {
                lato: ['Lato', 'sans-serif'],
                raleway: ['Raleway', 'sans-serif'],
            },
        },
    },
};
