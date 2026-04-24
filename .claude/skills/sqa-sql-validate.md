---
description: Generate SQL queries to validate test data before and after test execution — pre-conditions, post-conditions, cleanup, and constraint checks.
---

Generate SQL validation queries for $ARGUMENTS.

**Output 4 query blocks:**

**1. Pre-condition check** — verify required data exists before test run
```sql
-- Purpose: confirm target record exists
-- Table: ...
-- When: BEFORE test
SELECT ... FROM ... WHERE ...;
```

**2. Post-condition check** — verify DB state after test action
```sql
-- Purpose: assert the action wrote correct data
-- Table: ...
-- When: AFTER test action
SELECT ... FROM ... WHERE ...;
```

**3. Cleanup / Teardown** — safely delete test-generated records
```sql
-- Purpose: remove test data, restore state
-- Table: ...
-- When: AFTER test completes (afterEach or afterAll)
DELETE FROM ... WHERE ...;
```

**4. Count assertions** — verify row counts match expected
```sql
-- Purpose: confirm no duplicate / missing rows
SELECT COUNT(*) FROM ... WHERE ...;
```

**Project SQL conventions:**
- `invoices."type"` — double-quoted (reserved word)
- Join via `order_id + company_id` or `subscription_id + company_id`
- Filter company: `gcs.name IN ('circuly shopify stripe')`
- Broaden payment: `payment_method_token IN ('visa','mastercard','card','paypal')`
- Status: `IN ('open','fulfilled')` for orders, `IN ('active')` for subscriptions
- Always `LIMIT 1` for single-record lookups
