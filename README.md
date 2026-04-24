# Node Hierarchy Processor (GraphInsights) 🚀

[![Next.js](https://img.shields.io/badge/Next.js-Black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **SRM Full Stack Engineering Challenge Submission** > **Role:** Full Stack Engineering Candidate  
> **Author:** SHREYANSH KUMAR 
> **Live Demo:** https://graph-insights.vercel.app/

---

## 📖 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Future Enhancements](#-future-enhancements)
- [Contact](#-contact)

---

## 🎯 Overview

The **Node Hierarchy Processor** is a zero-to-one full-stack prototype built to enable users to input complex node relationships and visually map out hierarchical trees. 

This project was developed as part of the SRM / Bajaj Finserv Health (BFHL) Engineering Challenge to demonstrate the ability to construct RESTful APIs, implement advanced graph-theory algorithms (like cycle detection), and design responsive, modular React components suitable for an enterprise-grade dashboard.

---

## ✨ Key Features

- **Robust Graph Processing API:** A `POST /bfhl` endpoint that natively parses arrays of node edge strings.
- **Strict Algorithm Rules:** Five distinct processing phases with unique handlers:
  - 🟢 `Validation`: Automatically trims inputs and filters out malformed strings (accepts only `$X->Y$`).
  - 🔵 `Duplicates`: Identifies identical duplicate edges and isolates them into a separate array.
  - 🟣 `Multi-Parent Conflicts`: Resolves diamond structures by accepting the first valid parent and gracefully discarding subsequent ones.
  - 🟠 `Cycle Detection`: Deep DFS traversal that actively traces recursion stacks to detect cyclic relationships, returning empty trees and flags.
  - 🔴 `Tie-Breakers`: Lexicographical sorting ensures deterministic root selection for pure cycles and tie-breaker scenarios in tree depths.
- **Dynamic Configuration Panel:** A responsive frontend dashboard that updates its summary metrics based on the currently parsed API data.
- **Visual Tree Canvas:** Completely custom recursive UI components to visually render nested tree structures without relying on heavy third-party graph libraries.
- **Simulation Sandbox:** Built-in validation error toasts and a mock execution timeline terminal for `invalid_entries` and `duplicate_edges`.

---

## 🛠 Architecture & Tech Stack

### Frontend Core
* **React 18 & Next.js:** Chosen for fast hot-module replacement, modern build tooling, and seamless API route integration via the App Router.
* **Lucide React:** Utilized as the core iconography engine to handle distinct visual flags for trees, cycles, and errors.

### Backend & State Management
* **Next.js Route Handlers (`/api/bfhl`):** Selected over Express/FastAPI for a lightweight, boilerplate-free approach to managing the backend logic in the same repository.
* **JavaScript Maps & Sets:** Used natively to maintain `O(V+E)` time complexity for efficient graph traversal and duplicate tracking.

### Styling
* **Tailwind CSS:** Used for rapid UI prototyping, ensuring a responsive, modern, and consistent dark-mode design system without writing custom CSS files.

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── api/bfhl/route.ts   # Core REST API endpoint and graph algorithm logic
│   ├── globals.css         # Tailwind directives and base theme definitions
│   ├── layout.tsx          # Main application layout and metadata wrapper
│   └── page.tsx            # Frontend React DOM entry point and layout orchestration
├── components/
│   ├── ErrorBadges.tsx     # Warning UI definitions for invalid/duplicate entries
│   ├── SummaryCards.tsx    # Dashboard metrics for total trees and cycles
│   └── TreeVisualizer.tsx  # Recursive visual mapping for parsed hierarchies
├── lib/
│   └── graphEngine.ts      # Decoupled utility functions for DFS and parsing
└── tailwind.config.ts      # Tailwind configuration and theme customization
