# Story 3.4 Planning Document

## Story Overview
**Story 3.4**: Implement Light/Dark Mode Toggle + Activity Panel + System Prompt Improvements

**Dependencies**: Story 3.3 must be complete with Socket.io real-time pages menu updates

---

## Primary Goal (From Original PRD)
Implement a light/dark mode toggle in the chat interface header

---

## Extended Goals (Polish & Real-time Features)

### 1. Light/Dark Mode Toggle
**Location**: Header, next to connection status

**Implementation**:
- Toggle button (sun/moon icon)
- Uses Tailwind dark mode class toggling
- Persists preference to localStorage
- Applies `.dark` class to root element

**Acceptance Criteria**:
- Click toggle switches between light/dark
- Preference persists across page reloads
- All UI components adapt to dark mode properly

---

### 2. Activity Panel (Slide-out Drawer)

#### Visual Design
**Position**: Right side of screen, overlays unused whitespace

**Behavior**:
- **Collapsed**: Small tab on right edge ("📋 Activity" vertically)
- **Expanded**: Slides out 350-400px panel
- **Sticky**: Stays open/closed based on user preference (localStorage)
- **Scrollable**: Last 15-20 file operations

#### Event Display Format
```
✅ Created: products.html          [View] [08:45:23]
📝 Updated: styles.css              [View] [08:45:30]
❌ Deleted: old-page.html                  [08:45:35]
💾 Created: products.json           [View] [08:45:40]
📝 Updated: app.js                  [View] [08:45:45]
🎨 Created: theme.css               [View] [08:45:50]
```

#### File Type Handling
- **HTML files**: Open in new tab at `http://localhost:3000/[filepath]`
- **CSS files**: Open in new tab at `http://localhost:3000/[filepath]`
- **JS files**: Open in new tab at `http://localhost:3000/[filepath]`
- **JSON files**: Open in new tab at `http://localhost:3000/data/[filename]`
- **Deleted files**: No link (grayed out, informational only)

#### Socket Events (Already implemented in 3.3)
Server emits:
```typescript
socket.emit('file-operation', {
  type: 'created' | 'updated' | 'deleted',
  filepath: string,
  fileType: 'html' | 'css' | 'js' | 'json',
  timestamp: number
});
```

Client listens and updates activity feed state.

#### Key Differences from Pages Menu
| Feature | Pages Menu (Top-right) | Activity Panel (Right sidebar) |
|---------|------------------------|--------------------------------|
| Shows | HTML files only | All file types |
| Display | Current snapshot | Chronological history |
| Purpose | Quick navigation | Activity monitoring |
| Updates | Real-time via Socket.io | Real-time via Socket.io |

---

### 3. System Prompt Improvements

#### Problem A: Inconsistent URLs in Generated HTML
**Issue**: Generated pages link to `http://localhost:3000/chat` but dev server is on `http://localhost:5173/chat`

**Solution**: Update system prompt to use relative URLs
```
When creating HTML pages with navigation:
- Use relative URLs like "/chat" (not http://localhost:3000/chat)
- This works in both development (port 5173) and production (port 3000)
```

#### Problem B: Generated HTML Uses Fetch Instead of Socket.io
**Issue**: Product list pages fetch from `/api/products` - not reactive, no real-time updates

**Solution**: Update system prompt to prefer Socket.io
```
When creating HTML pages that display dynamic data (products, lists, etc.):
- Use Socket.io for real-time updates (not fetch/AJAX)
- Connect to socket: const socket = io('http://localhost:3000')
- Listen for data events: socket.on('products-updated', (products) => renderProducts(products))
- Emit requests if needed: socket.emit('get-products')

Example pattern:
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
</head>
<body>
  <div id="products"></div>
  <script>
    const socket = io('http://localhost:3000');

    socket.on('products-updated', (products) => {
      document.getElementById('products').innerHTML =
        products.map(p => `<div>${p.name} - $${p.price}</div>`).join('');
    });

    // Request initial data
    socket.emit('get-products');
  </script>
</body>
</html>
```

**Benefits**:
- Generated pages are reactive
- Demonstrates Socket.io power in video
- When you chat "add 3 more products", they appear live in the HTML page

**Server-side Changes Needed**:
- Add Socket.io event handlers for data requests (`get-products`, `get-data`, etc.)
- Emit data events when JSON files are updated (`products-updated`, `data-updated`)
- Read from `/data` directory and emit to connected clients

---

### 4. Conversation Failure Analysis

**TODO**: Analyze the current chat conversation screenshot to identify:
- Questions that were misunderstood
- Responses that were incorrect
- Operations that failed
- Agent reading JSON when it should have been creating HTML

**Purpose**: Document common failure patterns to improve system prompt and error handling

**Document Location**: `docs/conversation-failures-analysis.md`

---

## Implementation Order

### Phase 1: Light/Dark Mode (Original Requirement)
1. Add theme toggle button to header
2. Implement dark mode styles in globals.css
3. Add localStorage persistence
4. Test all components in dark mode

### Phase 2: Activity Panel UI
1. Create ActivityPanel component (slide-out drawer)
2. Add toggle button/tab on right edge
3. Implement expand/collapse animation
4. Add localStorage for panel state persistence

### Phase 3: Activity Panel Data (Uses Socket.io from 3.3)
1. Client: Listen for `file-operation` events
2. Client: Update activity feed state (last 15-20 operations)
3. Client: Render activity items with appropriate icons
4. Client: Implement click handlers based on file type

### Phase 4: System Prompt Updates
1. Update system prompt with relative URL guidance
2. Update system prompt with Socket.io pattern
3. Test with "create a products page" command
4. Verify Socket.io usage in generated HTML

### Phase 5: Server Socket.io Data Events
1. Add event handlers: `get-products`, `get-data`
2. Emit events when JSON files change: `products-updated`, `data-updated`
3. Test real-time updates in generated HTML pages

---

## Acceptance Criteria (Story 3.4 Complete)

### Light/Dark Mode
- [ ] Toggle button visible in header
- [ ] Clicking toggles between light/dark themes
- [ ] Preference persists across page reloads
- [ ] All components render correctly in both modes

### Activity Panel
- [ ] Panel slides in/out smoothly from right side
- [ ] Shows last 15-20 file operations
- [ ] Each operation shows: icon, type, filename, timestamp, [View] link
- [ ] Clicking [View] opens appropriate file in new tab
- [ ] Panel state persists across page reloads
- [ ] Updates in real-time when agent creates/updates/deletes files

### System Prompt Improvements
- [ ] Generated HTML uses relative URLs (`/chat` not `http://localhost:3000/chat`)
- [ ] Generated HTML with dynamic data uses Socket.io (not fetch)
- [ ] Product pages update live when data changes
- [ ] Server emits appropriate data events

### Conversation Failure Analysis
- [ ] Document created: `docs/conversation-failures-analysis.md`
- [ ] Common failure patterns identified
- [ ] System prompt improvements documented
- [ ] Error handling improvements noted

---

## Time Estimate
**Total**: 3-4 hours
- Light/Dark Mode: 45 minutes
- Activity Panel UI: 1 hour
- Activity Panel Data Integration: 45 minutes
- System Prompt Updates: 30 minutes
- Server Socket.io Data Events: 45 minutes
- Testing & Polish: 30 minutes

---

## Notes
- Socket.io infrastructure for file operations completed in Story 3.3
- Activity panel uses existing Socket.io connection
- Focus on UI/UX polish and system prompt improvements
- This story ties together all real-time features for video demonstration

---

**Last Updated**: 2025-11-20
