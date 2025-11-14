# Testing Strategy

**MVP Testing Approach:** Manual testing only (no automated test framework)

## Testing Pyramid

```
        E2E Tests (Future)
       /                  \
    Integration Tests (Future)
   /                            \
Unit Tests (Future)    Unit Tests (Future)
 Frontend                  Backend
```

**MVP:** All testing manual during development

## Test Organization

**Future Test Structure:**

**Frontend Tests:**
```
packages/client/tests/
├── unit/
│   ├── hooks/
│   │   ├── useSocket.test.ts
│   │   └── useChat.test.ts
│   └── components/
│       └── ChatInterface.test.tsx
└── e2e/
    └── chat-workflow.spec.ts
```

**Backend Tests:**
```
packages/server/tests/
├── unit/
│   ├── tools/
│   │   ├── read-json.test.ts
│   │   ├── write-json.test.ts
│   │   └── write-file.test.ts
│   └── utils/
│       └── path-validator.test.ts
└── integration/
    └── agent-event-loop.test.ts
```

**E2E Tests:**
```
tests/e2e/
└── complete-demo-sequence.spec.ts
```

## Test Examples

**Frontend Component Test (Future):**

```typescript
// packages/client/tests/unit/components/ChatInterface.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInterface } from '../../../src/components/chat/ChatInterface';

describe('ChatInterface', () => {
  it('should send user message when form submitted', () => {
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByText('Send');

    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

**Backend API Test (Future):**

```typescript
// packages/server/tests/unit/tools/read-json.test.ts
import { readJson } from '../../../src/tools/read-json';
import fs from 'fs/promises';

describe('readJson tool', () => {
  it('should read and parse valid JSON file', async () => {
    // Setup: Create test file
    await fs.writeFile('data/test.json', JSON.stringify({ foo: 'bar' }));

    // Execute
    const result = await readJson('test.json');

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ foo: 'bar' });

    // Cleanup
    await fs.unlink('data/test.json');
  });

  it('should throw ToolError for path traversal attempt', async () => {
    await expect(readJson('../etc/passwd')).rejects.toThrow('Path traversal');
  });
});
```

**E2E Test (Future):**

```typescript
// tests/e2e/complete-demo-sequence.spec.ts
import { test, expect } from '@playwright/test';

test('complete demo sequence: products → landing page', async ({ page }) => {
  // Navigate to chat
  await page.goto('http://localhost:3000/chat');

  // Create products
  await page.fill('input[placeholder="Type a message..."]', 'Create 3 tech products');
  await page.click('button:has-text("Send")');
  await page.waitForSelector('text=/created products.json/i');

  // Generate products page
  await page.fill('input[placeholder="Type a message..."]', 'Create products.html');
  await page.click('button:has-text("Send")');
  await page.waitForSelector('text=/created products.html/i');

  // Verify generated page
  await page.goto('http://localhost:3000/products');
  await expect(page.locator('h1')).toContainText('Products');
});
```

---
