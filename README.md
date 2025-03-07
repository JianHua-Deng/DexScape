# DexScape

DexScape is a web client that allows you to browse, search, and read Manga and Webtoons by utilizing the Mangadex API. It provides a clean and intuitive interface to explore and enjoy your favorite series.

## Features

- **Browse Manga and Webtoons:** Explore a wide range of popular and trending titles.
- **Search Capabilities:** Find specific manga or authors quickly and easily.
- **Reader Interface:** Enjoy chapters with a responsive and user-friendly reading experience.
- **Bookmarking:** Save your favorite series for easy access later.
- **Latest Updates:** Stay informed about new chapter releases and updates.

## Screenshot

![DexScape Demo](https://i.imgur.com/OFt8KZO.png)

## Technology Stack

DexScape is built with the following tools:

- **React:** A JavaScript library for building dynamic user interfaces.
- **Supabase:** Handles authentication and backend operations using PostgreSQL, ensuring secure data management.
- **Mangadex API:** The source and backbone for fetching manga and webtoon data.
- **MUI Library:** A comprehensive React component library that provides a modern and customizable UI, ensuring a sleek and responsive user experience.
- **Vite:** A fast frontend tooling system with Hot Module Replacement (HMR).
- [Proxy/Caching Service](https://github.com/JianHua-Deng/Dexscape-Cache-Service): A service that proxies to Mangadex, intercepts the response, and caches it to AWS DynamoDB and S3 Bucket for optimized performance and reliability.

### Vite Plugins

This project uses a minimal React + Vite setup with the following plugins:

- `@vitejs/plugin-react`: Uses Babel for Fast Refresh.
- `@vitejs/plugin-react-swc`: Uses SWC for faster compilation and refresh.

The setup also includes ESLint rules for code quality.

## Usage

After starting the development server, open your browser and navigate to `http://localhost:5173` to begin exploring manga and webtoons.

## Credit & Disclaimer

This project is built completely based on MangaDex's API and is intended solely for learning purposes. All content is sourced from Mangadex, and DexScape does not host any manga or webtoon data itself.
