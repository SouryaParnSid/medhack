# SwasthyaAI - AI-Powered Healthcare Assistant

SwasthyaAI is a Progressive Web App designed to support community health workers in rural areas with AI-powered healthcare tools. The application provides intelligent assistance for preliminary diagnosis, triage, and treatment guidance, optimized for low-resource environments.

## Features

- **Symptom Checker**: Input symptoms via text or voice for AI-powered preliminary diagnosis. Users can describe their symptoms in detail, and the system provides a comprehensive analysis including possible conditions, severity level, and whether immediate medical attention is needed.

- **Triage Assistant**: Smart prioritization of cases based on severity. Healthcare workers can register patients with their symptoms, and the AI analyzes the information to assign priority levels (high, medium, low) with explanations, helping manage patient queues efficiently.

- **Image Diagnosis**: Upload patient images for instant AI analysis. The system can analyze medical images to identify visible conditions or abnormalities, providing preliminary assessments to support healthcare workers in remote areas.

- **AI Chat**: Get instant guidance on medical conditions and treatments through a conversational interface. The chat assistant provides helpful information about medical conditions while emphasizing the importance of professional medical advice.

- **Offline Support**: Designed as a Progressive Web App to function in low-connectivity environments.

## Tech Stack

- **Frontend**: 
  - Next.js 15.3.2 with React 19
  - TypeScript 5
  - Tailwind CSS 4
  - Headless UI 2.2.2
  - Heroicons 2.2.0

- **Backend**:
  - Next.js API Routes for serverless functions
  - API Route Handlers with Edge Runtime
  - RESTful API architecture
  - Middleware for request validation
  - Firebase Firestore for online database

- **AI Integrations**:
  - Google Generative AI (Gemini 1.5 Flash) for text and image analysis
  - TensorFlow.js for client-side ML processing
  - LangChain for AI chain orchestration
  - Enhanced AI output formatting with animations and structured HTML

- **Data Management**:
  - Firebase Firestore for cloud database storage
  - Dexie.js for local IndexedDB storage and offline support
  - Axios 1.9.0 for API requests
  - Type-safe data handling with Zod

- **Security & Performance**:
  - API rate limiting
  - Request validation and sanitization
  - Edge caching for API responses
  - Environment variable protection

- **PWA Support**:
  - Next-PWA 5.6.0 for offline capabilities
  - Service Worker for background sync
  - Cache-first strategy for assets

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/swasthyaai.git
   cd swasthyaai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Set up Firebase:
   - Follow the instructions in `FIREBASE_SETUP.md` to create and configure your Firebase project
   - Initialize Firestore database for the triage system

5. Run the development server with Turbopack for faster development:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── api/      # Backend API routes
│   │   │   ├── chat/ # Chat API endpoints
│   │   │   ├── diagnosis/ # Image diagnosis endpoints
│   │   │   ├── symptoms/ # Symptom analysis endpoints
│   │   │   └── triage/  # Triage management endpoints
│   │   ├── chat/      # AI Chat feature frontend
│   │   ├── components/# Shared UI components
│   │   ├── image-diagnosis/ # Image analysis feature frontend
│   │   ├── symptom-checker/ # Symptom analysis feature frontend
│   │   ├── triage/   # Patient triage feature frontend
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx # Root layout
│   │   └── page.tsx  # Home page
│   ├── lib/         # Backend utilities
│   │   ├── db.ts    # Database operations with Dexie
│   │   └── types.ts # TypeScript interfaces
│   └── utils/        # Utility functions
│       └── gemini.ts # AI integration with Google's Gemini API
└── package.json      # Project dependencies and scripts
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with Next.js 15 and React 19
- Styled with Tailwind CSS 4
- UI components from Headless UI
- Icons from Heroicons
- AI capabilities powered by Google's Generative AI (Gemini)
- Offline capabilities with Next-PWA

## Deployment

The application is deployed using Vercel. To deploy your own instance:

1. Fork this repository
2. Create a Vercel account if you haven't already
3. Import your forked repository to Vercel
4. Set up the required environment variables in Vercel:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```
5. Deploy!

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
