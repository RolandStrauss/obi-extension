---
name: TypeScript Strict Typing
description: Enforce strict typing standards avoiding 'any' type in favor of proper type definitions. Use when user writes TypeScript code, reviews types, fixes type errors, or mentions TypeScript, type safety, or 'any' type.
---

# TypeScript Strict Typing

Comprehensive guidelines for maintaining strict type safety in TypeScript projects by eliminating `any` type usage.

## Quick Reference

**Core Principle**: Never use `any` type. Use proper types, `unknown`, generics, or type definitions instead.

**Type Alternatives:**
- ✅ Use `unknown` for values that need runtime validation
- ✅ Use generics (`<T>`) for reusable type-safe functions
- ✅ Create `.d.ts` type definitions for external untyped modules
- ✅ Use union types for multiple possible types
- ✅ Use type guards for runtime type narrowing

**Legacy Code Strategy:**
- Replace `any` with the narrowest viable type
- Use `Unknown<Purpose>` placeholder (e.g., `UnknownApiResponse`) for complex types requiring research
- Document type conversion plan in code comments

## When This Skill Applies

Use this skill when:
- Writing new TypeScript code
- Reviewing TypeScript code
- Refactoring existing code with `any` types
- Integrating external libraries without type definitions
- Handling dynamic data from APIs or user input

## Detailed Usage

### Rule: Never Use `any`

**❌ Bad:**
```typescript
function processData(data: any) {
    return data.value;
}

const apiResponse: any = await fetch('/api/data').then(r => r.json());
```

**✅ Good:**
```typescript
interface ApiData {
    value: string;
}

function processData(data: ApiData) {
    return data.value;
}

const apiResponse: ApiData = await fetch('/api/data').then(r => r.json());
```

### Use `unknown` for Runtime Validation

When you receive data that needs runtime validation:

**✅ Proper approach:**
```typescript
function parseJSON(json: string): unknown {
    return JSON.parse(json);
}

function processUnknownData(data: unknown) {
    // Type guard for runtime validation
    if (isValidData(data)) {
        // Now TypeScript knows data is ValidData
        return data.value;
    }
    throw new Error('Invalid data structure');
}

function isValidData(data: unknown): data is { value: string } {
    return (
        typeof data === 'object' &&
        data !== null &&
        'value' in data &&
        typeof (data as { value: unknown }).value === 'string'
    );
}
```

### Use Generics for Reusable Functions

**❌ Bad:**
```typescript
function getValue(obj: any, key: string): any {
    return obj[key];
}
```

**✅ Good:**
```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

// Usage maintains full type safety
const user = { name: 'Alice', age: 30 };
const name: string = getValue(user, 'name'); // Type is string
const age: number = getValue(user, 'age');   // Type is number
```

### Create Type Definitions for External Modules

For external libraries without TypeScript definitions:

**Step 1: Create declaration file** (`types/external-lib.d.ts`):
```typescript
declare module 'external-lib' {
    export interface LibConfig {
        apiKey: string;
        timeout?: number;
    }

    export class LibClient {
        constructor(config: LibConfig);
        fetch(url: string): Promise<LibResponse>;
    }

    export interface LibResponse {
        data: unknown;
        status: number;
    }
}
```

**Step 2: Use with full type safety:**
```typescript
import { LibClient, LibConfig } from 'external-lib';

const config: LibConfig = { apiKey: 'abc123', timeout: 5000 };
const client = new LibClient(config);
```

### Use Union Types for Multiple Possibilities

**❌ Bad:**
```typescript
function formatValue(value: any): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    return 'unknown';
}
```

**✅ Good:**
```typescript
function formatValue(value: string | number | boolean): string {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    // TypeScript knows we've exhausted all cases
}
```

### Legacy Code Refactoring Strategy

When encountering `any` in existing code:

**Phase 1: Identify and Document**
```typescript
// TODO: Replace 'any' with proper type definition
// Research needed: External API response structure
type UnknownApiResponse = any; // Temporary placeholder

function handleResponse(response: UnknownApiResponse) {
    // Implementation
}
```

**Phase 2: Research and Define**
```typescript
// API documentation: https://api.example.com/docs
interface ApiResponse {
    data: {
        users: User[];
        total: number;
    };
    status: 'success' | 'error';
    message?: string;
}

function handleResponse(response: ApiResponse) {
    // Now fully typed
}
```

