---
title: Security Considerations
purpose: Brief security overview for self-editing application pattern
audience: Developers considering this pattern
when_to_read: Understanding risks and appropriate use cases
status: active
---

# Security Considerations

## The Risk

This application accepts user input and generates/executes code through Claude SDK with minimal validation.

**Safe for:**
- Local development and learning
- Internal tools with trusted users
- Rapid prototyping and MVPs

**Not safe for:**
- Production without significant hardening
- Public-facing applications
- Systems with untrusted users
- Applications handling sensitive data

## Key Attack Vectors

1. **Prompt Injection** - User tricks agent into ignoring safety rules
2. **Path Traversal** - User attempts to write outside sandboxed directories
3. **Code Injection** - Malicious code in generated files
4. **Resource Exhaustion** - User causes infinite loops or large file generation

## Mitigations (Current)

- Path sandboxing (`/data` and `/public` only)
- BMAD quality gates (requires ACTIVE_STORY)
- Local-only deployment (no public access)

## Mitigations (Production Requirements)

- Authentication and authorization
- Input validation and sanitization
- Rate limiting and resource constraints
- Comprehensive audit logging
- Output validation before execution
- Containerization and process isolation
- Regular security reviews

---

**Bottom line**: Great pattern for learning and internal tools. Production deployment requires significant security hardening.
