# Hagere Hiwot Labs Task Platform — Git Workflow Standards

## 🎯 Purpose

This document defines the Git workflow standards for the Hagere Hiwot Labs Task Platform. Consistent Git practices enable efficient collaboration, clear history, and reliable deployments.

## 📁 Repository Structure

### Branches

```
main
├── develop
│   ├── feature/description-initials
│   ├── bugfix/description-initials
│   ├── hotfix/description-initials
│   ├── chore/description-initials
│   └── docs/description-initials
└── release/vX.Y.Z
```

### Protected Branches

| Branch    | Protection | Merge Requirements                                        |
| --------- | ---------- | --------------------------------------------------------- |
| `main`    | Full       | - 2 approvals<br>- All checks pass<br>- Squash merge only |
| `develop` | Partial    | - 1 approval<br>- All checks pass<br>- Squash merge only  |

## 🌿 Branch Strategy

### Branch Types

#### Feature Branches (`feature/*`)

```bash
# Format: feature/description-initials
feature/add-dark-mode-jd
feature/user-profile-avatar-ms
```

**Purpose**: Development of new features  
**Source**: `develop`  
**Destination**: `develop`  
**Lifespan**: 7 days maximum  
**Naming**: Lowercase, hyphens, include initials

#### Bugfix Branches (`bugfix/*`)

```bash
# Format: bugfix/description-initials
bugfix/login-error-500-jd
bugfix/mobile-layout-ms
```

**Purpose**: Fixing bugs in development  
**Source**: `develop`  
**Destination**: `develop`  
**Lifespan**: 3 days maximum

#### Hotfix Branches (`hotfix/*`)

```bash
# Format: hotfix/description-initials
hotfix/production-auth-bug-jd
```

**Purpose**: Critical fixes for production  
**Source**: `main`  
**Destination**: `main` and `develop`  
**Lifespan**: 24 hours maximum  
**Process**: Emergency process only

#### Chore Branches (`chore/*`)

```bash
# Format: chore/description-initials
chore/update-dependencies-jd
chore/ci-configuration-ms
```

**Purpose**: Maintenance tasks  
**Source**: `develop`  
**Destination**: `develop`  
**Lifespan**: 3 days maximum

#### Documentation Branches (`docs/*`)

```bash
# Format: docs/description-initials
docs/update-readme-jd
docs/api-documentation-ms
```

**Purpose**: Documentation updates  
**Source**: `develop`  
**Destination**: `develop`  
**Lifespan**: 3 days maximum

### Branch Creation Rules

1. **Always start from target branch**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-initials
   ```

2. **One feature per branch**
   - Keep changes focused
   - Easier to review
   - Simpler to revert if needed

3. **Maximum lifespan**
   - Feature: 7 days
   - Bugfix/Chore/Docs: 3 days
   - Hotfix: 24 hours
   - Stale branches auto-deleted

4. **Regular updates**

   ```bash
   # Rebase on develop regularly
   git fetch origin
   git rebase origin/develop

   # Resolve conflicts early
   ```

## 💾 Commit Standards

### Commit Message Format

```
type(scope): subject

body

footer
```

### Type (Required)

| Type       | Description                                         | Example                                    |
| ---------- | --------------------------------------------------- | ------------------------------------------ |
| `feat`     | A new feature                                       | `feat(auth): add refresh tokens`           |
| `fix`      | A bug fix                                           | `fix(api): handle null response`           |
| `docs`     | Documentation only                                  | `docs(readme): update setup instructions`  |
| `style`    | Formatting, missing semi colons, etc                | `style(ui): fix button padding`            |
| `refactor` | Code change that neither fixes bug nor adds feature | `refactor(api): extract validation logic`  |
| `perf`     | Performance improvement                             | `perf(db): add query indexes`              |
| `test`     | Adding missing tests                                | `test(auth): add login tests`              |
| `chore`    | Maintenance tasks                                   | `chore(deps): update packages`             |
| `ci`       | CI/CD changes                                       | `ci(github): add coverage check`           |
| `build`    | Build system changes                                | `build(webpack): update configuration`     |
| `revert`   | Revert a previous commit                            | `revert: "feat(auth): add refresh tokens"` |

### Scope (Optional)

- Package or module name
- Keep it concise
- Use lowercase
- Examples: `auth`, `ui`, `api`, `db`

### Subject (Required)

- 50 characters maximum
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end

### Body (Optional)

- Wrap at 72 characters
- Explain what and why vs. how
- Use bullet points if needed
- Reference issues using #

### Footer (Optional)

- Reference GitHub issues
- Breaking changes notice
- Migration instructions

### Examples

```bash
# Good
git commit -m "feat(auth): add password reset flow

