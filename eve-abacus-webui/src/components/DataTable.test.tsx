import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataTable } from './DataTable';

// Test data with items that have the same group/category but different names
const testData = [
  { id: 1, name: 'Alpha Item', group: 'Group A', category: 'Category 1', value: 100 },
  { id: 2, name: 'Beta Item', group: 'Group A', category: 'Category 1', value: 100 },
  { id: 3, name: 'Charlie Item', group: 'Group A', category: 'Category 1', value: 100 },
  { id: 4, name: 'Delta Item', group: 'Group B', category: 'Category 2', value: 200 },
  { id: 5, name: 'Echo Item', group: 'Group B', category: 'Category 2', value: 200 },
];

const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'group', header: 'Group', sortable: true },
  { key: 'category', header: 'Category', sortable: true },
  { key: 'value', header: 'Value', sortable: true },
];

describe('DataTable Secondary Sorting', () => {
  test('should sort by group and then by name when group column is clicked', () => {
    render(
      <DataTable
        data={testData}
        columns={columns}
        secondarySortKey="name"
      />
    );

    // Click on the Group column header to sort by group
    const groupHeader = screen.getByText('Group');
    fireEvent.click(groupHeader);

    // Get all name cells to verify the order
    const nameCells = screen.getAllByText(/Item$/);
    
    // Items should be sorted by group first, then by name within each group
    // Group A items: Alpha, Beta, Charlie
    // Group B items: Delta, Echo
    expect(nameCells[0]).toHaveTextContent('Alpha Item');
    expect(nameCells[1]).toHaveTextContent('Beta Item');
    expect(nameCells[2]).toHaveTextContent('Charlie Item');
    expect(nameCells[3]).toHaveTextContent('Delta Item');
    expect(nameCells[4]).toHaveTextContent('Echo Item');
  });

  test('should sort by category and then by name when category column is clicked', () => {
    render(
      <DataTable
        data={testData}
        columns={columns}
        secondarySortKey="name"
      />
    );

    // Click on the Category column header to sort by category
    const categoryHeader = screen.getByText('Category');
    fireEvent.click(categoryHeader);

    // Get all name cells to verify the order
    const nameCells = screen.getAllByText(/Item$/);
    
    // Items should be sorted by category first, then by name within each category
    // Category 1 items: Alpha, Beta, Charlie
    // Category 2 items: Delta, Echo
    expect(nameCells[0]).toHaveTextContent('Alpha Item');
    expect(nameCells[1]).toHaveTextContent('Beta Item');
    expect(nameCells[2]).toHaveTextContent('Charlie Item');
    expect(nameCells[3]).toHaveTextContent('Delta Item');
    expect(nameCells[4]).toHaveTextContent('Echo Item');
  });

  test('should not apply secondary sorting when sorting by the secondary sort key itself', () => {
    render(
      <DataTable
        data={testData}
        columns={columns}
        secondarySortKey="name"
      />
    );

    // Click on the Name column header to sort by name
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    // Get all name cells to verify the order
    const nameCells = screen.getAllByText(/Item$/);
    
    // Items should be sorted by name only (no secondary sorting when sorting by the secondary key)
    expect(nameCells[0]).toHaveTextContent('Alpha Item');
    expect(nameCells[1]).toHaveTextContent('Beta Item');
    expect(nameCells[2]).toHaveTextContent('Charlie Item');
    expect(nameCells[3]).toHaveTextContent('Delta Item');
    expect(nameCells[4]).toHaveTextContent('Echo Item');
  });
}); 