---
description: Generate a k6 load test script scaffold for API or web endpoints with ramp-up stages, thresholds, and checks.
---

Generate a k6 load test script for $ARGUMENTS.

```js
import http from 'k6/http';
import { check, sleep } from 'k6';

// Options: stages + thresholds
export const options = {
  stages: [
    { duration: '1m', target: 20 },   // ramp-up
    { duration: '3m', target: 20 },   // sustained load
    { duration: '1m', target: 0  },   // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95th percentile < 2s
    http_req_failed:   ['rate<0.01'],   // < 1% error rate
  },
};

// Auth token from environment
const BASE_URL = __ENV.BASE_URL || 'https://hub.development.circuly.io';
const TOKEN    = __ENV.API_TOKEN || '';

export default function () {
  // selector: target endpoint
  const res = http.get(`${BASE_URL}/api/endpoint`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  // assertion: verify response
  check(res, {
    'status is 200':       (r) => r.status === 200,
    'response time < 2s':  (r) => r.timings.duration < 2000,
    'has expected field':  (r) => JSON.parse(r.body).data !== undefined,
  });

  sleep(1);
}
```

**Run command:**
```bash
k6 run --env BASE_URL=https://hub.development.circuly.io --env API_TOKEN=xxx k6-test.js
```

**Note:** Adjust VUs, stages, and thresholds to match your SLA requirements. This is a scaffold only.
