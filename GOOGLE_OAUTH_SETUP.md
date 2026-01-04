# Google OAuth Setup Guide

Follow these steps to enable Google Sign-In for OpsMind AI:

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: OpsMind AI
   - User support email: Your email
   - Developer contact: Your email
   - Click **Save and Continue**

6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: OpsMind AI Web Client
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:5000`
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback`
   - Click **Create**

7. Copy the **Client ID** and **Client Secret**

## 2. Update Backend Environment Variables

Open `backend/.env` and update:

```env
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
FRONTEND_URL=http://localhost:3000
```

## 3. Test Google Login

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Click **Sign In** in the navbar
4. Click **Continue with Google**
5. Select your Google account
6. You should be redirected back and logged in!

## Production Setup

For production, update:

1. Google Cloud Console:
   - Add your production domain to Authorized JavaScript origins
   - Add `https://yourdomain.com/api/auth/google/callback` to Authorized redirect URIs

2. Backend `.env`:
   ```env
   FRONTEND_URL=https://yourdomain.com
   ```

## Troubleshooting

**Error: redirect_uri_mismatch**
- Make sure the redirect URI in Google Console matches exactly: `http://localhost:5000/api/auth/google/callback`

**Error: invalid_client**
- Double-check your Client ID and Client Secret in `.env`

**Not redirecting after login**
- Check that FRONTEND_URL is set correctly in backend `.env`
