# Corn Counter 🌽

This project features a backend with a rate-limiting system and an interactive frontend built with React, TypeScript, and Tailwind CSS.
✨ Key Features

    User Onboarding: A welcoming flow for users to either enter a name (clientId) or continue as a guest.

    Interactive Dashboard: Real-time display of the user's personal corn harvests and the global total.

    Clear Rate-Limiting Feedback: A live countdown timer informs the user exactly when they can purchase corn again, reflecting the backend's 1-per-minute limit.

    State Persistence: The user's session and the cooldown timer state persist across page reloads, thanks to localStorage.

    No use of Database storage.

    Clean, Modern UI: An intuitive and pleasant user interface built with Tailwind CSS.

💡 Solution Approach

Instead of building two separate applications, I decided to merge both requirements into a single, cohesive user experience.

The application starts with an onboarding screen that offers two paths:

    Enter a name: This sets a specific clientId and fulfills the requirement to identify a unique client.

    Continue as Guest: This assigns a default clientId ("Guest") and allows the user to proceed directly to the main functionality, fulfilling the requirement for a simple interface to buy corn.

This offers a far more intuitive experience because:

    It Demonstrates Product Thinking: It focuses on building a complete and realistic user flow, from first arrival to active use.

    It's Efficient (DRY Principle): It avoids code duplication and results in a cleaner, more maintainable codebase.

    It Mirrors a Real-World Environment: Production applications are built as integrated systems, not as isolated tasks.

🛠️ Tech Stack

    Frontend:

        React

        TypeScript

        Vite

        Tailwind CSS

    Backend:

        Node.js

        Express

        (State is handled in-memory, no database is used)

🚀 Getting Started

Follow these steps to run the project locally.
Prerequisites

    Node.js (v18 or newer recommended)

    npm

1. Clone the Repository
```
git clone [https://github.com/diegoengelhard/Corn-Counter.git](https://github.com/diegoengelhard/Corn-Counter.git)
```

2. Run the Backend

# Install dependencies
npm i

# Start the development server
npm run dev

The backend server will be running at http://localhost:3000.

3. Run the Frontend

# Install dependencies
npm i

# Start the development server
npm run dev

The frontend application will be available at http://localhost:5173.

### 🌐 Backend API Endpoints

The backend exposes two main endpoints. The clientId must be passed via the `X-Client-Id` header in all requests.
POST /api/rate-limiter/buy

Attempts to purchase one unit of corn for the specified client.

    Successful Response (200 OK):
    Occurs when the purchase is allowed by the rate limiter.

    {
        "ok": true,
        "purchased": 1,
        "clientId": "Diego",
        "count": 1,
        "totalSold": 1,
        "nextAllowedAt": 1759114738
    }

    Rate Limit Response (429 Too Many Requests):
    Occurs when the client attempts to buy corn more than once per minute.

    {
        "ok": false,
        "error": "Too Many Requests",
        "retryAfterSeconds": 39,
        "nextAllowedAt": 1759114738,
        "clientId": "Diego",
        "count": 1,
        "totalSold": 1
    }

GET /api/rate-limiter/me

Retrieves the current information for a client, including their personal corn count and the global total.

    Successful Response (200 OK):

    {
        "ok": true,
        "clientId": "Diego",
        "count": 1,
        "totalSold": 1,
        "retryAfterSeconds": 14,
        "nextAllowedAt": 1759114738
    }

💾 Frontend Data Persistence

To ensure a seamless user experience, localStorage is used to persist two key pieces of data:

    clientId: Saves the user's name or "Guest" to keep the session active across page reloads.

    nextAllowedAt: Stores the exact timestamp (per user) when the cooldown period ends. This allows the countdown timer to be accurately reconstructed for each client after a page refresh or session change, preventing UI/UX inconsistencies.