# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Project Overview

- **Framework:** Nuxt 4.2 (Vue 3.5)
- **Runtime:** Bun (or Node.js)
- **Language:** TypeScript with strict mode
- **Database:** SQLite with Drizzle ORM
- **Styling:** TailwindCSS with custom dark theme
- **Module System:** ESM (`"type": "module"`)

## Commands

### Development

```bash
# Start development server (with hot reload)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Generate static site
bun run generate
```

### Database

```bash
# Generate migrations from schema changes
bun run db:generate

# Run migrations
bun run db:migrate

# Push schema directly (dev only)
bun run db:push

# Open Drizzle Studio (database GUI)
bun run db:studio
```

### Type Checking

```bash
# Nuxt generates types automatically, check with:
bun nuxt typecheck
```

### Testing

No test framework is currently configured. If Vitest is added:

```bash
# Run all tests
bun test

# Run a single test file
bun test path/to/file.test.ts

# Run tests matching a pattern
bun test --test-name-pattern "pattern"
```

## Project Structure

```
app/
├── assets/css/       # Global CSS (Tailwind base)
├── components/       # Vue components
│   ├── form/         # Reusable UI components (J-prefixed)
│   └── icons/        # Icon components
├── layouts/          # Page layouts
├── pages/            # File-based routing
└── types/            # TypeScript type definitions

server/
├── api/              # API routes (auto-registered)
│   ├── exercises/
│   ├── sets/
│   └── workouts/
└── database/
    ├── migrations/   # Drizzle migrations
    ├── index.ts      # Database connection
    └── schema.ts     # Drizzle schema definitions
```

## Code Style Guidelines

### Imports

1. **Use ESM import syntax** - No CommonJS `require()`
2. **Use `import type` for type-only imports**
3. **Order imports:**
   - External packages (vue, drizzle-orm, etc.)
   - Internal modules with aliases (`~/components/...`)
   - Relative imports (`./utils`)
   - Type imports last

```typescript
// Good
import { eq } from "drizzle-orm";
import { db } from "../../database";
import type { Exercise } from "~/types/database";
```

### Vue Components

1. **Use `<script setup lang="ts">`** for all components
2. **Define props with `defineProps<T>()`** using TypeScript generics
3. **Define emits with `defineEmits<T>()`** using TypeScript generics
4. **Use `Teleport` for modals** to render at body level
5. **Template first, then script** - Follow Vue SFC order

```vue
<template>
  <!-- Template content -->
</template>

<script setup lang="ts">
import type { Exercise } from "~/types/database";

const props = defineProps<{
  exercise?: Exercise | null;
}>();

const emit = defineEmits<{
  close: [];
  save: [data: Partial<Exercise>];
}>();
</script>
```

### API Routes (Server)

1. **Use `defineEventHandler`** for all API endpoints
2. **Check `event.method`** to handle different HTTP methods
3. **Use `readBody(event)`** for POST/PUT request bodies
4. **Use `createError()`** for error responses
5. **File naming:** `index.ts` for collection, `[id].ts` for single resource

```typescript
export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === "GET") {
    return db.select().from(exercises);
  }

  if (method === "POST") {
    const body = await readBody(event);
    return db.insert(exercises).values(body).returning();
  }
});
```

### Database (Drizzle)

1. **Schema in `server/database/schema.ts`**
2. **Export inferred types** for select and insert operations
3. **Use timestamp columns with `mode: "timestamp"`**
4. **Use `.$defaultFn()` for default values**

```typescript
export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Vue components | PascalCase | `ExerciseModal.vue` |
| UI components | J-prefixed PascalCase | `JButton.vue`, `JInput.vue` |
| Pages | kebab-case | `workout.vue` |
| API routes | kebab-case | `index.ts`, `[id].ts` |
| Variables/functions | camelCase | `handleSubmit`, `isActive` |
| Types/interfaces | PascalCase | `Exercise`, `Workout` |
| Database columns | snake_case | `muscle_group`, `created_at` |
| CSS classes | kebab-case | `btn-primary`, `card` |

#### UI Component Naming

Reusable UI/form components use the `J` prefix convention and are located in `app/components/form/`:

- `JButton.vue` - Button component with variants (primary, secondary, ghost, danger)
- Future: `JInput.vue`, `JSelect.vue`, `JModal.vue`, etc.

### Formatting

- **Indentation:** 2 spaces
- **Quotes:** Double quotes for strings
- **Semicolons:** Required
- **Trailing commas:** Use in multiline arrays/objects

### Error Handling

1. **API routes:** Use `createError({ statusCode, message })`
2. **Client-side:** Use try/catch with async/await
3. **Provide meaningful error messages**

```typescript
if (result.length === 0) {
  throw createError({ statusCode: 404, message: "Workout not found" });
}
```

### TailwindCSS

- **Custom colors:** `dark-*` (grays), `accent-*` (green)
- **Use utility classes** from the design system
- **Common components:** `.card`, `.btn-primary`, `.btn-secondary`, `.input`

## Important Notes

1. **Nuxt auto-imports** - Vue APIs, composables, and components are auto-imported
2. **Path aliases** - Use `~/` for app directory, `~~/` for project root
3. **Database file** - SQLite database is stored as `sqlite.db` in project root
4. **Migrations run on startup** - Database is migrated when server starts
