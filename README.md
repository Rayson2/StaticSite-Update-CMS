

# CMS Admin Panel

A secure, production-ready CMS admin panel built with **Next.js (App Router)** for managing **carousel and gallery images** with controlled authentication and session handling.

---

## Why This Was Built

This system was developed to provide a **centralized, secure administrative interface** for managing website media assets, specifically **carousel and gallery images**, without requiring direct server or file-system access.

The platform is designed for the following deployment model:

* **Next.js application hosted on Vercel** for reliability, scalability, and global delivery
* **Image storage on Hostinger Web Hosting Premium** using FTP for direct file management
* **MySQL (Hostinger SQL)** for:

  * Admin authentication
  * Image URL and metadata management
  * Audit logging

This architecture separates **application hosting** from **asset storage**, ensuring better performance, lower hosting costs, and easier maintenance for commercial deployments.

---

## Features

* Secure admin authentication (JWT + HttpOnly cookies)
* Absolute session timeout with automatic logout
* Carousel & gallery image management
* FTP-based image storage
* MySQL-backed metadata and audit logging
* Responsive admin interface

---

## Tech Stack

* **Framework:** Next.js (App Router)
* **Auth:** JWT (HttpOnly cookies)
* **Database:** MySQL (Hostinger)
* **Storage:** FTP (Hostinger Web Hosting Premium)
* **Styling:** Tailwind CSS
* **Hosting:** Vercel (Application)

---

## Packages Used

| Package               | Purpose                     |
| --------------------- | --------------------------- |
| `next`                | Application framework       |
| `react` / `react-dom` | UI rendering                |
| `jsonwebtoken`        | JWT creation & verification |
| `bcryptjs`            | Password hashing            |
| `mysql2`              | MySQL database driver       |
| `ftp`                 | FTP file operations         |
| `postcss`             | CSS processing (Tailwind)   |

---

## Project Structure

```text
src/
├── instrumentation.js        # Server startup logic
├── app/
│   ├── middleware.js        # Auth & session enforcement
│   ├── admin/               # Protected admin pages
│   ├── api/                 # Auth & image APIs
│   ├── components/          # Shared UI & session guard
│   └── login/               # Login page
└── lib/
    ├── db.js                # Database connection
    ├── ftp.js               # FTP utilities
    └── seedAdmin.js         # Admin credential sync
```

---

## Environment Variables

```env
# Authentication
AUTH_SECRET=your_secret_key

# Session control (seconds)
IDLE_TIMEOUT=
ABSOLUTE_CAP=
NEXT_PUBLIC_ABSOLUTE_CAP=

# Database
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=

# FTP
FTP_HOST=
FTP_USER=
FTP_PASSWORD=

# Site
SITE_URL=
```

---

## Session Policy

* **Idle timeout:** 10 minutes
* **Absolute session cap:** 15 minutes
* Session expiry is enforced **server-side** and **client-side** with automatic logout.

---

## Production Notes

* HTTPS must be enabled
* `NODE_ENV=production` is required
* Restrict database access by IP
* Secure `.env` at host level

---

## License

**Apache License**

