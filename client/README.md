# Mini URL Shortener & Analytics Dashboard

A full-stack web application, similar to Bitly, that allows users to shorten long URLs, manage them, and view basic analytics like click counts and sources.

## Features

* **User Authentication:**
    * Email/Password Signup & Login.
    * Cookie-based session management.
* **URL Shortening:**
    * Generate short aliases for long URLs.
    * Option for custom aliases.
    * Option to set an expiration date for short links.
* **Redirection:** Short URLs redirect users to the original long URL.
* **Analytics:**
    * Tracks total clicks for each short URL.
    * Logs click details (timestamp, IP address, user agent) asynchronously on redirection.
    * Dashboard displays a table of created links (Original URL, Short URL, Clicks, Created Date, Expiration Status).
    * Visual charts for "Clicks Over Time" and "Device/Browser Breakdown".
* **QR Code Display:** Generates and displays QR codes for short URLs on the frontend dashboard.

## Setup and Installation

### Prerequisites

* Node.js (v16 or later recommended)
* npm or yarn
* MongoDB instance (local or cloud like MongoDB Atlas)

### Backend Setup

1.  **Clone the repository (or get the backend code):**
    ```bash
    # git clone <repository-url>
    cd server # or your backend folder name
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create a `.env` file** in the backend root directory and add the following variables (replace placeholders with actual values):
    ```dotenv
    PORT=3001
    MONGODB_URI=mongodb://localhost:27017/urlShortener # Your MongoDB connection string
    COOKIE_SECRET=a_very_strong_secret_for_signing_cookies # A strong random string for signing cookies
    # Add any other necessary variables (e.g., CORS origins if frontend/backend are on different domains in production)
    ```
4.  **Run the backend server:**
    ```bash
    npm run dev # If you have a dev script using nodemon
    # or
    node server.js
    ```
    The server should start, typically on port 3001.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../client # or your frontend folder name
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure Vite Proxy:** Ensure your `vite.config.js` includes the proxy setup to forward `/api` requests to your backend server (running on port 3001) during development, as shown previously.
4.  **Run the frontend development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The React application should open in your browser, typically on a port like `5173`.

## Tech Stack

* **Frontend:**
    * React (Vite)
    * Redux Toolkit (for state management)
    * React Router (implicitly required for navigation between Login/Signup/Dashboard)
    * TailwindCSS (for styling)
    * Recharts (for analytics charts)
    * Axios (for API calls)
    * `qrcode.react` (for client-side QR code generation)
    * `ua-parser-js` (for parsing user agents)
    * `lucide-react` (for icons)
* **Backend:**
    * Node.js
    * Express.js
    * MongoDB (Database)
    * Mongoose (ODM)
    * `cookie-parser` (for handling session cookies)
    * `bcrypt` (for password hashing)
    * `nanoid` (for short code generation)
* **Database:**
    * MongoDB
