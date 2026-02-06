# Project Replication Guide - Visual Walkthrough

> **Goal**: Set up Claude AI for a new project in 5 minutes using this project as a template

---

## 🗺️ Visual Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    THIS PROJECT (Source)                     │
│                                                              │
│  hub-e2e-automation/                                        │
│  └── .claude-memory/                                        │
│      ├── claude-instructions.md  ← Copy as-is              │
│      ├── claude-memory.md        ← Copy & customize        │
│      ├── session-starter.md      ← Copy as-is              │
│      └── session-history.md      ← Copy template, clear    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Copy files
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  YOUR NEW PROJECT (Target)                   │
│                                                              │
│  your-new-project/                                          │
│  └── .claude-memory/          ← Create this folder         │
│      ├── claude-instructions.md  ← Pasted                  │
│      ├── claude-memory.md        ← Pasted & edited         │
│      ├── session-starter.md      ← Pasted                  │
│      └── session-history.md      ← Pasted & cleared        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 The 4 Files Explained

### File 1: `claude-instructions.md` (Operating Manual)

```
┌──────────────────────────────────────────┐
│  claude-instructions.md                  │
├──────────────────────────────────────────┤
│  What it contains:                       │
│  • How to start sessions                 │
│  • Token optimization rules              │
│  • What to do/avoid                      │
│  • Response style guidelines             │
│  • End of session protocol               │
├──────────────────────────────────────────┤
│  Do you need to edit?                    │
│  ❌ NO - Works for all projects          │
└──────────────────────────────────────────┘
```

### File 2: `claude-memory.md` (Knowledge Base)

```
┌──────────────────────────────────────────┐
│  claude-memory.md                        │
├──────────────────────────────────────────┤
│  What it contains:                       │
│  • Project overview                      │
│  • File structure                        │
│  • Code patterns                         │
│  • Selectors (if testing project)       │
│  • Database queries (if applicable)      │
│  • Conventions and preferences           │
├──────────────────────────────────────────┤
│  Do you need to edit?                    │
│  ✅ YES - Customize for each project     │
└──────────────────────────────────────────┘
```

### File 3: `session-starter.md` (Quick Guide)

```
┌──────────────────────────────────────────┐
│  session-starter.md                      │
├──────────────────────────────────────────┤
│  What it contains:                       │
│  • Session start instructions            │
│  • Session end instructions              │
│  • Quick commands reference              │
│  • Current priority/focus                │
├──────────────────────────────────────────┤
│  Do you need to edit?                    │
│  ⚠️ OPTIONAL - Minor updates             │
└──────────────────────────────────────────┘
```

### File 4: `session-history.md` (Recent Work Log)

```
┌──────────────────────────────────────────┐
│  session-history.md                      │
├──────────────────────────────────────────┤
│  What it contains:                       │
│  • Last 5 sessions                       │
│  • Tasks completed                       │
│  • Files created/modified                │
│  • Important discoveries                 │
│  • Next session TODO                     │
├──────────────────────────────────────────┤
│  Do you need to edit?                    │
│  ✅ YES - Clear old sessions, start new  │
└──────────────────────────────────────────┘
```

---

## 🎯 Copy Decision Tree

```
                    New Project Setup
                           │
                           ▼
              ┌────────────────────────┐
              │ What type of project?  │
              └────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────┐      ┌──────────┐      ┌──────────┐
   │ Testing │      │ Web App  │      │ Backend  │
   │ Project │      │ Project  │      │ API      │
   └─────────┘      └──────────┘      └──────────┘
        │                  │                  │
        ▼                  ▼                  ▼
Copy all 4 files    Copy all 4 files    Copy all 4 files
        │                  │                  │
        ▼                  ▼                  ▼
   Edit these:       Edit these:        Edit these:
   • Project info    • Project info     • Project info
   • File structure  • File structure   • File structure
   • Page Objects    • Components       • Controllers
   • Selectors       • State mgmt       • Models
   • DB queries      • UI patterns      • Routes
```

---

## 🔧 Customization Map for `claude-memory.md`

### What to Change:

```
claude-memory.md
│
├── Lines 10-16: Project Overview
│   ├── Project Name: "Your Project Name"
│   ├── Framework: "React/Vue/Cypress/etc"
│   ├── Database: "PostgreSQL/MongoDB/etc"
│   ├── UI Library: "Material UI/Ant Design/etc"
│   └── Company: "Your Company"
│
├── Lines 20-62: File Structure
│   └── Replace with your actual folders
│
├── Lines 74-124: Code Organization Pattern
│   ├── For Testing: Page Object pattern
│   ├── For React: Component pattern
│   ├── For Backend: Controller/Service pattern
│   └── Add your specific pattern
│
├── Lines 127-182: Selector Patterns (Optional)
│   └── Only for UI testing projects
│
├── Lines 184-216: Database Queries (Optional)
│   └── Only if project uses database
│
├── Lines 218-248: Test Structure (Optional)
│   └── Only for testing projects
│
├── Lines 252-287: Important Conventions
│   ├── Naming conventions
│   ├── Code style
│   └── Testing conventions
│
└── Lines 318-326: User Preferences
    ├── What you prefer
    └── What Claude should always do
```

