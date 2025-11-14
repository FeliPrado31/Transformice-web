# Setup Instructions

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB:

```bash
# Ubuntu/Debian
sudo apt install mongodb

# macOS with Homebrew
brew install mongodb-community
```

2. Start MongoDB:

```bash
# Ubuntu/Debian
sudo systemctl start mongodb

# macOS
brew services start mongodb-community
```

3. The default connection string is:

```
mongodb://localhost:27017/transformice
```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and replace in `.env.local`:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/transformice?retryWrites=true&w=majority
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Testing the Application

1. **Home Page**: Navigate to `http://localhost:3000`

   - Should see the landing page with game information
   - Click "Play Now" or "Register"

2. **Registration**: Go to `/auth/register`

   - Create a test account
   - Username: 3-20 characters
   - Email: valid email format
   - Password: minimum 6 characters

3. **Login**: Go to `/auth/login`

   - Login with your credentials
   - Should redirect to game page

4. **Game Page**: Go to `/game`

   - Ruffle player should load the Transformice SWF
   - Test fullscreen and volume controls

5. **Leaderboard**: Go to `/leaderboard`
   - Should display registered users sorted by score

## Troubleshooting

### Ruffle Not Loading

If Ruffle fails to load:

- Check browser console for errors
- Ensure SWF file exists at `/public/Transformice.swf`
- Try clearing browser cache
- Check if browser supports WebAssembly

### MongoDB Connection Issues

If MongoDB connection fails:

- Verify MongoDB is running: `sudo systemctl status mongodb`
- Check connection string in `.env.local`
- Ensure database user has proper permissions
- Check firewall settings if using Atlas

### Build Errors

If you encounter build errors:

- Delete `.next` folder: `rm -rf .next`
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: `node -v` (should be 18+)

## API Testing

You can test the API endpoints using curl or Postman:

### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123456"}'
```

### Get Leaderboard

```bash
curl http://localhost:3000/api/leaderboards?limit=10
```

## Environment Variables

Create a `.env.local` file with:

```env
# Required
MONGODB_URI=mongodb://localhost:27017/transformice

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
6. Deploy!

Vercel will automatically:

- Install dependencies
- Build the project
- Deploy to production

## Next Steps

- [ ] Add user profiles
- [ ] Implement real-time chat
- [ ] Add screenshot gallery
- [ ] Implement game statistics tracking
- [ ] Add theme switcher (light/dark)
- [ ] Add password reset functionality
- [ ] Implement social login (Google, Discord)
- [ ] Add admin panel for moderation
