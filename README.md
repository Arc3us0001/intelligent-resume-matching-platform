# Intelligent Resume Matching Platform

An AI-powered full-stack web application that parses resumes, extracts structured candidate data, and intelligently matches candidates to job descriptions using skill analysis.

---

## 🚀 Features

- Resume upload and storage
- AI-based resume parsing into structured data
- Candidate and job management
- Intelligent candidate–job matching based on skills
- Match score visualization
- Dashboard with analytics
- Modern responsive UI

---

## 🧠 System Architecture

Frontend:
- React + TypeScript
- Vite
- Tailwind CSS
- React Query

Backend:
- Supabase (PostgreSQL, Auth, Storage)
- Supabase Edge Functions
- AI-powered parsing and matching logic

---

## ⚙️ How It Works

1. User uploads a resume (PDF)
2. Resume is stored securely
3. AI extracts structured fields (skills, experience, education)
4. Job descriptions are stored in the database
5. Matching engine compares resume skills with job requirements
6. Match scores are generated and displayed on the dashboard

---

## 🛠️ Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Supabase
- Database: PostgreSQL
- AI Integration: Resume parsing & matching logic
- Tooling: Vite, ESLint

---

## ▶️ Running the Project Locally

```bash
npm install
npm run dev
