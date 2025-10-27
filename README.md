# Simple Web Server

A TypeScript project that exposes product CRUD operations through both a Commander-powered CLI and an Express 5 API. Business logic lives in reusable services backed by MongoDB via Mongoose.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/SashaSohrabi/simple-web-server.git
cd simple-web-server

# Install dependencies
npm install
```

Create the environment files required by the CLI and HTTP server. At minimum provide your Mongo connection string:

```bash
echo "MONGO_URI=mongodb://localhost:27017" > .env.production.local
echo "PORT=3000" >> .env.production.local     # optional override
```

### Run the tools

- CLI (watch mode): `npm run dev`
- CLI (production build): `npm run start -- <command> [args]`
- HTTP server: `npm run start:server`

## 📁 Project Structure

```bash
.
├── package.json        # Scripts, deps, path aliases
├── src
│   ├── app.ts          # CLI entry (Commander commands)
│   ├── server.ts       # Express server using shared services
│   ├── services/       # Reusable product CRUD functions
│   ├── models/         # Mongoose models
│   └── db/             # MongoDB connection bootstrap
└── tsconfig.json       # TypeScript configuration
```

> `dist/` is generated automatically by `npm run build`.

## 🛠 Available Scripts

| Command              | Description                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`        | Run the CLI in watch mode with development env vars                            |
| `npm run build`      | Compile TypeScript output into `dist/`                                         |
| `npm run start`      | Build and invoke the compiled CLI (`dist/app.js`)                              |
| `npm run start:server` | Build and launch the Express API (`dist/server.js`) with production env vars |

> `prebuild`, `prestart`, and `prestart:server` run automatically to ensure fresh builds.

## 🔧 Key Features

- Strict TypeScript setup targeting ES2022 with native ES modules
- Shared service layer consumed by both CLI commands and HTTP routes
- Express 5 REST API with validation and MongoDB persistence via Mongoose
- Path aliases (`#services`, `#models`, etc.) for clean import statements

## 📦 Runtime Dependencies

- `commander` — CLI argument parsing
- `express` — HTTP API
- `mongoose` — MongoDB ODM
