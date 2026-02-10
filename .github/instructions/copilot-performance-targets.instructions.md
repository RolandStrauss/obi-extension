---
applyTo: '**'
description: 'Lancelot-specific performance budgets, SLA targets, and performance metrics for extension runtime, API interactions, and user experience.'
---

# Lancelot Performance Targets & SLA

**Effective Date:** 2026-01-24
**Version:** 1.0
**Authority:** `instructions/lancelot.instructions.md` (Section: Core Development Principles)

## Overview

This instruction file defines performance budgets and SLA targets specific to the Lancelot VS Code extension. All code changes must adhere to these targets; regressions that violate these targets block merges until remediated.

**Performance is User Experience:** Users notice performance; perceived slowness damages adoption. These targets balance responsiveness with resource constraints.

---

## Extension Activation & Startup

### Cold Activation (First Load)

**Target:** < 2,000 ms from `activate()` call to command availability

**Definition:** Time from extension process start (`activate()`) until extension has completed initialization and user can execute commands (e.g., open a command palette action).

| Metric | Target | Threshold | Consequence |
|--------|--------|-----------|-------------|
| Time to activate | < 2.0s | > 3.0s (yellow), > 4.0s (red) | Performance regression review required |
| Blocking work | 0 ms | Any extended sync operation | Refactor to async or defer |
| Tree view render | < 500ms | > 1000ms | Refactor data loading to pagination/lazy |

**How to Measure:**
```typescript
const startTime = performance.now();
await context.subscriptions.push(...);
// ... initialization complete
const activationTime = performance.now() - startTime;
console.log(`Activation time: ${activationTime}ms`);
```

**Common Causes of Violation:**
- Synchronous file I/O during activation (use async)
- Large data structure parsing during initialization (defer)
- Tree data provider loading all items upfront (use pagination)
- Bundled heavy dependencies loaded at module level (use dynamic `import()`)

### Warm Activation (Subsequent Loads)

**Target:** < 500 ms from `activate()` call to command availability

**Definition:** Time for re-activation (e.g., after developer reload in debug session).

| Metric | Target |
|--------|--------|
| Warm activation | < 500ms |

---

## VSIX Package Size

### Bundle Size Budget

**Target:** < 5 MB (uncompressed VSIX)

**Rationale:** Faster downloads, faster installations, less disk usage

| Component | Budget | Comments |
|-----------|--------|----------|
| extension.cjs bundle | 3.0 MB | Core extension code (esbuild output) |
| Media files (icons, styles) | 1.0 MB | Images, CSS, fonts |
| node_modules (if included) | 0.5 MB | Rarely included; most via npm install |
| Metadata (package.json, README, etc.) | 0.5 MB | Documentation and configuration |

**How to Measure:**

```bash
npm run package:optimized
ls -lh .artifacts/vsix/lancelot-*.vsix
# Output: -rw-r--r-- 1 user staff 3.2M Jan 24 12:00 lancelot-1.0.1.vsix
```

**Monitoring:**
- CI/CD build log records unpacked size: `vsce package --out .artifacts/vsix` logs size
- Trend in size over releases (should not grow >10% per minor release)

**Blocker:** VSIX > 8 MB requires exception approval (potentially due to new heavy dependency)

---

## Command Execution Response Time

### User-Initiated Commands

**Target:** Immediate response (< 500 ms for first feedback)

| Command Type | Target | Example |
|--------------|--------|---------|
| Instant feedback | < 100ms | Show status bar message, update tree view |
| Short operation | < 500ms | Execute quick API call, local computation |
| Long operation | Show progress | Operations > 2 seconds show progress indicator |

**Definition:** Time from user triggering command (e.g., clicking button) to first visual feedback (status bar message, dialog appear, tree refresh).

**Examples:**
- ✅ `lancelot.gitlab.enterToken` – Dialog appears < 100ms
- ✅ `lancelot.selectRepository` – Repository list updates < 500ms
- ✅ `lancelot.checkout.selectMembers` – Webview loads < 1000ms, shows loading spinner while fetching
- ❌ `lancelot.ibmi.uploadMember` – Takes 5 seconds without progress indicator (violates SLA)

