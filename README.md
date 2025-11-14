# Transformice Private Server

A modern web application to play Transformice using Ruffle emulator. Built with Next.js, TypeScript, and MongoDB.

## Features

- 🎮 **Play Transformice in Browser**: Uses Ruffle to emulate Flash SWF files
- 🎨 **Modern UI**: Built with Shadcn/ui and Tailwind CSS
- 🔐 **Authentication**: User registration and login system
- 🏆 **Leaderboard**: Global player rankings
- ⚙️ **Settings**: Customizable game settings (volume, quality, fullscreen)
- 📱 **Mobile-First**: Responsive design for all devices
- 🌙 **Dark Theme**: Eye-friendly dark mode by default

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Database**: MongoDB with Mongoose
- **SWF Emulation**: Ruffle (@ruffle-rs/ruffle)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Transformice-web
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/transformice
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (backend proxy)
│   │   ├── auth/         # Authentication endpoints
│   │   └── leaderboards/ # Leaderboard endpoints
│   ├── auth/             # Auth pages (login, register)
│   ├── game/             # Game page with Ruffle player
│   ├── leaderboard/      # Leaderboard page
│   └── layout.tsx        # Root layout
├── components/            # React components
│   ├── ui/               # Shadcn/ui base components
│   ├── organisms/        # Complex components (Navigation, RufflePlayer)
│   └── providers/        # Context providers (React Query)
├── hooks/                 # Custom React hooks
├── services/              # API service functions
├── stores/                # Zustand stores (auth, theme, game settings)
├── lib/                   # Utility functions and configurations
│   ├── mongodb.ts        # MongoDB connection
│   ├── models/           # Mongoose models
│   ├── utils.ts          # Utility functions
│   └── constants/        # App constants
├── types/                 # TypeScript type definitions
├── public/                # Static assets (SWF file)
└── styles/                # Global styles
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Leaderboard

- `GET /api/leaderboards?limit=10` - Get top players

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables (MONGODB_URI)
4. Deploy!

## Environment Variables

| Variable              | Description               | Default                                  |
| --------------------- | ------------------------- | ---------------------------------------- |
| `MONGODB_URI`         | MongoDB connection string | `mongodb://localhost:27017/transformice` |
| `NEXT_PUBLIC_APP_URL` | Public app URL            | `http://localhost:3000`                  |

## Features Details

### Ruffle Integration

- Dynamic import with SSR disabled
- Lazy loading for performance
- Fullscreen support
- Volume controls
- Quality settings

### Authentication

- Secure password hashing with bcrypt
- Form validation with Zod
- Real-time error handling
- Persistent sessions with Zustand

### State Management

- Zustand for global state
- Persistent storage (localStorage)
- Separate stores for auth, theme, and game settings

### Styling

- Mobile-first responsive design
- Transformice-inspired color scheme (blues and oranges)
- Smooth animations with Framer Motion
- Accessible components with ARIA labels

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational purposes only. Transformice is owned by Atelier 801.

## Acknowledgments

- [Transformice](http://www.transformice.com/) - Original game by Atelier 801
- [Ruffle](https://ruffle.rs/) - Flash emulator
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
