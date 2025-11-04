# Scrutin

Scrutin is a **job applicant testing and evaluation app** built on **Frappe / ERPNext / FrappeHR**.  
It helps organizations **evaluate candidates objectively** before hiring — without leaving their HR system.

If you already use ERPNext for Recruitment or FrappeHR, Scrutin becomes the missing piece between **Application → Evaluation → Hiring**.

---

## 🚀 Why Scrutin Exists

Most companies test candidates using scattered tools (Google Forms, PDFs, WhatsApp, TestGorilla, etc.).  
That creates chaos, cheating, and zero traceability.

Scrutin **centralizes testing inside ERPNext**, so:

- Recruiters stay in one system.
- Tests link directly to Job Applicants.
- Scores become part of hiring decisions.
- No data is lost, duplicated, or manually imported/exported.

---

## ✨ Core Features

| Feature | Description |
|--------|-------------|
| **Question Bank** | Store, tag, and organize questions by skill, difficulty, and role. |
| **Randomized Tests** | Each candidate receives a unique test instance to reduce cheating. |
| **Timers & Auto-Submit** | Tests auto-submit on timeout to stop gaming the system. |
| **Webcam Snapshot (Proctoring)** | Capture periodic webcam shots during the test. |
| **Screen Focus Detection** | Logs when a candidate switches tabs or leaves test window. |
| **Multiple Test Types** | MCQs, written response, coding tasks (extendable). |
| **Custom Scoring Rubrics** | Define scoring logic per test or per question. |
| **Recruiter Evaluation View** | Central screen to review answers, proctor logs, and scoring. |
| **Direct Integration with ERPNext / FrappeHR** | Link test results directly to Job Applicants → Job Offers → Employees. |

---

## 🔥 Built For

- Companies using **ERPNext** or **FrappeHR**
- HR Teams needing structured, defensible evaluation processes
- Recruitment agencies who want scalable screening workflows
- Teams hiring remote or freelance talent

---

## 🧱 Architecture

| Layer | Stack |
|------|-------|
| Backend | Frappe Framework (Python) |
| Frontend | Frappe UI + Custom Pages |
| Database | MariaDB (via ERPNext) |
| Deployment | Works on Frappe Cloud or self-hosted environments |

Scrutin does **not** require any external services by default.

---

## 🛠️ Installation

```bash
bench get-app scrutin https://github.com/<your-org>/scrutin.git
bench --site yoursite.com install-app scrutin
bench migrate
🏁 Usage Workflow
Create Question Bank entries.

Create a Test Template with rules & scoring.

Attach a test to a Job Applicant or Recruitment Flow.

Candidate receives test link.

Candidate completes test under monitoring.

HR reviews results and makes hiring decisions confidently.

🗺️ Roadmap
Code Editor-based Programming Tests (with sandbox execution)

Audio/Video interview prompts

AI-assisted scoring for written answers

Conversation-style Behavioral Test Models

Advanced Proctoring (eye tracking, screen recording)

🤝 Contributing
We welcome contributions that improve test integrity, scoring intelligence, or workflow integration.

Open an Issue → Discuss → Submit PR.

📝 License
MIT (or whatever license you choose)

⚡ Tip Before You Use This
If you're expecting Scrutin to magically fix your hiring process while you still recruit randomly and define roles vaguely — that’s your problem, not the software.
Scrutin works best when roles and skill expectations are clearly defined.