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

- **AI Integrations**:
  - Google Generative AI (Gemini 1.5 Flash) for text and image analysis


- **Data Management**:
  - Dexie.js for client-side storage
  - Axios 1.9.0 for API requests

- **PWA Support**:
  - Next-PWA 5.6.0 for offline capabilities

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
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server with Turbopack for faster development:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── chat/      # AI Chat feature
│   │   ├── components/# Shared UI components
│   │   ├── image-diagnosis/ # Image analysis feature
│   │   ├── symptom-checker/ # Symptom analysis feature
│   │   ├── triage/   # Patient triage feature
│   │   ├── globals.css # Global styles
│   │   ├── layout.tsx # Root layout
│   │   └── page.tsx  # Home page
│   └── utils/        # Utility functions
│       └── gemini.ts # AI integration with Google's Gemini API
└── package.json      # Project dependencies and scripts
```

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

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
