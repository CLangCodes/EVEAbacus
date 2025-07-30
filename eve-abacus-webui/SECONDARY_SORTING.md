# Secondary Sorting Feature

## Overview

The DataTable component now supports secondary sorting, which provides a more organized and user-friendly sorting experience. When sorting by any column other than the primary name column, items with the same value in the sorted column will be automatically sorted alphabetically by name.

## How It Works

When you click on a column header to sort by that column (e.g., Group, Category, etc.), the table will:
1. First sort by the selected column
2. Then, for items with the same value in that column, sort alphabetically by the name column

## Implementation

### DataTable Component Changes

The `DataTable` component now accepts an optional `secondarySortKey` prop:

```typescript
interface DataTableProps<T> {
  // ... existing props
  secondarySortKey?: keyof T | string;
}
```

### Usage Examples

#### Production Routing Table
```tsx
<DataTable
  data={routeData}
  columns={columns}
  secondarySortKey="blueprintName"
/>
```

#### Bill of Materials Table
```tsx
<DataTable
  data={materialData}
  columns={columns}
  secondarySortKey="name"
/>
```

#### PI Planet Explorer
```tsx
<DataTable
  data={planets}
  columns={columns}
  secondarySortKey="name"
/>
```

## Benefits

1. **Better Organization**: Items are grouped logically by category/group and then alphabetically within each group
2. **Consistent User Experience**: Users can always find items in a predictable order
3. **Improved Readability**: Related items are grouped together and sorted alphabetically
4. **No Breaking Changes**: The feature is optional and doesn't affect existing functionality

## Examples

### Before Secondary Sorting
When sorting by Group:
```
Group A: Charlie Item
Group A: Alpha Item  
Group A: Beta Item
Group B: Echo Item
Group B: Delta Item
```

### After Secondary Sorting
When sorting by Group:
```
Group A: Alpha Item
Group A: Beta Item
Group A: Charlie Item
Group B: Delta Item
Group B: Echo Item
```

## Components Updated

The following components now use secondary sorting:

- **ProductionRouting**: Secondary sort by `blueprintName`
- **BillOfMaterials**: Secondary sort by `name`
- **BulkEditMode**: Secondary sort by `blueprintName` and `name`
- **PICalc**: Secondary sort by `name` (planet names)
- **SupplyPlan**: Secondary sort by `name` (item names)
- **OrdersDataGrid**: Secondary sort by `blueprintName`

## Technical Details

The secondary sorting logic:
1. Compares the primary sort column values
2. If they are equal, compares the secondary sort key values
3. Handles both string and number types appropriately
4. Maintains null/undefined handling for missing values
5. Only applies secondary sorting when the primary sort key is different from the secondary sort key 