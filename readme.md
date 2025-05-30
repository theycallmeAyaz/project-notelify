# Notelify - A Simple yet Aesthetic Note Taking App

A modern, responsive note-taking application built with React and Firebase, featuring real-time synchronization, dark mode support, and Google authentication.

## Overview

Notelify is a web-based note-taking application that allows users to create, edit, and manage their notes with a beautiful and intuitive interface. The application features a clean, modern design with both light and dark mode support, making it comfortable to use in any environment.

## Features

- **User Authentication**
  - Email/Password login
  - Google Sign-in integration
  - Secure authentication powered by Firebase

- **Note Management**
  - Create and edit notes in real-time
  - Rich text editing capabilities
  - Automatic saving
  - Delete notes
  - Search functionality

- **User Interface**
  - Clean, modern design
  - Responsive layout for all devices
  - Dark/Light mode toggle
  - Smooth animations and transitions
  - Loading states and feedback

## Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Context API for state management

### Backend & Database
- Firebase Authentication
- Cloud Firestore for real-time data storage
- Firebase Security Rules for data protection

## Project Structure

```
src/
├── components/
│   ├── auth/       # Authentication components
│   ├── dashboard/  # Main dashboard view
│   ├── layout/     # Layout components
│   ├── notes/      # Note management components
│   └── ui/         # Reusable UI components
├── context/        # React Context providers
├── firebase/       # Firebase configuration
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── css/           # Global styles
```


## Security

- Firebase Authentication handles user sessions securely
- Firestore Security Rules ensure users can only access their own notes
- All data is encrypted at rest in Firebase
- HTTPS encryption for all client-server communication

## Performance

- Optimized bundle size with Vite
- Lazy loading of components
- Efficient real-time updates with Firestore
- Responsive images and optimized assets

