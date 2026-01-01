# PunoX

A portfolio with content management system for posting blogs, docs, projects...

## Project Structure

This project follows an MVC (Model-View-Controller) architecture with separate client and server folders:

```
PunoX/
├── client/          # Next.js frontend application
│   ├── app/         # Next.js App Router pages
│   ├── public/      # Static assets
│   └── ...
├── server/          # Express.js backend API
│   ├── controllers/ # Request handlers
│   ├── models/      # Data models
│   ├── routes/      # API routes
│   ├── middleware/  # Custom middleware
│   ├── config/      # Configuration files
│   └── index.js     # Server entry point
└── README.md
```

## Tech Stack

### Client
- **Framework:** Next.js (JavaScript)
- **Styling:** TailwindCSS
- **Linting:** ESLint

### Server
- **Framework:** Express.js
- **Runtime:** Node.js

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nadif-hasan-purno/PunoX.git
cd PunoX
```

2. Install client dependencies:
```bash
cd client
npm install
```

3. Install server dependencies:
```bash
cd ../server
npm install
```

### Running the Application

#### Development Mode

1. Start the server:
```bash
cd server
npm run dev
```
The server will run on `http://localhost:5000`

2. In a new terminal, start the client:
```bash
cd client
npm run dev
```
The client will run on `http://localhost:3000`

#### Production Mode

1. Build the client:
```bash
cd client
npm run build
npm start
```

2. Start the server:
```bash
cd server
npm start
```

## Features

- Modern portfolio website
- Content Management System (CMS)
- Blog posting capabilities
- Documentation management
- Project showcasing
- Responsive design with TailwindCSS

## Development

- Client runs on port 3000 by default
- Server runs on port 5000 by default
- Hot reload enabled for both client and server in development mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

