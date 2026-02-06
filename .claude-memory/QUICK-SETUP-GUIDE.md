# Quick Setup Guide for New Projects

> **TL;DR**: Copy 4 files to `.claude-memory/` folder, customize, and you're done!

---

## ⚡ 5-Minute Setup

### Step 1: Create Folder (30 seconds)
```bash
cd your-new-project
mkdir .claude-memory
```

### Step 2: Copy 4 Files (2 minutes)

Copy these files from this project to your new project:

**Source (this project)**:
```
hub-e2e-automation/.claude-memory/
├── claude-instructions.md
├── claude-memory.md
├── session-starter.md
└── session-history.md
```

**Destination (your new project)**:
```
your-new-project/.claude-memory/
├── claude-instructions.md       (copy as-is, no changes needed)
├── claude-memory.md             (customize this)
├── session-starter.md           (copy as-is, minimal changes)
└── session-history.md           (copy template, clear old data)
```

### Step 3: Customize `claude-memory.md` (2 minutes)

Only change these sections:

1. **Project Overview** (lines 10-16)
   ```markdown
   **Project Name**: YOUR PROJECT NAME
   **Framework**: YOUR FRAMEWORK
   **Database**: YOUR DATABASE
   **UI Library**: YOUR UI LIBRARY
   ```

2. **File Structure** (lines 20-62)
   - Replace with your actual folder structure

3. **Code Organization Pattern** (lines 74-124)
   - Add your code patterns (components, classes, etc.)

4. **Selector Patterns** (if applicable) (lines 127-182)
   - Add your UI selectors if it's a testing project

### Step 4: Git Commit (30 seconds)
```bash
git add .claude-memory/
git commit -m "Add Claude AI instruction files"
git push
```

### Step 5: Test with Claude (30 seconds)
```
Claude, read .claude-memory/claude-memory.md and tell me what you understand about this project
```

✅ **Done!** Claude now understands your project structure.

---

## 📁 What Each File Does

| File | Purpose | Do You Need to Edit? |
|------|---------|---------------------|
| `claude-instructions.md` | Token optimization rules | ❌ No - Copy as-is |
| `claude-memory.md` | Project knowledge base | ✅ Yes - Customize for your project |
| `session-starter.md` | Session start/end guide | ⚠️ Optional - Minor updates |
| `session-history.md` | Recent work tracking | ✅ Yes - Clear old sessions |

---

## 🎯 Key Sections to Update in `claude-memory.md`

### Section 1: Project Overview
```markdown
## Project Overview

**Project Name**: My New React App
**Framework**: React 18.2.0 + TypeScript
**Database**: Firebase Firestore
**UI Library**: Material UI v5
**Primary Language**: TypeScript
**Company/Client**: My Company
```

### Section 2: File Structure
```markdown
## File Structure

```
my-new-react-app/
├── .claude-memory/
├── src/
│   ├── components/
│   ├── pages/
│   └── App.tsx
├── public/
└── package.json
```
```

### Section 3: Code Patterns
```markdown
## Code Organization Pattern

### React Component Structure (CRITICAL)

**✅ CORRECT PATTERN**:
```javascript
const MyComponent = () => {
  return <div>Hello</div>;
};
export default MyComponent;
```
```

### Section 4: User Preferences
```markdown
## User Preferences

1. ✅ Always use TypeScript
2. ✅ Follow Material UI patterns
3. ✅ Ask before pushing to git
```

---

## 🚀 Usage After Setup

### Starting a Session
```
Claude, read .claude-memory/claude-memory.md and let's start
```

### During Work
```
Claude, follow the pattern from claude-memory.md
```

### Ending a Session
```
Claude, update .claude-memory/session-history.md with today's work
```

---

## 📋 Copy-Paste Template for `session-history.md`

Clear the old sessions and start fresh:

```markdown
# Session History

> Keep only last 5 sessions. Trim older entries to save tokens.

---

## Session: 2026-02-06

### Tasks Completed
- Set up Claude AI instruction files
- Customized project structure

### Files Created
- .claude-memory/claude-instructions.md
- .claude-memory/claude-memory.md
- .claude-memory/session-starter.md
- .claude-memory/session-history.md

### Next Session TODO
- [ ] Start development work

---
```

---

## 🎨 Templates for Different Project Types

### React/Vue/Angular Project
```markdown
**Framework**: React 18 / Vue 3 / Angular 16
**UI Library**: Material UI / Vuetify / Angular Material
**State Management**: Redux / Vuex / NgRx

File Structure:
- src/components/
- src/pages/
- src/services/
- src/utils/
```

### E2E Testing Project (Cypress/Playwright)
```markdown
**Framework**: Cypress 13 / Playwright 1.40
**Pattern**: Page Object Model

File Structure:
- cypress/e2e/
- cypress/support/page-objects/
- cypress/support/helpers/
- cypress/support/commands/
```

### Backend API Project
```markdown
**Framework**: Express / NestJS / Fastify
**Database**: PostgreSQL / MongoDB / MySQL

File Structure:
- src/controllers/
- src/services/
- src/models/
- src/routes/
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `.claude-memory/` folder exists in project root
- [ ] All 4 files copied to `.claude-memory/`
- [ ] `claude-memory.md` updated with project info
- [ ] `session-history.md` cleared of old data
- [ ] Files committed to git
- [ ] Tested with Claude successfully

---

## 🆘 Common Issues

### Issue: Claude still asks about project structure
**Fix**: Remind Claude to read the memory file:
```
Claude, please read .claude-memory/claude-memory.md first
```

### Issue: Claude doesn't follow patterns
**Fix**: Be more explicit in `claude-memory.md`:
```markdown
## Code Organization Pattern

### CRITICAL: Always Follow This Pattern
[Your pattern here]
```

### Issue: Memory file too long
**Fix**: Remove unnecessary details, keep only essential patterns

---

## 💡 Pro Tips

1. **Update memory as you go**: When you discover a new pattern, add it immediately
2. **Keep it concise**: Only add information that Claude actually needs
3. **Reference, don't repeat**: Tell Claude "follow pattern from claude-memory.md"
4. **Clean up session history**: Keep only last 5 sessions to save tokens

---

## 📚 Full Documentation

For detailed documentation, see:
- `PROJECT-SETUP-TEMPLATE.md` - Complete setup guide with all templates
- `claude-instructions.md` - Token optimization rules
- `claude-memory.md` - Project knowledge base

---

*Quick setup time: ~5 minutes | Benefits: Save hours of explaining the same things to Claude*
