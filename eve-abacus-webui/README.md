# EVE Abacus WebUI - Manufacturing Calculator

A modern Next.js application for EVE Online manufacturing calculations and industry planning.

## Features

### ✅ Completed
- **Order Management**: Complete CRUD operations for manufacturing orders
- **Session Storage**: Persistent order storage with session storage and cookie backup
- **Modern UI**: Responsive design with Tailwind CSS and dark mode support
- **Dashboard Layout**: Clean, modern dashboard with tabbed navigation
- **Order Statistics**: Real-time statistics and metrics
- **Search & Filter**: Advanced filtering and sorting capabilities

### 🚧 In Development
- Bill of Materials (BOM) calculation
- Market analysis and price tracking
- Production routing optimization
- Supply planning and logistics

## Architecture

### Component Structure
```
src/
├── components/
│   ├── Icons.tsx                    # Custom SVG icons
│   └── manufCalc/
│       ├── Orders.tsx               # Main orders management
│       ├── OrderCard.tsx            # Individual order display
│       ├── OrderForm.tsx            # Create/edit order modal
│       ├── OrderStats.tsx           # Statistics dashboard
│       ├── BillOfMaterials.tsx      # BOM calculator (placeholder)
│       ├── MarketAnalysis.tsx       # Market analysis (placeholder)
│       ├── ProductionRouting.tsx    # Production routing (placeholder)
│       └── SupplyPlan.tsx           # Supply planning (placeholder)
├── hooks/
│   └── useOrderStorage.ts           # Order persistence hook
├── types/
│   └── orders.ts                    # TypeScript interfaces
├── utils/
│   ├── cookies.ts                   # Custom cookie utility
│   └── cookies.test.ts              # Cookie utility tests
└── app/
    └── manufacturing-calculator/
        └── page.tsx                 # Main calculator page
```

### Data Flow
1. **Order Creation**: Users create orders via modal form
2. **Validation**: Client-side validation with TypeScript
3. **Storage**: Orders saved to session storage + cookie backup
4. **Display**: Orders shown in responsive card grid
5. **Statistics**: Real-time calculation of order metrics

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **State Management**: React hooks + custom storage hook
- **Icons**: Custom SVG icons (no external dependencies)
- **Storage**: Session Storage + Custom Cookie Utility (no external dependencies)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation
```bash
cd eve-abacus-webui
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
npm start
```

## Order Management Features

### Order Properties
- **Blueprint Name**: Searchable blueprint selection
- **Activity Type**: Manufacture, Research, Copy, Invention, Reaction
- **Copies**: Number of blueprint copies
- **Runs**: Production runs per copy
- **Material Efficiency (ME)**: 0-10 range
- **Time Efficiency (TE)**: 0-20 range (step 2)

### Storage Strategy
- **Primary**: Session Storage (persists during browser session)
- **Backup**: Custom Cookie Utility (30-day expiration, survives browser restart)
- **Fallback**: Automatic restoration from cookies to session storage
- **No Dependencies**: Custom implementation, no external packages required

### UI Features
- **Responsive Grid**: Adapts to screen size (1-3 columns)
- **Search & Filter**: Real-time blueprint name filtering
- **Sorting**: By name, copies, runs, ME, or TE
- **Statistics**: Live calculation of totals and averages
- **Dark Mode**: Full dark mode support
- **Loading States**: Smooth loading indicators

## Comparison with Blazor Version

| Feature | Next.js | Blazor |
|---------|---------|--------|
| **UI Framework** | Tailwind CSS | MudBlazor |
| **Layout** | Dashboard + Cards | Tabbed + Table |
| **Storage** | Session + Custom Cookies | Session Storage |
| **Icons** | Custom SVG | Material Icons |
| **Responsive** | ✅ | ✅ |
| **Dark Mode** | ✅ | ✅ |
| **Type Safety** | TypeScript | C# |
| **Dependencies** | Minimal (no external cookie lib) | Blazored.SessionStorage |

## Testing

### Cookie Utility Testing
You can test the cookie functionality in the browser console:
```javascript
// Import and test cookie utility
import { testCookies } from '@/utils/cookies.test';
testCookies();
```

## Future Enhancements

### Phase 2: Core Calculator Features
- [ ] Bill of Materials calculation
- [ ] Material cost analysis
- [ ] Production time estimation
- [ ] Profit margin calculation

### Phase 3: Market Integration
- [ ] EVE ESI market data integration
- [ ] Real-time price tracking
- [ ] Market order analysis
- [ ] Regional price comparison

### Phase 4: Advanced Features
- [ ] Production routing optimization
- [ ] Supply chain planning
- [ ] Inventory management
- [ ] Export/import functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the EVE Abacus suite for EVE Online industry planning. 