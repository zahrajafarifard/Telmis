# Telmis Platform

A comprehensive, full-stack web platform comprising four integrated applications: an administration panel, backend API, public website, and customer user panel. Built with modern technologies and industry best practices.

## Overview

Telmis is a complete e-commerce and job platform solution with role-based access, real-time notifications, and advanced features for both administrators and end users.

## Projects

### 🔧 [Backend API](back-end/)

Node.js and Express-based REST API with MySQL database integration, JWT authentication, and Socket.io real-time capabilities.

### 👨‍💼 [Admin Panel](admin/)

React-based administration dashboard for managing users, products, content, and system operations.

### 🌐 [Public Website](site/)

Next.js public-facing website with product catalog, shopping functionality, and responsive design.

### 👤 [User Panel](user-panel/)

Next.js user interface for customer account management, order tracking, and profile operations.

## Technology Stack

### Frontend

- **React 18** - UI framework
- **Next.js 15** - Server-side rendering and static generation
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **MySQL** - Relational database
- **JWT** - Authentication
- **Socket.io** - Real-time communication

### Additional

- **Axios** - HTTP client
- **Multer** - File upload handling
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL database

### Installation

Clone the repository:

```bash
git clone https://github.com/zahrajafarifard/Telmis.git
cd Telmis
```

Each project is independent with its own dependencies:

```bash
# Backend API
cd back-end
npm install
npm start

# Admin Panel (in new terminal)
cd admin
npm install
npm start

# Public Website (in new terminal)
cd site
npm install
npm run dev

# User Panel (in new terminal)
cd user-panel
npm install
npm run dev
```

## Project Structure

```
Telmis/
├── admin/          # React admin dashboard
├── back-end/       # Node.js REST API
├── site/           # Next.js public website
└── user-panel/     # Next.js user interface
```

## Features

- **Authentication & Authorization**: JWT-based secure authentication
- **Role-Based Access Control**: Admin and client roles
- **Real-Time Communication**: Socket.io for live notifications
- **File Management**: Secure file upload and preview
- **Responsive Design**: Mobile-first approach across all applications
- **Database Integration**: Robust MySQL integration with ORM
- **API Documentation**: RESTful API with comprehensive endpoints
- **State Management**: Centralized Redux store
- **Performance Optimization**: Code splitting and lazy loading

## Database

The backend uses MySQL with Sequelize ORM. Database migrations are included for schema setup.

For database configuration, see the [Backend README](back-end/README.md).

## Deployment

Each application can be deployed independently:

- **Backend**: Traditional Node.js hosting, Docker, or cloud platforms (AWS, Heroku)
- **Admin Panel**: Traditional hosting or containerized deployment
- **Public Website**: Vercel (recommended for Next.js), Docker, or traditional hosting
- **User Panel**: Vercel (recommended for Next.js), Docker, or traditional hosting

## Development

For detailed setup instructions for each project, refer to the README files in their respective folders.

## Contributing

When contributing, ensure:

- Code follows the existing style and conventions
- Changes are tested before submitting
- Documentation is updated as needed

## License

ISC

## Author

**Zahra Jafarifard**

---

For more information about each project, see the individual README files in their respective directories.
