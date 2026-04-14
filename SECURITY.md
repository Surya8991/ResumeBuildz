# Security Policy

ResumeForge takes security seriously. This document describes the security practices, data handling, and vulnerability reporting process for the project.

## Security Practices

### Client-Side Architecture

ResumeForge is a fully client-side application. There is no backend server, no database, and no server-side data processing.

- All resume data is processed entirely in the browser.
- No data is ever transmitted to any server owned or operated by ResumeForge.
- The application works offline after initial load (PWA support).
- No user accounts, no authentication, no cookies.

### No Data Collection

ResumeForge does not collect, store, or transmit any user data. There are:

- No analytics or tracking scripts.
- No third-party data collection.
- No telemetry.
- No server-side logging of user content.

## API Key Handling

If users choose to use the AI writing assistant, they provide their own Groq API key.

- API keys are stored **only** in the browser's `localStorage`.
- API keys are sent **directly** from the browser to the Groq API. They never pass through any ResumeForge server.
- API keys are never logged, transmitted, or stored anywhere other than the user's own browser.
- Users can delete their API key at any time by clearing their browser data or using the in-app settings.

## Data Storage

All user data is stored in the browser's `localStorage`:

- Resume content (text, sections, entries).
- Template selection and preferences.
- Theme preference (dark/light mode).
- API keys (if provided by the user).

This data never leaves the browser. Clearing browser data or `localStorage` removes all stored information permanently.

## Security Measures

### XSS Prevention

- HTML export output is sanitized to prevent cross-site scripting attacks.
- User-provided content is escaped before rendering in templates.
- No `dangerouslySetInnerHTML` usage with unsanitized user input.

### File Upload Limits

- **Resume import:** Maximum file size of 10MB for DOCX, TXT, HTML, MD, and PDF imports.
- **Photo upload:** Maximum file size of 2MB for profile photos.
- File type validation is performed before processing.
- Uploaded files are processed client-side only and are never transmitted to any server.

### CSS Injection Prevention

- Font selections are restricted to a whitelist of safe, commonly available fonts.
- User-configurable values (font sizes, margins, spacing) are clamped to safe ranges.
- No arbitrary CSS input is accepted from users.

## Reporting Vulnerabilities

If you discover a security vulnerability in ResumeForge, please report it responsibly.

### How to Report

Send an email to: **Suryaraj8147@gmail.com**

Include the following information:

- A description of the vulnerability.
- Steps to reproduce the issue.
- The potential impact of the vulnerability.
- Any suggested fixes (optional but appreciated).

### What to Expect

- You will receive an acknowledgment within 48 hours.
- We will investigate the report and provide updates on our progress.
- We will work to resolve confirmed vulnerabilities as quickly as possible.
- We will credit reporters in the fix commit (unless you prefer to remain anonymous).

## Responsible Disclosure Policy

We ask that you:

- **Do not** publicly disclose the vulnerability until we have had a reasonable amount of time to address it.
- **Do not** exploit the vulnerability beyond what is necessary to demonstrate its existence.
- **Do not** access, modify, or delete other users' data (note: since all data is local, this is inherently limited).
- Act in good faith to avoid privacy violations, data destruction, and service disruption.

We will not pursue legal action against researchers who follow this responsible disclosure policy.

## Scope

The following are **in scope** for security reports:

- XSS vulnerabilities in resume rendering or export.
- Data leakage through exported files.
- Vulnerabilities in file import parsing (DOCX, PDF, HTML, MD, TXT).
- CSS injection or style-based attacks.
- localStorage data exposure risks.

The following are **out of scope**:

- Vulnerabilities in third-party services (e.g., Groq API).
- Issues that require physical access to the user's device.
- Browser-specific vulnerabilities not caused by ResumeForge code.
- Social engineering attacks.

## Disclosure Timeline

- **Day 0:** Vulnerability report received via email
- **Day 1-3:** Acknowledgment sent to reporter
- **Day 7:** Initial assessment and severity classification
- **Day 30:** Fix developed and tested
- **Day 45:** Fix deployed to production
- **Day 90:** Public disclosure (coordinated with reporter)

We commit to responding to all security reports within 72 hours.

## Updates

This security policy may be updated from time to time. Changes will be reflected in this document with the date of the last update.

Last updated: 2026-04-11
