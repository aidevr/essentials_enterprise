# Git Workflow Guide

## Step 1: Clone the Repository
To clone the repository, run:
```bash
git clone <repository-url>
cd backend
```
**Explanation**: This step downloads the repository to your local machine and navigates into the project directory.

## Step 2: Create a New Branch
Create a new branch for your changes:
```bash
git checkout -b <branch-name>
```
**Explanation**: A new branch allows you to work on your changes without affecting the main codebase.

## Step 3: Make Changes and Commit
After making changes to the code, stage and commit them:
```bash
git add .
git commit -m "Your commit message"
```
**Explanation**: Staging (`git add`) prepares your changes for commit, and committing saves them with a descriptive message.

## Step 4: Push the Branch
Push your branch to the remote repository:
```bash
git push -u origin <branch-name>
```
**Explanation**: This uploads your branch to the remote repository, making it available for collaboration.

## Step 5: Create a Pull Request (PR)
1. Go to your repository on GitHub.
2. Navigate to the "Pull Requests" tab.
3. Click "New Pull Request."
4. Select your branch and compare it with the `master` branch.
5. Add a title and description, then click "Create Pull Request."
**Explanation**: A PR allows you to propose your changes and request a review before merging them into the main branch.

## Step 6: Review and Merge the PR
1. Review the changes in the PR.
2. Once approved, click "Merge Pull Request."
3. Confirm the merge and delete the branch if no longer needed.
**Explanation**: Merging integrates your changes into the main branch, and deleting the branch keeps the repository clean.

---

# GitHub Actions
GitHub Actions automates workflows like testing, building, and deploying your application. For this application:

## Set Up a Workflow
Create a `.github/workflows/ci.yml` file.

## Example Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - master
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '22'

    - name: Install dependencies
      run: npm install

    - name: Run tests
      run: npm test
```
**Explanation**: This workflow ensures that your code is tested and built automatically whenever changes are pushed or a PR is created.

## Trigger
This workflow runs on every push to the `master` branch or when a PR is created.

---

## Visual Guide (Snapshots)

### Cloning the Repository
![Clone Repository](path/to/clone-snapshot.png)

### Creating a New Branch
![Create Branch](path/to/create-branch-snapshot.png)

### Committing Changes
![Commit Changes](path/to/commit-snapshot.png)

### Pushing the Branch
![Push Branch](path/to/push-snapshot.png)

### Creating a Pull Request
![Create PR](path/to/create-pr-snapshot.png)

### Merging the Pull Request
![Merge PR](path/to/merge-pr-snapshot.png)

**Note**: Replace `path/to/...` with the actual paths to the snapshots once they are captured.

---

## Generating SBOM for the Current Application

To generate a Software Bill of Materials (SBOM) for this application using CycloneDX, follow these steps:

### Step 1: Validate `package.json`
Ensure the `package.json` file in the project is valid and does not contain unexpected or malformed fields. You can validate it using:
```bash
npm run validate
```

### Step 2: Install CycloneDX CLI
Install CycloneDX globally to ensure it is available for use:
```bash
npm install -g @cyclonedx/bom
```

### Step 3: Run CycloneDX in Debug Mode
If you encounter issues, enable debug mode to get more details:
```bash
DEBUG=cyclonedx-bom npx @cyclonedx/bom -o sbom.json
```

### Step 4: Check for Unsupported Fields
Inspect the `package.json` for custom or non-standard fields. Remove them temporarily to test if CycloneDX works.

### Step 5: Use a Minimal Project
If the issue persists, create a minimal `package.json` with only essential fields and dependencies:
```json
{
  "name": "todo-backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

### Step 6: Update CycloneDX
Ensure you are using the latest version of CycloneDX:
```bash
npm install -g @cyclonedx/bom@latest
```

### Step 7: Generate SBOM
Once resolved, generate the SBOM for this application using:
```bash
npx @cyclonedx/bom -o sbom.json
```

The generated `sbom.json` file will contain the Software Bill of Materials for the current application.
