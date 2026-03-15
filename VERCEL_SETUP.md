# Vercel Deployment Setup

## Quick Setup

When deploying to Vercel, use these settings:

### Project Settings
- **Framework Preset**: Next.js
- **Root Directory**: `packages/frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=0xA7D5e4F74C05905EAD28dCF3cBab0891de4258dB
NEXT_PUBLIC_INTENT_ROUTER_ADDRESS=0x7E7d7D50353213c96aa1b6697c3e6407B4Df38AF
NEXT_PUBLIC_XCM_BRIDGE_ADDRESS=0xe84F4ad4c49813Ab6A1D1d84B6347587BB162234
NEXT_PUBLIC_RPC_URL=https://rpc.api.moonbase.moonbeam.network
NEXT_PUBLIC_CHAIN_ID=1287
```

## Deploy Steps

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `packages/frontend`
5. Add environment variables (see above)
6. Click "Deploy"

## Troubleshooting

### 404 Error
If you see a 404 error, make sure:
- Root Directory is set to `packages/frontend`
- Framework is detected as Next.js
- Build completed successfully

### Build Errors
Check the build logs in Vercel dashboard for specific errors.

## Alternative: Deploy from CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd packages/frontend
vercel --prod
```

When prompted:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No** (first time) or **Yes** (subsequent)
- What's your project's name? **kairos**
- In which directory is your code located? **./** (you're already in packages/frontend)

The CLI will automatically detect Next.js and use the correct settings.
