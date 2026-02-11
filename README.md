# Product Management Dashboard

A professional e-commerce product management admin panel built with modern web technologies.

Notes: AI is highly used to assist with the code writing, I am open to discussing any part of the codebase and explaining my thought process behind it. Please feel free to ask any questions or request clarifications on specific implementations.

## Project Overview

This is a fully functional product management dashboard that demonstrates production-ready code with proper authentication, API integration, state management, and a polished UI. The application allows administrators to manage products, view users, and configure settings with a seamless user experience.

## Features

### Authentication
- Secure login with JWT tokens
- Automatic token refresh mechanism
- Session persistence across page refreshes
- Remember me functionality
- Protected routes with automatic redirection

### Product Management
- **Listing**: Server-side pagination with 10/20/50 items per page
- **Search**: Debounced search (300ms) across product titles and descriptions
- **Filtering**: Filter by category with persistent URL state
- **Sorting**: Client-side sorting by price, rating, stock, and title
- **CRUD Operations**: Create, read, update, and delete products
- **Image Upload**: Cloudinary integration for thumbnail and gallery images
- **Bulk Actions**: Select multiple products for batch operations
- **Detail View**: Complete product information with gallery and specifications

### Dashboard
- **Statistics Cards**: Total products, users, low stock items, average price/rating, categories
- **Charts**: 
  - Pie chart for product distribution by category
  - Bar chart for price range distribution
  - Horizontal bar chart for top 10 rated products
- Real-time data aggregation

### Users Management
- **Listing**: Paginated user directory with search
- **Detail Modal**: Complete user information including contact and company details
- **Company Info**: Department, title, and organizational structure
- **Address Information**: Full address with city, state, postal code, and country

### Layout & Navigation
- **Collapsible Sidebar**: Icon-only mode on collapse with smooth animations
- **Header**: Global search, theme toggle, and user menu with profile options
- **Breadcrumbs**: Current page indication
- **Responsive Design**: Mobile, tablet, and desktop breakpoints

### Additional Features
- **Theme Support**: Light/Dark/System mode with next-themes
- **Settings Panel**: Customize theme, table density, page size, and sidebar behavior
- **Persistent State**: User preferences saved to localStorage
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: Comprehensive error messages with toast notifications
- **Form Validation**: React Hook Form + Zod for robust validation

## Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19.2
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS 3.4
- **Components**: ShadCN UI (Radix UI primitives)
- **Charts**: Recharts

### State Management
- **Server State**: TanStack Query (React Query) v5
- **Auth State**: Zustand
- **Form State**: React Hook Form

### Data & APIs
- **HTTP Client**: Axios with custom interceptors
- **Validation**: Zod
- **API**: DummyJSON for mock data
- **File Upload**: Cloudinary unsigned uploads

### Development
- **Bundler**: Turbopack (default in Next.js 16)
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ and pnpm
- Cloudinary account with upload preset configured

### 2. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd product-management-dashboard

# Install dependencies
pnpm install
```

### 3. Configure Environment Variables

Create `.env.local` in the project root:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

### 4. Setup Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Navigate to Settings → Upload
4. Click "Add upload preset"
5. Set mode to "Unsigned"
6. Copy your Cloud Name and Upload Preset name
7. Add to `.env.local`

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Test Credentials

```
Username: emilys
Password: emilyspass
```


## Architecture

```
app/
├── login/                       # Login page
├── dashboard/                   # Dashboard page
├── products/                    # Product management pages
│   ├── [id]/                   # Product detail & edit
│   └── new/                    # Add product form
├── users/                       # User directory page
├── settings/                    # Settings page
├── components/
│   ├── ui/                      # ShadCN UI components
│   ├── layout/                  # Sidebar, Header, Layout
│   ├── auth/                    # Login components
│   ├── products/                # Product-specific components
│   └── dashboard/               # Dashboard widgets
├── hooks/
│   ├── use-auth.ts              # Authentication hook
│   ├── use-products.ts          # Product queries & mutations
│   ├── use-users.ts             # User queries
│   └── use-debounce.ts          # Utility hooks
├── lib/
│   ├── api-client.ts            # Axios instance with interceptors
│   ├── utils.ts                 # Helper functions
│   └── validations.ts           # Zod schemas
├── services/
│   ├── auth.service.ts          # Auth API calls
│   ├── product.service.ts       # Product API calls
│   ├── user.service.ts          # User API calls
│   └── upload.service.ts        # Cloudinary uploads
├── stores/
│   └── auth.store.ts            # Zustand auth store
├── types/
│   └── index.ts                 # TypeScript definitions
├── config/
│   └── constants.ts             # API URLs, config values
├── layout.tsx                   # Root layout with providers
└── globals.css                  # Global styles
```

## Token Refresh Implementation

This app implements automatic token refresh with the following flow:
1. **Request**: User makes an API request with `Authorization: Bearer {accessToken}`
2. **401 Response**: If token is expired, the API returns 401
3. **Intercept**: Axios response interceptor catches the 401
4. **Queue Requests**: Failed requests are queued while refresh is happening
5. **Refresh**: POST to `/auth/refresh` with `refreshToken`
6. **Update Tokens**: New tokens stored in localStorage and Zustand store
7. **Retry**: Original request is retried with new token
8. **Fallback**: If refresh fails, user is logged out and redirected to login

In short, if the access token expires, the app automatically tries to refresh it using the refresh token. If successful, it updates the tokens and retries the original request without user intervention. If the refresh fails (e.g., refresh token is also expired), it logs the user out.
This happens silently without user notifying. The `expiresInMins: 1` parameter ensures tokens expire quickly for testing purposes.

## Key Implementation Details

### Authentication Flow
- Login credentials sent to `/auth/login`
- Tokens stored securely in localStorage and Zustand store
- API client automatically includes token in all requests
- Token refresh happens silently on 401 responses
- Session persists across page refreshes

### API Client Design
- Centralized Axios instance with interceptors
- Request queuing during token refresh
- Automatic Authorization header injection
- Global error handling
- Request/response type safety with TypeScript

### State Management Strategy
- **Auth State**: Zustand store for centralized auth state
- **Server State**: React Query for caching API responses
- **UI State**: React useState for component-level state
- **Persistent State**: localStorage for user preferences

### Form Handling
- React Hook Form for efficient form management
- Zod for compile-time type-safe validation
- Field-level error display
- Loading states during submission
- Success/error toast notifications

### Product Search & Pagination
- Debounced search (300ms) to reduce API calls
- URL query parameters for state persistence
- Server-side pagination with configurable page size
- Category filtering with persistent state
- Results sync across component unmount/remount

### Image Upload
- File validation (type and size)
- Progress tracking during upload
- Preview before submission
- Multiple image support
- Drag & drop interface
- Graceful error handling

## Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Connect to Vercel and it auto-deploys

# Or deploy via CLI
vercel
```