**Long Operations (> 2 seconds):**
- Must show progress indicator (`vscode.window.withProgress()`)
- Must support cancellation (CancellationToken)
- Progress should update at least every 1 second

### Rate-Limited Command Execution

**Target:** Enforce rate limits to protect external APIs

| Service | Rate Limit | Notes |
|---------|-----------|-------|
| GitLab API | 5 req/sec | Per user; queued beyond limit |
| Jira API | 10 req/sec | Per integration; batched when possible |
| IBM i SSH | 3 concurrent connections | Per host; queued beyond limit |
| Telemetry | 100 events/sec | Per extension instance |

**How to Implement:**
```typescript
const rateLimiter = new RateLimiter({ maxPerSecond: 5, name: 'GitLab' });
await rateLimiter.acquire();
// Execute API call
const result = await gitlabClient.getProjects();
```

---

## API Response Time (P95 Latency)

### GitLab API Calls

**Target:** P95 < 1000 ms (95th percentile of response times < 1 second)

| Endpoint | Target (P95) | Timeout | Notes |
|----------|-------------|---------|-------|
| GET projects | < 800ms | 5000ms | Paginated (20 items) |
| GET branch/{branch}/commits | < 1000ms | 5000ms | Limited to 50 commits |
| POST merge_requests | < 2000ms | 10000ms | Slower due to backend validation |
| GET approvals | < 500ms | 5000ms | Usually cached |

**Measurement:**
- Track in telemetry: `{ event: 'gitlabApi', endpointCall: 'GET /projects', durationMs: 750 }`
- Alert if P95 exceeds target > 2 consecutive hours
- Investigate for API degradation, network issues, or implementation inefficiencies

### IBM i Command Execution

**Target:** P95 < 3000 ms (95th percentile of IBM i command execution < 3 seconds)

| Command | Target (P95) | Timeout | Notes |
|---------|-------------|---------|-------|
| SSH auth | < 2000ms | 10000ms | High variance; network-dependent |
| Download member | < 3000ms | 15000ms | Depends on file size |
| Compile (SQLRPGLE) | < 30000ms | 60000ms | Compilation is slow |
| List library members | < 1000ms | 5000ms | Fast query |

**Measurement:**
- Always apply timeout; fail gracefully if exceeded
- Track in telemetry: `{ event: 'ibmiCommand', command: 'DSPLIB', durationMs: 2100, timedOut: false }`
- Alert user if command timeout exceeded (suggest checking IBM i host availability)

### RBAC API (Internal Rate Limiting Service)

**Target:** P95 ≤ 200 ms within corporate network

| Operation | Target (P95) | Timeout |
|-----------|-------------|---------|
| Check permission | ≤ 200ms | 500ms |
| List roles for user | ≤ 300ms | 1000ms |

**Rationale:** RBAC is called for every sensitive command; high latency blocks user workflow.

### Jira API Calls

**Target:** P95 < 2000 ms

| Operation | Target (P95) | Timeout |
|-----------|-------------|---------|
| Create issue | < 2000ms | 10000ms |
| Fetch issue | < 500ms | 3000ms |
| List issues (paginated) | < 1000ms | 5000ms |

---

## Memory & Resource Usage

### Memory Profile

**Target:** Steady-state memory < 200 MB; peak < 400 MB

| Scenario | Target | Notes |
|----------|--------|-------|
| Idle state | < 100 MB | Extension loaded but inactive |
| Tree views with 1000 items | < 200 MB | Repository tree with many projects |
| WebView open (complex UI) | < 250 MB | Webview renderer + VS Code overhead |
| Under heavy use (10 commands/min) | < 300 MB | Transient memory spike acceptable |

**How to Measure:**
```bash
# Start VS Code with extension profiler
code --prof-startup
# Inspect memory in Chrome DevTools
# chrome://inspect > inspect VS Code

# Or use Node.js memory profiling
node --inspect dist/extension.cjs
```

**Memory Leak Detection:**
- Automated memory snapshots before/after each test suite run
- Diff snapshots to detect growing allocations
- CI fails if memory grows > 50 MB across test suite

