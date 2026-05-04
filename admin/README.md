# Telmis Admin Panel

A comprehensive React-based administration dashboard for managing content, users, products, and system operations. Built with modern React practices and Redux state management.

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Create React App
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Document Handling**: React PDF, React Doc Viewer
- **UI Components**: React Select, React DatePicker2
- **Real-time**: Socket.io Client

## Features

- Admin authentication and authorization
- User and client management
- Product catalog administration
- Content and article management
- Order and invoice tracking
- File upload and management
- Real-time notifications
- Analytics and reporting
- Responsive dashboard UI
- Document preview capabilities

## Installation

```bash
cd admin
npm install
```

## Running the Application

**Development Mode**:

```bash
npm start
```

The application will open at `http://localhost:3000`

**Production Build**:

```bash
npm run build
```

## Configuration

Create a `.env` file in the admin folder:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Project Structure

```
admin/
├── public/         — Static assets
│   └── index.html — Entry HTML file
├── src/
│   ├── components/ — React components
│   ├── store/      — Redux store configuration
│   ├── assets/     — Images and static files
│   ├── App.js      — Main application component
│   ├── index.js    — Application entry point
│   └── index.css   — Global styles
├── tailwind.config.js
└── package.json
```

## Available Scripts

- `npm start` — Run development server
- `npm test` — Run tests
- `npm run build` — Create production build
- `npm run eject` — Eject from Create React App (irreversible)

## Performance

The admin panel includes optimized code splitting and lazy loading for better performance.

## Tailwind CSS

Tailwind CSS is configured for responsive design. Customize the configuration in `tailwind.config.js`.

## Author

**Zahra Jafarifard**
