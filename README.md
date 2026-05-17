# Apon Kumar Das — Data Engineer Portfolio 🚀

A modern, dark-themed **Data Engineering Portfolio** built with modern full-stack tools.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

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


---

## 🌟 About Me

Hi! I’m **Apon Kumar Das**, a tech enthusiast and aspiring **Data Engineer**. I’m passionate about **technology, data, and building robust data solutions**.  

This repository represents my personal **Data Engineering portfolio platform**—a full-stack project designed to showcase my technical skills, projects, experience, certifications, and SQL-inspired portfolio interactions. It combines modern frontend design, Supabase-backed dynamic content, admin management workflows, and deployment-ready architecture to present my growth as a Data Engineer in a practical and professional way. 

📚🌱 I’m eager to learn, grow, and connect with others in the data engineering community:  

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/apon-kumar-das-47087a332)  [![Portfolio](https://img.shields.io/badge/Portfolio-FF6F61?style=for-the-badge&logo=internet-explorer&logoColor=white)](https://apondas-data-engineer-portfolio.vercel.app)

---

## 📄 License

This project is for personal portfolio use.

© 2026 AP. All rights reserved.
