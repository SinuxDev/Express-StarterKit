# Express TypeScript Starter Kit

A clean, minimal Express.js starter kit with TypeScript and MongoDB, built with layered architecture and SOLID principles.

## 📋 Overview

This starter kit provides a solid foundation for building scalable Node.js REST APIs with:

- **Express.js** - Fast, minimalist web framework
- **TypeScript** - Type-safe development
- **MongoDB** - NoSQL database with Mongoose ODM
- **Layered Architecture** - Separation of concerns (Repository → Service → Controller)
- **Base Classes** - Reusable abstract classes following SOLID principles
- **Error Handling** - Centralized exception handling

---

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Dev Tools**: ts-node-dev (hot reload)

---

## 📁 Project Structure

```
express-ts-starter/
├── src/
│ ├── app/
│ │ ├── controllers/
│ │ │ └── BaseController.ts # Abstract base controller
│ │ ├── services/
│ │ │ └── BaseService.ts # Abstract base service
│ │ ├── repositories/
│ │ │ └── BaseRepository.ts # Abstract base repository
│ │ ├── models/ # Mongoose models (empty for now)
│ │ ├── entities/ # Domain entities (empty for now)
│ │ └── exceptions/
│ │ └── AppException.ts # Custom error class
│ ├── config/
│ │ ├── env.ts # Environment configuration
│ │ └── database.ts # MongoDB connection (Singleton)
│ ├── start/
│ │ └── routes.ts # Centralized route definitions
│ ├── app.ts # Express app setup
│ └── server.ts # Server bootstrap
├── .env # Environment variables
├── package.json
└── tsconfig.json

```

```

## 🏗️ Architecture

### Layered Architecture

- **Controller Layer**: Handles HTTP requests/responses
- **Service Layer**: Business logic and validation
- **Repository Layer**: Data access and persistence
- **Model Layer**: Database schema definitions

### Base Classes (SOLID Principles)

#### BaseRepository

Generic data access layer with common CRUD operations:

- `findById(id)` - Find by ID
- `findOne(filter)` - Find single document
- `findAll(filter)` - Find multiple documents
- `create(data)` - Create new document
- `updateById(id, data)` - Update by ID
- `deleteById(id)` - Delete by ID

#### BaseService

Generic business logic layer:

- Wraps repository methods
- Adds error handling (throws `AppException` when not found)
- Provides consistent API for CRUD operations

#### BaseController

HTTP layer utilities:

- `asyncHandler()` - Async error wrapper
- `ok()` - 200 response helper
- `created()` - 201 response helper

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone or create the project**

mkdir express-ts-starter
cd express-ts-starter
npm init -y

2. **Install dependencies**

3. **Create `.env` file**

PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/express-starter-kit
NODE_ENV=development

4. **Start MongoDB**

5. **Run in development mode**

npm run dev

---

## 📜 Available Scripts

Development (with hot reload)
npm run dev

Build for production
npm run build

Run production build
npm start

---

## ⚙️ Configuration

### Environment Variables

| Variable    | Description               | Example                            |
| ----------- | ------------------------- | ---------------------------------- |
| `PORT`      | Server port               | `3000`                             |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/dbname` |
| `NODE_ENV`  | Environment               | `development` or `production`      |

### TypeScript Config

```

{
"compilerOptions": {
"target": "ES2020",
"module": "commonjs",
"rootDir": "./src",
"outDir": "./dist",
"strict": true,
"moduleResolution": "node16",
"esModuleInterop": true,
"skipLibCheck": true
}
}

```

```

---

## 📝 Adding a New Module

To add a new feature (e.g., `User`), follow this pattern:

### 1. Create Model (`src/app/models/User.ts`)

```

import { Schema, model } from "mongoose";

export interface IUser {
name: string;
email: string;
}

const userSchema = new Schema<IUser>({
name: { type: String, required: true },
email: { type: String, required: true, unique: true },
}, { timestamps: true });

export const UserModel = model<IUser>("User", userSchema);

```

```

### 2. Create Repository (`src/app/repositories/UserRepository.ts`)

```

import { BaseRepository } from "./BaseRepository";
import { IUser, UserModel } from "../models/User";

export class UserRepository extends BaseRepository<IUser> {
constructor() {
super(UserModel);
}

async findByEmail(email: string) {
return this.findOne({ email });
}
}

```

```

### 3. Create Service (`src/app/services/UserService.ts`)

```

import { BaseService } from "./BaseService";
import { IUser } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService extends BaseService<IUser> {
private userRepository: UserRepository;

constructor() {
const userRepository = new UserRepository();
super(userRepository);
this.userRepository = userRepository;
}

async createUser(name: string, email: string) {
return this.create({ name, email });
}
}

```

### 4. Create Controller (`src/app/controllers/UserController.ts`)

```

import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { UserService } from "../services/UserService";

export class UserController extends BaseController {
private userService: UserService;

constructor() {
super();
this.userService = new UserService();
}

create = this.asyncHandler(async (req: Request, res: Response) => {
const { name, email } = req.body;
const user = await this.userService.createUser(name, email);
return this.created(res, user);
});
}

```

```

### 5. Register Routes (`src/start/routes.ts`)

```

import { Router } from "express";
import { UserController } from "../app/controllers/UserController";

const router = Router();
const userController = new UserController();

router.post("/users", userController.create);

export default router;

```

```

## 🔒 Error Handling

```
Custom exceptions are handled globally:
// Throw from anywhere
throw new AppException("User not found", 404);

// Automatically converted to JSON response
{
"success": false,
"message": "User not found"
}

```

```

---

## 🎯 Design Principles

This starter follows **SOLID principles**:

- **S**ingle Responsibility - Each class has one job
- **O**pen/Closed - Base classes are extensible without modification
- **L**iskov Substitution - Child classes can replace parent classes
- **I**nterface Segregation - Base classes provide focused interfaces
- **D**ependency Inversion - Services depend on repository abstractions

---

## 🚧 Roadmap

- [ ] Add validation middleware (Zod/Joi)
- [ ] Add authentication (JWT)
- [ ] Add logging (Winston/Pino)
- [ ] Add API documentation (Swagger)
- [ ] Add testing setup (Jest/Vitest)
- [ ] Add Docker support

---

## 📄 License

MIT

---

## 🤝 Contributing

Feel free to fork and extend this starter kit for your needs!

```
