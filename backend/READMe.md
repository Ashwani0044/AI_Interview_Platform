# AI Interview Platform

An AI-powered mock interview platform that helps candidates prepare for technical interviews by analyzing their resume, generating personalized interview questions, evaluating answers using an LLM, and providing feedback.

---

## Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Protected API Routes

### Resume Parser

* Upload PDF Resume
* Extract Resume Text
* AI-based Resume Parsing
* Store:

  * Skills
  * Projects
  * Experience
  * Education

### AI Interview Generation

* Select Target Role
* Select Difficulty
* Build Candidate Profile
* Generate Personalized Interview Questions using AI

### Interview Evaluation

* Submit Candidate Answers
* AI Evaluates Every Answer
* Score Each Answer
* Generate Constructive Feedback
* Calculate Overall Interview Score

### Interview Management

* Get Interview Details
* View Interview History
* Track Interview Status

---

# Tech Stack

## Backend

* Python
* Flask
* Flask-JWT-Extended
* Flask-SQLAlchemy
* Flask-Migrate
* SQLAlchemy
* Alembic

## Database

* MySQL

## AI

* OpenRouter API
* DeepSeek R1

## PDF Processing

* PyMuPDF (fitz)

## Authentication

* JWT (JSON Web Tokens)

---

# Project Structure

```text
backend/
│
├── config.py
├── run.py
├── extensions.py
│
├── models/
│   ├── user.py
│   ├── resume.py
│   ├── skill.py
│   ├── project.py
│   ├── experience.py
│   ├── education.py
│   ├── interview.py
│   ├── interview_question.py
│   ├── interview_answers.py
│
├── routes/
│   ├── auth.py
│   ├── resume.py
│   └── interview.py
│
├── services/
│   ├── ai_services.py
│   ├── pdf_service.py
│   ├── resume_services.py
│   └── interview_service.py
│
├── prompts/
│
├── uploads/
│
├── migrations/
│
└── requirements.txt
```

---

# Database Schema

## User

* id
* username
* email
* password

## Resume

* id
* user_id
* filename
* path

## Skill

* id
* user_id
* skill_name

## Project

* id
* user_id
* title
* description
* role

## Experience

* id
* user_id
* company
* role
* duration
* description

## Education

* id
* user_id
* degree
* institution
* year

## Interview

* id
* user_id
* resume_id
* role
* difficulty
* status
* overall_score
* created_at

## InterviewQuestion

* id
* interview_id
* question
* topic
* difficulty
* question_order

## InterviewAnswer

* id
* interview_question_id
* answer_text
* score
* feedback
* created_at

---

# API Endpoints

## Authentication

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

---

## Resume

### Upload Resume

```
POST /api/resume/upload
```

---

## Interview

### Start Interview

```
POST /api/interview/start
```

### Submit Interview

```
POST /api/interview/submit/<interview_id>
```

### Get Interview Details

```
GET /api/interview/<interview_id>
```

### Interview History

```
GET /api/interview/history
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

```env
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret_key

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=ai_interview_db

OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=deepseek/deepseek-r1-0528
```

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Create a virtual environment

```bash
python -m venv venv
```

Activate the virtual environment

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run database migrations

```bash
flask db upgrade
```

Start the server

```bash
python run.py
```

---

# Future Improvements

* AI Follow-up Questions
* Voice-based Interviews
* Live Coding Interview Support
* Resume Improvement Suggestions
* AI-generated Interview Reports (PDF)
* Admin Dashboard
* Leaderboard
* Interview Analytics
* Email Reports
* Multi-language Support

---

# Author

**Ashwani Bhardwaj**

B.Tech Computer Science Engineering

AI • Backend Development • Full Stack Development
