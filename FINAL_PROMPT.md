# Final Project Prompt

Copy and paste this prompt at the start of a new Codex/chat session to build or recreate this project result.

```txt
You are Codex acting as a senior full-stack developer, senior React developer, UI/UX designer, creative anime-style portfolio designer, GSAP ScrollTrigger expert, Tailwind CSS expert, Cloudinary upload expert, Supabase PostgreSQL backend developer, security-focused developer, web performance optimizer, responsive design expert, and production deployment engineer.

Project name:
Cinematic Video Editing Portfolio

Goal:
Build and polish a real professional anime-style cinematic portfolio website for a video editor and graphic designer.

Important:
- Do not rebuild unrelated parts from scratch if an existing project is present.
- Edit the existing code directly.
- Do not add MongoDB.
- Do not add Mongoose.
- Do not add fake demo projects.
- Do not add fake testimonials.
- Do not add fake client names.
- Public pages must show only real uploaded portfolio work.
- If no uploads exist, show a clean empty state: "No projects uploaded yet."
- Keep backend API routes, admin auth, Cloudinary upload, and Supabase metadata working.

Tech stack:
- Frontend: React, Vite, Tailwind CSS, React Router, GSAP ScrollTrigger, Lenis, Framer Motion, Axios, lucide-react
- Backend: Node.js, Express, Multer, Cloudinary, Supabase JS, JWT, bcrypt
- Database: Supabase PostgreSQL only
- Media storage: Cloudinary only
- No MongoDB
- No Mongoose

Architecture:
- Cloudinary stores uploaded images/videos.
- Supabase PostgreSQL stores portfolio metadata in `public.portfolio_items`.
- Frontend never talks to Supabase directly.
- Supabase service role key stays backend-only.
- Admin credentials come only from environment variables.
- There is no registration route and no admin users table.
- JWT sessions use secure httpOnly cookies.
- Upload routes are protected.

Required root setup:
- Workspace structure with `client/`, `server/`, and `supabase/`
- Root `package.json` must support:
  - `npm install`
  - `npm run dev`
  - `npm run build`
  - `npm run lint`
- `npm run dev` must start both client and server.

Environment files:
Create and maintain these examples:

`server/.env.example`:
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

`client/.env.example`:
VITE_API_URL=http://localhost:5000/api
VITE_MAX_IMAGE_SIZE_MB=25
VITE_MAX_VIDEO_SIZE_MB=100
VITE_CONTACT_EMAIL=
VITE_CONTACT_PHONE=
VITE_WHATSAPP_URL=
VITE_INSTAGRAM_URL=
VITE_YOUTUBE_URL=
VITE_BEHANCE_URL=
VITE_DRIBBBLE_URL=

`.gitignore` must ignore:
.env
.env.local
server/.env
client/.env

Backend requirements:
1. Load `server/.env` before importing the app/server modules.
2. Validate required environment variables on startup with clear errors:
   - JWT_SECRET
   - ADMIN_EMAIL
   - ADMIN_PASSWORD or ADMIN_PASSWORD_HASH
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - SUPABASE_URL
   - SUPABASE_SECRET_KEY
3. Use environment-variable admin login:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD` for development
   - `ADMIN_PASSWORD_HASH` for production
4. Auth routes:
   - POST `/api/auth/login`
   - POST `/api/auth/logout`
   - GET `/api/auth/me`
5. Portfolio routes:
   - GET `/api/portfolio`
   - GET `/api/portfolio/featured`
   - GET `/api/portfolio/type/:type`
   - PUT `/api/portfolio/:id`
   - DELETE `/api/portfolio/:id`
6. Upload route:
   - POST `/api/upload`
   - Protected by JWT
   - Multipart fields:
     - `file`: required image/video
     - `thumbnail`: optional image
     - `title`
     - `description`
     - `type`
     - `category`
     - `project_date`: optional YYYY-MM-DD
     - `tools`
     - `featured`
     - `sort_order`
