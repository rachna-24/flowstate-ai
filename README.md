# Buddy.AI
## Your Smart Productivity Assistant

## Project Overview

Buddy.AI is an AI-powered workplace productivity assistant designed to help users manage tasks, improve communication, organise meetings, and increase daily productivity.

The application provides an intelligent digital workspace that combines artificial intelligence, task management, scheduling, analytics, and communication tools into one platform.

Buddy.AI is built as a modern SaaS application with a futuristic but minimalistic interface. The goal is to create a personal AI assistant that helps users work smarter, stay organised, and improve productivity.

---

# Features Implemented

## AI Dashboard

The dashboard provides users with a complete overview of their productivity.

Features include:

- Personalised welcome dashboard
- Animated Buddy AI assistant mascot
- Real-time date and time display
- Productivity overview cards
- Motivational productivity quotes
- Productivity score tracking
- AI usage statistics
- AI-generated productivity insights

---

## Chat With Buddy AI

A ChatGPT-style AI assistant that allows users to communicate with Buddy.

Features:

- AI-powered conversations
- Message history
- Typing animation
- Auto-scrolling chat
- Suggested prompts
- Productivity recommendations

Users can ask Buddy to:

- Plan their day
- Generate ideas
- Summarise information
- Provide productivity advice
- Assist with workplace tasks

---

## Smart Email Generator

An AI-powered email assistant that helps users create professional emails.

Users can generate:

- Professional emails
- Follow-up emails
- Leave requests
- Apology emails
- Meeting invitations
- Thank-you messages

Features:

- Recipient input
- Email purpose selection
- Tone selection
- Additional information input
- AI-generated email responses

Actions available:

- Copy
- Regenerate
- Improve
- Shorten
- Expand
- Clear

---

## Meeting Note Summary

An AI tool that converts meeting notes into structured summaries.

Supported file formats:

- PDF
- DOCX
- TXT

Buddy AI generates:

- Meeting summaries
- Action items
- Important decisions
- Deadlines
- Follow-up tasks

---

## AI Task Planner

A smart task management system designed to improve organisation and productivity.

Features:

- Create tasks
- Edit tasks
- Delete tasks
- Assign priorities
- Add due dates
- Mark tasks as completed
- Drag-and-drop organisation
- Progress tracking
- Deadline countdown

Buddy AI assists by:

- Recommending task priorities
- Suggesting deadlines
- Estimating completion times
- Suggesting the best task order

---

## Smart Calendar

An interactive calendar system for managing important dates and activities.

Features:

- Monthly calendar view
- Current date highlighting
- Meetings
- Deadlines
- Reminders
- Date information panels

---

## AI Analytics

A productivity analytics dashboard that tracks user performance.

Includes:

- Weekly AI usage statistics
- AI interaction tracking
- Activity graphs
- Most-used AI features
- Productivity trends

---

## Buddy Insights

AI-generated productivity insights based on user activity.

Examples:

- Weekly goal completion
- Productivity patterns
- Time saved using AI
- Areas for improvement

---

## Settings and Customisation

Users can customise their Buddy.AI experience.

Settings include:

- Profile settings
- AI preferences
- Notifications
- Theme selection
- Accent colours
- Accessibility settings
- Privacy settings
- Language preferences

---

# Design Features

Buddy.AI uses a premium SaaS design system focused on simplicity and usability.

Design elements:

- Dark mode interface
- Glassmorphism design
- Modern typography
- Gradient backgrounds
- Neon accent colours
- Smooth animations
- Responsive layouts
- Rounded UI components
- Interactive cards

Design goals:

- Futuristic
- Minimalistic
- Professional
- Easy to use
- Not overwhelming

---

# Technologies and Tools Used

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Lucide React Icons
- React Hook Form
- Zustand
- Recharts

## Backend

- Node.js
- Express.js
- PostgreSQL
- Authentication system

## AI Integration

- OpenAI API or configurable AI provider

## Development Tools

- Visual Studio Code
- Git
- GitHub
- npm
- Figma

---

# Project Structure

```
Buddy.AI

├── frontend
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── store
│   └── assets
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   └── server
│
├── database
│
├── README.md
└── package.json
```

---

# Setup Instructions

## Requirements

Install the following:

- Node.js
- npm
- PostgreSQL
- Git


## Clone Repository

```bash
git clone https://github.com/yourusername/buddy-ai.git
```

Navigate into the project:

```bash
cd buddy-ai
```

---

# Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

DATABASE_URL=your_database_connection

OPENAI_API_KEY=your_api_key

JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run server
```

Backend will run on:

```
http://localhost:5000
```

---

# Future Improvements

Planned improvements:

- Voice assistant support
- Calendar integrations
- Mobile application
- Team collaboration features
- Advanced AI automation
- Personalised AI learning
- Smart notifications

---

# License

MIT License
````
