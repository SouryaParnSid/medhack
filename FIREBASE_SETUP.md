# Firebase Setup for SwasthyaAI Triage System

This guide will help you set up Firebase for the online database component of the SwasthyaAI triage system.

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "SwasthyaAI")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)
5. Click "Create project"

## Step 2: Set Up Firestore Database

1. In your Firebase project dashboard, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode" (recommended for real patient data)
4. Select a location closest to your target users (e.g., for India, you might choose "asia-south1")
5. Click "Enable"

## Step 3: Set Up Web App

1. In your Firebase project dashboard, click on the gear icon next to "Project Overview" and select "Project settings"
2. Scroll down to "Your apps" and click the web icon (</>)
3. Register your app with a nickname (e.g., "SwasthyaAI Web")
4. Click "Register app"
5. You'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Add Firebase Configuration to SwasthyaAI

1. Copy the values from the configuration object
2. Open your `.env.local` file in the SwasthyaAI project
3. Add the following environment variables with your Firebase configuration values:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. Save the file

## Step 5: Set Up Firestore Security Rules

For a production application, you should set up proper security rules. Here's a basic set of rules to get you started:

1. Go to the Firestore Database in your Firebase console
2. Click on the "Rules" tab
3. Replace the default rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to patients collection
    match /patients/{document=**} {
      allow read, write: if true;  // For development only
      
      // For production, you should restrict access:
      // allow read, write: if request.auth != null;
    }
  }
}
```

4. Click "Publish"

**Note:** The rules above allow anyone to read and write to your database. For a production application, you should implement proper authentication and more restrictive rules.

## Step 6: Install Firebase SDK

The Firebase SDK is already added to the project, but if you need to install it manually, run:

```bash
npm install firebase
```

## Step 7: Restart Your Application

After setting up all the configuration, restart your Next.js development server:

```bash
npm run dev
```

## Troubleshooting

- If you see errors related to Firebase initialization, check that all environment variables are correctly set in your `.env.local` file.
- If you're having issues with Firestore permissions, check your security rules in the Firebase console.
- Make sure you have the latest version of the Firebase SDK installed.

## Next Steps

- Consider adding authentication to protect patient data
- Set up proper security rules for production
- Implement backup strategies for your Firestore database