---

## 📋 Step-by-Step Visual Walkthrough

### Step 1: Create Folder

```
Before:                          After:
your-new-project/               your-new-project/
├── src/                        ├── .claude-memory/  ← NEW
├── tests/                      ├── src/
└── package.json                ├── tests/
                                └── package.json
```

Command:
```bash
cd your-new-project
mkdir .claude-memory
```

### Step 2: Copy Files

```
From this project:              To new project:

hub-e2e-automation/            your-new-project/
├── .claude-memory/            ├── .claude-memory/
│   ├── claude-instructions.md → claude-instructions.md
│   ├── claude-memory.md       → claude-memory.md
│   ├── session-starter.md     → session-starter.md
│   └── session-history.md     → session-history.md
```

Command:
```bash
# Option 1: Manual copy-paste
# Open each file, copy content, paste in new project

# Option 2: Command line
cp /path/to/hub-e2e/.claude-memory/*.md .claude-memory/
```

### Step 3: Edit `claude-memory.md`

```
Before (from this project):
┌─────────────────────────────────────┐
│ **Project Name**: HUB Cypress E2E   │
│ **Framework**: Cypress v13.17.0     │
│ **Database**: PostgreSQL            │
│ **UI Library**: Headless UI         │
└─────────────────────────────────────┘

After (your project):
┌─────────────────────────────────────┐
│ **Project Name**: My React Store    │
│ **Framework**: React 18.2.0         │
│ **Database**: Firebase              │
│ **UI Library**: Material UI v5      │
└─────────────────────────────────────┘
```

### Step 4: Clear `session-history.md`

```
Before (from this project):
┌──────────────────────────────────────────┐
│ ## Session: 2026-01-30                   │
│ ### Tasks Completed                      │
│ - Created order workflow tests           │
│ - Updated page objects                   │
│                                          │
│ ## Session: 2026-01-29                   │
│ ### Tasks Completed                      │
│ - Fixed subscription queries             │
└──────────────────────────────────────────┘

After (your project):
┌──────────────────────────────────────────┐
│ # Session History                        │
│                                          │
│ > Keep only last 5 sessions              │
│                                          │
│ ---                                      │
│                                          │
│ ## Session: [Today's Date]               │
│ ### Tasks Completed                      │
│ - Set up Claude AI files                 │
└──────────────────────────────────────────┘
```

### Step 5: Commit to Git

```
Git workflow:

Working directory         Staging area          Repository
─────────────────        ─────────────         ────────────
.claude-memory/
├── file1.md     ──add──▶  file1.md   ─commit─▶  [Committed]
├── file2.md     ──add──▶  file2.md   ─commit─▶  [Committed]
├── file3.md     ──add──▶  file3.md   ─commit─▶  [Committed]
└── file4.md     ──add──▶  file4.md   ─commit─▶  [Committed]
```

Commands:
```bash
git add .claude-memory/
git commit -m "Add Claude AI instruction files"
git push
```

### Step 6: Test with Claude

```
You: "Claude, read .claude-memory/claude-memory.md"

Claude: "I've read the project memory file. I understand this is
        [Your Project Name], using [Framework] with [Database].
        The file structure shows [folders], and the code follows
        [your pattern]. Ready to work!"

You: "Perfect! Let's start coding."
```

---

## 🎨 Examples for Different Project Types

### Example 1: React E-commerce App

```markdown
## Project Overview in claude-memory.md

**Project Name**: ShopNow E-commerce Store
**Framework**: React 18.2.0 + TypeScript
**Database**: Firebase Firestore
**UI Library**: Material UI v5.14
**State Management**: Redux Toolkit
**Primary Language**: TypeScript
**Company/Client**: ShopNow Inc.

## File Structure

```
shopnow-store/
├── .claude-memory/
├── src/
│   ├── components/
│   │   ├── product/
│   │   ├── cart/
│   │   └── checkout/
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProductPage.tsx
│   │   └── CheckoutPage.tsx
│   ├── store/
│   │   ├── slices/
│   │   └── store.ts
│   ├── services/
│   │   └── api.ts
│   └── App.tsx
└── package.json
```

## Code Organization Pattern

### React Component Structure (CRITICAL)

**✅ CORRECT PATTERN**:
```javascript
import React from 'react';
import { Box, Button } from '@mui/material';

interface Props {
  title: string;
  onClick: () => void;
}

const ProductCard: React.FC<Props> = ({ title, onClick }) => {
  return (
    <Box>
      <Button onClick={onClick}>{title}</Button>
    </Box>
  );
};

export default ProductCard;
```
```

### Example 2: Python FastAPI Backend

