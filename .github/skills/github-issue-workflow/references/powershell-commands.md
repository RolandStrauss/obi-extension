# PowerShell Commands for GitHub Workflow

PowerShell equivalents for GitHub issue workflow automation.

## Detect Default Branch

```powershell
$DEFAULT_BRANCH = (gh repo view --json defaultBranchRef --jq ".defaultBranchRef.name")
```

## Find or Create Issue

```powershell
$ISSUE_JSON = gh issue list --state open --search "in:title '<ISSUE_TITLE>'" --json number,title | ConvertFrom-Json

if (-not $ISSUE_JSON) {
    $body = @"
### Original Request
<REQUEST>

### Context & Acceptance Criteria
- <criterion 1>
- <criterion 2>

### Implementation Plan
1. <step 1>
2. <step 2>

### Checklist
- [ ] Code updated
- [ ] Tests added/updated
- [ ] Docs updated
"@
    gh issue create --title "<ISSUE_TITLE>" --body $body --label "auto-generated" --label "copilot-task" | Out-Null
    $ISSUE_JSON = gh issue list --state open --search "in:title '<ISSUE_TITLE>'" --json number | ConvertFrom-Json
}

$ISSUE_NUMBER = $ISSUE_JSON[0].number
$ISSUE_URL = (gh issue view $ISSUE_NUMBER --json url --jq ".url")
```

## Branch Naming

```powershell
$SHORT = ("<ISSUE_TITLE>".ToLower() -replace "[^a-z0-9]+","-").Trim("-")
if ($SHORT.Length -gt 40) { $SHORT = $SHORT.Substring(0,40) }
$BRANCH = "feature/$ISSUE_NUMBER-$SHORT"

git fetch origin $DEFAULT_BRANCH | Out-Null
git checkout -b $BRANCH "origin/$DEFAULT_BRANCH"
```

## Make Changes and Commit

```powershell
git add -A
git commit -m "Implement: <ISSUE_TITLE> (#$ISSUE_NUMBER)"
git push -u origin $BRANCH
```

## Create or Reuse PR

```powershell
$EXISTING_PR = gh pr list --head $BRANCH --json number | ConvertFrom-Json

if (-not $EXISTING_PR) {
    $prBody = @"
## Summary
<what changed>

## Implementation Notes
<how it was done>

## Testing
<how verified>

## Risks & Mitigations
<risks>

Closes #$ISSUE_NUMBER
"@
    gh pr create --base $DEFAULT_BRANCH --head $BRANCH --title "Fix: <ISSUE_TITLE>" --body $prBody --label "auto-generated" --label "copilot-task" | Out-Null
}

$PR_URL = (gh pr view --head $BRANCH --json url --jq ".url")
```

## Optional: Merge and Close

```powershell
# Merge PR (if policy allows)
# gh pr merge --squash --auto $PR_URL

# Fallback close issue
# gh issue close $ISSUE_NUMBER --reason "completed"
```

## Error Handling

```powershell
try {
    # Your command here
    gh issue create --title "Test" --body "Test"
} catch {
    Write-Error "Command failed: $_"
    exit 1
}
```

## String Manipulation Tips

```powershell
# Convert to lowercase
$text.ToLower()

# Replace multiple spaces/special chars with hyphen
$text -replace "[^a-z0-9]+", "-"

# Trim leading/trailing hyphens
$text.Trim("-")

# Limit length
if ($text.Length -gt 40) {
    $text = $text.Substring(0, 40)
}
```
