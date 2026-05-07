# Full Stack Internship Tracker

A modern full-stack developer internship tracker built with Next.js App Router, React, Tailwind CSS, shadcn-style components, Framer Motion, Recharts, and localStorage persistence.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy To Vercel

### Option 1: Vercel Dashboard

1. Push this folder to a GitHub repository.
2. Go to Vercel and choose **Add New Project**.
3. Import the repository.
4. Keep the defaults:
   - Framework Preset: `Next.js`
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: Next.js default
5. Click **Deploy**.

No environment variables are required because the app stores tracker data in the browser with localStorage.

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel
vercel --prod
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Notes

- Requires Node.js `20.9.0` or newer.
- Uses client-side persistence only, so every user has their own local browser data.
- The project is configured for Vercel, but still runs normally as a local Next.js app.
