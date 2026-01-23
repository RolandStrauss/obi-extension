---
name: Webview-TreeView Feature Parity
description: Maintain UI feature parity between Webview and TreeView implementations with shared service patterns
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

**Service Implementation:** `src/core/projectService.ts`

```typescript
import { IUiSyncService, ISelectableItem } from './uiShared';

export class ProjectService implements IUiSyncService {
    private selectedItemId: string | null = null;
    private changeEmitter = new vscode.EventEmitter<ISelectableItem[]>();

    async getItems(): Promise<ISelectableItem[]> {
        // Single source of truth for data
        const projects = await this.fetchProjects();
        return projects.map(p => ({
            id: p.id,
            label: p.name,
            description: p.description,
            icon: 'folder',
            metadata: { url: p.webUrl }
        }));
    }

    async selectItem(id: string): Promise<void> {
        // Single selection logic
        this.selectedItemId = id;
        await this.handleSelection(id);

        // Notify both views
        const items = await this.getItems();
        this.changeEmitter.fire(items);
    }

    getSelectedItem(): ISelectableItem | null {
        // Single source of selected state
        return this.items.find(i => i.id === this.selectedItemId) || null;
    }

    onDidChange(callback: (items: ISelectableItem[]) => void): vscode.Disposable {
        return this.changeEmitter.event(callback);
    }
}
```

### Webview Usage

**File:** `src/ui/webview/projectsWebview.ts`

```typescript
import { ProjectService } from '../../core/projectService';

export class ProjectsWebview {
    constructor(private projectService: ProjectService) {
        // Subscribe to changes
        this.projectService.onDidChange(items => {
            this.updateWebviewContent(items);
        });
    }

    async initialize() {
        // Get items from shared service
        const items = await this.projectService.getItems();
        this.renderItems(items);
    }

    private renderItems(items: ISelectableItem[]) {
        // Webview-specific rendering
        const html = `
            <table>
                ${items.map(item => `
                    <tr onclick="selectItem('${item.id}')">
                        <td>${item.label}</td>
                        <td>${item.description || ''}</td>
                    </tr>
                `).join('')}
            </table>
        `;
        this.panel.webview.html = html;
    }

    private async handleMessage(message: any) {
        if (message.command === 'selectItem') {
            // Use shared service
            await this.projectService.selectItem(message.itemId);
        }
    }
}
```

### TreeView Usage

**File:** `src/ui/treeview/projectsTreeView.ts`

```typescript
import { ProjectService } from '../../core/projectService';

export class ProjectsTreeProvider implements vscode.TreeDataProvider<ProjectTreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private projectService: ProjectService) {
        // Subscribe to changes from shared service
        this.projectService.onDidChange(() => {
            this._onDidChangeTreeData.fire();
        });
    }

    async getChildren(): Promise<ProjectTreeItem[]> {
        // Get items from shared service
        const items = await this.projectService.getItems();

        // TreeView-specific rendering
        return items.map(item => new ProjectTreeItem(
            item.label,
            item.description,
            vscode.TreeItemCollapsibleState.None,
            item.id
        ));
    }

    async selectItem(item: ProjectTreeItem) {
        // Use shared service
        await this.projectService.selectItem(item.id);
    }
}
```

## Feature Addition Workflow

### Step 1: Update Shared Service

Add new capability to shared interface:

```typescript
// src/core/uiShared.ts
export interface IUiSyncService {
    // ... existing methods

    /**
     * Filter items by search term
     * @param searchTerm - Text to search for
     * @returns Filtered items
     */
    filterItems(searchTerm: string): Promise<ISelectableItem[]>;
}
```

### Step 2: Implement in Service

```typescript
// src/core/projectService.ts
async filterItems(searchTerm: string): Promise<ISelectableItem[]> {
    const allItems = await this.getItems();

    if (!searchTerm) return allItems;

    return allItems.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
}
```

### Step 3: Update Webview

```typescript
// src/ui/webview/projectsWebview.ts
private addSearchBox() {
    const html = `
        <input
            type="text"
            id="search"
            placeholder="Search projects..."
            oninput="handleSearch(this.value)"
        />
        <div id="results"></div>
    `;

    this.panel.webview.html = html;
}

private async handleMessage(message: any) {
    if (message.command === 'search') {
        const items = await this.projectService.filterItems(message.term);
        this.renderItems(items);
    }
}
```

### Step 4: Update TreeView

