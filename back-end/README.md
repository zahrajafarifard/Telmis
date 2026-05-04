# Telmis Backend API

A robust Node.js and Express-based REST API server for the Telmis platform, providing comprehensive backend services including authentication, data management, and API endpoints.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Real-time Communication**: Socket.io
- **HTTP Client**: Axios

## Features

- User authentication and authorization
- JWT-based session management
- Role-based access control (Admin, Client)
- RESTful API endpoints
- MySQL database with Sequelize ORM
- File upload and management
- Real-time notifications via Socket.io
- Comprehensive error handling
- CORS support

## Installation

```bash
cd back-end
npm install
```

## Configuration

Create a `config/config.json` file with your database credentials:

```json
{
  "development": {
    "username": "your_db_user",
    "password": "your_db_password",
    "database": "your_db_name",
    "host": "localhost",
    "dialect": "mysql"
  }
}
```

## Running the Server

**Development Mode** (with auto-reload):

```bash
npm start
```

This uses `nodemon` to automatically restart the server on file changes.

## API Documentation

The API includes the following main endpoints:

- `/api/auth/*` — Authentication (login, register, logout)
- `/api/admin/*` — Admin operations
- `/api/articles/*` — Article management
- `/api/products/*` — Product catalog
- `/api/carts/*` — Shopping cart operations
- `/api/clients/*` — Client management
- `/api/factors/*` — Billing/invoices
- `/api/jobs/*` — Job postings
- `/api/exchange/*` — Exchange operations

## Database Migrations

Run migrations using Sequelize:

```bash
npx sequelize-cli db:migrate
```

## Environment Variables

Configure the following environment variables:

- `NODE_ENV` — Development or production environment
- `PORT` — Server port (default: 5000)
- `DB_HOST` — Database host
- `DB_USER` — Database username
- `DB_PASSWORD` — Database password
- `DB_NAME` — Database name
- `JWT_SECRET` — Secret key for JWT signing

## Project Structure

```
back-end/
├── controllers/    — Request handlers
├── models/         — Database models
├── routes/         — API route definitions
├── migrations/     — Database migrations
├── config/         — Configuration files
├── uploads/        — Uploaded files directory
└── app.js         — Application entry point
```

## Author

**Zahra Jafarifard**

## License

ISC
