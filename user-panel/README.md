# Telmis User Panel

A full-featured Next.js user interface for customer interactions, account management, and transaction tracking. Designed for seamless user experience and mobile responsiveness.

## Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **State Management**: Redux, Redux Wrapper
- **Cookie Management**: Cookies-next
- **HTTP Client**: Axios
- **Date Picker**: React Multi Date Picker, React Modern Calendar Datepicker
- **Maps**: Leaflet, Mapir React Component, React Leaflet
- **Forms**: React Hook Form
- **Date Utilities**: Moment Jalaali

## Features

- Responsive user account dashboard
- Order history and tracking
- User profile management
- Address management
- Payment and transaction history
- Shopping cart integration
- Wishlist and favorites
- Notifications center
- Secure authentication with JWT
- Map integration for location-based services
- Advanced date picker for Persian calendar support

## Installation

```bash
cd user-panel
npm install
```

## Running the Application

**Development Mode**:

```bash
npm run dev
```

The application will open at `http://localhost:3001`

**Production Build and Start**:

```bash
npm run build
npm start
```

## Configuration

Create a `.env.local` file in the user-panel folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Project Structure

```
user-panel/
├── app/            — Next.js app directory (pages and layouts)
├── components/     — Reusable React components
├── public/         — Static assets (images, fonts)
├── store/          — Redux store configuration
├── tailwind.config.ts — Tailwind CSS configuration
├── tsconfig.json   — TypeScript configuration
└── server.js       — Custom server file
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

## Type Safety

The project uses TypeScript for type safety and better development experience. All components and utilities are properly typed.

## State Management

Redux is configured with Next.js Redux Wrapper for server-side rendering support. Persistent state is maintained using Redux Persist.

## Responsive Design

Built with Tailwind CSS breakpoints for responsive design across all device sizes.

## Authentication

The application uses JWT tokens stored in cookies for secure authentication. Tokens are automatically managed and refreshed.

## Deployment

The application can be deployed to:

- Vercel (recommended for Next.js)
- Docker containers
- Traditional Node.js hosting

## Author

**Zahra Jafarifard**

## License

ISC
