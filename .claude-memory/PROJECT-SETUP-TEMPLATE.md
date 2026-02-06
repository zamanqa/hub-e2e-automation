# Project Setup Template for Claude AI Integration

> **Purpose**: Use this template to set up new projects with the same structure and AI instructions that work with Claude Code.

---

## 📋 Table of Contents

1. [AI Instruction Files Overview](#ai-instruction-files-overview)
2. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
3. [File Templates](#file-templates)
4. [Project Structure Template](#project-structure-template)
5. [Customization Guide](#customization-guide)

---

## AI Instruction Files Overview

### Primary AI Files Location: `.claude-memory/`

This project uses **4 core AI instruction files** that Claude reads to understand your project:

| File | Purpose | When Claude Reads It |
|------|---------|---------------------|
| `claude-instructions.md` | Token optimization rules and session protocols | Start of every session |
| `claude-memory.md` | Project knowledge base (patterns, conventions, selectors) | Start of every session |
| `session-starter.md` | Quick reminder for session start/end | Start of session |
| `session-history.md` | Recent session tracking (last 5 sessions) | Start of session |

### Additional Optional File:
- `CLAUDE-CODE-GUIDE.md` - User guide for how to work with Claude on this project

---

## Step-by-Step Setup Guide

### Step 1: Create `.claude-memory/` Folder

```bash
# In your project root
mkdir .claude-memory
cd .claude-memory
```

### Step 2: Create Core AI Files

Create these 4 files in `.claude-memory/`:

1. `claude-instructions.md` - Copy template from [Section A](#template-a-claude-instructionsmd)
2. `claude-memory.md` - Copy template from [Section B](#template-b-claude-memorymd)
3. `session-starter.md` - Copy template from [Section C](#template-c-session-startermd)
4. `session-history.md` - Copy template from [Section D](#template-d-session-historymd)

### Step 3: Customize for Your Project

Update these sections in `claude-memory.md`:

1. **Project Overview** - Change project name, framework, database, etc.
2. **File Structure** - Map your actual project structure
3. **Code Organization Pattern** - Add your code patterns (Page Objects, Services, etc.)
4. **Selector Patterns** - Add your UI library selectors (Material UI, Ant Design, etc.)
5. **Test Structure** - Define your preferred test structure
6. **Important Conventions** - Add your team's coding conventions

### Step 4: Add to Git

```bash
# Add .claude-memory folder to git
git add .claude-memory/
git commit -m "Add Claude AI instruction files for project setup"
git push
```

### Step 5: Test with Claude

Open your project with Claude Code and say:
```
Claude, read .claude-memory/claude-memory.md and confirm you understand the project structure
```

---

## File Templates

### Template A: `claude-instructions.md`

```markdown
# Claude Operating Instructions

> **CRITICAL**: Read this file at the start of EVERY session BEFORE doing anything else.

---

## 🎯 Primary Directive: MINIMIZE TOKEN USAGE

**Token Budget**: Always use the minimum tokens necessary to complete tasks efficiently.

---

## 📋 Start of Session Protocol

### Step 1: Load Memory First (REQUIRED)
1. Read .claude-memory/claude-memory.md FIRST
2. Read .claude-memory/session-starter.md for context
3. Check for session-history.md (if exists, read it)
4. NEVER search through old chat history
5. NEVER read long conversation transcripts

### Step 2: Quick Status Check
1. Check git status (if needed)
2. Ask user: "What would you like to work on today?"
3. Get to work immediately

---

## 💰 Token Optimization Rules

### ✅ DO THIS (Low Token Usage)

1. **Read Memory Files**
   - `.claude-memory/claude-memory.md` - Project knowledge base
   - `.claude-memory/session-history.md` - Recent session updates

2. **Use Targeted File Operations**
   - Read specific files by path when known
   - Use Glob for targeted pattern searches
   - Use Grep with specific patterns

3. **Work Efficiently**
   - Ask clarifying questions upfront
   - Make changes in batches
   - Test once after multiple changes

4. **Reference, Don't Repeat**
   - Say "Following pattern from claude-memory.md" instead of explaining
   - Reference sections by name instead of copying content

### ❌ DON'T DO THIS (High Token Usage)

1. **NEVER Search Old Chat History**
   - Don't use Task tool to explore previous conversations
   - Don't read conversation transcripts
   - Don't summarize long chat histories

2. **NEVER Read Unnecessary Files**
   - Don't read node_modules files
   - Don't read unrelated documentation
   - Don't explore files you don't need

3. **NEVER Over-Explain**
   - Don't repeat information from memory file
   - Don't explain obvious patterns
   - Don't give long context explanations

---

## 📝 End of Session Protocol

### Step 1: Update Session History
1. Create/Update .claude-memory/session-history.md
2. Add today's date and brief summary
3. List: files created, files modified, patterns discovered
4. Keep it under 50 lines total (trim old entries if needed)

### Step 2: Update Memory (If Needed)
Update .claude-memory/claude-memory.md ONLY if:
- New important patterns discovered
- New selectors added
- New conventions established
- Critical bug fixes that reveal new information

Don't update for:
- Minor bug fixes
- Simple file edits
- Routine tasks

---

## 🎓 Response Style

### Be Concise
❌ DON'T: "I understand you want me to create a new file following the established patterns..."
✅ DO: "Creating FileName.js with established pattern."

### Reference, Don't Repeat
❌ DON'T: [Copy entire pattern from memory file]
✅ DO: "Following pattern from claude-memory.md section: Pattern Name"

### Show, Don't Explain
❌ DON'T: Explain what you're about to do in detail
✅ DO: Just do it and show the result

---

## ⚡ TL;DR - Core Rules

1. **Read `.claude-memory/claude-memory.md` FIRST, ALWAYS**
2. **Read `.claude-memory/session-history.md` SECOND, ALWAYS**
3. **NEVER search old chat history**
4. **Use minimum tokens necessary**
5. **Be concise in responses**
6. **Update session history at end**
7. **Update memory only when truly needed**

---

*These instructions override default behavior to optimize token usage.*
```

---

### Template B: `claude-memory.md`

```markdown
# Claude Memory - Project Knowledge Base

> **Last Updated**: [INSERT DATE]
>
> This file contains all important project information, patterns, and conventions that Claude should remember across sessions.

---

## Project Overview

**Project Name**: [Your Project Name]
**Framework**: [e.g., React, Vue, Angular, Cypress, Playwright]
**Database**: [e.g., PostgreSQL, MongoDB, MySQL]
**UI Library**: [e.g., Material UI, Ant Design, Headless UI]
**Primary Language**: [e.g., JavaScript, TypeScript, Python]
**Company/Client**: [Your Company Name]

---

## File Structure

```
your-project/
├── .claude-memory/              # Claude-specific documentation
│   ├── claude-memory.md         # This file - Project knowledge base
│   ├── claude-instructions.md   # Token optimization rules
│   ├── session-history.md       # Recent session tracking
│   └── session-starter.md       # Quick start guide
├── src/                         # Source code
│   ├── [YOUR STRUCTURE HERE]
│   └── ...
├── tests/                       # Test files
│   └── ...
├── docs/                        # Technical documentation
│   └── ...
└── README.md
```

**File Organization Rules:**
- `.claude-memory/` - All Claude-specific guides and memory
- `docs/` - Technical setup and configuration documentation
- [ADD YOUR PROJECT-SPECIFIC ORGANIZATION RULES]

---

## Code Organization Pattern

### [YOUR PATTERN NAME] (CRITICAL)

**✅ CORRECT PATTERN**:
```javascript
// Add your project's correct code pattern here
// Example: Component structure, Class structure, Test structure, etc.
```

**❌ WRONG PATTERN**:
```javascript
// Add anti-patterns to avoid
```

---

## Selector Patterns (For UI Testing Projects)

### Buttons
```javascript
// Add your button selector patterns
```

### Inputs
```javascript
// Add your input selector patterns
```

### [Add More UI Elements]
```javascript
// Add more patterns as needed
```

---

## Database Queries (For Backend/Test Projects)

### Important Queries Location
**File**: [path to query file]

**Key Methods**:
- `methodName()` - Description
- `anotherMethod()` - Description

---

## Test Structure (For Testing Projects)

### Preferred Test Pattern
```javascript
// Add your preferred test structure
describe('Test Suite', () => {
  it('should do something', () => {
    // Test code
  });
});
```

---

## Important Conventions

### 1. [Convention Category]
- Rule 1
- Rule 2

### 2. [Another Category]
- Rule 1
- Rule 2

---

## User Preferences

1. ✅ [Preference 1]
2. ✅ [Preference 2]
3. ✅ [Preference 3]

---

## Common Pitfalls to Avoid

1. ❌ [Pitfall 1]
2. ❌ [Pitfall 2]
3. ❌ [Pitfall 3]

---

## Quick Reference Commands

### Run Tests (if applicable)
```bash
# Run command
npm test

# Other commands
npm run build
```

### Git Commands
```bash
# Stage files
git add <files>

# Commit
git commit -m "message"

# Push
git push origin branch-name
```

---

## Environment

**Working Directory**: [Your project path]
**Node Version**: [Your Node version]
**Platform**: [Windows/Mac/Linux]

---

## How to Update This File

### When to Update

Update this file after:
- ✅ Creating new important files or modules
- ✅ Discovering new patterns or conventions
- ✅ Changing project structure
- ✅ Completing major features
- ✅ User provides new preferences

### Update Format

```markdown
**Update (YYYY-MM-DD)**: Brief description
- Item 1
- Item 2
```

---

*This is a living document. Update as project evolves.*
```

---

### Template C: `session-starter.md`

```markdown
# Session Starter for Claude

> **Purpose**: Quick reminder to load project memory at the start of each session

---

## 🔄 Start of Session Instructions

**Dear Claude**, at the start of each session:

1. **Read the memory file first**: `.claude-memory/claude-memory.md`
2. **Review recent changes**: Check git status or recent file modifications
3. **Ask user for current task**: "What would you like to work on today?"

---

## 💾 End of Session Instructions

**Dear Claude**, at the end of each session:

1. **Update session history**: Add entry to `.claude-memory/session-history.md`
2. **Update memory file (if needed)**: Add new patterns to `.claude-memory/claude-memory.md`
3. **Format**:
   ```markdown
   ## Session: YYYY-MM-DD

   ### Tasks Completed
   - Task 1
   - Task 2

   ### Files Created/Modified
   - file1.js
   - file2.js
   ```

---

## 📋 Quick Commands for User

### Start Session
```
Claude, read .claude-memory/claude-memory.md and let me know you're ready
```

### End Session
```
Claude, update .claude-memory/session-history.md with today's changes
```

### Add Specific Info
```
Claude, add to memory: [specific information]
```

---

## 🎯 Current Priority

**Focus Area**: [Current work area]
**Current Files**: [Files being worked on]
**Next Tasks**: [Upcoming tasks]

---

*Save this file for easy reference!*
```

---

### Template D: `session-history.md`

```markdown
# Session History

> Keep only last 5 sessions. Trim older entries to save tokens.

---

## Session: [YYYY-MM-DD]

### Tasks Completed
- Task 1
- Task 2

### Files Created
- path/to/file1.js - Description
- path/to/file2.js - Description

### Files Modified
- path/to/file3.js - What was changed
- path/to/file4.js - What was changed

### Important Discoveries
- Discovery 1
- Discovery 2

### Next Session TODO
- [ ] Task for next time
- [ ] Another task

---

## Session: [Previous Date]

[Keep only 4 more previous sessions, then delete older ones]

---

*Note: Keep this file under 50 lines total. Trim old sessions as needed.*
```

---

## Project Structure Template

### For E2E Testing Projects (Cypress/Playwright)

```
your-e2e-project/
├── .claude-memory/
│   ├── claude-instructions.md
│   ├── claude-memory.md
│   ├── session-starter.md
│   └── session-history.md
├── cypress/ or tests/
│   ├── e2e/
│   │   └── [test-files].cy.js
│   ├── support/
│   │   ├── page-objects/
│   │   ├── helpers/
│   │   └── commands/
│   └── fixtures/
├── docs/
│   └── [technical-docs].md
├── .env
├── .env.example
├── .gitignore
├── cypress.config.js or playwright.config.js
├── package.json
└── README.md
```

### For Web Applications (React/Vue/Angular)

```
your-web-app/
├── .claude-memory/
│   ├── claude-instructions.md
│   ├── claude-memory.md
│   ├── session-starter.md
│   └── session-history.md
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── App.js
├── public/
├── tests/
│   └── [test-files].test.js
├── docs/
│   └── [technical-docs].md
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### For Backend API Projects (Node.js/Express)

```
your-api-project/
├── .claude-memory/
│   ├── claude-instructions.md
│   ├── claude-memory.md
│   ├── session-starter.md
│   └── session-history.md
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── app.js
├── tests/
│   └── [test-files].test.js
├── docs/
│   ├── API.md
│   └── [other-docs].md
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Customization Guide

### Step 1: Identify Your Project Type

Choose the template that best matches your project:
- E2E Testing Project → Use Cypress/Playwright template
- Web Application → Use React/Vue/Angular template
- Backend API → Use Node.js/Express template
- Other → Adapt the closest template

### Step 2: Update Project Overview

In `claude-memory.md`, update the **Project Overview** section:

```markdown
**Project Name**: Your Actual Project Name
**Framework**: Your Framework (e.g., React 18, Cypress 13)
**Database**: Your Database (e.g., PostgreSQL 15)
**UI Library**: Your UI Library (e.g., Material UI v5)
**Primary Language**: TypeScript
**Company/Client**: Your Company
```

### Step 3: Map Your File Structure

Update the **File Structure** section with your actual folder structure:

```markdown
## File Structure

```
your-project/
├── .claude-memory/
├── [YOUR ACTUAL FOLDERS]
│   ├── [YOUR SUBFOLDERS]
│   └── ...
└── README.md
```
```

### Step 4: Add Your Code Patterns

Replace the generic code patterns with your actual patterns:

**For Page Object Pattern (E2E Testing)**:
```javascript
class YourPage {
  // Selector
  get elementName() {
    return cy.get('[your-selector]');
  }

  // Action
  clickElement() {
    this.elementName.click();
  }
}

export default new YourPage();
```

**For Component Pattern (React)**:
```javascript
const YourComponent = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* Your JSX */}
    </div>
  );
};

export default YourComponent;
```

### Step 5: Add Your Selectors

If you're doing UI testing, add your selector patterns:

**For Material UI**:
```javascript
// Buttons
cy.get('button.MuiButton-root').contains('Text')

// Text Fields
cy.get('.MuiTextField-root input')

// Select Dropdowns
cy.get('.MuiSelect-select').click()
```

**For Ant Design**:
```javascript
// Buttons
cy.get('.ant-btn').contains('Text')

// Inputs
cy.get('.ant-input')

// Select
cy.get('.ant-select').click()
```

### Step 6: Add Your Conventions

Document your team's coding conventions:

```markdown
## Important Conventions

### 1. Naming Conventions
- Files: camelCase.js
- Components: PascalCase
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE

### 2. Code Style
- Use single quotes for strings
- Use 2 spaces for indentation
- Add semicolons at end of statements

### 3. Testing Conventions
- Test file names: fileName.test.js
- Describe blocks: describe('ComponentName', ...)
- Test names: it('should do something', ...)
```

### Step 7: Add Your Preferences

Document your personal/team preferences:

```markdown
## User Preferences

1. ✅ Always ask before pushing to git
2. ✅ Run tests before committing
3. ✅ Use TypeScript for new files
4. ✅ Follow Airbnb style guide
5. ✅ Write unit tests for all functions
```

---

## Example: Converting This Template for a React Project

### Original Template (Generic):
```markdown
**Project Name**: [Your Project Name]
**Framework**: [e.g., React, Vue, Angular]
```

### Customized for React E-commerce Project:
```markdown
**Project Name**: E-commerce Store Frontend
**Framework**: React 18.2.0 with TypeScript
**Database**: Firebase Firestore
**UI Library**: Material UI v5.14
**State Management**: Redux Toolkit
**Primary Language**: TypeScript
**Company/Client**: ABC E-commerce Inc.
```

### File Structure (Customized):
```markdown
## File Structure

```
ecommerce-store/
├── .claude-memory/
│   ├── claude-instructions.md
│   ├── claude-memory.md
│   ├── session-starter.md
│   └── session-history.md
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── product/
│   │   └── cart/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProductPage.tsx
│   │   └── CheckoutPage.tsx
│   ├── store/
│   │   ├── slices/
│   │   └── store.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── firebase.ts
│   ├── utils/
│   ├── types/
│   └── App.tsx
├── public/
├── tests/
├── docs/
├── .env
├── .gitignore
├── package.json
└── README.md
```
```

### Code Pattern (Customized for React):
```markdown
## Code Organization Pattern

### React Component Structure (CRITICAL)

**✅ CORRECT PATTERN**:
```javascript
import React from 'react';
import { Box, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface Props {
  title: string;
  onAction: () => void;
}

const ComponentName: React.FC<Props> = ({ title, onAction }) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.slice);

  const handleClick = () => {
    // Logic here
    onAction();
  };

  return (
    <Box>
      <Button onClick={handleClick}>{title}</Button>
    </Box>
  );
};

export default ComponentName;
```

**❌ WRONG PATTERN**:
```javascript
// Don't use default exports for everything
// Don't mix Props interface with implementation
// Don't use any type
```
```

---

## Quick Start Checklist

Use this checklist when setting up a new project:

- [ ] Create `.claude-memory/` folder in project root
- [ ] Copy `claude-instructions.md` template
- [ ] Copy `claude-memory.md` template
- [ ] Copy `session-starter.md` template
- [ ] Copy `session-history.md` template
- [ ] Update **Project Overview** in `claude-memory.md`
- [ ] Update **File Structure** in `claude-memory.md`
- [ ] Add **Code Patterns** specific to your project
- [ ] Add **Selector Patterns** (if UI testing project)
- [ ] Add **Conventions** and **Preferences**
- [ ] Add `.claude-memory/` to git
- [ ] Commit and push to repository
- [ ] Test with Claude: "Read .claude-memory/claude-memory.md"

---

## Benefits of This Setup

### 1. Token Efficiency
- Claude doesn't need to search old conversations
- All project knowledge in one place
- Reduces repetitive explanations

### 2. Consistency
- Same patterns across all team members
- New team members can onboard quickly
- Claude follows your conventions every time

### 3. Knowledge Retention
- Project knowledge persists across sessions
- No need to re-explain patterns
- Session history tracks what was done

### 4. Scalability
- Easy to add new patterns as project grows
- Can be adapted for different project types
- Template can be reused across multiple projects

---

## Troubleshooting

### Issue: Claude doesn't read memory files

**Solution**: Explicitly ask Claude to read them at the start:
```
Claude, read .claude-memory/claude-memory.md and confirm you're ready
```

### Issue: Memory file is getting too large

**Solution**:
1. Keep only essential patterns
2. Remove outdated information
3. Split into multiple topic-specific files if needed

### Issue: Claude forgets conventions mid-session

**Solution**:
1. Remind Claude: "Check claude-memory.md for the pattern"
2. Update session-history.md more frequently
3. Make conventions more explicit in memory file

---

## Advanced Tips

### 1. Multiple Memory Files

For large projects, you can create topic-specific memory files:

```
.claude-memory/
├── claude-instructions.md
├── claude-memory.md (overview)
├── patterns-components.md
├── patterns-testing.md
├── patterns-database.md
└── session-history.md
```

Reference them in `claude-memory.md`:
```markdown
See also:
- `.claude-memory/patterns-components.md` for component patterns
- `.claude-memory/patterns-testing.md` for test patterns
```

### 2. Project-Specific Commands

Add project-specific commands to `claude-memory.md`:

```markdown
## Quick Commands

### Development
```bash
npm run dev          # Start dev server
npm run test:watch   # Run tests in watch mode
npm run lint         # Run linter
```

### Deployment
```bash
npm run build        # Build for production
npm run deploy       # Deploy to staging
```
```

### 3. Team Conventions

Document team-specific workflows:

```markdown
## Team Workflows

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes and commit
3. Push and create PR
4. Wait for CI/CD to pass
5. Request review from 2 team members
6. Merge to `develop` after approval

### Code Review Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Follows style guide
```

---

## Maintenance

### Monthly Maintenance

1. **Review session-history.md**
   - Keep only last 5 sessions
   - Archive older sessions if needed

2. **Review claude-memory.md**
   - Remove outdated patterns
   - Update changed conventions
   - Add new important discoveries

3. **Update timestamps**
   - Update "Last Updated" date in claude-memory.md

### When to Update

**Update immediately when**:
- Project structure changes
- New important patterns discovered
- Team conventions change
- Major refactoring completed

**Update at end of sprint/week when**:
- Multiple small changes accumulated
- New features completed
- New team members join

---

## Summary

This template provides a complete setup for integrating Claude AI with your project. The key files are:

1. **claude-instructions.md** - How Claude should operate (token optimization)
2. **claude-memory.md** - What Claude should remember (project knowledge)
3. **session-starter.md** - Quick session start/end guide
4. **session-history.md** - Recent work tracking

**To use this template:**
1. Create `.claude-memory/` folder
2. Copy the 4 template files
3. Customize for your project
4. Add to git
5. Test with Claude

**Benefits:**
- Saves tokens and time
- Maintains consistency
- Retains knowledge across sessions
- Scales across projects

---

*This template is based on the successful setup from the HUB Cypress E2E Automation project.*
*Adapt and modify as needed for your specific project requirements.*
