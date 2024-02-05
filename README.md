This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. First set the environment variables:
   Copy the `.env.example` file to `.env.local` and fill in the values.

2. Install the dependencies: `npm run install`

3. Run the development server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to use the app.

## Dependencies

This project uses the following frameworks and libraries:

- TypeScript [https://www.typescriptlang.org/]: As a statically typed language.
- Next.js [https://nextjs.org/]: As a React and CI/CD framework.
- Tailwind CSS [https://tailwindcss.com/]: As a utility-first CSS framework.
- DaisyUI [https://daisyui.com/]: As a component library for Tailwind CSS.
- React-query [https://react-query.tanstack.com/]: As a data-fetching library.
- Echarts [https://echarts.apache.org/]: As a charting library.

The app also depends on the followin 2 external APIs (see `.env.example` for the environment variables needed to use them):

- [finnhub.io](https://finnhub.io/): For general stock data.
- [polygon.io](https://polygon.io/): For historical price data.

## Architecture

The app is structured as follows:

- `pages`: We have 2 pages in the app, the blank index (`/`) and the stock-symbol page (`/[stock-symbol]`). Both pages display the exact same layout, the only difference, that the stock-symbol page automatically fill the input field with the symbol from the URL and fetches the stock data for the symbol, while the index page has a blank input field.
  - `_app`: The global providers and their configurations (`react-query`).
- `components`: We have 3 components in the app:
  - `ticker-container`: The container that holds the input field and the stock details components.
  - `stock-symbol-input`: The full-featured input field that can be used to search for stock symbols (also includes the logic to load the symbol from the URL inside the field).
  - `ticker-statistics`: The component that displays the ticker's statistics (open, close, high, low, etc).
  - `ticker-historical-price-graph`: The component that displays the ticker's historical price graph.
- `external-apis`: the fetching url composers for the external APIs.
