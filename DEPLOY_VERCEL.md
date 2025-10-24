# Jobzee Deployment Guide - Render (Backend) + Vercel (Frontend)

This guide walks you through deploying your backend to Render and frontend to Vercel.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **MongoDB Atlas**: Set up a cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
4. **Cloudinary Account**: Sign up at [cloudinary.com](https://cloudinary.com)
5. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket

---

## 🎯 Part 1: Deploy Backend to Render

### Step 1: Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier M0)
3. **Database Access** → Add New Database User
   - Username: `jobzee-user` (or your choice)
   - Password: Generate a strong password
   - Database User Privileges: **Read and write to any database**
4. **Network Access** → Add IP Address → **Allow Access from Anywhere** (0.0.0.0/0)
5. **Database** → Connect → **Connect your application**
6. Copy connection string: `mongodb+srv://username:<password>@cluster.mongodb.net/jobzee`
7. Replace `<password>` with your actual password

### Step 2: Deploy Backend to Render

#### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Blueprint**
3. Connect your Git repository
4. Render will detect `render.yaml` and show the backend service
5. Click **Apply**

#### Option B: Manual Setup

1. Go to Render Dashboard → **New +** → **Web Service**
2. Connect your repository
3. Configure:
   - **Name**: `jobzee-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `jobzee-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
4. Click **Create Web Service**

### Step 3: Configure Backend Environment Variables

Go to your backend service → **Environment** → Add these variables:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobzee

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-64-characters-long-random-string

# Frontend URL (you'll update this after deploying to Vercel)
FRONTEND_URL=https://your-app.vercel.app

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (for password resets)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yoursite.com
FROM_NAME=Jobzee Platform

# App Configuration
NODE_ENV=production
PORT=5000
APP_NAME=JobZee
```

### Step 4: Get Your Backend URL

After deployment completes:
1. Your backend will be available at: `https://jobzee-backend-xxxx.onrender.com`
2. Test health: Visit `https://your-backend-url.onrender.com/api/health`
3. Copy this URL - you'll need it for Vercel

---

## 🚀 Part 2: Deploy Frontend to Vercel

### Step 1: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. **Import Git Repository**
   - Select your repository
   - Click **Import**

### Step 2: Configure Build Settings

Vercel should auto-detect the settings, but verify:

- **Framework Preset**: Create React App
- **Root Directory**: `jobzee-frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### Step 3: Configure Environment Variables

Click **Environment Variables** and add:

```bash
# Backend API URL (use your Render backend URL)
REACT_APP_API_URL=https://jobzee-backend-xxxx.onrender.com

# Google OAuth Client ID
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# Mapbox Token (if using maps)
REACT_APP_MAPBOX_TOKEN=your-mapbox-token

# Environment
NODE_ENV=production
```

**Important**: Make sure `REACT_APP_API_URL` points to your Render backend URL (without trailing slash).

### Step 4: Deploy

1. Click **Deploy**
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be available at: `https://your-app.vercel.app`

### Step 5: Update Backend FRONTEND_URL

Now that you have your Vercel URL:

1. Go back to **Render Dashboard** → Your backend service → **Environment**
2. Update `FRONTEND_URL` to your Vercel URL: `https://your-app.vercel.app`
3. Save changes (this will trigger a redeploy)

---

## 🔧 Part 3: Configure OAuth & Services

### Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth 2.0 Client ID
3. Add **Authorized JavaScript origins**:
   - `https://your-app.vercel.app`
4. Add **Authorized redirect URIs**:
   - `https://your-app.vercel.app`
5. Save changes

### Verify CORS

The backend is already configured to accept:
- `.onrender.com` domains
- `.vercel.app` domains  
- The specific `FRONTEND_URL` you set

---

## ✅ Part 4: Verification

### Test Backend

Visit these URLs to verify backend:
- Health check: `https://your-backend-url.onrender.com/api/health`
- Should return JSON with `status: "OK"`

### Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Open browser DevTools → Network tab
3. Try to register/login
4. Verify API calls go to your Render backend
5. Check for CORS errors (should be none)

### Test Features

- [ ] User Registration & Login
- [ ] Employer Registration & Login
- [ ] Admin Login
- [ ] Job Posting & Search
- [ ] File Uploads (Profile pictures, resumes)
- [ ] Dashboard Loading
- [ ] Applications
- [ ] Payments (if applicable)

---

## 🔄 Auto-Deployment

### Vercel

- **Automatic**: Pushes to `main` branch auto-deploy
- **Preview**: Pull requests create preview deployments
- **Rollback**: Easy rollback to previous deployments

### Render

- **Automatic**: Pushes to `main` branch auto-deploy
- **Manual**: Can trigger manual deploys from dashboard

---

## 📊 Environment Variables Summary

### Backend (Render)

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | Secret for JWT tokens | ✅ Yes |
| `FRONTEND_URL` | Vercel frontend URL | ✅ Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ Yes |
| `SMTP_HOST` | Email SMTP host | ⚠️ Optional |
| `SMTP_USER` | Email username | ⚠️ Optional |
| `SMTP_PASS` | Email password | ⚠️ Optional |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ⚠️ Optional |

### Frontend (Vercel)

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API URL | ✅ Yes |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID | ⚠️ Optional |
| `REACT_APP_MAPBOX_TOKEN` | Mapbox token | ⚠️ Optional |

---

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors:
1. Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
2. No trailing slashes
3. Include `https://`
4. Redeploy backend after changing

### API Connection Failed

1. Check `REACT_APP_API_URL` in Vercel environment variables
2. Verify backend is running: Visit `/api/health` endpoint
3. Check browser Network tab for exact error
4. Verify no typos in URLs

### Build Failures

**Vercel:**
- Check build logs in Vercel dashboard
- Verify `jobzee-frontend` directory exists
- Ensure all dependencies in `package.json`

**Render:**
- Check deploy logs in Render dashboard  
- Verify `jobzee-backend` directory exists
- Ensure all dependencies in `package.json` (including `qrcode`)

### Free Tier Limitations

**Render:**
- Spins down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- 750 hours/month free

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Serverless functions: 100GB-hours

---

## 💰 Cost Optimization

### Free Tier Limits

- **Render Backend**: Free (with cold starts)
- **Vercel Frontend**: Free (generous limits)
- **MongoDB Atlas**: Free M0 cluster (512MB)
- **Cloudinary**: Free tier (25 credits/month)

### Going to Production

When ready for production:
- **Render**: Upgrade to $7/month (no cold starts)
- **Vercel**: Pro $20/month (better performance)
- **MongoDB**: Shared M2 $9/month (2GB)

---

## 🔐 Security Checklist

- [ ] Strong JWT_SECRET set (64+ characters)
- [ ] MongoDB IP whitelist configured
- [ ] Environment variables secured (not in code)
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic on both platforms)
- [ ] Google OAuth credentials secured
- [ ] Cloudinary credentials secured

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Cloudinary**: https://cloudinary.com/documentation

---

## 🎉 Success!

Once deployed:
- Backend: `https://jobzee-backend-xxxx.onrender.com`
- Frontend: `https://your-app.vercel.app`
- Ready to use!

For any issues, check the logs in respective dashboards.
