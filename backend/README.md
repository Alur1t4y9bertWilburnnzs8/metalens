# Metalens Backend

## Setup Requirements
**Important**: The current environment has Node.js v5.2.0 which is too old. You must use **Node.js v18** or higher.

## Installation
1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma Client (Required for types and DB connection):
   ```bash
   npx prisma generate
   ```
4. Push Database Schema to Supabase:
   ```bash
   npx prisma db push
   ```

## Configuration
1. Update `.env` with your Supabase credentials.
2. In Supabase Dashboard:
   - Create a Storage Bucket named `metalens-assets`.
   - Set it to **Public**.

## Running
```bash
npm run start:dev
```

## API Features
- **Auth**: `POST /auth/sync-profile` (Sync Auth user to Profile table)
- **Upload**: `POST /upload` (Uploads to Supabase, generates Thumbnail)
- **Community**: `GET /community/feed` (Paginated public works)
