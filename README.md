# NutriBalance Backend

NutriBalance is a **Node.js + Express.js** backend service that utilizes **PostgreSQL** for database management and **Redis** for caching and JWT blacklisting.

⚠ **This backend is designed to run on Linux.** If you are using Windows, please install **WSL (Windows Subsystem for Linux)** to support Redis.

---

##  **System Requirements**
- **Node.js** (Recommended: v18.x or later)
- **PostgreSQL** (Database)
- **Redis** (JWT Blacklist & Caching)
- **Linux or WSL** (Required for Redis)
- **Docker & Docker Compose** (Optional for containerized deployment)

---
## **Project Structure**
```bash
NUTRIBALANCE_BACKEND/   # Project root
│── public/             # Public assets (if needed)
│── src/                # Main source code
│   ├── config/         # Configuration files
│   │   ├── db.js               # Configuration File for Connecting to a PostgreSQL Database
│   │   ├── redisClient.js      # Redis connection
│   │   ├── VerifyEmail.js      # Email verification logic
│   ├── External_API/    # Third-party API integrations
│   │   ├── Deepseek_api.js     # DeepSeek chatbot API
│   ├── middlewares/     # Express middlewares
│   │   ├── authMiddleware.js   # JWT authentication middleware
│   ├── models/          # Database models
│   │   ├── userModel.js        # User schema (PostgreSQL)
│   ├── routes/          # API endpoints
│   │   ├── auth.js            # Authentication routes (login, register)
│   │   ├── user_data.js       # User data-related routes
│   ├── services/        # Business logic & services
│   │   ├── chatbot_ser/       # Chatbot service layer
│   │   │   ├── deepseek_chatbot.js  # Handles chatbot queries
│   │   ├── cleanup_ser/       # Cleanup services (e.g., JWT blacklist)
│   │   │   ├── Token_blacklist.js   # Manages blacklisted JWTs
│   │   │   ├── verification_cleanup.js # Cleans up expired verification tokens
│   │   ├── database_ser/      # Database service layer
│   │   │   ├── getDatafromDB.js    # Fetch user-related data from DB
│   │   │   ├── updateDatafromDB.js # Update user data in DB
│   │   ├── user_auth/         # User authentication services
│   │   │   ├── genVerificationEmail.js # Generates email verification tokens
│   │   │   ├── loginUser.js         # Login service
│   │   │   ├── registerUser.js      # Registration service
│   │   │   ├── resetPassword.js     # Password reset service
│── server.js              # Main entry point
```

## **Code Logic**
### **Authentication & User Management**
- **User registration (`/auth/register`)**
  - Stores user data in **PostgreSQL**.
  - Sends a verification email using **Nodemailer**.
- **User login (`/auth/login`)**
  - Generates a **JWT Token** for authentication.
  - Uses **Redis** to store blacklisted JWTs for secure logout.
- **JWT Middleware**
  - Ensures only authenticated users can access protected routes.

---

### **Chatbot & AI Integration**
- Uses **DeepSeek API** (`deepseek_chatbot.js`) for AI-based food queries.
- The chatbot processes user inputs, retrieves food nutrition data, and returns structured results (JSON format).

---

### **Database Operations**
- **PostgreSQL (`db.js`)**
  - Configuration File for Connecting to a PostgreSQL Database.
- **Database Services (`database_ser/`)**
  - `getDatafromDB.js`: Fetches user data.
  - `updateDatafromDB.js`: Updates user nutrition records.

---

### **Caching & Cleanup Services**
- **Redis (`redisClient.js`)**
  - Used for **JWT blacklisting** (prevents token reuse after logout).
- **Cleanup Services (`cleanup_ser/`)**
  - `Token_blacklist.js`: Manages expired JWTs.
  - `verification_cleanup.js`: Deletes expired email verification tokens.

---

## **Future Work: Docker Deployment**
Currently working on **Dockerizing the backend** for easier deployment:
- **PostgreSQL, Redis, and the backend will be containerized**.
- A **`docker-compose.yml`** will be added for quick setup.
