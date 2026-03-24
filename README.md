# MFA Card Platform

A production-grade multi-device authentication platform combining passkeys, NFC smart cards, and distributed trust architecture.

## Architecture

- **Frontend**: Next.js 14+ with App Router, React, TypeScript, Tailwind CSS
- **Mobile**: React Native with TypeScript and NFC integration
- **Backend**: Node.js with Fastify and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for challenge storage
- **Deployment**: Vercel (web), Railway (API)

## Features

- **Primary Authentication**: WebAuthn/Passkeys
- **Physical Security**: NFC smart card security keys
- **Emergency Recovery**: Single-use recovery codes
- **Compatibility**: TOTP as backup fallback
- **Security**: Risk engine, device management, security events
- **Enterprise Ready**: Admin architecture and audit trails

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd mfa-card-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start development servers
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mfa_platform"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# WebAuthn
WEBAUTHN_RP_ID="localhost"
WEBAUTHN_RP_ORIGIN="http://localhost:3000"

# App URLs
WEB_URL="http://localhost:3000"
API_URL="http://localhost:3001"
```

## Development

```bash
# Start all services
npm run dev

# Start individual services
npm run api:dev   # Backend API on :3001
npm run web:dev   # Web app on :3000
npm run mobile:dev # React Native app

# Database operations
npm run db:studio  # Open Prisma Studio
npm run db:migrate # Run migrations
```

## Project Structure

```
mfa-card-platform/
├── apps/
│   ├── web/          # Next.js web application
│   ├── mobile/       # React Native mobile app
│   └── api/          # Fastify backend API
├── packages/
│   ├── db/           # Prisma database schema
│   ├── shared/       # Shared TypeScript types
│   ├── auth/         # Authentication utilities
│   ├── crypto/       # Cryptographic functions
│   └── cards/        # NFC card logic
├── docs/             # Documentation
└── README.md
```

## Security Model

The platform enforces **distributed trust** - no single device can be the only path into or out of an account:

1. **Multiple Factors**: Users must set up at least 2 independent recovery methods
2. **No Silent Replacement**: Security factors cannot be replaced without re-authentication
3. **Recovery Protection**: Recovery sessions are limited and require re-enrollment
4. **Device Management**: Full visibility and control over all authentication methods

## Deployment

### Web (Vercel)

```bash
# Deploy web app
cd apps/web
vercel --prod
```

### API (Railway)

```bash
# Deploy API
cd apps/api
railway up
```

## License

MIT License - see LICENSE file for details.