```typescript
// src/ui/treeview/projectsTreeView.ts
export class ProjectsTreeProvider {
    private searchTerm: string = '';

    setSearchTerm(term: string) {
        this.searchTerm = term;
        this._onDidChangeTreeData.fire();
    }

    async getChildren(): Promise<ProjectTreeItem[]> {
        // Use shared service with filter
        const items = await this.projectService.filterItems(this.searchTerm);
        return items.map(item => this.createTreeItem(item));
    }
}

// Register search command
vscode.commands.registerCommand('lancelot.searchProjects', async () => {
    const term = await vscode.window.showInputBox({
        prompt: 'Search projects'
    });
    if (term !== undefined) {
        treeProvider.setSearchTerm(term);
    }
});
```

### Step 5: Add to Test Scenarios

```markdown
## Cross-View Parity Testing

### Test: Search Functionality

**Objective:** Verify search works identically in both views

**Steps:**
1. Open both Webview and TreeView
2. Enter search term "auth" in Webview search box
3. Run "Lancelot: Search Projects" command for TreeView
4. Enter same search term "auth"
5. Compare results in both views

**Expected Results:**
- Both views show same filtered projects
- Order matches between views
- Count matches between views
- Selecting item in either view updates both

**Acceptance Criteria:**
- [ ] Results match in both views
- [ ] Selection state synchronized
- [ ] Performance acceptable in both views
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

### Acceptable Divergences

**1. Layout Differences**
- Webview: Table with sortable columns
- TreeView: Hierarchical tree structure
- **Justification:** Different interaction models
- **Documentation:** Decision record explaining trade-offs

**2. Performance Optimizations**
- Webview: Virtual scrolling for thousands of items
- TreeView: Lazy loading with pagination
- **Justification:** Platform-specific optimization
- **Documentation:** Implementation notes

**3. Platform-Specific Features**
- Webview: Drag-and-drop file upload
- TreeView: Native context menu integration
- **Justification:** Leveraging platform strengths
- **Documentation:** Feature comparison document

### Unacceptable Divergences

❌ **Data Differences**
- Webview shows 10 projects, TreeView shows 5
- **Fix:** Use shared service method

❌ **Feature Availability**
- Webview has filter, TreeView doesn't
- **Fix:** Implement in both or document why not

❌ **Selection Behavior**
- Webview single-select, TreeView multi-select
- **Fix:** Standardize or document intentional difference

❌ **Error Messages**
- Different error text for same error
- **Fix:** Centralize error messages

## Documentation Requirements

### Decision Record Template

**Location:** `docs/architecture/decision-records/`

```markdown
# Decision Record: Webview/TreeView Divergence

**Date:** 2025-12-23
**Status:** Accepted
**Context:** Implementing advanced filtering

## Decision

TreeView will use simple text filter, Webview will have multi-field filter panel.

## Rationale

- TreeView space constraints limit UI complexity
- Webview can provide richer UI without compromising usability
- Users can choose view based on filtering needs
- Core filtering logic still shared

## Consequences

**Positive:**
- Better user experience in each context
- Leverages strengths of each view type

**Negative:**
- More maintenance overhead
- Documentation must explain differences

## Alternatives Considered

1. Identical UI in both → Rejected (TreeView space constraints)
2. Advanced filter only in Webview → Accepted
3. Remove TreeView → Rejected (users depend on it)

## Implementation

- Shared: `filterItems()` service method
- Webview: Multi-field filter panel
- TreeView: Simple text search command
```

### Feature Comparison Document

**Location:** `docs/features/webview-tree-parity.md`

```markdown
# Webview / Tree View Parity

## Shared Features

| Feature | Webview | TreeView | Notes |
|---------|---------|----------|-------|
| Project List | ✅ | ✅ | Same data source |
| Selection | ✅ | ✅ | Synchronized |
| Refresh | ✅ | ✅ | Same endpoint |
| Basic Filter | ✅ | ✅ | Text search |

## View-Specific Features

| Feature | Webview | TreeView | Rationale |
|---------|---------|----------|-----------|
| Advanced Filter | ✅ | ❌ | Space constraints |
| Column Sort | ✅ | ❌ | Table-specific |
| Hierarchical View | ❌ | ✅ | TreeView strength |
| Context Menu | ✅ | ✅ | Different implementations |

## Shared Service Usage

Both views use `src/core/uiShared.ts` interfaces:
- `IUiSyncService` for data operations
- Shared state management
- Synchronized selection
```

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

- Lancelot Instructions: `.github/instructions/lancelot_built_tool.instructions.md` (Webview and Tree View Feature Parity section)
- Architecture Documentation: `docs/architecture/ui-architecture.md`
- Shared Service Pattern: `src/core/uiShared.ts`
