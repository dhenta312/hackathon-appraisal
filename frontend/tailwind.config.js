/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'body-xs': ['10px', '14px'],
        'body-s': ['12px', '16px'],
        'body-m': ['14px', '20px'],
        'heading-xxs': ['14px', '20px'],
        'heading-m': ['24px', '28px'],
        'metric-l': ['28px', '32px'],
      },
      fontWeight: {
        'regular': 400,
        'medium': 500,
        'semibold': 600,
        'bold': 700,
      },
      colors: {
        brand: {
          50: '#e5eeff',
          100: '#ccddff',
          200: '#a3bef5',
          600: '#0044cd',
          700: '#003399',
          800: '#002266',
          900: '#001133',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          900: '#0f172a',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cefafe',
          600: '#0092b8',
          800: '#005f78',
          900: '#104e64',
        },
        red: {
          100: '#ffe2e2',
          800: '#9f0712',
        },
        green: {
          50: '#f0fdf4',
          600: '#00a63e',
          800: '#016630',
        },
        background: {
          primary: '#ffffff',
          secondary: '#f9fafb',
          tertiary: '#f3f4f6',
          disabled: '#e5e7eb',
        },
        text: {
          primary: '#101828',
          'primary-2': '#364153',
          secondary: '#475569',
          tertiary: '#64748b',
          muted: '#94a3b8',
          placeholder: '#94a3b8',
          'brand-1': '#0044cd',
          destructive: '#e7000b',
        },
        border: {
          secondary: '#e5e7eb',
          white: '#ffffff',
        },
      },
      borderRadius: {
        's': '8px',
        'm': '10px',
        'l': '12px',
      },
      spacing: {
        '50': '2px',
        '100': '4px',
        '150': '6px',
        '200': '8px',
        '250': '10px',
        '300': '12px',
        '400': '16px',
        '500': '20px',
        '600': '24px',
      },
    },
  },
  plugins: [],
};
