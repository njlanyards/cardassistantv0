# Card Words AI

An AI-powered card message generator that helps create personalized, heartfelt messages for any occasion.

## Features

- AI-powered message generation
- Multiple card types (Birthday, Thank You, Valentine's, etc.)
- Customizable message length
- Personal memory integration
- Optional poem generation
- Mobile-responsive design

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Groq AI API
- TypeScript
- Vercel Deployment

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/card-words-ai.git
cd card-words-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Groq API key:
```
GROQ_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add your `GROQ_API_KEY` to the Environment Variables
4. Deploy!

## Environment Variables

- `GROQ_API_KEY`: Your Groq API key for message generation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
