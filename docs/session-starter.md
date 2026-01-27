# Session Starter for Claude

> **Purpose**: Quick reminder to load project memory at the start of each session

---

## 🔄 Start of Session Instructions

**Dear Claude**, at the start of each session:

1. **Read the memory file first**: `docs/claude-memory.md`
2. **Review recent changes**: Check git status or recent file modifications
3. **Ask user for current task**: "What would you like to work on today?"

---

## 💾 End of Session Instructions

**Dear Claude**, at the end of each session:

1. **Update memory file**: Add any new patterns, selectors, or important discoveries to `docs/claude-memory.md`
2. **Format**:
   ```markdown
   **Update (YYYY-MM-DD)**: [Brief description]
   - Item 1
   - Item 2
   ```

---

## 📋 Quick Commands for User

### Start Session
```
Claude, read docs/claude-memory.md and let me know you're ready
```

### End Session
```
Claude, update docs/claude-memory.md with today's changes
```

### Add Specific Info
```
Claude, add to memory: [specific information]
```

---

## 🎯 Current Priority

**Focus Area**: Order Page Automation Tests
**Current Files**:
- `orderList.cy.js` - 11 tests (completed)
- `orderDetail.cy.js` - 1 combined test (completed)

**Next Tasks**: [User to specify]

---

*Save this file for easy reference!*
