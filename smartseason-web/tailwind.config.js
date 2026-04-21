/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                gray: {
                    200: '#E5E7EB',
                },
            },
        },
    },
    plugins: [],
};