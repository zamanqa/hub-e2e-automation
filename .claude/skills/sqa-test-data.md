---
description: Generate structured test data sets for all scenario types including JSON payloads, SQL seed data, boundary values, and edge cases.
---

Generate test data for $ARGUMENTS.

**Output sets:**

| Type | Description |
|---|---|
| Valid / Happy path | Standard correct input |
| Invalid | Wrong type, wrong format |
| Boundary | min, max, min-1, max+1 |
| Null / Empty / Whitespace | `null`, `""`, `"   "` |
| Special characters | `<script>`, `'OR 1=1--`, `@#$%^&*()` |
| Max length | String at field length limit + 1 over |
| Locale / Unicode | Emoji, RTL text, accented chars if applicable |

**Format — both:**

**JSON (API payload / fixture):**
```json
{
  "valid": { ... },
  "invalid_type": { ... },
  "boundary_min": { ... },
  "boundary_max": { ... },
  "empty": { ... }
}
```

**SQL INSERT (DB seed):**
```sql
-- Pre-condition: insert valid record
INSERT INTO table_name (...) VALUES (...);
-- Cleanup
DELETE FROM table_name WHERE id = ...;
```

**Note data dependencies:** foreign keys, required pre-conditions, order of insertion.
