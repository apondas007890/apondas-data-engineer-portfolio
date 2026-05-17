# Portfolio Admin Dashboard — Apon Kumar Das

A protected admin dashboard for managing my Data Engineering portfolio content.

---

## Live Admin URL

```txt
https://apondas-data-engineer-portfolio.vercel.app/admin
```

---

## Overview

The Admin Dashboard is used to create, update, and manage portfolio content stored in Supabase.

It supports:

- Admin login
- Account recovery
- Password update
- Personal/About management
- Education management
- Experience management
- Project management
- Skill/category management
- Certification management
- Resume management
- Practice dashboard management
- Image/PDF upload handling
- Storage cleanup for replaced or deleted files

---

## Tech Stack

```txt
React
TypeScript
Vite
Supabase Auth
Supabase Database
Supabase Storage
Tailwind CSS
Rich Text Editor
```

---

## Main Components

```txt
Certifications.tsx
Dashboard.tsx
Education.tsx
Experience.tsx
FloatingTechIcons.tsx
Login.tsx
MultipleImageUpload.tsx
Personal.tsx
Practices.tsx
Projects.tsx
Resume.tsx
RichTextEditor.tsx
Sidebar.tsx
Skills.tsx
Slideshow.tsx
Topbar.tsx
```

---

## Admin Routes

```txt
/admin
/admin/login
/admin/recovery
/admin/update-password
```

---

## Supabase Tables Managed

```txt
admin_profiles
about
education
education_media
experience
experience_media
projects
project_images
project_tags
skill_categories
skills
certifications
resumes
practice_platforms
practice_challenges
```

---

## Storage Handling

The admin dashboard should delete unused files when records are updated or deleted.

Expected cleanup rules:

```txt
If an image/PDF is replaced:
- Upload the new file
- Delete the old file from Supabase Storage
- Update the database row

If a record is deleted:
- Delete related files from Supabase Storage first
- Then delete or soft-delete the database row

If database update fails after upload:
- Delete the newly uploaded file immediately
```

---

## Security Notes

```txt
Admin access uses Supabase Auth.
Do not store passwords in custom tables.
Do not expose service_role keys in frontend code.
Use Row Level Security policies in Supabase.
Keep .env.local out of GitHub.
```

---

## Environment Variables

Required in the root app and Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
```

---

## Purpose

This admin dashboard allows me to keep my portfolio dynamic, maintainable, and database-driven without manually editing public-facing UI code for every content update.

---

## Author

**Apon Kumar Das**  
Data Engineer  
Dhaka, Bangladesh
