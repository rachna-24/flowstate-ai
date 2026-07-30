# FlowState AI

Absolutely. Since you'll likely be using Lovable AI, v0, Bolt.new, or another AI website builder, the more detailed your prompt is, the better the result.

Here's a prompt designed to produce a modern, minimal, professional application.

Prompt

Build a modern, minimalistic, AI-powered web application called AI Workplace Productivity Assistant.

The application should have a clean, premium, corporate aesthetic inspired by Apple, Notion, Linear, and Microsoft Fluent Design. Avoid clutter and overwhelming layouts. The design should feel spacious, elegant, and easy to navigate with generous white space.

Design Style

Minimalistic and modern.

Rounded cards (12–16px border radius).

Soft shadows.

Clean spacing between sections.

Smooth animations and subtle hover effects.

Glassmorphism only where appropriate (very subtle).

No bright gradients covering the whole page.

Professional appearance suitable for an office environment.

Colour Palette

Use mostly neutral colours with tasteful accents.

Primary:

#2563EB (Blue)

Accent:

#10B981 (Emerald Green)

#8B5CF6 (Purple)

#F59E0B (Amber)

Background:

#F8FAFC

Cards:

White

Text:

Dark Grey (#111827)

Use accent colours sparingly for buttons, icons, highlights, and status indicators to make the interface pop without becoming overwhelming.

Typography

Use a modern font combination:

Headings:

Poppins SemiBold

Body:

Inter

Numbers and Statistics:

Space Grotesk

Keep typography consistent with a clear hierarchy.

Layout

The application should contain:

Left Sidebar

Logo

Dashboard

Smart Email Generator

Meeting Notes Summarizer

AI Task Planner

Settings

About

The sidebar should be collapsible on desktop and transform into a hamburger menu on mobile devices.

Top Navigation Bar

Display:

Welcome message

User profile/avatar

Notification icon

Live Date

Live Time

The date and time must update automatically every second using JavaScript (real-time clock). Do not hardcode the values.

Dashboard

Show only three feature cards:

📧 Smart Email Generator

📝 Meeting Notes Summarizer

📅 AI Task Planner

Each card should contain:

Modern icon

Short description

"Open Tool" button

Cards should have hover animations and subtle scaling.

Smart Email Generator Page

Left panel:

Recipient

Subject (optional)

Email Purpose

Key Points

Tone dropdown:

Formal

Friendly

Persuasive

Right panel:
Generated Email

Buttons:

Generate

Copy

Clear

Meeting Notes Summarizer Page

Large textarea for meeting notes.

AI Output should display:

Executive Summary

Key Decisions

Action Items

Deadlines

Buttons:

Summarize

Copy

Clear

AI Task Planner Page

User enters:

Tasks

Due Dates (optional)

Working Hours

AI returns:

Priority Level

Suggested Daily Schedule

Estimated Time Per Task

Productivity Tips

Buttons:

Generate Plan

Copy

Clear

Responsible AI Notice

Add a clean information card stating:

"AI-generated content may contain inaccuracies. Always review generated outputs before using them professionally. Do not enter confidential or sensitive workplace information."

Responsiveness

Fully responsive for:

Desktop

Tablet

Mobile

The interface should adapt smoothly to all screen sizes.

Animations

Include:

Fade-in page transitions

Button ripple or hover effects

Card lift on hover

Smooth sidebar animations

Loading spinner while AI generates content

Accessibility

High colour contrast

Keyboard navigation

ARIA labels

Focus indicators

Responsive typography

Technical Requirements

HTML5

CSS3

JavaScript (ES6+)

Modular code structure

Real-time JavaScript clock for date and time

Clean, reusable components

Overall Goal

Create a polished, premium-looking AI productivity application that feels like a real commercial SaaS product. The interface should be simple, elegant, uncluttered, and intuitive, with plenty of white space and subtle use of colour to draw attention to important actions rather than overwhelming the user.

 Instead of calling the home page "Dashboard", rename it "Workspace." It gives the application a more premium, modern feel (similar to Notion, ClickUp, and Microsoft Copilot), while still meeting your project requirements. It also reinforces the idea that users are entering an AI-powered work environment rather than just viewing statistics.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c6c41836-a928-4af4-bcaf-aa70e3280364).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
