/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          // Cores oficiais do Magic: The Gathering
          mtg: {
            black: '#000000',
            blue: '#0e68ab',
            green: '#00733e',
            red: '#d32029',
            white: '#f8f7f1',
            purple: '#883997',
            // Cores adicionais
            azorius: '#2b579a',    // Azul + Branco
            rakdos: '#d1423d',     // Preto + Vermelho
            simic: '#00a4a6',      // Azul + Verde
            orzhov: '#9b9b9b',     // Branco + Preto
            gruul: '#c75a1c',      // Vermelho + Verde
          },
          background: {
            DEFAULT: '#f8fafc',
            card: '#ffffff',
            sidebar: '#1e293b',
          }
        },
      },
    },
    plugins: [],
  }