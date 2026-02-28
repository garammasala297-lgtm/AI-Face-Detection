# CommitLens 🚀
### Hackathon Management Platform

---

## What is this?

CommitLens is a web app that manages hackathon participants, judges, and organizers. Each role gets their own dashboard after logging in.

| Role | Login Method | Goes To |
|------|-------------|---------|
| Participant | GitHub Account | Participant Dashboard |
| Judge | Email + Password | Judge Dashboard |
| Organizer | Email + Password | Organizer Dashboard |
| Admin | Email + Password | Admin Dashboard |

---

## Before You Start

You need these installed on your computer:

### 1. Node.js
- Download from: https://nodejs.org
- Choose the **LTS version** (recommended)
- After installing, verify:
  ```
  node --version
  ```
  Should print something like `v20.x.x`

### 2. Git
- Download from: https://git-scm.com
- After installing, verify:
  ```
  git --version
  ```

### 3. A Code Editor
- Recommended: [VS Code](https://code.visualstudio.com)

---

## Step 1 — Open the Project Folder

Open your terminal (Command Prompt or PowerShell on Windows) and go to the project folder:

```bash
cd C:\Users\Public\AI-Face-Detection
```

> ⚠️ **All commands in this guide must be run inside this folder.**
> Never run them inside JUDGE_DASHBOARD, ORGANISER_DASHBOARD, or other subfolders.

---

## Step 2 — Install Dependencies

```bash
npm install
```

This downloads all the packages the project needs. Wait for it to finish (may take 1–2 minutes).

✅ You'll see something like: `added 457 packages`

---

## Step 3 — Create Your Environment File

```bash
copy .env.example .env.local
```

This creates a `.env.local` file where you'll store secret configuration values.

Now open `.env.local` in VS Code. You'll see this:

```
MONGODB_URI=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
ADMIN_EMAIL=priyanshu@gmail.com
ADMIN_PASSWORD=ChangeMe!Str0ng
```

You need to fill in 3 things: MongoDB URI, NextAuth Secret, and GitHub credentials.
Keep reading — each one is explained below.

---

## Step 4 — Set Up MongoDB Database

This is where your user data will be stored.

### 4a. Create a Free Account
- Go to: https://cloud.mongodb.com
- Click **"Try Free"** and sign up

### 4b. Create a Cluster
1. After logging in, click **"Build a Database"**
2. Choose **M0 Free** tier
3. Pick any cloud provider and region
4. Click **"Create"**

### 4c. Create a Database User
1. On the left sidebar click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set a username (e.g. `myuser`) and a password (e.g. `mypassword123`)
5. Under roles, select **"Atlas admin"**
6. Click **"Add User"**

> 💡 Save this username and password — you'll need them in a moment.

### 4d. Allow Your IP Address
1. On the left sidebar click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access From Anywhere"**
4. Click **"Confirm"**

### 4e. Get Your Connection String
1. On the left sidebar click **"Database"**
2. Click **"Connect"** on your cluster
3. Click **"Drivers"**
4. Copy the connection string. It looks like:
   ```
   mongodb+srv://myuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add `/commitlens` before the `?`:
   ```
   mongodb+srv://myuser:mypassword123@cluster0.xxxxx.mongodb.net/commitlens?retryWrites=true&w=majority
   ```

### 4f. Paste into .env.local
Open `.env.local` and replace the `MONGODB_URI` line:
```
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.xxxxx.mongodb.net/commitlens?retryWrites=true&w=majority
```

---

## Step 5 — Generate a NextAuth Secret

This is a secret key used to secure login sessions. Run this command:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

It will print a long random string like:
```
f8e4a9c2b1d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

Copy it and paste into `.env.local`:
```
NEXTAUTH_SECRET=f8e4a9c2b1d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
```

---

## Step 6 — Set Up GitHub OAuth

This lets participants sign in with their GitHub account.

### 6a. Create a GitHub OAuth App
1. Go to: https://github.com/settings/developers
2. Click **"OAuth Apps"** on the left
3. Click **"New OAuth App"**
4. Fill in the form exactly like this:
   ```
   Application name:          CommitLens
   Homepage URL:              http://localhost:3000
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```
5. Click **"Register application"**

### 6b. Get Your Credentials
1. Copy the **Client ID** shown on the page
2. Click **"Generate a new client secret"**
3. Copy the **Client Secret** (it only shows once!)

### 6c. Paste into .env.local
```
GITHUB_CLIENT_ID=Ov23lixxxxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Step 7 — Final .env.local Check

Your complete `.env.local` should look like this (with your actual values):

```
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/commitlens?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=f8e4a9c2b1d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
GITHUB_CLIENT_ID=Ov23lixxxxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=priyanshu@gmail.com
ADMIN_PASSWORD=ChangeMe!Str0ng
```

> ⚠️ Never share this file or commit it to GitHub. It contains secret keys.

---

## Step 8 — Create the Admin Account

Run this once to create the admin user in the database:

```bash
npx tsx scripts/seed-admin.ts
```

✅ Expected output:
```
✅ Connected to MongoDB
✅ Admin user created: priyanshu@gmail.com
```

If you see `Admin already exists` — that's fine, skip to the next step.

---

## Step 9 — Start the App

```bash
npm run dev
```

✅ Expected output:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
✓ Ready in 3s
```

Open your browser and go to: **http://localhost:3000**

---

## Step 10 — Test Everything Works

### Test Admin Login
1. Go to http://localhost:3000/auth
2. Click the **"Organizer/Judge"** tab
3. Select **Admin** from the dropdown
4. Email: `priyanshu@gmail.com`
5. Password: `ChangeMe!Str0ng`
6. Click **Sign In**
7. ✅ You should land on the Admin Dashboard

### Test Participant Login (GitHub)
1. Go to http://localhost:3000/auth
2. Click the **"Participant"** tab
3. Click **"Sign in with GitHub"**
4. Authorize the app on GitHub
5. Fill in the team registration form
6. ✅ You should land on the Participant Dashboard

### Test Judge Signup
1. Go to http://localhost:3000/auth
2. Click the **"Organizer/Judge"** tab
3. Select **Judge** from the dropdown
4. Enter any email and password
5. Click **Sign Up**
6. ✅ You should land on the Judge Dashboard

---

## Stopping the App

Press `Ctrl + C` in the terminal where `npm run dev` is running.

---

## Starting Again Later

Every time you want to run the app again, just:

```bash
cd C:\Users\Public\AI-Face-Detection
npm run dev
```

That's it. Steps 1–8 only need to be done once.

---

## Common Errors & Fixes

### ❌ `Cannot find module`
```bash
npm install
```

### ❌ `Please define the MONGODB_URI environment variable`
- Make sure `.env.local` exists in the root folder
- Make sure `MONGODB_URI` is filled in correctly

### ❌ `NEXTAUTH_SECRET` error
- Make sure `NEXTAUTH_SECRET` is set in `.env.local`
- It must be at least 32 characters long

### ❌ GitHub login redirects to error page
- Check the callback URL in GitHub settings is exactly:
  `http://localhost:3000/api/auth/callback/github`
- Make sure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct

### ❌ MongoDB connection times out
- Go to MongoDB Atlas → Network Access
- Make sure `0.0.0.0/0` is in the IP allowlist

### ❌ Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <the_number_shown> /F

# Then try again
npm run dev
```

---

## Project Folder Guide

```
AI-Face-Detection/          ← Run all commands here (ROOT)
├── app/                    ← Main app pages and API routes
├── components/             ← Shared React components
├── lib/                    ← Database and auth configuration
├── models/                 ← MongoDB data schemas
├── scripts/                ← Utility scripts (seed admin)
├── types/                  ← TypeScript type definitions
├── middleware.ts           ← Route access control
├── .env.local              ← Your secret config (you create this)
├── .env.example            ← Config template
└── package.json            ← Project dependencies

# These folders are reference-only, do NOT run npm commands inside them:
├── PARTICIPANT_DASHBOARD/
├── JUDGE_DASHBOARD/
├── ORGANISER_DASHBOARD/
└── LOGIN_SIGNIN PAGE/
```

---

## Deploying Online (Vercel)

When you're ready to put it on the internet:

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Select your repository
4. Add all the same environment variables from `.env.local`
5. Change `NEXTAUTH_URL` to your Vercel URL:
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   ```
6. Click **"Deploy"**

### 3. Update GitHub OAuth for Production
1. Go back to https://github.com/settings/developers
2. Edit your OAuth App
3. Update the callback URL to:
   ```
   https://your-app.vercel.app/api/auth/callback/github
   ```

---

*Built with Next.js, MongoDB, NextAuth.js, and Tailwind CSS*
