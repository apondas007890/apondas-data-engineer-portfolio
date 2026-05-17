# Apon Kumar Das — Data Engineer Portfolio 🚀

A modern, dark-themed **Data Engineering Portfolio** built with **Next.js, React, TypeScript, Supabase, and Vercel**.

This portfolio is designed to showcase my skills, projects, experience, education, certifications, practice progress, resume, and SQL-inspired interactive portfolio views.

---

## 🌐 Live Links

| Experience | URL |
|---|---|
| SQL Shades / SSMS Portfolio | https://apondas-data-engineer-portfolio.vercel.app |
| Visual Portfolio | https://apondas-data-engineer-portfolio.vercel.app/visualportfolio |
| Visual Contact Page | https://apondas-data-engineer-portfolio.vercel.app/visualportfolio/contact |

---

## 📖 Project Overview

This portfolio has three major experiences:

1. **SQL Shades / SSMS Inspired Portfolio**  
   A SQL Server Management Studio inspired interface where visitors can explore my portfolio like a database using SQL-style commands.

2. **Visual Portfolio**  
   A polished dark portfolio interface with animations, project cards, skills, experience, education, certifications, practice dashboard, resume, and contact page.

3. **Admin Dashboard**  
   A protected admin system for managing portfolio data using Supabase Auth, Supabase Database, and Supabase Storage.

---

## ✨ Features

- Premium dark Data Engineering themed UI
- SQL Server Management Studio inspired portfolio workspace
- Visual Portfolio with animated hero and technical sections
- Admin dashboard for managing portfolio content
- Supabase Auth based admin login
- Supabase PostgreSQL database integration
- Supabase Storage support for images, certificates, resumes, logos, and media
- Dynamic data loading from API routes
- Rich text support for descriptions
- Contact form integration
- Custom favicon and browser metadata
- Vercel deployment workflow

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- React Icons / Iconify

### Backend & Database

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security

### Deployment

- GitHub
- Vercel

---

## 🧭 Main Routes

```txt
/                         → SQL Shades / main portfolio workspace
/visualportfolio          → Visual Portfolio
/visualportfolio/contact  → Visual Contact Page
/admin                    → Admin Dashboard
/admin/login              → Admin Login
/admin/recovery           → Account Recovery
/admin/update-password    → Password Update
/auth/callback            → Supabase Auth Callback
/test-supabase            → Supabase Test Page
```

---

## 🏗️ Project Structure

```txt
apon-portfolio1/
├── admin/                  # Vite-based admin source project
├── app/                    # Main Next.js App Router pages and API routes
├── components/             # Shared UI components and SQL IDE components
├── hooks/                  # Shared React hooks
├── lib/                    # Shared utilities
├── public/                 # Static assets, favicon, visual build, toolbar icons
├── src/                    # Supabase logic, schema data, shared renderers
├── styles/                 # Global styles
├── visual/                 # Vite-based visual portfolio source project
├── package.json
├── next.config.mjs
├── tsconfig.json
└── README.md
```

---

## 🗂️ Important Folders

```txt
app/                       # Next.js routes, admin pages, API routes, metadata
app/api/visual/            # API routes for visual portfolio data
components/sql-ide/        # SQL Shades / SSMS-inspired interface components
src/lib/supabase/          # Supabase client, auth, data, and storage helpers
visual/src/components/     # Visual Portfolio components
admin/src/components/      # Admin Dashboard components
public/visual/             # Built visual portfolio assets
public/toolbar-icons/      # SSMS-style toolbar icons
```

---

## 🧩 Portfolio Sections

```txt
About
Skills
Experience
Projects
Education
Certifications
Practice Dashboard
Resume
Contact
```

---

## 🗄️ Database Tables

This portfolio uses a normalized Supabase/PostgreSQL database structure.

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

## 📌 Main Table Purposes

| Table | Purpose |
|---|---|
| `admin_profiles` | Stores admin profile and auth user mapping |
| `about` | Stores public personal/about information |
| `education` | Stores education records |
| `education_media` | Stores education-related images/files |
| `experience` | Stores internship/work experience |
| `experience_media` | Stores experience-related images/files |
| `projects` | Stores portfolio projects |
| `project_images` | Stores project images |
| `project_tags` | Stores project tech stack/tags |
| `skill_categories` | Stores skill groups |
| `skills` | Stores individual skills |
| `certifications` | Stores certificates and verification data |
| `resumes` | Stores resume PDF metadata |
| `practice_platforms` | Stores coding/practice platforms |
| `practice_challenges` | Stores solved problem analytics |

---

## 🗃️ Supabase Storage Buckets

```txt
profile-images
project-images
certificates
resumes
experience-media
education-media
logos
```

Storage file paths are saved in database columns so unused images and PDFs can be removed when records are updated or deleted.

---

## 🔐 Security

- Admin access uses Supabase Auth.
- Public users can read public portfolio data.
- Admin users can manage portfolio records.
- Row Level Security should be enabled on Supabase tables.
- `.env.local` must never be pushed to GitHub.
- Supabase `service_role` key must never be used in frontend code.
- Storage files should be deleted when related records are deleted or replaced.

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_or_publishable_key
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

For Vercel, add the same variables in:

```txt
Vercel → Project Settings → Environment Variables
```

---

## 🎨 Design System

```txt
Main background: #0a0e0f
Cyan accent:     #00eeff
Gold accent:     #d6be73
Primary text:    #f5f5f5
Muted text:      rgba(245,245,245,0.65)
Card background: #101717
Card hover:      #121d1d
Border:          rgba(255,255,255,0.10)
```

The design is inspired by:

- Data engineering systems
- SQL Server Management Studio
- Developer dashboards
- Dark technical interfaces
- Minimal futuristic UI

---

## 💻 Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open locally:

```txt
http://localhost:3000
```

Build locally:

```bash
npm run build
```

Start production build:

```bash
npm start
```

---

## 🚀 Deployment

This project is deployed with **Vercel** and connected to GitHub.

Normal deployment flow:

```bash
git add -A
git commit -m "Update portfolio"
git push
```

Vercel automatically redeploys after pushing to the `main` branch.

---

## 🧪 Git Workflow

Check status:

```bash
git status
```

Stage all changes:

```bash
git add -A
```

Commit:

```bash
git commit -m "Update portfolio"
```

Push:

```bash
git push
```

If push is rejected because remote has newer work:

```bash
git pull --rebase origin main
git push
```

---

## 👨‍💻 Author

**Apon Kumar Das**  
Data Engineer  
Dhaka, Bangladesh

```txt
Email: apondas007890@gmail.com
GitHub: apondas007890
LinkedIn: apondas0090
```

---

## 📄 License

This project is for personal portfolio use.

© 2026–Present Apon Kumar Das. All rights reserved.
