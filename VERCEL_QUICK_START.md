# Vercel + Render Quick Start Guide

## 🚀 Quick Deploy Steps

### 1️⃣ Backend (Render) - 5 minutes

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. **New +** → **Web Service**
3. Connect GitHub repo
4. Settings:
   ```
   Name: jobzee-backend
   Root Directory: jobzee-backend
   Build: npm install
   Start: npm start
   ```
5. Add environment variables (see list below)
6. **Create Web Service**
7. Copy your backend URL: `https://jobzee-backend-xxxx.onrender.com`

### 2️⃣ Frontend (Vercel) - 3 minutes

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Add New** → **Project**
3. Import your GitHub repo
4. Settings:
   ```
   Root Directory: jobzee-frontend
   Framework: Create React App
   Build Command: npm run build
   Output Directory: build
   ```
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://jobzee-backend-xxxx.onrender.com
   ```
6. **Deploy**
7. Copy your frontend URL: `https://your-app.vercel.app`

### 3️⃣ Update Backend FRONTEND_URL

1. Back to Render → Your backend → **Environment**
2. Set: `FRONTEND_URL=https://your-app.vercel.app`
3. Save (auto-redeploys)

---

## 📋 Required Environment Variables

### Backend (Render)

Copy-paste these into Render's environment variables:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobzee
JWT_SECRET=your-64-character-random-secret-string-here
FRONTEND_URL=https://your-app.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yoursite.com
FROM_NAME=Jobzee Platform
NODE_ENV=production
PORT=5000
```

### Frontend (Vercel)

```bash
REACT_APP_API_URL=https://jobzee-backend-xxxx.onrender.com
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_MAPBOX_TOKEN=your-mapbox-token
```

---

## ✅ Verification Checklist

- [ ] Backend health check works: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] Can register/login a user
- [ ] No CORS errors in browser console
- [ ] File uploads work (profile pictures)

---

## 🐛 Common Issues

### CORS Error?
- Check `FRONTEND_URL` in Render matches Vercel URL exactly
- No trailing slash
- Redeploy backend after changing

### Can't Connect to API?
- Verify `REACT_APP_API_URL` in Vercel
- Check backend is running (visit /api/health)
- Wait 30-60 seconds for Render to wake up (free tier)

### Build Failed?
**Render**: Check for missing dependencies in `package.json`
**Vercel**: Verify `jobzee-frontend` directory path is correct

---

## 💡 Pro Tips

1. **MongoDB Atlas**: Use free M0 tier
2. **JWT Secret**: Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
3. **Cold Starts**: First request to Render takes 30-60 seconds
4. **Logs**: Always check logs first when debugging
5. **Auto-Deploy**: Both platforms auto-deploy on git push

---

## 📱 Access Your App

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://jobzee-backend-xxxx.onrender.com/api`
- **Health Check**: `https://jobzee-backend-xxxx.onrender.com/api/health`

---

## 🎯 Next Steps

1. Update Google OAuth credentials with your Vercel URL
2. Test all features
3. Set up custom domain (optional)
4. Monitor usage on free tiers

For detailed guide, see **DEPLOY_VERCEL.md**
