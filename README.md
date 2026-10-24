# ☁️ Cloud-Based Student Attendance Management System

A sleek, enterprise-grade, cloud-enabled web application for managing academic attendance, visualizing student performance metrics, identifying attendance defaulters, tracking medical leave, and exporting official compliance records.

Designed with modern glassmorphism aesthetics, real-time analytics charts, QR digital student badges, and a zero-dependency dual storage engine (Local Cache + Node.js Cloud REST API).

---

## 🌟 Key Features

1. **📊 Executive Attendance Dashboard**
   - Live KPI cards: Institutional Average Attendance %, Total Enrolled Students, Classes Logged, and Defaulter Watchlist alert.
   - Interactive 7-Day Attendance Trend line chart via Chart.js.
   - Overall status distribution doughnut chart (Present vs Absent vs Late vs Excused).
   - Real-time defaulter watchlist alerting faculty to students below the 75% university benchmark.

2. **📝 Interactive Session Marking Panel**
   - Department, Semester, and Subject/Course filtering.
   - Real-time 4-way tactile toggle buttons for each student: `Present`, `Late`, `Absent`, `Excused`.
   - Batch automation: "Mark All Present" & "Mark All Absent" shortcuts.
   - Dynamic counters with instant calculation of attendance rates.
   - Seamless "Save Session to Cloud" action.

3. **👥 Enrolled Student Directory & Digital Badges**
   - Comprehensive student registry with contact info, department, and semester.
   - Individual attendance percentage tracking and exam eligibility indicators (`Eligible ≥ 75%` vs `Attendance Shortage < 75%`).
   - Digital Student Identity Card with simulated Smart QR code and one-click printable format.
   - Add, edit, search, and delete student records.

4. **📈 Academic Compliance & Reports**
   - Subject-wise performance comparison bar chart.
   - Filterable historical session audit logs.
   - One-click **Export to CSV** for university records or Excel analysis.
   - **Print Formal Sheet** formatted specifically for official departmental submissions.

5. **✉️ Leave & Medical Duty Portal**
   - Student leave application log with justification and date ranges.
   - Faculty approval/rejection actions.
   - Auto-excuses student attendance for approved leave dates.

6. **⚡ Cloud Telemetry & Data Recovery**
   - Live Cloud synchronization status indicator with ping latency telemetry.
   - Dual-mode persistence: Works 100% offline via `localStorage` or syncs to Node.js backend (`cloud_db.json`).
   - Full Database JSON Backup export & JSON restore uploader.
   - Reset and sample academic dataset reloader.
   - Dark Mode / Light Mode theme toggle.

---

## 📂 Minimalist Single-Directory Architecture

This project is structured with **only 6 files and 0 nested folders** for clean and effortless Git commits and GitHub repository hosting:

```text
├── index.html       # Single-Page Application (SPA) structure and semantic views
├── style.css        # Premium Glassmorphic UI, responsive layouts, and print styles
├── app.js           # Client-side state, sync engine, charts, and interactivity
├── server.js        # Zero-dependency Node.js HTTP server & REST API
├── package.json     # Project metadata and quick npm scripts
└── README.md        # Documentation and deployment guide
```

---

## 🚀 Quick Start Guide

### Option 1: Run with Node.js Server (Recommended)
1. Ensure [Node.js](https://nodejs.org/) is installed.
2. In the project folder, start the server (no `npm install` needed! Uses pure built-in Node modules):
   ```bash
   node server.js
   ```
   Or via npm:
   ```bash
   npm start
   ```
3. Open your browser at:
   ```text
   http://localhost:3000
   ```

### Option 2: Open Directly in Any Browser (Standalone Offline Mode)
- Simply double-click `index.html` to open it in Chrome, Edge, Firefox, or Safari!
- The system automatically detects offline mode and persists all changes in your browser's LocalStorage.

---

## 🚢 Deploying to Free Cloud Platforms

- **GitHub Pages**: Push this repository to GitHub, go to `Settings > Pages`, and select `main` branch root.
- **Vercel / Netlify**: Connect your GitHub repository and deploy with static presets.
- **Render / Railway**: Deploy as a Web Service running `node server.js`.

---

## 📜 License
MIT License - Open for academic, personal, and institutional use.
