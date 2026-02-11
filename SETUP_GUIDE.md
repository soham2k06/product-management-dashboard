# Quick Setup Guide

## Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- Cloudinary free account
- Code editor (VS Code recommended)

## Step 1: Clone & Install (2 minutes)

```bash
# Clone repository
git clone <your-repo-url>
cd product-management-dashboard

# Install dependencies
pnpm install
```

## Step 2: Setup Cloudinary (5 minutes)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up (free tier works)
2. Dashboard → Settings → Upload
3. Click "Add upload preset"
4. Name: anything (e.g., `my_preset`)
5. Mode: **Unsigned** (critical!)
6. Click Create
7. Note your **Cloud Name** (from Settings tab header)
8. Note your **Upload Preset** (from Upload tab)

## Step 3: Configure Environment (2 minutes)

Create `.env.local` in project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name_here
```

**Example:**
```env
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dmxyzabc
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=my_preset
```

## Step 4: Run Development Server (1 minute)

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Login (30 seconds)

Use test credentials:
- **Username:** `emilys`
- **Password:** `emilyspass`

You should see the dashboard with statistics and charts.

## Verify Everything Works

### Authentication
- [ ] Login works
- [ ] Logout clears session
- [ ] Refresh page and session persists

### Dashboard
- [ ] See statistics cards
- [ ] Charts load and display
- [ ] Dark/light theme toggle works

### Products
- [ ] Product list loads
- [ ] Search works (type in header)
- [ ] Pagination works
- [ ] Click "Add Product" opens form
- [ ] Upload an image in form

### Users
- [ ] User list loads
- [ ] Click "View" on a user opens details modal

### Settings
- [ ] Theme changes apply immediately
- [ ] Settings persist after refresh

## Troubleshooting

### "Cloudinary configuration is missing"
- Check `.env.local` file exists
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- Verify `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` is set
- Restart dev server: `Ctrl+C` then `pnpm dev`

### "Invalid credentials"
- Verify username is `emilys` (case-sensitive)
- Verify password is `emilyspass` (case-sensitive)
- Check that API is responding (network tab in DevTools)

### Images not uploading
- Verify upload preset is set to "Unsigned" in Cloudinary
- Check file is JPG/PNG/WebP and under 5MB
- Open browser console for error details

### Port 3000 already in use
```bash
# Use different port
pnpm dev -- -p 3001
```

### Dependencies won't install
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Project Structure Overview

```
src/
├── app/              # Pages (login, dashboard, products, etc.)
├── components/       # React components
├── hooks/            # Custom React hooks
├── services/         # API services
├── stores/           # Zustand stores
├── types/            # TypeScript types
├── lib/              # Utilities (API client, validation)
└── config/           # Configuration constants

app/                  # App router pages
└── [feature]/        # Feature folders with page.tsx
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (Cloudinary credentials) |
| `src/lib/api-client.ts` | Axios client with token refresh |
| `src/stores/auth.store.ts` | Authentication state with Zustand |
| `src/hooks/use-auth.ts` | Auth hooks (login, logout, etc.) |
| `src/services/` | API call functions |
| `app/*/page.tsx` | Route components |

## Common Tasks

### Add a new page
```bash
mkdir -p app/my-page
touch app/my-page/page.tsx
# Add your component
```

### Make an API call
```typescript
// In service file
export const myService = {
  getData: async () => {
    const response = await apiClient.get('/endpoint');
    return response.data;
  }
};

// In hook
export const useData = () => {
  return useQuery({
    queryKey: ['data'],
    queryFn: () => myService.getData(),
  });
};

// In component
const { data, isLoading } = useData();
```

### Add form validation
```typescript
// In validations.ts
export const mySchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

// In component
const form = useForm({
  resolver: zodResolver(mySchema),
});
```

### Update styling
```bash
# Edit app/globals.css for global styles
# Edit tailwind.config.ts for theme colors
# Use Tailwind classes in components: className="text-lg font-bold"
```

## Next Steps

1. **Explore the code**: Read through `src/` to understand patterns
2. **Add features**: Follow existing patterns to add new features
3. **Test thoroughly**: Use browser DevTools to verify functionality
4. **Deploy**: Push to GitHub and deploy to Vercel

## Useful Commands

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm build && pnpm start

# Lint code
pnpm lint

# Type check
pnpm tsc --noEmit
```

## Getting Help

1. **Check the README.md** for detailed documentation
2. **Check IMPLEMENTATION_NOTES.md** for architecture details
3. **Look at similar components** for code patterns
4. **Check browser console** for error messages
5. **Check network tab** to see API requests/responses

## Additional Resources

- [Next.js Docs](https://nextjs.org)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [ShadCN UI](https://ui.shadcn.com)
- [React Query](https://tanstack.com/query)
- [Zod Validation](https://zod.dev)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

**You're all set!** Happy coding! 🚀
