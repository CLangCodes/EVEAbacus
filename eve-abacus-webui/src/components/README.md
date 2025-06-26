# Reusable Components

This directory contains reusable React components for the EVE Abacus Next.js application.

## Components

### DataTable
A reusable, sortable data table component with loading states and empty state handling.

**Features:**
- Sortable columns
- Loading state with skeleton animation
- Empty state message
- Responsive design
- Custom cell rendering
- Hover effects

**Usage:**
```tsx
import { DataTable, Column } from '../components';

interface MyData {
  id: number;
  name: string;
  value: number;
}

const columns: Column<MyData>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'value', header: 'Value', sortable: true, render: (value) => `$${value}` }
];

<DataTable
  data={myData}
  columns={columns}
  loading={isLoading}
  emptyMessage="No data found"
/>
```

### Autocomplete
A searchable autocomplete input component with async search functionality.

**Features:**
- Async search with debouncing
- Loading indicator
- Keyboard navigation
- Click outside to close
- Customizable minimum characters

**Usage:**
```tsx
import { Autocomplete } from '../components';

<Autocomplete
  value={selectedValue}
  onChange={setSelectedValue}
  onSearch={async (query) => {
    // Return array of strings
    return await searchAPI(query);
  }}
  label="Search Items"
  placeholder="Start typing..."
  required={true}
/>
```

### MultiSelect
A multi-select dropdown component with checkboxes.

**Features:**
- Multiple selection with checkboxes
- Clear all functionality
- Customizable options
- Dropdown with search-like interface

**Usage:**
```tsx
import { MultiSelect } from '../components';

<MultiSelect
  options={['Option 1', 'Option 2', 'Option 3']}
  selectedValues={selectedValues}
  onChange={setSelectedValues}
  label="Select Options"
  placeholder="Choose options..."
  clearable={true}
/>
```

### PICalc
The main Planetary Infrastructure Calculator component.

**Features:**
- Solar system search with autocomplete
- Jump range selection
- Planet type filtering
- Security status filtering
- Sortable planet data table
- Responsive design

**Usage:**
```tsx
import { PICalc } from '../components';

<PICalc className="my-custom-class" />
```

## API Integration

The components are designed to work with the EVE Abacus backend API. The API service layer is located in `../services/api.ts` and provides:

- `searchSolarSystems(query?)` - Search for solar system names
- `getPlanetTypes()` - Get available planet types
- `getPlanets(request)` - Get filtered planet data

## Styling

All components use Tailwind CSS for styling and are designed to be responsive. The components follow a consistent design system with:

- Blue primary color (`blue-500`)
- Gray secondary colors
- Consistent spacing and typography
- Hover and focus states
- Loading animations

## TypeScript

All components are fully typed with TypeScript interfaces exported for easy integration into other parts of the application. 