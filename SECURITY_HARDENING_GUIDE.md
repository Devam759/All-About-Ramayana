# 🔐 Security Hardening Guide
## Firebase App Check + reCAPTCHA Setup

This guide walks you through activating **Firebase App Check**, which is the most critical security step. Once enabled, your Cloud Function **rejects all requests** that don't come from your verified website — meaning bots and scripts hitting the endpoint directly are blocked before they can spend any of your Gemini quota.

---

## Step 1: Register Your App for reCAPTCHA v3

1. Go to **[Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)**
2. Fill in the form:
   - **Label**: `All About Ramayana - Production`
   - **reCAPTCHA type**: ✅ **Score based (v3)**
   - **Domains**: Add `all-about-ramayana.web.app`
3. Click **Submit**
4. Copy the **Site Key** (starts with `6L...`)

---

## Step 2: Add the Key to Your Project

Open your `.env` file and paste the Site Key:

```
VITE_RECAPTCHA_SITE_KEY=6L_YOUR_ACTUAL_KEY_HERE
```

---

## Step 3: Register App Check in Firebase Console

1. Go to **[Firebase Console](https://console.firebase.google.com)** → Your Project → **App Check**
2. Click **Get Started**
3. Select your **Web App**
4. Choose **reCAPTCHA v3**
5. Paste the same **Site Key**
6. Click **Save**

> [!IMPORTANT]
> You must complete Step 3 in the Firebase Console. Without it, even a correctly configured front-end will fail App Check verification.

---

## Step 4: Enable Enforcement for Cloud Functions

1. In the Firebase Console → **App Check** → **APIs** tab
2. Find **Cloud Functions** in the list
3. Click **Enforce**

> [!WARNING]
> Only do this AFTER your production site is live with the reCAPTCHA key. If you enforce before deploying, your function will return 403 errors for all calls.

---

## Step 5: Deploy the Updated Code

Run the deploy command to push both the new Firestore rules and the Cloud Function with `enforceAppCheck: true`:

```bash
npm run deploy
```

---

## 🧪 Step 6: Local Development Debug Token

When developing locally, App Check will fail (no reCAPTCHA on localhost). Use a **Debug Token** instead:

1. Add to your browser console or `.env` for local only:
   ```
   self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
   ```
2. A debug token will be printed to the console on the next page load.
3. Go to Firebase Console → **App Check** → **Apps** → **Manage debug tokens**
4. Add the generated token.

> [!NOTE]
> Never add the debug token to a production build or commit it to git. It's for local development only.

---

## 🛡️ What You Have Now (Security Checklist)

| Layer | Status | Protection |
|---|---|---|
| **Client Sanitization** | ✅ Active | XSS, prompt injection, length limits |
| **Rate Limiting** | ✅ Active | 5-second client-side cooldown |
| **Backend Proxy** | ✅ Active | API key hidden in Secret Manager |
| **Firestore Rules** | ✅ Active | Field-level validation, no spam/spoofing |
| **App Check** | ⚠️ Pending Setup | Blocks bots from calling Cloud Functions directly |
| **Model Fallback** | ✅ Active | Auto-rotates models on quota/errors |

Once App Check is registered in the Firebase Console and deployed, your platform will be at a **production-grade security level**. 🏹🛡️🕊️