7. Supported portfolio types:
   - reel
   - video
   - photoshop
   - illustrator
   - thumbnail
   - poster
   - logo
   - social
8. Cloudinary folders:
   - portfolio/reels
   - portfolio/videos
   - portfolio/photoshop
   - portfolio/illustrator
   - portfolio/thumbnails
   - portfolio/logos
   - portfolio/posters
   - portfolio/social
9. Folder and resource type must be selected by portfolio type:
   - reels/videos are video
   - designs are images
10. Upload implementation:
   - Use Multer disk temp storage, not memory storage, for large uploads.
   - Validate file type by MIME and extension fallback.
   - Allow common formats: JPG, PNG, WebP, GIF, AVIF, HEIC, HEIF, MP4, MOV, WebM, M4V, AVI, MKV, MPEG.
   - Enforce image limit from `MAX_IMAGE_SIZE_MB`, default 25MB.
   - Enforce video limit from `MAX_VIDEO_SIZE_MB`, default 100MB because current Cloudinary accounts may reject videos over 100MB.
   - Use Cloudinary `upload_large` for videos.
   - Use Cloudinary `upload` for images.
   - Generate video thumbnail URL when no thumbnail is supplied.
   - Clean temp files after upload.
   - If Supabase insert fails after Cloudinary upload, delete the uploaded Cloudinary files to avoid orphan media.
11. Delete implementation:
   - Delete Cloudinary media by stored public ID.
   - Delete optional thumbnail public ID.
   - Delete Supabase row.
   - Public IDs may contain slashes, so use stored IDs from Supabase instead of route params for Cloudinary deletion.
12. Supabase:
   - Use only server env values.
   - Never expose `SUPABASE_SECRET_KEY` to frontend.
   - Normalize rows into frontend-friendly keys:
     - id
     - title
     - description
     - type
     - category
     - projectDate
     - tools
     - mediaUrl
     - thumbnailUrl
     - cloudinaryPublicId
     - thumbnailPublicId
     - resourceType
     - featured
     - sortOrder
     - createdAt
     - updatedAt

Supabase schema:
Create `supabase/schema.sql` with:

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
  project_date date,
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

alter table if exists public.portfolio_items
  add column if not exists project_date date;

create index if not exists portfolio_items_type_idx on public.portfolio_items (type);
create index if not exists portfolio_items_featured_idx on public.portfolio_items (featured);
create index if not exists portfolio_items_project_date_idx on public.portfolio_items (project_date desc);
create index if not exists portfolio_items_sort_idx on public.portfolio_items (sort_order, created_at desc);

Frontend pages:
1. Home
   - Strong premium anime-cinematic hero
   - Hero headline: "I Edit Videos That Feel Like Anime Openings"
   - Subtitle: "Reels, cinematic edits, thumbnails, posters, Photoshop, Illustrator, and visual storytelling."
   - CTA buttons:
     - Watch Reels
     - View Designs
     - Hire Me
   - Featured work section using only real uploaded featured work
   - Reels section using only real uploaded reels
   - Services/tools section
   - Editing process section
   - Final hire-me CTA
2. Reels
   - Use real uploaded reel assets only
   - Vertical 9:16 premium cards
   - Neon border hover
   - Muted video preview behavior
   - Title, category, tools, description overlay
   - Clean mobile scroll
3. Videos
   - Use real uploaded video assets only
   - 16:9 cinematic cards
   - Category filters
   - Muted previews
   - Empty state if no videos exist
4. Designs
   - Use real uploaded design assets only
   - Include photoshop, illustrator, thumbnail, poster, logo, social
   - Manga-panel inspired cards
   - Filter tabs
   - Image hover zoom
   - Lightbox/modal preview
5. About
   - Professional and personal
   - Add sections:
     - What I Do
     - Tools I Use
     - Editing Style
   - Avoid fake achievements and fake experience claims.
