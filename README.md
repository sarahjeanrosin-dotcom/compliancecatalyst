# ComplianceCatalyst

Map your compliance policies to FTC & FDA regulations, then optimize with behavioral design principles.

## Quick Deploy to Vercel

### Step 1: Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key and copy it

### Step 2: Deploy to Vercel

**Option A: Deploy via GitHub (Recommended)**

1. Create a new GitHub repository
2. Upload all files from this folder to the repo
3. Go to [vercel.com](https://vercel.com) and sign in with GitHub
4. Click "Add New Project"
5. Import your GitHub repository
6. **Important:** Add your environment variable:
   - Click "Environment Variables"
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your API key from Step 1
7. Click "Deploy"

**Option B: Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (run from this folder)
vercel

# Add your API key
vercel env add ANTHROPIC_API_KEY
# Paste your key when prompted

# Redeploy with the env variable
vercel --prod
```

### Step 3: Connect Your Custom Domain (Optional)

1. In Vercel dashboard, select your project
2. Go to "Settings" → "Domains"
3. Add your domain (e.g., `fullcompliancecatalyst.com`)
4. Update your domain's DNS settings as instructed

## Project Structure

```
compliance-catalyst/
├── api/
│   └── analyze.js    # Backend API endpoint (handles Anthropic calls)
├── index.html        # Frontend application
├── package.json      # Project configuration
├── vercel.json       # Vercel deployment configuration
└── README.md         # This file
```

## Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Create .env file with your API key
echo "ANTHROPIC_API_KEY=your-key-here" > .env

# Run locally
vercel dev
```

Then open http://localhost:3000

## How It Works

1. **Input Policy** - Paste your compliance text
2. **Map Regulations** - AI identifies applicable FTC/FDA regulations
3. **Select Principles** - Choose behavioral design principles to apply
4. **Get Results** - Receive optimized language that encourages compliance

## Support

For issues with:
- **Anthropic API**: [docs.anthropic.com](https://docs.anthropic.com)
- **Vercel Deployment**: [vercel.com/docs](https://vercel.com/docs)