```markdown
## Project Overview in claude-memory.md

**Project Name**: API Service Backend
**Framework**: FastAPI 0.104
**Database**: PostgreSQL 15
**ORM**: SQLAlchemy 2.0
**Primary Language**: Python 3.11
**Company/Client**: Tech Corp

## File Structure

```
api-service/
├── .claude-memory/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       └── dependencies.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── models/
│   ├── schemas/
│   └── main.py
└── requirements.txt
```

## Code Organization Pattern

### API Endpoint Structure (CRITICAL)

**✅ CORRECT PATTERN**:
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/items/{item_id}")
async def read_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    return item
```
```

### Example 3: Playwright E2E Tests

```markdown
## Project Overview in claude-memory.md

**Project Name**: Product Checkout E2E Tests
**Framework**: Playwright 1.40
**Pattern**: Page Object Model
**Primary Language**: TypeScript
**Company/Client**: E-commerce Inc.

## File Structure

```
checkout-tests/
├── .claude-memory/
├── tests/
│   ├── checkout.spec.ts
│   └── product.spec.ts
├── page-objects/
│   ├── CheckoutPage.ts
│   └── ProductPage.ts
└── playwright.config.ts
```

## Code Organization Pattern

### Page Object Structure (CRITICAL)

**✅ CORRECT PATTERN**:
```typescript
import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-testid="checkout-btn"]');
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }
}
```
```

---

## ✅ Final Checklist

```
Setup Complete When All Checked:

Project Setup:
□ Created .claude-memory/ folder in project root
□ Copied claude-instructions.md (no changes)
□ Copied claude-memory.md (customized)
□ Copied session-starter.md (no/minimal changes)
□ Copied session-history.md (cleared old data)

Customization:
□ Updated Project Overview in claude-memory.md
□ Updated File Structure in claude-memory.md
□ Added Code Patterns in claude-memory.md
□ Added User Preferences in claude-memory.md
□ Cleared old sessions in session-history.md

Git:
□ Added files to git
□ Committed with message
□ Pushed to repository

Testing:
□ Asked Claude to read claude-memory.md
□ Claude confirmed understanding
□ Claude follows your patterns

Ready to Work! ✓
```

---

## 🎓 Understanding the System

### How It Works:

```
Session Start:
┌────────────────┐
│ User opens     │
│ Claude Code    │
└────────┬───────┘
         │
         ▼
┌────────────────────────────────────┐
│ Claude reads:                      │
│ 1. claude-instructions.md (HOW)    │
│ 2. claude-memory.md (WHAT)         │
│ 3. session-history.md (RECENT)     │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Claude knows:                      │
│ • Project structure                │
│ • Code patterns                    │
│ • Your preferences                 │
│ • Recent work                      │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────┐
│ Ready to work  │
│ No need to     │
│ re-explain!    │
└────────────────┘
```

### Benefits:

```
Without AI Files:              With AI Files:
─────────────────             ──────────────
Session 1:                    Session 1:
  You: "Use React"              You: "Create ProductCard"
  Claude: "OK"                  Claude: [Creates with MUI pattern]
  [Explain patterns]
  [Show examples]             Session 2:
                                You: "Create CartPage"
Session 2:                      Claude: [Creates with same pattern]
  You: "Use Material UI"
  Claude: "OK"                Session 3:
  [Re-explain React]            You: "Add checkout"
  [Re-explain patterns]         Claude: [Follows established patterns]

Session 3:                    Result:
  You: "What pattern again?"    ✅ Consistent code
  Claude: "Let me check..."     ✅ No re-explaining
  [Search chat history]         ✅ Saves time
                                ✅ Saves tokens
Result:
  ❌ Inconsistent code
  ❌ Wasted time
  ❌ High token usage
```

---

## 📚 Quick Reference

| Need | Read This File |
|------|----------------|
| Direct answers to your questions | `AI-FILES-SUMMARY.md` |
| 5-minute setup guide | `QUICK-SETUP-GUIDE.md` |
| Complete setup with templates | `PROJECT-SETUP-TEMPLATE.md` |
| Visual walkthrough | `REPLICATION-GUIDE.md` (this file) |
| Understand HOW Claude works | `claude-instructions.md` |
| Understand WHAT Claude knows | `claude-memory.md` |

---

## 🚀 You're Ready!

You now have everything you need to replicate this AI setup for any project:

1. **4 core files** to copy
2. **Step-by-step guides** for setup
3. **Templates** for different project types
4. **Visual walkthroughs** for clarity
5. **Examples** for customization

**Next Steps:**
1. Pick your next project
2. Follow the 5-minute setup in `QUICK-SETUP-GUIDE.md`
3. Customize `claude-memory.md` for your project
4. Start working with Claude!

---

*Created: 2026-02-06*
*Purpose: Visual guide for replicating AI setup across projects*
*Based on: HUB Cypress E2E Automation project*