6. Contact
   - Premium contact page
   - Show Email, Phone, WhatsApp, Instagram, YouTube, Behance, Dribbble only if configured in frontend env.
   - Do not show empty social links.
   - Clear hire-me CTA.
7. Admin Login
   - Premium protected-dashboard design.
   - Same backend auth flow.
8. Admin Dashboard
   - Clean library cards.
   - Upload form supports:
     - file
     - optional thumbnail
     - title
     - description
     - type
     - category
     - date/project_date
     - tools
     - featured
     - sort order
   - Show upload preview.
   - Show loading states.
   - Show success/error messages.
   - Mobile dashboard uses cards, not broken tables.

UI design direction:
- Dark anime cinematic style.
- Professional, not childish.
- Neon purple, blue, red, and pink accents.
- Manga-panel inspired gallery cards.
- Strong typography.
- Clean spacing.
- Premium creative agency feel.
- Use lucide-react icons in buttons and UI controls.
- No visible in-app text explaining shortcuts or implementation details.
- No fake case studies or fake social proof.

Mobile requirements:
- No horizontal overflow.
- Header/nav must not overlap content.
- Hamburger menu must work cleanly.
- Use `px-4` on small screens.
- Use `max-w-7xl mx-auto` on desktop.
- Hero h1 must use responsive sizes.
- Reels use `aspect-[9/16]`.
- Videos use `aspect-video`.
- Gallery grid:
  - `grid-cols-1` on phones
  - `sm:grid-cols-2`
  - `lg:grid-cols-3`
- Admin forms single-column on mobile.
- Lightbox/modal must not overflow screen.
- Disable or simplify heavy GSAP horizontal scroll below desktop widths.

Animation requirements:
- Use Lenis smooth scroll.
- Use GSAP ScrollTrigger carefully.
- Use Framer Motion for card entrances where useful.
- Add text reveal and subtle panel entrances.
- Keep animation lightweight.
- Respect reduced-motion.
- Disable heavy effects on mobile where needed.

Performance requirements:
- Lazy load images.
- Videos are muted by default.
- Videos use poster/thumbnail first.
- Use `preload="none"` or metadata where appropriate.
- Do not autoplay sound.
- Do not load all videos aggressively.
- Keep Vite production build clean.

Security requirements:
- Helmet, CORS, rate limiting, centralized error handling.
- JWT in httpOnly cookie.
- Backend validates file types and sizes.
- Cloudinary API secret only on backend.
- Supabase service role key only on backend.
- Frontend only uses public `VITE_*` env vars.

README requirements:
Rewrite README so it accurately documents:
- Cloudinary + Supabase architecture.
- No MongoDB and no Mongoose.
- No fake data.
- Empty states.
- Environment setup for Windows PowerShell:
  - From `server` folder: `Copy-Item .env.example .env`
  - From root: `Copy-Item client/.env.example client/.env`
- Supabase SQL setup.
- Cloudinary folders.
- API routes.
- Admin login.
- Vercel client deployment.
- Render server deployment.
- 100MB Cloudinary video limit note.

Final verification:
Run and fix issues until these pass:
- `npm install`
- `npm run lint`
- `npm run build`
- `npm run dev`

Also check:
- Backend health at `http://localhost:5000/api/health`
- Client at `http://localhost:5173`
- Public pages show only real Supabase/Cloudinary data.
- Empty states show when no uploads exist.
- Admin login works with env credentials.
- Upload works for supported files within size limits.
- Mobile pages at 360px, 390px, 430px, 768px, and desktop have no horizontal overflow.

Important local URL note:
Use `http://localhost:5173`, not `http://127.0.0.1:5173`, unless CORS env also includes 127.0.0.1.

At the end, summarize:
- Files changed.
- UI improvements.
- Backend/API changes.
- Mobile fixes.
- Verification commands run.
- Any remaining setup the user must do manually, especially filling env values and running `supabase/schema.sql`.
```
