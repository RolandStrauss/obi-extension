# Self-Explanatory Code & Commenting Philosophy

**Core Principle**: Write code that speaks for itself. Comment only when necessary to explain WHY, not WHAT. We do not need comments most of the time.

This skill guides you in writing maintainable, self-documenting code with minimal but meaningful comments. The goal is to make code so clear that most comments become unnecessary, reserving comments only for explaining non-obvious decisions, constraints, and intentions.

## Commenting Anti-Patterns (AVOID)

### Obvious Comments

Comments that simply restate what the code does add no value and create maintenance burden.

**Bad Example:**

```javascript
// Initialize counter to zero
let counter = 0;

// Increment counter by one
counter++;
```

**Why This is Bad**: The code itself is self-explanatory. The comment adds noise without value.

### Redundant Comments

Comments that repeat the function or variable name without providing additional context.

**Bad Example:**

```javascript
// Return the user's name
function getUserName() {
    return user.name; // Return the user's name
}
```

**Why This is Bad**: The function name already communicates what it does. The comment is redundant.

### Outdated Comments

Comments that don't match the current code implementation create confusion and are worse than no comment.

**Bad Example:**

```javascript
// Calculate tax at 5% rate
const tax = price * 0.08; // Actually 8%
```

**Why This is Bad**: Misleading comments cause confusion and can lead to bugs. Keep code as the single source of truth.

---

## When to Write Comments (GOOD PRACTICES)

### Complex Business Logic

Explain the reasoning behind calculations or business rules that aren't obvious from the code alone.

**Good Example:**

```javascript
// Apply progressive tax brackets: 10% up to 10k, 20% above
const tax = calculateProgressiveTax(income, [0.1, 0.2], [10000]);
```

**Why This is Good**: The comment explains the business logic (tax brackets) that isn't obvious from the function call.

### Non-Obvious Algorithms

Explain algorithm choices and why a particular approach was selected.

**Good Example:**

```javascript
// Using Floyd-Warshall for all-pairs shortest paths
// because we need distances between all nodes
for (let k = 0; k < vertices; k++) {
    for (let i = 0; i < vertices; i++) {
        for (let j = 0; j < vertices; j++) {
            // ... implementation
        }
    }
}
```

**Why This is Good**: The comment explains the algorithm choice and justification, which helps future maintainers understand the approach.

### Regex Patterns

Regex is notoriously hard to read. Always explain what the pattern matches.

**Good Example:**

```javascript
// Match email format: username@domain.extension
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

**Why This is Good**: Regex is cryptic. The comment explains the pattern in human-readable terms.

### API Constraints or Gotchas

Document external constraints, rate limits, or known issues with third-party APIs.

**Good Example:**

```javascript
// GitHub API rate limit: 5000 requests/hour for authenticated users
await rateLimiter.wait();
const response = await fetch(githubApiUrl);
```

**Why This is Good**: The comment explains an external constraint that isn't obvious from the code.

---

## Comment Decision Framework

Before writing any comment, ask these four questions in order:

### 1. Is the code self-explanatory?

If the code clearly communicates its intent through good naming and structure, **no comment is needed**.

### 2. Would a better variable/function name eliminate the need?

**Refactor first, comment second**. Often, a descriptive name makes a comment unnecessary.

**Example:**

```javascript
// Bad: Needs comment
const d = 86400; // seconds in a day

// Good: Self-explanatory
const SECONDS_IN_A_DAY = 86400;
```

### 3. Does this explain WHY, not WHAT?

Good comments explain the reasoning, not the mechanics. If your comment describes what the code does rather than why it exists, it's likely unnecessary.

### 4. Will this help future maintainers?

Consider whether the comment provides value to someone reading the code six months from now. If not, skip it.

---

## Special Cases for Comments

### Public APIs (Documentation Comments)

Public interfaces should have comprehensive documentation explaining parameters, return values, and behavior.

**Good Example:**

```javascript
/**
 * Calculate compound interest using the standard formula.
 *
 * @param {number} principal - Initial amount invested
 * @param {number} rate - Annual interest rate (as decimal, e.g., 0.05 for 5%)
 * @param {number} time - Time period in years
 * @param {number} compoundFrequency - How many times per year interest compounds (default: 1)
 * @returns {number} Final amount after compound interest
 */
