# Vercel Quick Setup

To deploy this project to Vercel:

1. Import this GitHub repository to Vercel
2. Add these environment variables in Vercel project settings:

```
DATABASE_URL=postgresql://postgres.ujjxluxutvyvzjwqrmxv:password123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ujjxluxutvyvzjwqrmxv:password123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://ujjxluxutvyvzjwqrmxv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=dokumentasi
```

3. Override build command (optional):
   `npm run build:vercel`

4. Deploy! The ESLint errors will be ignored during build.
