# Cookie Love Server 🍪

A backend application built with Fastify, Prisma, and PostgreSQL for managing user authentication and sharing inspirational phrases.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Development Tools](#development-tools)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

## 🔧 Prerequisites

Before running this application, make sure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **pnpm** (package manager)
- **Docker** and **Docker Compose**
- **Git**

### Installing Prerequisites

#### Node.js and pnpm

```bash
# Install Node.js (if not already installed)
# Visit https://nodejs.org/ or use a version manager like nvm

# Install pnpm globally
npm install -g pnpm
```

#### Docker

```bash
# For Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose

# For macOS
# Download Docker Desktop from https://docker.com

# For Windows
# Download Docker Desktop from https://docker.com
```

## 🚀 Getting Started

Follow these steps to get the backend application running on your local machine:

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd cookie-love-server
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start the Database

Make sure Docker is running, then start the PostgreSQL database:

```bash
docker compose up -d
```

This command will:

- Pull the PostgreSQL Docker image
- Start a PostgreSQL container with the following configuration:
  - **Host:** localhost
  - **Port:** 5432
  - **Database:** cookie-lucky
  - **Username:** docker
  - **Password:** docker

### 4. Environment Setup

Create a `.env` file in the root directory with the following content:

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/cookie-lucky"
```

### 5. Database Migration

Run the database migrations to create the required tables:

```bash
pnpm prisma migrate dev
```

This command will:

- Apply all pending migrations
- Generate the Prisma client
- Create the database schema

### 6. Seed the Database

Populate the database with sample data:

```bash
pnpm prisma db seed
```

This will create fake users, phrases, and shared phrases for testing purposes.

### 7. Start the Development Server

```bash
pnpm run dev
```

The server will start on `http://localhost:3333`

## 🗄️ Database Setup

### Database Schema

The application uses the following main entities:

- **Users:** Store user information and authentication data
- **Phrases:** Inspirational phrases that can be shared
- **SharedPhrases:** Track which phrases are shared between users
- **Tokens:** Handle password recovery tokens

### Database Management

#### View Database Data

```bash
pnpm prisma studio
```

This opens Prisma Studio in your browser at `http://localhost:5555`, where you can:

- View all tables and data
- Edit records directly
- Run queries

#### Reset Database

```bash
pnpm prisma migrate reset
```

#### Generate Prisma Client

```bash
pnpm prisma generate
```

## 🔧 Development Tools

### Available Scripts

```bash
# Start development server with hot reload
pnpm run dev

# Build the application
pnpm run build

# Start production server
pnpm start

# Database operations
pnpm prisma studio          # Open database viewer
pnpm prisma migrate dev      # Run migrations
pnpm prisma db seed          # Seed database
pnpm prisma migrate reset    # Reset database
```

### Docker Commands

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# View logs
docker compose logs

# Rebuild containers
docker compose up --build -d
```

## 📚 API Documentation

Once the server is running, you can access the API documentation at:

- **Swagger UI:** `http://localhost:3333/docs`

The application provides endpoints for:

- User authentication and registration
- Password recovery
- Phrase management
- Sharing phrases between users

## 🔍 Troubleshooting

### Common Issues

#### Port 3333 Already in Use

```bash
# Check what's using the port
sudo lsof -i:3333

# Kill the process (replace PID with actual process ID)
sudo kill -9 <PID>
```

#### Database Connection Issues

- Make sure Docker is running
- Verify the database container is up: `docker compose ps`
- Check if the port 5432 is available

#### Prisma Issues

```bash
# Reset Prisma client
pnpm prisma generate

# Reset database completely
pnpm prisma migrate reset
```

#### PNPM Issues

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Environment Variables

Make sure your `.env` file contains:

```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/cookie-lucky"
```

## 📁 Project Structure

```
cookie-love-server/
├── prisma/
│   ├── migrations/         # Database migrations
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding script
├── src/
│   └── http/
│       └── server.ts     # Main server file
├── docker-compose.yml    # Docker configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

---

**Happy coding! 🚀**

If you encounter any issues or have questions, please open an issue in this repository.
