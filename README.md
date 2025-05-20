<div align="center">

# SwasthyaAI - AI-Powered Healthcare Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini_1.5-green)](https://ai.google.dev/)

</div>

## Overview

SwasthyaAI is a Progressive Web App designed to support community health workers in rural areas with AI-powered healthcare tools. The application provides intelligent assistance for preliminary diagnosis, triage, and treatment guidance, optimized for low-resource environments.

## 🌟 Key Features

### 🩺 Symptom Checker
- Input symptoms via text or voice for AI-powered preliminary diagnosis
- Detailed analysis with possible conditions, severity assessment, and urgency level
- Structured recommendations and next steps
- Voice input support for accessibility

### 🏥 Triage Assistant
- Smart prioritization of cases based on severity
- Patient registration with symptom tracking
- AI-powered priority assignment (high, medium, low)
- Queue management system with explanations

### 🔍 Image Diagnosis
- Multiple specialized diagnostic tools:
  - **General Medical Image Analysis**: AI-powered analysis of any medical image
  - **Pneumonia Detection**: Specialized X-ray analysis for pneumonia detection
  - **Skin Condition Analysis**: Dermatological image assessment
- Detailed findings, potential conditions, and recommendations
- Support for various image formats and sources

### 💬 AI Chat
- Conversational interface for medical guidance
- Context-aware responses to medical queries
- Treatment information and first-aid guidance
- Professional medical advice disclaimers

### 📱 Progressive Web App
- Offline functionality in low-connectivity environments
- Installable on mobile devices
- Responsive design for all screen sizes
- Low data usage optimizations

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.3.2 with React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom animations
- **UI Components**: Headless UI 2.2.2
- **Icons**: Heroicons 2.2.0
- **State Management**: React Context API and hooks

### Backend
- **API**: Next.js API Routes with Edge Runtime
- **Architecture**: RESTful API design
- **Validation**: Middleware for request validation
- **Database**: Firebase Firestore (cloud)
- **Authentication**: JWT-based auth system

### AI & Machine Learning
- **Text & Image Analysis**: Google Generative AI (Gemini 1.5 Flash)
- **Client-side ML**: TensorFlow.js for on-device processing
- **Orchestration**: LangChain for AI workflows
- **Output Enhancement**: Custom HTML formatting with animations
- **Medical Models**: Pre-trained TensorFlow models for specialized diagnostics

### Data Management
- **Cloud Storage**: Firebase Firestore
- **Local Storage**: Dexie.js (IndexedDB wrapper)
- **API Client**: Axios 1.9.0
- **Type Validation**: Zod schema validation
- **Offline Sync**: Background synchronization when connectivity returns

### Security & Performance
- **API Protection**: Rate limiting and request validation
- **Data Security**: Input sanitization and validation
- **Caching**: Edge caching for API responses
- **Environment**: Secure environment variable handling
- **Optimizations**: Image compression and lazy loading

### Progressive Web App
- **Framework**: Next-PWA 5.6.0
- **Background Sync**: Service Worker for offline operations
- **Caching Strategy**: Cache-first for assets and API responses
- **Installation**: Web App Manifest for native-like installation
- **Notifications**: Push notification support (where available)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Google Gemini API key (for AI features)
- Firebase project (optional, for cloud features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swasthyaai.git
   cd swasthyaai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Required for AI features
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   
   # Optional: Firebase configuration (for cloud features)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Firebase Setup (Optional)**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firestore Database
   - Add a Web App to your Firebase project
   - Copy the configuration details to your `.env.local` file

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000)

6. **Build for production**
   ```bash
   npm run build
   npm run start
   # or
   yarn build
   yarn start
   ```

## 📁 Project Structure

