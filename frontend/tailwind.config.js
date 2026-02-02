/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f4ff',
                    100: '#d9e2ff',
                    200: '#bccaff',
                    300: '#8fa8ff',
                    400: '#5c78ff',
                    500: '#374bff',
                    600: '#2329ff',
                    700: '#1a1eff',
                    800: '#1619d1',
                    900: '#1a1ca5',
                    950: '#101165',
                },
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
