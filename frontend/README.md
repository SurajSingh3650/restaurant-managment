# Restaurant Builder Platform

A full-stack web application that allows restaurant owners to create, manage, and publish their own restaurant website without writing code.

## Features

- ✅ User authentication (Register/Login)
- ✅ Restaurant management dashboard
- ✅ Create and edit restaurant details
- ✅ Menu management with categories
- ✅ Dynamic restaurant website generation
- ✅ Customizable themes
- ✅ Public-facing restaurant websites with unique URLs

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Authentication**: JWT tokens
- **Database**: File-based JSON storage (easily upgradeable to PostgreSQL/MongoDB)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (optional):
Create a `.env.local` file in the `frontend` directory:
```
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── restaurants/  # Restaurant CRUD endpoints
│   ├── dashboard/        # User dashboard pages
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   ├── r/[slug]/        # Public restaurant websites
│   └── page.tsx         # Landing page
├── lib/
│   ├── auth.ts          # Authentication utilities
│   ├── auth-client.ts   # Client-side auth helpers
│   ├── db.ts            # Database operations
│   └── middleware.ts    # API middleware
├── types/
│   └── index.ts         # TypeScript type definitions
└── data/                # JSON database files (auto-created)
```

## Usage

### For Restaurant Owners

1. **Register/Login**: Create an account or sign in
2. **Create Restaurant**: Click "New Restaurant" and fill in your details
3. **Edit Restaurant**: Use the dashboard to update information and manage your menu
4. **View Website**: Your restaurant website is automatically available at `/r/your-slug`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

#### Restaurants
- `GET /api/restaurants` - Get all restaurants or filter by userId
- `POST /api/restaurants` - Create restaurant (requires auth)
- `GET /api/restaurants/[id]` - Get restaurant by ID
- `PUT /api/restaurants/[id]` - Update restaurant (requires auth)
- `DELETE /api/restaurants/[id]` - Delete restaurant (requires auth)
- `GET /api/restaurants/slug/[slug]` - Get restaurant by slug (public)

## Database

The application uses a file-based JSON database stored in the `data/` directory:
- `data/users.json` - User accounts
- `data/restaurants.json` - Restaurant data

For production, consider upgrading to:
- PostgreSQL
- MongoDB
- Supabase
- Firebase

## Future Enhancements

- [ ] Image upload functionality for logos and menu items
- [ ] Multiple theme templates
- [ ] Online ordering integration
- [ ] Reservation system
- [ ] Analytics dashboard
- [ ] SEO optimization
- [ ] Custom domain support

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## License

MIT
