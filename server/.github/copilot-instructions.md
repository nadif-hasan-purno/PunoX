# Developer Portfolio CMS - Backend Copilot Instructions

## Project Overview

Build a secure headless CMS backend for a developer portfolio website using Node.js, Express, and MongoDB.  
The backend will manage projects (case studies), blog posts, and documentation content, following established MERN architecture patterns and clean-code practices.

The system is content-first, validation-first, and designed for predictable publishing workflows (draft → preview → publish).

---

## Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Security**: CORS, cookie-parser, environment variables
- **Storage**: MongoDB + external object storage for media (future-ready)

---

## Project Structure

```

/server
├── config/
│   └── database.js            # MongoDB connection configuration
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── projectController.js   # Project (case study) logic
│   ├── postController.js      # Blog post logic
│   └── docController.js       # Documentation logic
├── middleware/
│   ├── auth.js                # JWT authentication middleware
│   ├── role.js                # Role-based access control
│   └── validation.js          # Request validation
├── models/
│   ├── User.js                # Admin/editor user schema
│   ├── Project.js             # Project schema
│   ├── Post.js                # Blog post schema
│   └── Doc.js                 # Documentation schema
├── routes/
│   ├── auth.js                # Authentication routes
│   ├── projects.js            # Project routes
│   ├── posts.js               # Blog routes
│   └── docs.js                # Docs routes
├── utils/
│   ├── validation.js          # Validation helpers
│   ├── slugify.js             # Slug generation helpers
│   └── constants.js           # Application constants
└── app.js                     # Main application file

````

---

## Database Schema Design

### User Schema

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "editor"],
    default: "editor",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// JWT generation
userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Password validation
userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
````

---

### Project Schema (Case Studies)

```javascript
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: String,
    stack: [String],
    tags: [String],
    body: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: Date,
  },
  { timestamps: true }
);
```

---

### Post Schema (Blog)

```javascript
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: String,
    tags: [String],
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: Date,
  },
  { timestamps: true }
);
```

---

### Doc Schema (Documentation)

```javascript
const docSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    section: { type: String, required: true },
    order: { type: Number, default: 0 },
    body: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishedAt: Date,
  },
  { timestamps: true }
);

docSchema.index({ section: 1, order: 1 });
```

---

## API Endpoints

### Authentication Routes (`/`)

| Method | Endpoint    | Description           | Auth Required |
| ------ | ----------- | --------------------- | ------------- |
| POST   | `/register` | Register admin/editor | No            |
| POST   | `/login`    | Login user            | No            |
| POST   | `/logout`   | Logout user           | Yes           |

---

### Project Routes (`/projects`)

| Method | Endpoint | Description            | Auth Required |
| ------ | -------- | ---------------------- | ------------- |
| GET    | `/`      | Get published projects | No            |
| GET    | `/:slug` | Get project by slug    | No            |
| POST   | `/`      | Create project         | Yes (Editor)  |
| PATCH  | `/:id`   | Update project         | Yes (Editor)  |
| DELETE | `/:id`   | Delete project         | Yes (Admin)   |

---

### Blog Routes (`/posts`)

| Method | Endpoint | Description         | Auth Required |
| ------ | -------- | ------------------- | ------------- |
| GET    | `/`      | Get published posts | No            |
| GET    | `/:slug` | Get post by slug    | No            |
| POST   | `/`      | Create post         | Yes (Editor)  |
| PATCH  | `/:id`   | Update post         | Yes (Editor)  |

---

### Docs Routes (`/docs`)

| Method | Endpoint | Description        | Auth Required |
| ------ | -------- | ------------------ | ------------- |
| GET    | `/`      | Get published docs | No            |
| GET    | `/:slug` | Get doc by slug    | No            |
| POST   | `/`      | Create doc         | Yes (Editor)  |
| PATCH  | `/:id`   | Update doc         | Yes (Editor)  |

---

## Implementation Code Structure

### Main Application File (`app.js`)

```javascript
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", require("./routes/auth"));
app.use("/projects", require("./routes/projects"));
app.use("/posts", require("./routes/posts"));
app.use("/docs", require("./routes/docs"));

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server running on port " + process.env.PORT);
    });
  })
  .catch(console.error);
```

---

## Authentication Middleware (`middleware/auth.js`)

```javascript
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("Please login");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).send("User not found");

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

module.exports = userAuth;
```

---

## Validation Utilities (`utils/validation.js`)

```javascript
exports.requireFields = (fields, body) => {
  for (const field of fields) {
    if (!body[field]) {
      throw new Error(`${field} is required`);
    }
  }
};
```

---

## Environment Variables

```env
PORT=5000
DB_CONNECTION_STRING=mongodb://localhost:27017/portfolio_cms
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=8h
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## Security Considerations

* Always hash passwords
* Validate all incoming data
* Use role-based access control
* Never expose draft content publicly
* Use HTTPS in production
* Keep secrets in environment variables
* Keep dependencies updated

This backend follows proven MERN architecture patterns and enforces clean, predictable, production-grade behavior.

```

---

### Why this is correct
- Same **structure**
- Same **tone**
- Same **level of detail**
- Same **Copilot-enforceable clarity**
- Matches your **actual coding habits**

If you want, next we can:
- Rewrite **frontend Copilot instructions in the same exact style**
- Generate **Slice-1 (Auth + Projects) step-by-step build plan**
- Convert this into a **starter repo template**

Just say the word.
```


