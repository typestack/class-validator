# Guide: Fork and Push Your Changes

## The Problem
You're trying to push directly to `typestack/class-validator`, but you don't have write permissions to that repository. This is normal for open source projects!

## The Solution: Fork the Repository

### Step 1: Fork the Repository on GitHub

1. Go to https://github.com/typestack/class-validator
2. Click the **"Fork"** button in the top right corner
3. This creates a copy of the repository under your GitHub account (e.g., `https://github.com/YOUR_USERNAME/class-validator`)

### Step 2: Add Your Fork as a Remote

After forking, run these commands (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
# Add your fork as a remote named "fork" (or "myfork")
git remote add fork https://github.com/YOUR_USERNAME/class-validator.git

# Verify remotes
git remote -v
```

You should see:
- `origin` → points to typestack/class-validator (upstream)
- `fork` → points to YOUR_USERNAME/class-validator (your fork)

### Step 3: Stage and Commit Your Changes

```bash
# Stage all changes
git add .

# Commit with the provided message
git commit -F COMMIT_MESSAGE.txt

# Or commit manually
git commit -m "feat: add IsUserName validator for username validation"
```

### Step 4: Push to Your Fork

```bash
# Push to your fork (not origin!)
git push fork feat/add-is-username-validator

# If this is the first push, use:
git push -u fork feat/add-is-username-validator
```

### Step 5: Create a Pull Request

1. Go to your fork on GitHub: `https://github.com/YOUR_USERNAME/class-validator`
2. You'll see a banner saying "feat/add-is-username-validator had recent pushes" with a **"Compare & pull request"** button
3. Click that button
4. Fill in the PR description using the content from `PR_DESCRIPTION.md`
5. Submit the pull request!

## Alternative: If You Already Have a Fork

If you already forked the repository, you might need to update your fork first:

```bash
# Fetch latest changes from upstream
git fetch origin

# Update your local master branch
git checkout master
git pull origin master

# Update your fork
git push fork master
```

## Quick Reference Commands

```bash
# Check current remotes
git remote -v

# Add your fork (one time setup)
git remote add fork https://github.com/YOUR_USERNAME/class-validator.git

# Create feature branch (already done)
git checkout -b feat/add-is-username-validator

# Commit changes
git add .
git commit -F COMMIT_MESSAGE.txt

# Push to your fork
git push -u fork feat/add-is-username-validator
```

## Troubleshooting

### Error: "remote fork already exists"
If you already added your fork, you can update it:
```bash
git remote set-url fork https://github.com/YOUR_USERNAME/class-validator.git
```

### Error: "Permission denied"
Make sure you're pushing to YOUR fork, not the original repository. Use `fork` remote, not `origin`.

### Error: "Updates were rejected"
If your fork is behind, update it first:
```bash
git fetch origin
git rebase origin/master
git push fork feat/add-is-username-validator --force-with-lease
```

