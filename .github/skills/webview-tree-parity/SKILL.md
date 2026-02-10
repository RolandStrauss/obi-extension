---
name: Webview-TreeView Feature Parity
description: Maintain UI feature parity between Webview and TreeView implementations with shared service patterns. Use when user implements UI features, creates webviews or tree views, or mentions feature parity, dual UI, webview, or tree view.
---

# Webview and TreeView Feature Parity

Ensure UI features remain consistent between Webview and TreeView implementations through shared services and coordinated updates.

## Core Principle

**When changes affect UI behavior, presentation, or data in either view, apply equivalent changes to the other view.**

## Quick Reference

```typescript
// Shared service pattern
import { IUiSyncService } from './core/uiShared';

// Both views use same service
const items = await uiService.getItems();
```

**Rule:** Centralize logic in `src/core/`, keep only presentation code in views.

## When Parity is Required

### ✅ Requires Parity

Changes to:
- **Actions** - New buttons, commands, context menu items
- **Filters** - Search, sort, grouping options
- **Selection** - Single/multi-select behavior
- **Data columns** - Displayed information fields
- **Context menus** - Right-click options
- **Keyboard shortcuts** - Hotkey behavior
- **Data refresh** - Update mechanisms
- **Error states** - Error display and recovery
- **Loading states** - Progress indicators
- **Empty states** - "No data" messaging

### ❌ Parity Not Required (with documentation)

Differences in:
- **Visual presentation** - Layout, styling (if documented)
- **Interaction model** - Click vs expand (if intentional)
- **Performance optimizations** - View-specific optimizations
- **Platform-specific adaptations** - OS-specific UI patterns

**Important:** Document all intentional divergences in a Decision Record.

## Shared Service Pattern

### Minimal Pattern Example

**Location:** `src/core/uiShared.ts`

```typescript
/**
 * Shared interface for items displayable in both Webview and TreeView
 */
export interface ISelectableItem {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Synchronization service for UI state between views
 */
export interface IUiSyncService {
    /**
     * Get all items for display in either view
     * @returns Promise resolving to array of items
     */
    getItems(): Promise<ISelectableItem[]>;

    /**
     * Select an item in either view
     * @param id - Unique identifier of item to select
     */
    selectItem(id: string): Promise<void>;

    /**
     * Get currently selected item
     * @returns Currently selected item or null
     */
    getSelectedItem(): ISelectableItem | null;

    /**
     * Subscribe to item changes
     * @param callback - Called when items change
     * @returns Disposable to unsubscribe
     */
    onDidChange(callback: (items: ISelectableItem[]) => void): vscode.Disposable;
}
```

### Implementation Example

**Service:** `src/core/projectService.ts` implements `IUiSyncService`
**Webview:** `src/ui/webview/projectsWebview.ts` consumes service
**TreeView:** `src/ui/treeview/projectsTreeView.ts` consumes service

**Key Pattern:** Both views subscribe to service events and use same methods for data/selection.

```typescript
// Service provides single source of truth
export class ProjectService implements IUiSyncService {
    async getItems(): Promise<ISelectableItem[]> { /* fetch & map */ }
    async selectItem(id: string): Promise<void> { /* update & notify */ }
    onDidChange(callback): vscode.Disposable { /* event subscription */ }
}

// Views consume identically
export class ProjectsWebview {
    constructor(private service: ProjectService) {
        service.onDidChange(items => this.render(items));
    }
}

export class ProjectsTreeProvider {
    constructor(private service: ProjectService) {
        service.onDidChange(() => this.refresh());
    }
}
```

## Feature Addition Workflow

**5-Step Process:**

1. **Update Shared Interface** - Add method to `IUiSyncService` in `src/core/uiShared.ts`
2. **Implement in Service** - Add logic to service class (e.g., `ProjectService`)
3. **Update Webview** - Add UI and call service method
4. **Update TreeView** - Add command/UI and call service method
5. **Add Test Scenarios** - Create cross-view parity test with Given/When/Then format

**Example: Adding Search**
```typescript
// 1. Interface: filterItems(searchTerm: string): Promise<ISelectableItem[]>
// 2. Service: Implement filtering logic
// 3. Webview: Add <input> calling service.filterItems()
// 4. TreeView: Add command calling service.filterItems()
// 5. Test: Verify both return same results for same search term
```

## Validation Checklist

Before merging UI changes:

- [ ] Both views implement the feature
- [ ] Shared service used for data/logic
- [ ] Selection state synchronized
- [ ] Error handling consistent
- [ ] Loading states consistent
- [ ] Empty states consistent
- [ ] Test scenarios include cross-view validation
- [ ] Code review verified parity
- [ ] QA tested both views

## Common Divergence Patterns

### ✅ Acceptable (Document in Decision Record)

- **Layout** - Table vs. tree structure (different interaction models)
- **Performance** - View-specific optimizations (virtual scrolling, lazy loading)
- **Platform Features** - Leveraging strengths (drag-drop, native menus)

### ❌ Unacceptable (Must Fix)

- **Data Differences** - Different items shown → Use shared service
- **Feature Availability** - Missing in one view → Implement or document
- **Selection Behavior** - Different logic → Standardize
- **Error Messages** - Inconsistent text → Centralize messages

## Documentation Requirements

**Decision Record:** Document divergences in `docs/architecture/decision-records/`
- Include: Date, Status, Context, Decision, Rationale, Consequences
- Example: "TreeView uses simple filter, Webview uses multi-field (space constraints)"

**Feature Comparison:** Maintain table in `docs/features/webview-tree-parity.md`
- List shared features (✅ in both)
- List view-specific features with rationale
- Reference shared service usage

## Best Practices

1. **Design Shared First** - Start with shared service interface
2. **Test Both Views** - Every feature change requires dual testing
3. **Document Divergences** - All intentional differences documented
4. **Code Review Focus** - Reviewers check parity explicitly
5. **Centralize Logic** - Business logic in `src/core/`, not views
6. **Avoid Duplication** - Extract common code to utilities
7. **Consistent Error Handling** - Same errors, same messages
8. **Maintain Test Scenarios** - Cross-view test cases required

## References

- Lancelot Instructions: `.github/instructions/lancelot.instructions.md` (Webview and Tree View Feature Parity section)
- Architecture Documentation: `docs/architecture/ui-architecture.md`
- Shared Service Pattern: `src/core/uiShared.ts`
