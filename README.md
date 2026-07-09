# Cinematic Video Editing Portfolio

A real anime-style cinematic portfolio for a video editor and graphic designer. The site showcases uploaded reels, long-form edits, Photoshop work, Illustrator work, thumbnails, posters, logos, and social media designs.

The project uses Supabase PostgreSQL for portfolio metadata and Cloudinary for video/image files. It does not use MongoDB, Mongoose, seeded demo projects, fake clients, or fake testimonials. Public pages show only real uploaded work from Supabase records. If no records exist, the site shows: "No projects uploaded yet."

## Stack

- Client: React, Vite, Tailwind CSS, React Router, GSAP ScrollTrigger, Lenis, Framer Motion, Axios
- Server: Node.js, Express, Supabase JS, Multer, Cloudinary, JWT, bcrypt
- Database: Supabase PostgreSQL table `portfolio_items`
- Media storage: Cloudinary folders for videos, images, and thumbnails
- Deployment targets: Vercel for `client/`, Render for `server/`

## Architecture

- Cloudinary stores the actual uploaded media files.
- Supabase stores portfolio metadata only.
- The frontend never connects to Supabase directly.
- The Supabase secret/service key is used only by the backend.
- Admin upload is protected by JWT.
- Public pages load portfolio data from backend API routes.

## Project Structure

```txt
client/
  public/
  src/
    components/
    contexts/
    data/
    hooks/
    pages/
    services/
server/
  src/
    config/
    controllers/
    middleware/
    routes/
    utils/
```

## Setup

Install dependencies from the project root:

```bash
npm install
```

## Environment Setup

Create `server/.env` from the `server` folder:

```powershell
Set-Location server
Copy-Item .env.example .env
Set-Location ..
```

Create `client/.env` from the project root:

```powershell
Copy-Item client/.env.example client/.env
```

Do not commit real `.env` files. They are ignored by Git.

Fill in `server/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=replace_with_long_random_secret
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=change_me_in_development
ADMIN_PASSWORD_HASH=

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SECRET_KEY=your_supabase_service_role_key

MAX_IMAGE_SIZE_MB=25
MAX_VIDEO_SIZE_MB=100
```

Manually replace the Cloudinary and Supabase placeholders with real values. For production, prefer `ADMIN_PASSWORD_HASH` instead of `ADMIN_PASSWORD`.

Fill in `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_MAX_IMAGE_SIZE_MB=25
VITE_MAX_VIDEO_SIZE_MB=100
VITE_CONTACT_EMAIL=
VITE_WHATSAPP_URL=
VITE_INSTAGRAM_URL=
VITE_YOUTUBE_URL=
VITE_BEHANCE_URL=
VITE_DRIBBBLE_URL=
```

Keep the `VITE_MAX_*` upload limits aligned with the backend `MAX_*` limits. They are public UI pre-checks only; Cloudinary and the backend still enforce the real upload limit. Leave optional contact/social values empty until you have real links. The public contact page only shows configured links.

## Supabase Table

Create the metadata table in the Supabase SQL Editor. The same script is saved in `supabase/schema.sql`.

```sql
create extension if not exists pgcrypto;

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text check (
    type in (
      'reel',
      'video',
      'photoshop',
      'illustrator',
      'thumbnail',
      'poster',
      'logo',
      'social'
    )
  ),
  category text,
  tools text[] default '{}',
  media_url text,
  thumbnail_url text,
  cloudinary_public_id text unique,
  thumbnail_public_id text,
  resource_type text,
  featured boolean default false,
  sort_order integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists portfolio_items_type_idx on public.portfolio_items (type);
create index if not exists portfolio_items_featured_idx on public.portfolio_items (featured);
create index if not exists portfolio_items_sort_idx on public.portfolio_items (sort_order, created_at desc);
```

Use the Supabase service role key as `SUPABASE_SECRET_KEY` on the backend only. Never add it to `client/.env`, Vercel frontend variables, or browser code.

## Cloudinary Folders

Uploaded media is stored in these Cloudinary folders:

- `portfolio/reels`
- `portfolio/videos`
- `portfolio/photoshop`
- `portfolio/illustrator`
- `portfolio/thumbnails`
- `portfolio/logos`
- `portfolio/posters`
- `portfolio/social`

Cloudinary stores files only. Supabase stores metadata such as title, type, tools, featured status, sort order, media URL, Cloudinary public ID, and thumbnail public ID.

## Run Locally

Start both apps:

```bash
npm run dev
```

Client: `http://localhost:5173`

Server: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

## Admin Login

Admin credentials come from environment variables:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` for local development, or
- `ADMIN_PASSWORD_HASH` for production

There is no registration route and no admin database table.

## API Routes

Auth:

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Portfolio:

- `GET /api/portfolio`
- `GET /api/portfolio/featured`
- `GET /api/portfolio/type/:type`
- `PUT /api/portfolio/:id`
- `DELETE /api/portfolio/:id`

Upload:

- `POST /api/upload`

Upload requests are protected and expect multipart fields:

- `file`: required image/video
- `thumbnail`: optional image
- `title`
- `description`
- `type`
- `category`
- `tools`
- `featured`
- `sort_order`

Supported portfolio types:

- `reel`
- `video`
- `photoshop`
- `illustrator`
- `thumbnail`
- `poster`
- `logo`
- `social`

## Admin Workflow

1. Log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
2. Upload a video or image from the admin dashboard.
3. The backend uploads media to Cloudinary.
4. The backend inserts the metadata row into Supabase.
5. Public pages refresh from the Supabase-backed API.
6. Deleting an item removes the Cloudinary media, optional Cloudinary thumbnail, and Supabase metadata row.

If Supabase insert fails after a Cloudinary upload, the backend cleans up the uploaded Cloudinary files to avoid orphan media.

## Deployment

### Vercel Client

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-render-api.onrender.com/api`
- Add only public contact/social variables as needed.
- Do not add `SUPABASE_SECRET_KEY` to Vercel.

### Render Server

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Set all server environment variables from `server/.env.example`
- Set `NODE_ENV=production`
- Set `CLIENT_URL` and `CORS_ORIGINS` to the deployed Vercel URL
- Add `SUPABASE_URL` and `SUPABASE_SECRET_KEY`
- Add Cloudinary credentials

### Supabase

- Create a Supabase project.
- Run the SQL table creation script above.
- Copy the project URL into `SUPABASE_URL`.
- Copy the service role key into `SUPABASE_SECRET_KEY` on Render only.

### Cloudinary

- Create a Cloudinary account.
- Copy cloud name, API key, and API secret into `server/.env` or Render server variables.
- Keep the API secret only on the backend.
- Upload real portfolio work from the protected admin dashboard.

## Performance And Security

- No fake project cards or seeded demo work
- Empty states are shown when no records exist
- Videos use thumbnails, `preload="none"`, and muted previews
- Public media is delivered through Cloudinary URLs
- Cloudinary free/current accounts may reject videos over 100MB; compress large edits or increase the Cloudinary account upload limit before raising `MAX_VIDEO_SIZE_MB`
- Supabase secret key stays backend-only
- Upload routes are protected by JWT
- JWT sessions are stored in an httpOnly cookie
- Admin password is compared with bcrypt when `ADMIN_PASSWORD_HASH` is used
- File types and upload size are validated
- Helmet, CORS, rate limiting, and centralized error handling are enabled
