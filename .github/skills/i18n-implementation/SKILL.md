---
name: i18n-implementation
description: Implements internationalization (i18n) for VS Code extensions using message keys, resource bundles, and locale-aware APIs. Ensures all user-facing text is translatable with proper Unicode, RTL, and pluralization support. Use when implementing multi-language support or when user mentions internationalization, localization, or translations.
---

# Internationalization (i18n) Implementation

Comprehensive guidance for implementing internationalization in VS Code extensions. Ensures all user-facing text and UI elements are ready for translation into multiple languages.

## When to Use This Skill

- User mentions internationalization or i18n
- User wants to add multi-language support
- User mentions localization or translations
- User references locale-specific formatting
- Implementing new user-facing features
- User mentions RTL (right-to-left) support

## Core Requirements

### 1. No Hardcoded User-Facing Strings

**❌ Wrong:**
```typescript
vscode.window.showInformationMessage("File saved successfully!");
```

**✅ Correct:**
```typescript
const message = vscode.l10n.t('file.saved.success');
vscode.window.showInformationMessage(message);
```

### 2. Use Message Keys and Resource Bundles

**File Structure:**
```
project-root/
├── package.nls.json          # Default locale (English)
├── package.nls.de.json       # German translations
├── package.nls.fr.json       # French translations
├── package.nls.pseudo.json   # Pseudo-localization for testing
└── l10n/
    ├── bundle.l10n.json      # Extension messages (default)
    ├── bundle.l10n.de.json   # German
    └── bundle.l10n.fr.json   # French
```

**Message Key Format:**
```json
{
  "feature.action.result": "Action completed successfully",
  "error.network.timeout": "Network request timed out",
  "prompt.confirm.delete": "Are you sure you want to delete {0}?"
}
```

### 3. Locale-Aware Formatting

**Dates:**
```typescript
// ❌ Wrong: Hardcoded format
const date = `${month}/${day}/${year}`;

// ✅ Correct: Locale-aware
const formatter = new Intl.DateTimeFormat(vscode.env.language, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});
const date = formatter.format(new Date());
```

**Numbers:**
```typescript
// ❌ Wrong: Hardcoded format
const price = `$${amount.toFixed(2)}`;

// ✅ Correct: Locale-aware
const formatter = new Intl.NumberFormat(vscode.env.language, {
  style: 'currency',
  currency: 'USD'
});
const price = formatter.format(amount);
```

**Times:**
```typescript
// ✅ Locale-aware time
const formatter = new Intl.DateTimeFormat(vscode.env.language, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});
const time = formatter.format(new Date());
```

### 4. Unicode and RTL Support

**Text Direction:**
```css
/* Support both LTR and RTL */
.container {
  direction: inherit; /* Inherit from parent */
  text-align: start; /* Use 'start' not 'left' */
}

/* RTL-specific adjustments */
[dir="rtl"] .icon {
  transform: scaleX(-1); /* Mirror icons */
}
```

**Text Length:**
```typescript
// ❌ Wrong: Fixed width
<div style="width: 200px">{text}</div>

// ✅ Correct: Flexible width
<div style="min-width: 200px; max-width: 400px">{text}</div>
```

### 5. Pluralization and Variable Interpolation

**Using ICU MessageFormat:**
```json
{
  "items.count": "{count, plural, =0{No items} =1{One item} other{# items}}",
  "greeting": "Hello, {username}!"
}
```

**In Code:**
```typescript
// Simple interpolation
const message = vscode.l10n.t('greeting', 'John');

// Plural handling
const message = vscode.l10n.t('items.count', count);
```

**❌ Avoid String Concatenation:**
```typescript
// Wrong
const message = "You have " + count + " items";

// Correct
const message = vscode.l10n.t('items.count', count);
```

## Fallback Locale

Always provide English (`en`) as fallback:

```typescript
// Extension activation
export async function activate(context: vscode.ExtensionContext) {
  // Load default locale
  const locale = vscode.env.language || 'en';
  
  // Fail gracefully if translation missing
  try {
    await loadTranslations(locale);
  } catch (error) {
    // Fall back to English
    await loadTranslations('en');
  }
}
```

## What NOT to Localize

**Internal Identifiers:**
```typescript
// ✅ Don't localize
const commandId = 'extension.doSomething';
const configKey = 'extension.setting.value';
```

**File Paths:**
```typescript
// ✅ Don't localize
const filePath = path.join(__dirname, 'resources', 'data.json');
```

**Logs (unless user-visible):**
```typescript
// ✅ Don't localize internal logs
console.log('Debug: Processing request');

// ❌ Do localize user-visible errors
vscode.window.showErrorMessage(vscode.l10n.t('error.file.not.found'));
```

**Protocol Tokens:**
```typescript
// ✅ Don't localize
const httpMethod = 'GET';
const contentType = 'application/json';
```

## Testing

### Pseudo-Localization

Create `package.nls.pseudo.json`:
```json
{
  "command.title": "[!!! Çömmåñð Tîtlé !!!]",
  "message.success": "[!!! Öpérätîöñ çömplétéð süççéssfüllý !!!]"
}
```

**Benefits:**
- Tests text expansion (translations often longer)
- Tests diacritics rendering
- Tests RTL layout
- Identifies hardcoded strings

### Checklist

- [ ] All user-facing strings use message keys
- [ ] No hardcoded text in UI components
- [ ] Dates/times use `Intl.DateTimeFormat`
- [ ] Numbers/currency use `Intl.NumberFormat`
- [ ] Pluralization handled with ICU MessageFormat
- [ ] No string concatenation for messages
- [ ] RTL layout tested
- [ ] Text expansion tested (pseudo-localization)
- [ ] Missing keys fail gracefully (fallback to English)
- [ ] Internal IDs, paths, logs not localized

## Common Patterns

### Command Titles

**package.json:**
```json
{
  "contributes": {
    "commands": [
      {
        "command": "extension.doSomething",
        "title": "%command.doSomething.title%"
      }
    ]
  }
}
```

**package.nls.json:**
```json
{
  "command.doSomething.title": "Do Something"
}
```

### Configuration

**package.json:**
```json
{
  "contributes": {
    "configuration": {
      "properties": {
        "extension.setting": {
          "type": "string",
          "default": "value",
          "description": "%config.setting.description%"
        }
      }
    }
  }
}
```

**package.nls.json:**
```json
{
  "config.setting.description": "Description of the setting"
}
```

### Status Bar Items

```typescript
const statusBarItem = vscode.window.createStatusBarItem();
statusBarItem.text = vscode.l10n.t('status.ready');
statusBarItem.tooltip = vscode.l10n.t('status.ready.tooltip');
statusBarItem.show();
```

### Quick Pick Items

```typescript
const items = [
  {
    label: vscode.l10n.t('option.create'),
    description: vscode.l10n.t('option.create.description')
  },
  {
    label: vscode.l10n.t('option.delete'),
    description: vscode.l10n.t('option.delete.description')
  }
];

const selected = await vscode.window.showQuickPick(items);
```

## Error Handling

```typescript
try {
  await riskyOperation();
} catch (error) {
  // Localized error message
  const message = vscode.l10n.t('error.operation.failed', error.message);
  vscode.window.showErrorMessage(message);
  
  // Internal logging (not localized)
  console.error('Operation failed:', error);
}
```

## Related Documentation

- [VS Code i18n Guide](https://code.visualstudio.com/api/language-extensions/language-server-extension-guide)
- [ICU MessageFormat](https://unicode-org.github.io/icu/userguide/format_parse/messages/)
- [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [instructions/i18n.instructions.md](../../../.github/instructions/i18n.instructions.md)
