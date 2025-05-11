# SwasthyaAI - AI-Powered Healthcare Assistant

SwasthyaAI is a Progressive Web App designed to support community health workers in rural areas with AI-powered healthcare tools. The application provides intelligent assistance for preliminary diagnosis, triage, and treatment guidance, optimized for low-resource environments.

## Features

- **Symptom Checker**: Input symptoms via text or voice for AI-powered preliminary diagnosis
- **Triage Assistant**: Smart prioritization of cases based on severity
- **Image Diagnosis**: Upload patient images for instant AI analysis
- **AI Chatbot**: Get instant guidance on medical conditions and treatments
- **Offline Support**: Works offline as a Progressive Web App

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Headless UI
- TensorFlow.js
- OpenAI API
- LangChain
- Next-PWA for offline support

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
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The application can be deployed to any platform that supports Next.js applications. We recommend using Vercel for the best experience:

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with Next.js
- Styled with Tailwind CSS
- Icons from Heroicons
- AI capabilities powered by OpenAI and TensorFlow.js

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
