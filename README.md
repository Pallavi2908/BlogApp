
# BlogApp - AI-Powered Blogging Platform

Blogging platform built with Node.js, Express, and MongoDB, featuring secure authentication (JWT and BCrypt) , cloud-based image storage (Cloudinary), and a clean, responsive interface.


## Live Demo

**[View Live Application](https://blogapp-lngd.onrender.com/users/create)**

##  Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password encryption
- **Article Management**: Create, read, update, and delete blog posts with rich text content
- **Profile Management**: User profiles with Cloudinary-powered profile photo uploads
- **Responsive Design**: Clean, mobile-friendly interface built with EJS templates
- **Cloud Storage**: Profile images stored on Cloudinary CDN for fast, reliable delivery
- **RESTful API**: Well-structured API endpoints following REST principles

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing

**Frontend:**
- EJS templating engine
- Vanilla JavaScript
- TailwindCSS

**Cloud Services:**
- Cloudinary for image storage and CDN
- MongoDB Atlas for database hosting
- Render for application deployment

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- Cloudinary account

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/blogflow.git
cd blogflow
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment variables**

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_strong_random_secret_here

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_KEY=your_cloudinary_api_key
CLOUD_SECRET=your_cloudinary_api_secret

# Server
PORT=3000
```

4. **Run the application**
```bash
npm start
```

Visit `http://localhost:3000` in your browser.



### Image Upload Architecture
- Multer handles multipart/form-data
- Images temporarily stored in memory (`memoryStorage`)
- Streamed directly to Cloudinary
- Cloudinary URLs stored in MongoDB
- No local filesystem dependency (deployment-friendly)

### Database Schema

**User Model:**
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  userHandle: { type: String, required: true, unique: true },
  emailId: { type: String, required: true, unique: true },
  birthday: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  photo: { type: String, default: "" },
});

```

**Article Model:**
```javascript
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  authorHandle: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});
```

## 🚀 Deployment

Deployed on Render with:
- Automatic deployments from GitHub
- Environment variables configured in Render dashboard
- MongoDB Atlas for database
- Cloudinary for image CDN

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Create new user
- `POST /auth/login` - Authenticate user
- `GET /auth/logout` - Clear session

### Articles
- `GET /articles/all` - Get all articles
- `GET /articles/:id` - Get single article
- `POST /articles/new` - Create article (auth required)
- `PUT /articles/:id/edit` - Update article (auth required)
- `DELETE /articles/:id` - Delete article (auth required)

### Users
- `GET /users/profile` - View own profile (auth required)
- `POST /users/update-photo` - Upload profile photo (auth required)

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with authentication middleware
- Input validation and sanitization
- Environment variables for sensitive data
- HTTPS in production