- Add reset password endpoint
- Send email with reset token
- Validate token expiration

"

# Also good
git commit -m "fix(ui): correct button alignment on mobile"

# Bad
git commit -m "fixed some stuff"
git commit -m "update"
git commit -m "feat: did things"  # Missing scope, vague
```

## 🔀 Pull Request Process

### PR Creation Checklist

- [ ] Branch name follows convention
- [ ] PR title follows commit format
- [ ] Description includes what/why/how
- [ ] Linked to GitHub issue
- [ ] All checks passing
- [ ] No merge conflicts
- [ ] Self-reviewed changes
- [ ] Tests added/updated
- [ ] Documentation updated

### PR Description Template

```markdown
## What does this PR do?

Brief description of changes.

## Why is this change needed?

Problem being solved or feature being added.

## How was it tested?

- [ ] Unit tests added
- [ ] Integration tests updated
- [ ] Manual testing performed
- [ ] Edge cases considered

## Screenshots (if applicable)

Add before/after screenshots for UI changes.

## Checklist

- [ ] My code follows the style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Related Issues

Closes #123
Fixes #456
```

### PR Size Guidelines

| Type          | Ideal Size    | Maximum    |
| ------------- | ------------- | ---------- |
| Feature       | 200-500 lines | 1000 lines |
| Bugfix        | 50-200 lines  | 500 lines  |
| Refactor      | 100-400 lines | 800 lines  |
| Documentation | N/A           | N/A        |

**Rule**: If PR > 1000 lines, split into multiple PRs

## 👁️ Code Review Process

### Review Assignment

1. **Author**: Creates PR, assigns 2 reviewers
2. **Reviewers**: Selected based on expertise
3. **Timeline**: Respond within 24 hours
4. **Escalation**: If no response in 24h, ping in #code-reviews

### Review Guidelines

#### Do's

- "Consider extracting this into a helper function"
- "This might have an edge case when X happens"
- "Tests are missing for this scenario"
- "The naming could be more descriptive"
- "This pattern is used elsewhere, consider consistency"
- "Security consideration: [specific concern]"

#### Don'ts

- "This code is bad/wrong" (be specific)
- Sarcasm or dismissive language
- Blocking for personal preference
- Nitpicking without justification
- "You should have done it this way" (without explanation)

### Review Labels

| Label               | Meaning                  | Action               |
| ------------------- | ------------------------ | -------------------- |
| `approved`          | Ready to merge           | Merge when CI passes |
| `changes-requested` | Needs changes            | Author must address  |
| `comment`           | Non-blocking feedback    | Author may address   |
| `needs-discussion`  | Requires team discussion | Schedule discussion  |

### Review Checklist

- [ ] Code solves the stated problem
- [ ] Tests are adequate and pass
- [ ] Documentation updated
- [ ] Security considerations addressed
- [ ] Performance implications considered
- [ ] Follows existing patterns and conventions
- [ ] Error handling is appropriate
- [ ] Logging is adequate
- [ ] No sensitive data exposed
- [ ] Accessibility considered (for UI)

## 🚀 Merge Process

### After Approval

1. **Author addresses feedback**

   ```bash
   # Make requested changes
   git add .
   git commit -m "fix: address review comments"
   git push
   ```

2. **Squash commits** (if multiple)

   ```bash
   # Interactive rebase
   git rebase -i origin/develop
   # Squash all but first commit
   ```

3. **Update branch** (if needed)

   ```bash
   git fetch origin
   git rebase origin/develop
   ```

4. **Merge**
   - Use "Squash and merge" for feature branches
   - Use "Rebase and merge" for single-commit PRs
   - Never use "Merge commit" for feature branches

5. **Delete branch**
   - Delete source branch after merge
   - Clean up local branch
   ```bash
   git branch -d feature/your-feature
   git fetch --prune
   ```

### Merge Strategies

| Branch Type | Merge Strategy   | Notes                        |
| ----------- | ---------------- | ---------------------------- |
| `feature/*` | Squash and merge | Creates single commit        |
| `bugfix/*`  | Squash and merge | Creates single commit        |
| `hotfix/*`  | Rebase and merge | Preserves individual commits |
| `chore/*`   | Squash and merge | Creates single commit        |
| `docs/*`    | Squash and merge | Creates single commit        |

## 🔄 Hotfix Process

### When to Create Hotfix

- Production is down
- Critical security vulnerability
- Data loss or corruption
- Legal/compliance issue

### Hotfix Steps

1. **Create from main**

   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/description-initials
   ```

2. **Make minimal changes**
   - Fix only the critical issue
   - Add tests if possible
   - Document the fix

3. **Test thoroughly**

   ```bash
   npm run test
   npm run build
   ```

4. **Merge to main**

   ```bash
   # Get approval from team lead
   git checkout main
   git merge --no-ff hotfix/description-initials
   git tag -a v1.0.1 -m "Hotfix: description"
   git push origin main --tags
   ```

5. **Merge to develop**

   ```bash
   git checkout develop
   git merge main
   git push origin develop
   ```

6. **Cleanup**
   ```bash
   git branch -d hotfix/description-initials
   git push origin --delete hotfix/description-initials
   ```

## 🛠️ Git Configuration

### Recommended .gitconfig

```ini
[user]
    name = Your Name
    email = your.email@example.com

[core]
    editor = code --wait
    autocrlf = input

[pull]
    rebase = false

[push]
    default = current

[merge]
    ff = only

[alias]
    co = checkout
    br = branch
    ci = commit
    st = status
    lg = log --oneline --graph --decorate
    recent = log --oneline -10
    undo = reset --soft HEAD~1
```

### Pre-commit Hooks

```bash
# Install Husky hooks
npm run prepare

# Hooks automatically run:
# 1. lint-staged (ESLint, Prettier)
# 2. TypeScript compilation check
# 3. Test affected files
```

## 🧹 Cleanup & Maintenance

### Daily Cleanup

```bash
# Delete merged branches
git branch --merged develop | grep -v "develop" | grep -v "main" | xargs git branch -d

# Prune remote references
git fetch --prune
```

### Weekly Cleanup

```bash
# List stale branches (30+ days)
git branch -r | awk '{print $1}' | egrep -v -f /dev/fd/0 <(git branch -vv | grep origin) | awk '{print $1}'

# Delete stale branches (with team approval)
git push origin --delete stale-branch
```

### Branch Hygiene Rules

1. **Delete after merge**: Immediately after PR merge
2. **Stale branches**: Auto-delete after 30 days
3. **Naming conventions**: Enforced by CI
4. **Size limits**: PR size checks in CI

## 🚨 Common Issues & Solutions

### Merge Conflicts

```bash
# Rebase and resolve conflicts
git fetch origin
git rebase origin/develop

# Resolve conflicts, then
git add .
git rebase --continue

# If stuck, abort
git rebase --abort
```

### Accidentally Pushed to Main

```bash
# Revert the commit
git revert <commit-sha>

# Force push (only if you're sure)
git push origin main --force-with-lease
```

### Lost Changes

```bash
# Find lost commits
git reflog

# Recover
git cherry-pick <commit-sha>
```

### Wrong Branch

```bash
# Stash changes
git stash

# Switch branch
git checkout correct-branch

# Apply stash
git stash pop
```

## 📈 Best Practices

### Commit Often

- Small, logical commits
- Each commit should work independently
- Easier to review and revert

### Write Good Messages

- Follow conventional commits
- Explain why, not just what
- Reference issues

### Keep History Clean

- Rebase instead of merge
- Squash WIP commits
- Remove temporary commits

### Collaborate Effectively

- Communicate about conflicting work
- Review each other's code regularly
- Help with complex merges

### Use Git Features

- `.gitignore` properly configured
- Use hooks for quality
- Tags for releases
- Submodules if needed

## 🔧 Tools & Extensions

### Recommended Tools

- **GitHub CLI**: `gh` for PR management
- **GitLens**: VS Code extension
- **SourceTree**: GUI for complex operations
- **Tig**: Terminal UI for Git

### VS Code Settings

```json
{
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "git.autofetch": true,
  "git.fetchOnPull": true,
  "git.pruneOnFetch": true
}
```

## 📚 Learning Resources

### Documentation

- [Pro Git Book](https://git-scm.com/book/en/v2)
- [GitHub Git Cheat Sheet](https://training.github.com/downloads/github-git-cheat-sheet/)
- [Conventional Commits](https://www.conventionalcommits.org/)
