# IntentFlow Frontend

Next.js-based user interface for IntentFlow protocol.

## Features

- 🔐 Wallet connection via RainbowKit
- 📝 Natural language intent creation
- 📊 Real-time intent status tracking
- 📈 System analytics dashboard
- 🎨 Beautiful gradient UI with Tailwind CSS
- 📱 Fully responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Web3**: Wagmi + Viem + RainbowKit
- **State Management**: React Query
- **API Client**: Axios
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 20+
- Backend API running (default: http://localhost:3001)
- Smart contracts deployed

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CHAIN_ID=1000
NEXT_PUBLIC_RPC_URL=https://polkadot-hub-rpc.example.com
NEXT_PUBLIC_INTENT_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── providers.tsx       # Wagmi/RainbowKit providers
│   └── globals.css         # Global styles
├── components/
│   ├── IntentForm.tsx      # Intent creation form
│   ├── IntentList.tsx      # Intent display list
│   └── StatsCard.tsx       # Statistics card
├── hooks/
│   ├── useIntents.ts       # Intent data hook
│   ├── useContracts.ts     # Contract interaction hook
│   └── useStats.ts         # Analytics hook
└── lib/
    ├── api.ts              # API client
    ├── wagmi.ts            # Wagmi configuration
    └── abis.ts             # Contract ABIs
```

## Components

### IntentForm

Intent creation form with wallet integration.

**Features:**
- Natural language input
- Reward amount configuration
- Automatic deadline calculation
- Transaction signing
- Loading states

**Usage:**
```tsx
<IntentForm onIntentCreated={() => refetch()} />
```

### IntentList

Display list of intents with filtering.

**Features:**
- Status filtering (All, Pending, Executing, Completed)
- Real-time updates
- Solver information
- Time formatting

**Usage:**
```tsx
<IntentList />
```

### StatsCard

Display system statistics.

**Props:**
- `title`: Card title
- `value`: Statistic value
- `loading`: Loading state
- `color`: Color theme (purple, green, yellow, blue)

**Usage:**
```tsx
<StatsCard title="Total Intents" value={1000} color="purple" />
```

## Hooks

### useIntents

Fetch and manage intent data.

```tsx
const { intents, loading, refetch } = useIntents();
```

### useContracts

Interact with smart contracts.

```tsx
const { useGetIntent, contractAddress } = useContracts();
const { data: intent } = useGetIntent(intentId);
```

### useStats

Fetch system statistics.

```tsx
const { stats, loading, refetch } = useStats();
```

## API Integration

The frontend communicates with the backend API for:
- Intent creation (after on-chain transaction)
- Intent listing and filtering
- Analytics and statistics
- Solver information

See `src/lib/api.ts` for API client implementation.

## Smart Contract Integration

The frontend interacts with smart contracts for:
- Intent creation (on-chain)
- Intent status queries
- Solver registration
- Transaction signing

See `src/lib/wagmi.ts` for Wagmi configuration.

## Styling

### Theme

The app uses a dark gradient theme:
- Background: Slate 900 → Purple 900 → Slate 900
- Accent: Purple 600 → Pink 600
- Glass morphism effects

### Tailwind Configuration

Custom configuration in `tailwind.config.js`:
- Extended color palette
- Custom gradients
- Responsive breakpoints

## Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

Set environment variables in Vercel dashboard.

### Netlify

```bash
npm run build
netlify deploy --prod --dir=.next
```

### Docker

```bash
docker build -f ../../docker/frontend.Dockerfile -t intentflow-frontend .
docker run -p 3000:3000 intentflow-frontend
```

## Performance

- Server-side rendering for initial load
- Static generation where possible
- Image optimization
- Code splitting
- Lazy loading

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Testing

```bash
# Unit tests (future)
npm run test

# E2E tests (future)
npm run test:e2e
```

## Troubleshooting

### Wallet Connection Issues

1. Check MetaMask is installed
2. Verify network configuration
3. Check RPC URL is accessible

### Contract Interaction Fails

1. Verify contract addresses in `.env.local`
2. Check wallet has sufficient balance
3. Verify network is correct

### API Connection Issues

1. Check backend is running
2. Verify API URL in `.env.local`
3. Check CORS configuration

## Contributing

1. Follow existing code style
2. Use TypeScript strictly
3. Add comments for complex logic
4. Test on multiple browsers

## License

MIT
