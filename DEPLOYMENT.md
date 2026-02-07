# HealthMate - Deployment Guide

## Prerequisites
- **Java 17+** (JDK)
- **Node.js 16+** & **npm**
- **MongoDB** (Local or Atlas Connection String)
- **Maven** (Optional, for building backend jar)

## 1. Database Setup
1. Ensure MongoDB is running on `localhost:27017` OR update `src/main/resources/application.properties` with your Atlas URI.
2. The application will automatically create the `healthmate` database and collections (`users`, `roles`, `health_plans`, `daily_logs`) on first run.

## 2. Backend Deployment (Spring Boot)
1. Navigate to the backend folder:
   ```sh
   cd healthmate-backend
   ```
2. Build the application:
   ```sh
   ./mvnw clean package
   # Or if you have maven installed:
   mvn clean package
   ```
3. Run the JAR file:
   ```sh
   java -jar target/healthmate-backend-0.0.1-SNAPSHOT.jar
   ```
4. The Backend API will start at `http://localhost:8080`.

## 3. Frontend Deployment (React)
1. Navigate to the frontend folder:
   ```sh
   cd healthmate-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Build for production:
   ```sh
   npm run build
   ```
4. Preview the production build:
   ```sh
   npm run preview
   ```
   Or deploy the `dist/` folder to any static host (Netlify, Vercel, S3).

## 4. Connecting Frontend to Backend
- By default, the frontend sends requests to `http://localhost:8080/api`.
- If deploying to a different domain, update `src/services/api.js` `baseURL`.

## 5. Default Users
- **Admin**: No default admin created. Sign up a user with `admin` role via direct API call or DB insertion if strict admin needed, or modify `AuthController` to allow role selection (current impl allows requesting role).

## 6. Accessing the App
1. Open Browser: `http://localhost:5173` (Dev) or deployed URL.
2. Sign Up -> Enter details -> Get Plan.
3. Login -> View Dashboard -> Update Progress.