```
├── public/                  # Static assets and pre-trained models
│   ├── models/              # TensorFlow.js models
│   │   ├── pneumonia/       # Pneumonia detection model (active)
│   │   ├── skin-cancer/     # Skin cancer model (directory prepared)
│   │   └── brain-stroke/    # Heart attack model (directory prepared)
│   ├── images/              # Static images
│   └── manifest.json        # PWA manifest
│
├── models/                   # Model directory (alternative location)
│   └── pneumonia/           # Pneumonia model files
│
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/             # Backend API routes
│   │   │   ├── chat/        # Chat API endpoints
│   │   │   ├── diagnosis/   # Image diagnosis endpoints
│   │   │   ├── symptoms/    # Symptom analysis endpoints
│   │   │   └── triage/      # Triage management endpoints
│   │   ├── chat/            # AI Chat feature frontend
│   │   ├── components/      # Shared UI components
│   │   │   └── Navigation.tsx # Navigation component
│   │   ├── image-diagnosis/ # Image analysis feature
│   │   │   ├── general/     # General image analysis with Gemini
│   │   │   ├── pneumonia/   # Pneumonia detection with TensorFlow.js
│   │   │   └── skin/        # Skin condition analysis
│   │   ├── symptom-checker/ # Symptom analysis with Gemini
│   │   ├── triage/          # Patient triage feature
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   │
│   ├── models/              # Model implementations
│   │   └── pneumonia/       # Pneumonia model interface
│   │       └── pneumoniaModel.ts # Pneumonia detection logic
│   │
│   └── utils/               # Utility functions
│       └── gemini.ts        # AI integration with Google Gemini API
│
├── .env.local               # Environment variables (not in repo)
├── .gitignore               # Git ignore file
├── LICENSE                  # MIT License
├── convert_pneumonia_model.py # Python script to convert pneumonia model
├── convert_skin_cancer_model.py # Python script to convert skin cancer model
├── ensemble_model.pkl       # Heart attack prediction model (pickle format)
├── export_model.py          # General model export utility
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies and scripts
├── pneumonia_detection_model (1).h5 # Pneumonia model (H5 format)
├── README.md                # Project documentation
├── skin_cancer_model.h5     # Skin cancer model (H5 format)
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Backend Implementation

- **API Routes**: The application uses Next.js API routes to handle server-side operations:
  - `/api/chat`: Handles AI chat conversations using Gemini API
  - `/api/diagnosis`: Processes medical image analysis requests
  - `/api/symptoms`: Manages symptom analysis and recommendations
  - `/api/triage`: Handles patient triage operations

- **Database**: Uses Dexie.js for client-side storage:
  - Patient records management
  - Triage queue handling
  - Offline data persistence
  - Automatic synchronization when online

- **Security**: 
  - API rate limiting and request validation
  - Secure environment variable handling
  - Data sanitization and validation

## 🧠 Machine Learning Models

### Model Architecture

The application uses several machine learning models for different diagnostic tasks:

1. **Pneumonia Detection Model**:
   - Original format: H5 file (`pneumonia_detection_model.h5`, 9.8 MB)
   - Successfully converted to TensorFlow.js format for browser execution
   - Located in `public/models/pneumonia/` (active and functional)
   - Contains `model.json` and binary weight files
   - Trained on X-ray images to classify pneumonia vs. normal cases

2. **Skin Cancer Detection Model**:
   - Original format: H5 file (`skin_cancer_model.h5`, 52.9 MB)
   - Directory structure prepared at `public/models/skin-cancer/`
   - Pending conversion to TensorFlow.js format
   - Trained to identify various skin conditions and potential cancerous lesions
   - Uses a CNN architecture with transfer learning

3. **Heart Attack Prediction Model**:
   - Original format: Pickle file (`ensemble_model.pkl`, 560 KB)
   - Directory structure prepared at `public/models/brain-stroke/`
   - Pending conversion to TensorFlow.js format
   - Ensemble model combining multiple algorithms
   - Predicts heart attack risk based on patient data

### Model Conversion Process

The original models (H5 and PKL formats) are converted to TensorFlow.js format for client-side execution using the following Python scripts:

- `convert_pneumonia_model.py`: Converts the pneumonia detection model
- `convert_skin_cancer_model.py`: Converts the skin cancer detection model
- `export_model.py`: General model export utility

To convert models for browser use:

```bash
# Install required packages
pip install tensorflowjs tensorflow

# Convert pneumonia model
python convert_pneumonia_model.py

# Convert skin cancer model
python convert_skin_cancer_model.py
```

The converted models are stored in the `public/models/` directory for client-side loading.

## Key Features Implementation

- **AI Integration**: The application uses Google's Gemini 1.5 Flash model for text analysis and multimodal (image + text) processing. All AI interactions are handled through the utility functions in `src/utils/gemini.ts`.

- **Responsive Design**: The UI is fully responsive and adapts to different screen sizes, making it accessible on various devices including tablets and smartphones used in the field.

- **Dark/Light Mode**: Automatic theme detection based on user preferences with seamless switching between dark and light modes.

- **Accessibility**: Designed with accessibility in mind, following WCAG guidelines for better inclusivity.

## Deployment

The application can be deployed to any platform that supports Next.js applications. We recommend using Vercel for the best experience:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables (NEXT_PUBLIC_GEMINI_API_KEY, OPENAI_API_KEY)
4. Deploy!

## 🔧 Development

### Commands

- **Development**: `npm run dev` - Start the development server with Turbopack
- **Build**: `npm run build` - Build the production application
- **Start**: `npm run start` - Start the production server
- **Lint**: `npm run lint` - Run ESLint for code quality
- **Type Check**: `npm run type-check` - Check TypeScript types

### Code Style

This project follows a consistent code style enforced by ESLint and Prettier. Key conventions include:

- TypeScript for type safety
- Functional components with React hooks
- Tailwind CSS for styling
- Modular component architecture

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how you can contribute:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📦 Deployment

SwasthyaAI can be deployed to any platform that supports Next.js applications.

### Vercel Deployment (Recommended)

1. Fork this repository
2. Create a Vercel account at [vercel.com](https://vercel.com)
3. Import your forked repository
4. Configure environment variables:
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - Any Firebase configuration variables if using cloud features
5. Deploy!

### Other Platforms

The application can also be deployed to other platforms like Netlify, AWS, or a traditional server. Refer to the Next.js documentation for platform-specific deployment instructions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- **Frameworks**: Next.js 15, React 19
- **Styling**: Tailwind CSS 4
- **Components**: Headless UI
- **Icons**: Heroicons
- **AI**: Google Generative AI (Gemini)
- **PWA**: Next-PWA
- **Community**: Thanks to all contributors and the open-source community

---

<div align="center">

**SwasthyaAI** — Empowering healthcare with AI

[GitHub](https://github.com/yourusername/swasthyaai) • [Issues](https://github.com/yourusername/swasthyaai/issues) • [Documentation](https://github.com/yourusername/swasthyaai/wiki)

</div>

## Recent Updates

- **Added Firebase Integration**: Implemented online database system for the triage component, allowing patient data to be stored in the cloud and accessed from multiple devices
- **Enhanced AI Output Formatting**: Redesigned the AI-generated content with structured HTML, animations, and visual styling for better readability and user experience
- **Added Data Migration**: Created utility for migrating local IndexedDB data to Firebase Firestore
- **Added patient deletion functionality in Triage**
- **Improved priority level consistency in patient analysis**
- **Fixed ESLint issues and optimized deployment**
- **Enhanced accessibility with proper ARIA labels**
- **Improved error handling for API failures**

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