### Advanced Type Patterns

**Conditional Types:**
```typescript
type IsString<T> = T extends string ? true : false;

type Result1 = IsString<string>;  // true
type Result2 = IsString<number>;  // false
```

**Mapped Types:**
```typescript
interface User {
    name: string;
    age: number;
}

// Make all properties optional
type PartialUser = {
    [K in keyof User]?: User[K];
};

// Make all properties readonly
type ReadonlyUser = {
    readonly [K in keyof User]: User[K];
};
```

**Type Guards:**
```typescript
interface Dog {
    bark(): void;
}

interface Cat {
    meow(): void;
}

function isDog(animal: Dog | Cat): animal is Dog {
    return 'bark' in animal;
}

function handleAnimal(animal: Dog | Cat) {
    if (isDog(animal)) {
        animal.bark(); // TypeScript knows it's a Dog
    } else {
        animal.meow(); // TypeScript knows it's a Cat
    }
}
```

## TypeScript Configuration

Ensure strict mode is enabled in `tsconfig.json`:

```json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "strictBindCallApply": true,
        "strictPropertyInitialization": true,
        "noImplicitThis": true,
        "alwaysStrict": true
    }
}
```

## Validation Checklist

Before merging code, verify:
- [ ] No `any` types in new code
- [ ] External modules have type definitions (`.d.ts` files)
- [ ] `unknown` is used with proper type guards
- [ ] Generic functions maintain type safety
- [ ] Union types are exhaustively handled
- [ ] Legacy `any` types have refactoring plan documented
- [ ] TypeScript compiler reports no implicit `any` errors
- [ ] All type assertions are justified with comments

## Common Mistakes and Fixes

**Mistake 1: Using `any` for complex objects**

❌ Bad:
```typescript
const config: any = JSON.parse(configString);
```

✅ Good:
```typescript
interface Config {
    database: {
        host: string;
        port: number;
    };
    api: {
        key: string;
    };
}

const rawConfig: unknown = JSON.parse(configString);
if (isValidConfig(rawConfig)) {
    const config: Config = rawConfig;
}
```

**Mistake 2: Type assertions instead of proper types**

❌ Bad:
```typescript
const value = (apiResponse as any).data.value;
```

✅ Good:
```typescript
interface ApiResponse {
    data: {
        value: string;
    };
}

const response = apiResponse as ApiResponse;
const value = response.data.value;
```

**Mistake 3: Not handling null/undefined**

❌ Bad:
```typescript
function getName(user: User): string {
    return user.name; // Error if user.name is undefined
}
```

✅ Good:
```typescript
function getName(user: User): string {
    return user.name ?? 'Unknown';
}

// Or with explicit type
function getName(user: User): string | undefined {
    return user.name;
}
```

## Troubleshooting

**Issue: "Type 'X' is not assignable to type 'Y'"**

Solution: Check the actual type structure and create proper interface:
```typescript
// Check runtime value
console.log(JSON.stringify(value, null, 2));

// Define proper interface based on actual structure
interface ActualType {
    // Properties found in console.log output
}
```

**Issue: "Property 'X' does not exist on type 'unknown'"**

Solution: Use type guard before accessing properties:
```typescript
if (typeof value === 'object' && value !== null && 'propertyName' in value) {
    // Safe to access value.propertyName
}
```

**Issue: External library has no types**

Solution: Install community types or create your own:
```bash
# Check for community types
npm install --save-dev @types/library-name

# If not available, create types/library-name.d.ts
```

## Tools and Resources

**Linting:**
- Enable `@typescript-eslint/no-explicit-any` rule in ESLint
- Use `@typescript-eslint/no-unsafe-*` rules for stricter checking

**Type Exploration:**
- Use TypeScript Playground: https://www.typescriptlang.org/play
- Use VS Code "Go to Type Definition" (F12)
- Use `tsc --noEmit` to check types without compilation

**References:**
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/
- DefinitelyTyped Repository: https://github.com/DefinitelyTyped/DefinitelyTyped
- TypeScript Deep Dive: https://basarat.gitbook.io/typescript/

## Related Skills

- See `instructions/typescript-5-es2022.instructions.md` for comprehensive TypeScript guidelines
- See `.github/skills/lancelot-folder-structure/SKILL.md` for where to place `.d.ts` files
- See documentation standards for commenting complex types
