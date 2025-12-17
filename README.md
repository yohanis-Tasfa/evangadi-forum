# 🎓 Evangadi Forum - Q&A Platform

A full-stack Q&A platform where Evangadi students can ask programming-related questions and get answers.

## 🚀 Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MySQL
- **Authentication:** JWT

## 📁 Project Structure

```
evangadii-forum/
├── evangadii-forum-backend/     # Backend API (Node.js/Express)
│   ├── app.js                   # Express server
│   ├── controller/              # Business logic
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth middleware
│   └── db/                       # Database config
├── evangadii-forum-frontend/    # Frontend (React/Vite)
│   ├── src/
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   └── ...
│   └── ...
├── package.json                 # Root package.json
└── README.md
```

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ installed
- MySQL database running
- Git

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd evangadii-forum-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   USER=your_db_user
   PASSWORD=your_db_password
   DATABASE=evangadi_forum_db
   HOST=your_db_host
   DB_PORT=3306
   PORT=5500
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd evangadii-forum-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   VITE_API_BASE_URL=http://localhost:5500/api
   ```

4. **Start dev server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5500/api

## 🚀 Deployment

### Backend on Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set **Root Directory** to: `evangadii-forum-backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add environment variables (same as local `.env`)
7. Deploy!

### Frontend on Vercel

1. Connect your GitHub repository to Vercel
2. Create a new Project
3. Set **Root Directory** to: `evangadii-forum-frontend`
4. Framework: Vite (auto-detected)
5. Add environment variable:
   - `VITE_API_BASE_URL` = Your Render backend URL + `/api`
6. Deploy!

## 📋 Features

- ✅ User Registration & Login
- ✅ Post Questions
- ✅ Answer Questions
- ✅ Edit/Delete Own Questions
- ✅ Edit/Delete Own Answers
- ✅ View All Questions
- ✅ View My Questions
- ✅ View My Answers
- ✅ Question Detail Page

## 📝 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/check` - Check authenticated user

### Questions
- `GET /api/question/all` - Get all questions
- `GET /api/question/:questionid` - Get question by ID
- `GET /api/question/user/:userid` - Get user's questions
- `POST /api/question/create` - Create question
- `PUT /api/question/update/:questionid` - Update question
- `DELETE /api/question/delete/:questionid` - Delete question

### Answers
- `GET /api/answer/question/:questionid` - Get answers for question
- `GET /api/answer/user/:userid` - Get user's answers
- `POST /api/answer/create` - Create answer
- `PUT /api/answer/update/:answerid` - Update answer
- `DELETE /api/answer/delete/:answerid` - Delete answer

## 🔒 Security

- Passwords hashed with bcrypt
- JWT authentication
- CORS configured
- Environment variables for secrets
- Owner-only edit/delete permissions

## 📄 License

ISC

## 👥 Author

Evangadi Networks
