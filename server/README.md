# PunoX Server

Express.js backend API for PunoX portfolio CMS.

## Structure

```
server/
├── controllers/  # Request handlers (business logic)
├── models/       # Data models
├── routes/       # API route definitions
├── middleware/   # Custom middleware functions
├── config/       # Configuration files
├── index.js      # Server entry point
└── .env.example  # Environment variables template
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Run the server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Base URL
`http://localhost:5000`

### Available Routes
- `GET /` - Welcome message

## Technologies

- Express.js - Web framework
- CORS - Cross-origin resource sharing
- dotenv - Environment variable management