### Environment Variables on Vercel

1. Go to Vercel Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset`
3. Redeploy

## Code Quality

### TypeScript Strict Mode
- All code written in TypeScript with strict mode enabled
- No `any` types used
- Full type coverage for API responses
- Generic types for reusable components

### Linting & Formatting
```bash
# Run linter
pnpm lint

# Format code
pnpm format
```

### Error Handling
- Comprehensive try-catch blocks
- User-friendly error messages
- API error differentiation (400, 401, 403, 404, 500)
- Network error detection
- Toast notifications for user feedback

## Performance Optimizations

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component with lazy loading
- **API Caching**: React Query with configurable stale times
- **Debouncing**: Search input debounced to reduce requests
- **Lazy Loading**: Dynamic route imports
- **Skeleton Loaders**: Better perceived performance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations & Future Improvements

### Current Limitations
- User management is read-only (no edit/create/delete)
- No real-time notifications
- No advanced filtering options
- Product images must be uploaded to Cloudinary

### Future Enhancements
1. **Unit & E2E Tests**: Add Jest and Cypress test suites
2. **Advanced Filtering**: Multiple field filters with AND/OR logic
3. **Bulk Operations**: Bulk edit and bulk delete with progress tracking
4. **CSV Export**: Export products and users to CSV
5. **Keyboard Shortcuts**: Cmd+K for search, etc.
6. **PWA Support**: Offline mode and app installation
7. **API Caching**: Service worker for offline support
8. **Request Cancellation**: AbortController for concurrent requests
9. **Analytics**: Page view tracking and user behavior
10. **Audit Logging**: Track all CRUD operations

## Trade-offs Made

### Design Decisions
1. **Zustand over Redux**: Simpler boilerplate, easier to understand, sufficient for auth state
2. **React Query over SWR**: Better pagination support, more granular cache control
3. **Zod over Yup**: Type safety, better TypeScript integration
4. **localStorage over sessionStorage**: Allows persistence across browser restarts
5. **Unsigned Cloudinary uploads**: No backend required, simpler setup

### Simplified for Time
- No sophisticated error recovery
- Minimal accessibility testing
- No internationalization (i18n)
- No advanced filtering UI
- Limited input validation rules
- Basic loading states (could use skeleton components more)

## Troubleshooting

### Login fails with "Invalid credentials"
- Check username and password (case-sensitive)
- Ensure API_BASE_URL is correct
- Check network tab for actual error response

### Images not uploading
- Verify Cloudinary credentials in .env.local
- Check upload preset is set to "Unsigned"
- Verify file size is under 5MB
- Check file type (JPG, PNG, WebP only)

### Token refresh not working
- Check localStorage for tokens (DevTools → Application)
- Verify token format in Authorization header
- Check API response for auth endpoints

### Sidebar toggle not persisting
- Check browser localStorage is enabled
- Clear localStorage and try again
- Check browser console for errors

## Support & Questions

For issues or questions:
1. Check the troubleshooting section above
2. Review error messages in browser console
3. Check network tab for API errors
4. Verify environment variables are set correctly

## License

This project is provided as-is for educational and assessment purposes.

---

**Built with ❤️ using modern web technologies**