### Connection Limits

| Resource | Limit | Notes |
|----------|-------|-------|
| IBM i SSH connections | 3 concurrent | Per host; excess queued |
| HTTP connections (GitLab/Jira) | Max pool size 10 | Reuse connections |
| File handles | < 100 open | OS limit typically 1024 |

---

## UI Responsiveness

### Main Thread Blocking

**Target:** No operation blocks main thread > 100 ms

**Definition:** Long-running operations must use Web Workers or `setTimeout(..., 0)` to yield to other tasks.

**Violations:**
- ❌ Synchronous `JSON.parse()` of large objects (> 1 MB)
- ❌ Nested loops over large datasets without yields
- ❌ Synchronous file I/O
- ✅ Large operations broken into chunks with `setImmediate()` yields

**How to Test:**
```typescript
// BAD: Blocks main thread for 2+ seconds
const largeArray = new Array(1000000).fill(0);
const result = largeArray.filter(x => x > 0);

// GOOD: Yields to main thread every 1000 items
async function filterLarge(array: number[]): Promise<number[]> {
    const result: number[] = [];
    for (let i = 0; i < array.length; i++) {
        result.push(array[i]);
        if (i % 1000 === 0) await new Promise(r => setImmediate(r));
    }
    return result;
}
```

### UI Rendering Performance

**Target:** Tree view/webview renders in < 300 ms

| UI Element | Target Render Time |
|------------|-------------------|
| Command tree (100 items) | < 200ms |
| Repository list webview | < 300ms |
| Dependency visualization | < 500ms |

**Measure with DevTools Performance tab** (if webview):
1. Open DevTools (`F12` in webview)
2. Performance tab → Record
3. Perform action (click, expand tree)
4. Stop recording
5. Review "Rendering" section (should show < 300ms)

---

## Caching & Freshness

### Cache TTL (Time-To-Live) Targets

| Data Type | TTL | Invalidation Trigger |
|-----------|-----|----------------------|
| GitLab projects list | 15 minutes | Manual "Refresh" command, new project created |
| Branch list | 5 minutes | MR merged, branch pushed |
| IBM i member list | 1 minute | File synced, member compiled |
| Jira issues | 10 minutes | Issue transitioning, new comment |
| User permissions (RBAC) | 1 hour | User role changed, permission granted |
| Compiler output | 1 hour | New compilation run |

**Rationale:** Balances freshness (shorter TTL = fresher data) vs. API load (longer TTL = fewer API calls).

**Implementation:**
```typescript
const cache = new SimpleCache<string, Project[]>({
    ttlMs: 15 * 60 * 1000,  // 15 minutes
    maxSize: 1000
});
```

---

## Network Efficiency

### Data Transfer Targets

**Target:** Minimize bandwidth; compress responses

| Operation | Target Download | Notes |
|-----------|-----------------|-------|
| Repository list | < 500 KB | 100 projects at ~5KB each |
| Member content download | Streaming | Large files (>10 MB) streamed, not buffered |
| Dependency graph | < 2 MB | JSON representation of library structure |