function calculateCompoundInterest(principal, rate, time, compoundFrequency = 1) {
    // ... implementation
}
```

**Why This is Good**: Public APIs need comprehensive documentation for consumers. Use JSDoc, Javadoc, or equivalent standards.

### Configuration and Constants

Explain the source or reasoning behind configuration values and magic numbers.

**Good Example:**

```javascript
// Based on network reliability studies
const MAX_RETRIES = 3;

// AWS Lambda timeout is 15s, leaving buffer for cleanup
const API_TIMEOUT = 5000;
```

**Why This is Good**: Constants often encode business decisions or constraints. Document the reasoning.

### Code Annotations (Standard Tags)

Use standard annotation prefixes to mark technical debt, optimizations, and future work:

```javascript
// TODO: Replace with proper user authentication after security review

// FIXME: Memory leak in production - investigate connection pooling

// HACK: Workaround for bug in library v2.1.0 - remove after upgrade

// NOTE: This implementation assumes UTC timezone for all calculations

// WARNING: This function modifies the original array instead of creating a copy

// PERF: Consider caching this result if called frequently in hot path

// SECURITY: Validate input to prevent SQL injection before using in query

// BUG: Edge case failure when array is empty - needs investigation

// REFACTOR: Extract this logic into separate utility function for reusability

// DEPRECATED: Use newApiFunction() instead - this will be removed in v3.0
```

**Why These are Good**: Standard annotations make technical debt and issues scannable and trackable.

---

## Anti-Patterns to Avoid

### Dead Code Comments

Never comment out code. Use version control instead.

**Bad Example:**

```javascript
// const oldFunction = () => { ... };
const newFunction = () => { ... };
```

**Why This is Bad**: Version control tracks history. Commented code creates clutter and confusion.

### Changelog Comments

Don't maintain history in comments. Use version control commit messages.

**Bad Example:**

```javascript
// Modified by John on 2023-01-15
// Fixed bug reported by Sarah on 2023-02-03
function processData() {
    // ... implementation
}
```

**Why This is Bad**: Git already tracks who changed what and when. Comments duplicate this information poorly.

### Divider Comments

Don't use decorative ASCII art or dividers to organize code. Use file/module structure instead.

**Bad Example:**

```javascript
//=====================================
// UTILITY FUNCTIONS
//=====================================
```

**Why This is Bad**: Proper code organization (modules, classes, files) is more effective than visual dividers.

---

## Quality Checklist

Before committing code with comments, verify:

- [ ] **Explains WHY, not WHAT**: Comment provides context or reasoning, not a description of the code
- [ ] **Grammatically correct and clear**: Comment uses proper spelling and professional language
- [ ] **Will remain accurate**: Comment won't become outdated as code evolves
- [ ] **Adds genuine value**: Comment provides information not obvious from the code
- [ ] **Placed appropriately**: Comment appears above the code it describes (not inline unless necessary)
- [ ] **Uses professional language**: No slang, profanity, or unprofessional content

---

## Implementation Guidance

### For Code Reviews

When reviewing code:
- Flag comments that restate obvious code
- Suggest refactoring over commenting when names can be improved
- Request comments for complex algorithms or business logic
- Ensure comments explain WHY, not WHAT

### For Code Generation

When generating new code:
- Write self-documenting code first (clear names, simple logic)
- Add comments only for non-obvious decisions or constraints
- Include documentation comments for public APIs
- Use standard annotation tags (TODO, FIXME, etc.) for technical debt

### For Refactoring

When refactoring existing code:
- Remove comments that have become obvious after refactoring
- Update comments that no longer match the code
- Add comments if refactoring made the "why" less clear
- Prefer refactoring code to be clearer over adding explanatory comments

---

## Summary

**The best comment is the one you don't need to write because the code is self-documenting.**

Strive for:
- **Clear, descriptive names** for variables, functions, and classes
- **Simple, focused functions** that do one thing well
- **Logical code organization** that makes flow obvious
- **Comments only when necessary** to explain WHY, not WHAT

Remember: Code is read far more often than it's written. Invest in clarity over cleverness, and use comments as a last resort when code alone cannot convey the intent.
