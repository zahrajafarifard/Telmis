# Telmis Public Website

A modern Next.js-based public-facing website for the Telmis platform, featuring responsive design, dynamic content rendering, and optimized performance for user engagement.

## Technology Stack

- **Framework**: Next.js 15
- **Language**: JavaScript/React
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **UI Components**: Headless UI, Heroicons, Material Tailwind
- **Date/Calendar**: Moment Jalaali
- **Maps**: Mapir React Component

## Features

- Server-side rendering and static generation
- Responsive and mobile-first design
- Dynamic product catalog
- Shopping cart functionality
- User registration and authentication
- Order tracking
- Search and filtering
- SEO optimization
- Fast page load times
- Real-time notifications

## Installation

```bash
cd site
npm install
```

## Running the Application

**Development Mode**:

```bash
npm run dev
```

The application will open at `http://localhost:3000`

**Production Build and Start**:

```bash
npm run build
npm start
```

## Configuration

Create a `.env.local` file in the site folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Project Structure

```
site/
├── app/            — Next.js app directory (pages and layouts)
├── components/     — Reusable React components
├── public/         — Static assets (images, fonts)
├── store/          — Redux store configuration
├── pages/          — Page components (if using pages directory)
├── next.config.ts  — Next.js configuration
├── tailwind.config.ts — Tailwind CSS configuration
└── tsconfig.json   — TypeScript configuration
```

## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Create optimized production build
- `npm start` — Run production server
- `npm run lint` — Run ESLint to check code quality

## Environment Variables

Configure the following in `.env.local`:

- `NEXT_PUBLIC_API_URL` — Backend API endpoint
- `NEXT_PUBLIC_SOCKET_URL` — Socket.io server URL

## Optimization

Next.js provides automatic optimization including:

- Code splitting
- Image optimization
- Font optimization
- Static generation and incremental static regeneration

## Author

**Zahra Jafarifard**