**Optimization Practices:**
- ✅ Request only needed fields (avoid `SELECT *` in APIs)
- ✅ Use pagination (not unlimited result sets)
- ✅ Compress large responses (gzip)
- ✅ Stream large downloads (don't buffer entire file in memory)
- ❌ Download all data upfront (use lazy loading)

---

## Database & Query Performance

### GitLab API Query Performance

**Target:** Single API call < 1000 ms (P95)

**Violations (Examples):**
- ❌ Fetching entire project history (use pagination with limit)
- ❌ Fetching all approvals without filtering (use project filter)

**Optimization:**
```typescript
// BAD: No pagination, no limit
const commits = await gitlabClient.getCommits(projectId);

// GOOD: Paginated, limited to recent commits
const commits = await gitlabClient.getCommits(projectId, {
    page: 1,
    perPage: 50,
    orderBy: 'created_at',
    sort: 'desc'
});
```

### IBM i Query Performance

**Target:** List operations on IBM i < 3000 ms (P95)

**Examples:**
- `DSPLIB` – List all members in library
- `DSPSRC` – List all source members

**Optimization:**
- Limit initial result set (show first 100, "load more")
- Use sparse patterns (`DSPSRC *ALL SRCMBR(TEST*)`) to filter before transfer

---

## Telemetry & Logging Performance

### Telemetry Emission

**Target:** Telemetry events < 10 ms to emit (non-blocking)

**Implementation:** Telemetry is async and fire-and-forget; never block user action on telemetry.

```typescript
// GOOD: Non-blocking telemetry
trackEvent('command.executed', { command: 'gitlab.auth' }).catch(e => logger.error(e));

// BAD: Blocking telemetry
await trackEvent('command.executed', { command: 'gitlab.auth' });
```

### Logging Performance

**Target:** Logging < 5 ms per call in hot paths

**Optimization:**
- ✅ Use debug log level for high-frequency events (disabled by default)
- ✅ Avoid large object serialization in logs
- ❌ Log large JSON structures for every API call

---

## Performance Regression Detection

### Automated Monitoring

**CI/CD Checks:**
- ✅ Bundle size change tracked (alert if +10% or > 100 KB)
- ✅ TypeScript compilation time tracked (alert if +20%)
- ✅ Test suite runtime tracked (alert if +15%)

**Benchmark Tests (Run Weekly):**
```bash
npm run benchmark
# Output:
# suiteActivationTime: 1850ms (target: 2000ms) ✓
# commandGitlabAuth: 245ms (target: 500ms) ✓
# treeViewRender: 180ms (target: 300ms) ✓
```

**Alert Matrix:**
| Metric | Yellow (Warning) | Red (Blocker) |
|--------|-----------------|---------------|
| Activation time | > 2.0s | > 3.0s |
| VSIX size | > 4.5 MB | > 5.0 MB |
| Command response | > 400ms | > 700ms |
| Memory idle | > 150 MB | > 250 MB |

---

## Performance Tuning Guidelines

### Profiling Checklist

When performance targets are violated:

1. **Identify the bottleneck:**
   ```bash
   node --prof dist/extension.cjs
   node --prof-process isolate-*.log | head -50
   ```

2. **Root cause analysis:**
   - Is it a library (e.g., esbuild compilation slow)?
   - Is it application code (e.g., inefficient algorithm)?
   - Is it external service (e.g., GitLab API slow)?

3. **Choose optimization strategy:**
   - **Caching**: Store results for repeated queries
   - **Pagination**: Fetch smaller batches, load on demand
   - **Parallelization**: Fetch multiple independent resources concurrently
   - **Lazy Loading**: Defer non-critical initialization
   - **Algorithm Optimization**: Use faster data structures or algorithms

4. **Implement fix** and **validate** with measurements

### Common Optimizations

| Problem | Solution | Expected Improvement |
|---------|----------|----------------------|
| Large tree view (10K items) | Pagination, virtual scrolling | 10x faster render |
| Slow API calls | Caching with TTL | 100x faster (cache hits) |
| Bundled dependencies | Code splitting, dynamic imports | 50% smaller bundle |
| Memory leaks | Event listener cleanup | 20-30% memory reduction |
| Sync I/O | Async conversion | Main thread unblocked |

---

## SLA Reporting

### Performance Dashboard

**Monthly Reporting:**
- Activation time trend (plot over releases)
- Command response time percentiles (P50, P95, P99)
- API call latency by service (GitLab, Jira, IBM i)
- Memory usage profile (idle, active, peak)
- User-reported performance issues (if any)

**Escalation Criteria:**
- Activation time regression > 500 ms without explanation
- Any command response time > 1000 ms consistently
- Memory growth > 50 MB between releases
- User-reported slowness (>2 reports per week)

---

## References

- `instructions/lancelot.instructions.md` – Primary authority for Lancelot development
- `instructions/performance-optimization.instructions.md` – General performance best practices
- `instructions/copilot-it-architecture.instructions.md` – Architecture optimization patterns

---

**Last Updated:** 2026-01-24
**Status:** Active
**Owner:** Roland Strauss (GitHub Copilot Performance Authority)
**Next Review:** Q2 2026 (quarterly performance metrics review)
