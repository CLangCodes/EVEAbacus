# OpenAPI Type Generation Setup

This guide explains how to set up automatic TypeScript type generation from your .NET API's OpenAPI/Swagger schema.

## Prerequisites

1. **Start your .NET backend** on `http://localhost:5000`
2. **Ensure Swagger is accessible** at `http://localhost:5000/swagger/v1/swagger.json`

## Installation

Install the required package:

```bash
pnpm add -D openapi-typescript
```

## Usage

### Generate Types Once
```bash
pnpm run generate-types
```

### Generate Types in Watch Mode (Development)
```bash
pnpm run generate-types:dev
```

### Build with Type Generation
```bash
pnpm run build
```

## How It Works

1. **Source**: The generator reads your .NET API's OpenAPI schema from `/swagger/v1/swagger.json`
2. **Output**: Generates TypeScript interfaces in `src/types/generated.ts`
3. **Integration**: The `manufacturing.ts` file automatically uses generated types when available

## Benefits

- ✅ **DRY Principle**: Single source of truth from .NET models
- ✅ **Type Safety**: Full TypeScript intellisense and validation
- ✅ **Auto-sync**: Types automatically match your API
- ✅ **Fallback**: Manual types available if generation fails

## Troubleshooting

### PowerShell Execution Policy
If you get execution policy errors, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Backend Not Running
Ensure your .NET backend is running on `http://localhost:5000` before generating types.

### Swagger Not Accessible
Check that Swagger is enabled in your .NET project and accessible at the expected URL.

## Manual Override

If you need to use manual types instead of generated ones, you can:
1. Delete `src/types/generated.ts`
2. The system will automatically fall back to `src/types/api-types.ts`

## Development Workflow

1. **Start backend**: Run your .NET API
2. **Generate types**: `pnpm run generate-types`
3. **Develop**: Use the generated types in your components
4. **Update models**: When you change .NET models, regenerate types

## File Structure

```
src/types/
├── generated.ts      # Auto-generated from OpenAPI (don't edit)
├── api-types.ts      # Manual fallback types
├── manufacturing.ts  # Frontend-specific types + imports
└── orders.ts         # Order-related types
``` 