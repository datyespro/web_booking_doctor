# Context for AI Agent: Project Setup & Architecture

**System Instruction**: If you are an AI agent reading this, use the following context to assist the user in setting up and developing the "Web Hospital" project.

## 1. Project Overview
This is a full-stack web application for booking doctor appointments (BookingCare Clone).
- **Architecture**: Client-Server (Monorepo structure).
- **Database**: Firebase Firestore (NoSQL).
- **Authentication**: Firebase Authentication.

## 2. Tech Stack & Structure

### Client (`/client`)
- **Framework**: React 19 + Vite.
- **Language**: TypeScript.
- **UI Library**: Mantine UI (@mantine/core, @mantine/hooks).
- **State Management**: Zustand.
- **Routing**: React Router v7.
- **API Client**: Axios (configured in `src/config/axios.ts`).
- **Key Config**: `src/config/firebase.ts` (Firebase Client SDK).

### Server (`/server`)
- **Runtime**: Node.js.
- **Framework**: Express.js.
- **Language**: TypeScript.
- **Database SDK**: Firebase Admin SDK (`firebase-admin`).
- **Hot Reload**: Nodemon.
- **Key Config**: `service-account.json` (REQUIRED for Firestore connection).

## 3. Critical Setup Instructions for the Agent

When helping the user set up this project on a new machine, you MUST verify the following:

### Step A: Backend Setup (`/server`)
1.  **Install Dependencies**: `npm install`
2.  **Service Account (CRITICAL)**:
    - The server **will not start** without a `service-account.json` file in the `server/` root directory.
    - **Action**: Ask the user to provide this file from their Firebase Console (Project Settings -> Service Accounts -> Generate Private Key).
3.  **Environment Variables**:
    - Check for `.env`.
    - Default `PORT` is `8080`.
4.  **Start Server**: `npm run dev`

### Step B: Frontend Setup (`/client`)
1.  **Install Dependencies**: `npm install`
2.  **API Configuration**:
    - Check `src/config/axios.ts`. It defaults to `http://127.0.0.1:8080`.
    - If the server runs on a different port/host, this file must be updated.
3.  **Start Client**: `npm run dev` (usually runs on port `5173`).

## 4. Common Troubleshooting Tips for the Agent
- **"Error connecting to Firestore"**: 99% of the time, this is missing or invalid `service-account.json` in the server folder.
- **CORS Errors**: Ensure the server's `cors` middleware is active (it is by default in `server.ts`).
- **"User not found" (Auth)**: The client and server must use the SAME Firebase project. Check `client/src/config/firebase.ts` and the `service-account.json` project ID.

## 5. Development Workflow
- **Run both**: The user needs two terminal sessions active (one for client, one for server).
- **Linting**: `npm run lint` in client.
