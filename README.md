# Cinematic Video Editing Portfolio

A real anime-style cinematic portfolio for a video editor and graphic designer. The site showcases uploaded reels, long-form edits, Photoshop work, Illustrator work, thumbnails, posters, logos, and social media designs.

This project uses Cloudinary only for portfolio storage. It does not use MongoDB, Mongoose, SQL, local JSON storage, seeded demo projects, fake clients, or fake testimonials. Public portfolio pages show real work uploaded through the protected admin dashboard. If no work has been uploaded yet, the site shows a clean empty state: "No projects uploaded yet."

## Stack

- Client: React, Vite, Tailwind CSS, React Router, GSAP ScrollTrigger, Lenis, Framer Motion, Axios
- Server: Node.js, Express, Multer, Cloudinary, JWT, bcrypt
- Storage: Cloudinary folders, tags, and context metadata
- Deployment targets: Vercel for `client/`, Render for `server/`

## Cloudinary Storage

Uploaded media is stored in these Cloudinary folders:

- `portfolio/reels`
- `portfolio/videos`
- `portfolio/photoshop`
- `portfolio/illustrator`
- `portfolio/thumbnails`
- `portfolio/logos`
- `portfolio/posters`

Portfolio metadata is stored on Cloudinary assets using tags and context fields:

- `title`
- `description`
- `type`
- `category`
- `tools`
- `featured`
- `thumbnailUrl`
- `thumbnailPublicId`

Metadata edits use Cloudinary context and tags through the Cloudinary Admin API. If your Cloudinary account settings or plan reject metadata updates, the admin dashboard will show the Cloudinary API error; the project does not fall back to any local database.

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

Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Fill in `server/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=change_me_in_development
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

For production, prefer `ADMIN_PASSWORD_HASH` instead of `ADMIN_PASSWORD`.

Fill in `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_CONTACT_EMAIL=
VITE_WHATSAPP_URL=
VITE_INSTAGRAM_URL=
VITE_YOUTUBE_URL=
VITE_BEHANCE_URL=
VITE_DRIBBBLE_URL=
```

Leave optional contact/social values empty until you have real links. The public contact page only shows configured links.

Start both apps:

```bash
npm run dev
```

Client: `http://localhost:5173`

Server: `http://localhost:5000`

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

Cloudinary uploads:

- `POST /api/upload`
- `DELETE /api/upload`
- `PUT /api/upload/metadata`

Upload requests are protected and expect multipart fields:

- `file`: required image/video
- `thumbnail`: optional image
- `title`
- `description`
- `type`
- `category`
- `tools`
- `featured`

Delete requests are protected and expect JSON. Sending `publicId` in the body supports Cloudinary IDs with slashes, such as `portfolio/reels/example`.

- `publicId`
- `resourceType`
- `thumbnailPublicId` when deleting an attached thumbnail

Metadata update requests are protected and expect JSON or multipart data:

- `publicId`
- `title`
- `description`
- `type`
- `category`
- `tools`
- `featured`
- optional `thumbnail`

Supported portfolio types:

- `reel`
- `video`
- `photoshop`
- `illustrator`
- `thumbnail`
- `poster`
- `logo`

## Deployment

### Vercel Client

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-render-api.onrender.com/api`

### Render Server

- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Set all server environment variables from `server/.env.example`
- Set `NODE_ENV=production`
- Set `CLIENT_URL` and `CORS_ORIGINS` to the deployed Vercel URL

### Cloudinary

- Create a Cloudinary account
- Copy cloud name, API key, and API secret into `server/.env`
- Keep the API secret only on the backend
- Upload portfolio work from the protected admin dashboard

## Performance And Security

- No fake project cards or seeded demo work
- Empty states are shown when no assets exist
- Videos use thumbnails, `preload="none"`, and muted previews on hover/open
- Public media is delivered through Cloudinary optimized URLs
- Upload routes are protected by JWT
- JWT sessions are stored in an httpOnly cookie, not browser local storage
- Admin password is compared with bcrypt when `ADMIN_PASSWORD_HASH` is used
- File types and upload size are validated
- Helmet, CORS, rate limiting, and centralized error handling are enabled
