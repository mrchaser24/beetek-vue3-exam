# Vue 3 Firebase Items Manager

A modern Vue.js application built with Vue 3, Vuetify 3 (Material Design 3), Firebase Authentication, and Firestore for managing personal items with user-specific data access.

## 🚀 Features

- **🔐 Google Authentication**: Secure sign-in using Firebase Auth with Google provider
- **📊 Data Management**: Full CRUD operations (Create, Read, Update, Delete) for items
- **🔒 User Data Isolation**: Each user can only access their own data
- **📱 Responsive Design**: Material Design 3 compliant interface using Vuetify 3
- **⚡ Real-time Updates**: Live data synchronization with Firestore
- **🎨 Modern UI**: Clean, intuitive interface with dialogs and data tables

## 🛠️ Tech Stack

- **Frontend**: Vue 3 (Composition API)
- **UI Framework**: Vuetify 3 (Material Design 3)
- **Build Tool**: Vite
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Routing**: Vue Router with file-based routing
- **State Management**: Vue 3 Composables

## � Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm or yarn package manager
- A Firebase project (see Firebase Setup section)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd my-vue3-exam
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Firebase Setup

#### Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Follow the setup wizard:
   - Enter your project name
   - Choose whether to enable Google Analytics (optional)
   - Select your analytics account (if enabled)

#### Enable Authentication

1. In your Firebase project dashboard, click on "Authentication" in the left sidebar
2. Click on the "Get started" button
3. Go to the "Sign-in method" tab
4. Enable "Google" as a sign-in provider:
   - Click on "Google"
   - Toggle the "Enable" switch
   - Enter your project support email
   - Click "Save"

#### Setup Firestore Database

1. In your Firebase project dashboard, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database
5. Click "Done"

#### Get Your Firebase Configuration

1. In your Firebase project dashboard, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click on the "</>" (Web) icon to add a web app
5. Register your app with a nickname
6. Copy the Firebase configuration object

### 4. Environment Configuration

1. Copy the environment example file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

### 5. Run the Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── ItemDialog.vue   # Add/Edit item dialog
│   ├── ItemsTable.vue   # Main data table component
│   └── LoginForm.vue    # Authentication component
├── composables/         # Vue 3 composables
│   ├── useAuth.js       # Authentication logic
│   └── useItems.js      # Items CRUD operations
├── pages/               # Page components (auto-routed)
│   └── index.vue        # Main page
├── plugins/             # External integrations
│   ├── firebase.js      # Firebase configuration
│   └── vuetify.js       # Vuetify configuration
├── styles/              # Global styles
│   └── settings.scss    # Vuetify customization
├── App.vue              # Root component
└── main.js              # Application entry point
```

## � Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and fix files
npm run lint
```

## 🔒 Security Rules (Firestore)

For production, update your Firestore security rules to ensure data isolation:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Items collection - users can only access their own items
    match /items/{itemId} {
      allow read, write: if request.auth != null && 
                         request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                    request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 📱 Usage

1. **Sign In**: Click "Sign in with Google" to authenticate
2. **Add Items**: Click the "Add Item" button to create new items
3. **Edit Items**: Click the pencil icon in the actions column to edit
4. **Delete Items**: Click the delete icon and confirm to remove items
5. **Search**: Use the search bar to filter items by name or description
6. **Sign Out**: Click the "Sign Out" button to log out

## 🎨 Features Overview

### Authentication
- Google Sign-In integration
- Automatic authentication state management
- Secure user session handling

### Items Management
- Create items with name and description
- Real-time updates across all sessions
- Edit items with form validation
- Delete items with confirmation
- Search and filter functionality

### User Experience
- Material Design 3 interface
- Responsive layout for all devices
- Loading states and error handling
- Success/error notifications
- Form validation with helpful messages

## � Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting (Optional)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```

4. Deploy:
   ```bash
   firebase deploy
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Firebase Configuration Error**
   - Ensure all environment variables are correctly set in `.env.local`
   - Verify your Firebase project settings

2. **Authentication Not Working**
   - Check that Google Sign-In is enabled in Firebase Console
   - Verify your domain is authorized in Firebase Auth settings

3. **Firestore Permission Denied**
   - Ensure Firestore is set up in test mode for development
   - Check that security rules allow read/write operations

4. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check for any ESLint errors and fix them

### Getting Help

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Firebase configuration
3. Ensure all dependencies are properly installed
4. Check the Firebase Console for any service issues

## � Support

For additional support or questions, please open an issue in the repository or contact the development team.
