# AGENTS.md

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

- **Runtime:** Bun v1.3.5+
- **Language:** TypeScript 5.x with strict mode
- **Module System:** ESM (`"type": "module"`)
- **Build Tool:** None required (Bun executes TypeScript directly)

## Commands

### Running the Application

```bash
bun run index.ts
# or simply
bun index.ts
```

### Installing Dependencies

```bash
bun install
```

### Type Checking

```bash
bun tsc --noEmit
```

### Testing

Bun has a built-in test runner. No additional test framework is needed.

```bash
# Run all tests
bun test

# Run a single test file
bun test path/to/file.test.ts

# Run tests matching a pattern
bun test --test-name-pattern "pattern"

# Run tests in watch mode
bun test --watch
```

### Linting and Formatting

No linter or formatter is currently configured. If added, use:

```bash
# If ESLint is added
bun eslint .

# If Prettier is added
bun prettier --write .

# If Biome is added
bun biome check --apply .
```

## Code Style Guidelines

### Imports

1. **Use ESM import syntax** - CommonJS `require()` is not allowed
2. **Use `import type` for type-only imports** - Required by `verbatimModuleSyntax`
3. **File extensions are optional** but `.ts` extensions are allowed in imports
4. **Order imports** in this sequence:
   - Node.js built-in modules (with `node:` prefix)
   - External packages
   - Internal modules (relative paths)
   - Type imports last

```typescript
// Good
import { readFile } from "node:fs/promises";
import { z } from "zod";
import { helper } from "./utils";
import type { Config } from "./types";

// Bad - missing 'type' keyword for type-only import
import { Config } from "./types";  // If Config is only used as a type
```

### TypeScript and Types

1. **Strict mode is enabled** - No implicit `any`, strict null checks, etc.
2. **Always define explicit types** for function parameters and return values
3. **Use `noUncheckedIndexedAccess`** - Array/object indexing returns `T | undefined`
4. **Use `noImplicitOverride`** - Must use `override` keyword when overriding methods
5. **Prefer interfaces for object shapes**, types for unions/intersections
6. **Avoid `any`** - Use `unknown` and narrow with type guards

```typescript
// Good - handles potential undefined from index access
const items: string[] = ["a", "b", "c"];
const first = items[0];  // Type is string | undefined
if (first !== undefined) {
  console.log(first.toUpperCase());
}

// Good - explicit override
class Child extends Parent {
  override method(): void {
    // ...
  }
}

// Good - type guard
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `userName`, `isActive` |
| Functions | camelCase | `getUserById`, `calculateTotal` |
| Classes | PascalCase | `UserService`, `HttpClient` |
| Interfaces | PascalCase | `UserConfig`, `ApiResponse` |
| Types | PascalCase | `UserId`, `RequestHandler` |
| Constants | SCREAMING_SNAKE_CASE or camelCase | `MAX_RETRIES`, `defaultConfig` |
| Files | kebab-case or camelCase | `user-service.ts`, `userService.ts` |
| Test files | `*.test.ts` or `*.spec.ts` | `user-service.test.ts` |

### Error Handling

1. **Use typed errors** - Create custom error classes when appropriate
2. **Always handle promise rejections** - Use try/catch with async/await
3. **Provide meaningful error messages** - Include context about what failed
4. **Use Result types for expected failures** - Reserve exceptions for unexpected errors

```typescript
// Custom error class
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

// Async error handling
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// Result type pattern for expected failures
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
```

### Formatting

- **Indentation:** 2 spaces
- **Quotes:** Double quotes for strings
- **Semicolons:** Use semicolons
- **Trailing commas:** Use in multiline arrays/objects
- **Line length:** Keep under 100 characters when practical

### Functions and Methods

1. **Prefer arrow functions** for callbacks and short functions
2. **Use regular function declarations** for top-level exports
3. **Keep functions small** - Single responsibility principle
4. **Use descriptive names** - Verbs for actions, nouns for getters

```typescript
// Top-level function
export function processData(input: string): ProcessedData {
  // ...
}

// Arrow function for callbacks
const filtered = items.filter((item) => item.isActive);

// Async function
export async function fetchData(url: string): Promise<Data> {
  // ...
}
```

### Testing Patterns

Use Bun's built-in test runner with `describe`, `test`, and `expect`:

```typescript
import { describe, test, expect, beforeEach } from "bun:test";

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  test("should create a user", async () => {
    const user = await service.create({ name: "Test" });
    expect(user.name).toBe("Test");
  });

  test("should throw on invalid input", () => {
    expect(() => service.validate(null)).toThrow();
  });
});
```

## Project Structure

```
.
├── index.ts          # Application entry point
├── package.json      # Package manifest
├── tsconfig.json     # TypeScript configuration
├── bun.lock          # Bun lockfile
└── README.md         # Project documentation
```

When adding new code, follow this recommended structure:

```
.
├── src/              # Source code
│   ├── index.ts      # Entry point
│   ├── types/        # Type definitions
│   ├── utils/        # Utility functions
│   └── services/     # Business logic
├── tests/            # Test files
└── ...
```

## Important Notes

1. **No build step required** - Bun runs TypeScript directly
2. **Use Bun APIs** - Prefer `Bun.file()`, `Bun.write()`, etc. over Node.js equivalents
3. **JSX ready** - React JSX transform is configured if needed
4. **Unused variables are allowed** - `noUnusedLocals` and `noUnusedParameters` are disabled
