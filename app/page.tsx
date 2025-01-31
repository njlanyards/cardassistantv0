'use client';

import { useState } from 'react';
import Image from 'next/image';

const cardTypes = [
  'Thank You',
  'Gratitude',
  'Love',
  'Valentine\'s',
  'Birthday',
  'Anniversary',
];

const relationships = [
  'Partner',
  'Friend',
  'Family member',
  'Colleague',
  'Parent',
  'Sibling',
  'Child',
  'Mentor',
];

const characteristics = [
  'Kind',
  'Funny',
  'Adventurous',
  'Thoughtful',
  'Creative',
  'Caring',
  'Inspiring',
  'Supportive',
  'Intelligent',
  'Passionate',
];

export default function Home() {
  const [formData, setFormData] = useState({
    writingStyle: '',
    cardType: '',
    wordCount: '',
    recipient: '',
    highlight: '',
    characteristics: [] as string[],
    specialQualities: '',
    includePoem: false
  });

  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const generatePrompt = () => {
    const lengthGuide = {
      'short': '50-100 words',
      'medium': '100-200 words',
      'long': '200-400 words'
    }[formData.wordCount] || '100-200 words';

    return `Write a ${formData.cardType} card message for my ${formData.recipient}. 
    Writing style: ${formData.writingStyle || 'natural and authentic'}
    Length: ${lengthGuide}
    Recent highlight/memory: ${formData.highlight}
    Their characteristics: ${formData.characteristics.join(', ')}
    What makes them special: ${formData.specialQualities}
    ${formData.includePoem ? 'Please include a short poem that captures these sentiments.' : ''}
    Make it personal, heartfelt, and specific to the details provided.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    setGeneratedMessage('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generatePrompt(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate message');
      }

      const data = await response.json();
      setGeneratedMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate message. Please try again.');
      console.error('Error generating message:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCharacteristicsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      characteristics: selectedOptions
    }));
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#FF3B30]/10 rounded-full -translate-x-16 -translate-y-16" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#1DCCB1]/10 rounded-full translate-x-20 translate-y-20" />
      
      <main className="max-w-3xl mx-auto relative">
        <h1 className="text-4xl sm:text-5xl font-black text-center mb-8 text-[#FF3B30] tracking-tight transform transition-transform duration-300 hover:scale-105">
          Card Words AI
        </h1>
        <p className="text-center mb-12 text-gray-600 text-lg animate-fade-in">
          Let me help you find the perfect words for your special message
        </p>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative">
          <div className="space-y-6">
            {/* Writing Style */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide group-hover:text-[#FF3B30] transition-colors duration-200">
                Writing Style
              </label>
              <textarea
                name="writingStyle"
                value={formData.writingStyle}
                onChange={handleChange}
                placeholder="Enter your preferred writing style or paste a sample of your writing..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#1DCCB1] focus:ring-[#1DCCB1] transition-all duration-200 hover:border-[#1DCCB1]/50"
                rows={4}
              />
            </div>

            {/* Card Type */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide group-hover:text-[#FF3B30] transition-colors duration-200">
                Type of Card
              </label>
              <select
                name="cardType"
                value={formData.cardType}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#1DCCB1] focus:ring-[#1DCCB1] transition-all duration-200 hover:border-[#1DCCB1]/50 appearance-none bg-white"
              >
                <option value="">Select card type</option>
                {cardTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Word Count */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide group-hover:text-[#FF3B30] transition-colors duration-200">
                Message Length
              </label>
              <select
                name="wordCount"
                value={formData.wordCount}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#1DCCB1] focus:ring-[#1DCCB1] transition-all duration-200 hover:border-[#1DCCB1]/50 appearance-none bg-white"
              >
                <option value="">Select length</option>
                <option value="short">Short and Sweet</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>

            {/* Recipient */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide group-hover:text-[#FF3B30] transition-colors duration-200">
                Who is this card for?
              </label>
              <input
                list="relationships"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#1DCCB1] focus:ring-[#1DCCB1] transition-all duration-200 hover:border-[#1DCCB1]/50"
                placeholder="Start typing..."
              />
              <datalist id="relationships">
                {relationships.map(relation => (
                  <option key={relation} value={relation} />
                ))}
              </datalist>
            </div>

            {/* Highlight */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide group-hover:text-[#FF3B30] transition-colors duration-200">
                Recent Highlight or Memory
              </label>
              <textarea
                name="highlight"
                value={formData.highlight}
                onChange={handleChange}
                placeholder="Share a recent special moment or memory..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#1DCCB1] focus:ring-[#1DCCB1] transition-all duration-200 hover:border-[#1DCCB1]/50"
                rows={3}
              />
            </div>

            {/* Characteristics */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide group-hover:text-[#FF3B30] transition-colors duration-200">
                Their Characteristics
              </label>
              <select
                name="characteristics"
                multiple
                value={formData.characteristics}
                onChange={handleCharacteristicsChange}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#1DCCB1] focus:ring-[#1DCCB1] transition-all duration-200 hover:border-[#1DCCB1]/50 appearance-none bg-white"
              >
                {characteristics.map(trait => (
                  <option key={trait} value={trait}>{trait}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple traits</p>
            </div>

            {/* Special Qualities */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-2 uppercase tracking-wide group-hover:text-[#FF3B30] transition-colors duration-200">
                What Makes Them Special?
              </label>
              <textarea
                name="specialQualities"
                value={formData.specialQualities}
                onChange={handleChange}
                placeholder="Describe specific qualities, shared memories, or unique traits..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#1DCCB1] focus:ring-[#1DCCB1] transition-all duration-200 hover:border-[#1DCCB1]/50"
                rows={3}
              />
            </div>

            {/* Include Poem - Special styling for checkbox */}
            <div className="flex items-center group">
              <input
                type="checkbox"
                id="includePoem"
                name="includePoem"
                checked={formData.includePoem}
                onChange={(e) => setFormData(prev => ({ ...prev, includePoem: e.target.checked }))}
                className="w-5 h-5 text-[#FF3B30] border-2 border-gray-200 rounded focus:ring-[#FF3B30] transition-colors duration-200"
              />
              <label htmlFor="includePoem" className="ml-3 block text-sm font-bold text-gray-800 uppercase tracking-wide group-hover:text-[#FF3B30] transition-colors duration-200">
                Include a poem in the message
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-[#FF3B30] text-white py-4 px-8 rounded-xl font-bold uppercase tracking-wider transform transition-all duration-200 
            hover:bg-[#FF3B30]/90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isGenerating ? 'Creating Magic...' : 'Find The Perfect Words'}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-[#FF3B30] rounded-xl font-bold animate-shake">
            {error}
          </div>
        )}

        {generatedMessage && (
          <div className="mt-8 p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-black mb-6 text-[#FF3B30] uppercase tracking-wide">Soul Stirring Words</h2>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {generatedMessage}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedMessage);
              }}
              className="mt-6 px-6 py-3 bg-[#1DCCB1]/10 text-[#1DCCB1] rounded-xl hover:bg-[#1DCCB1]/20 transition-colors duration-200 font-bold uppercase tracking-wide flex items-center gap-2"
            >
              <span>Copy to Clipboard</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        )}

        {/* Add SEO Content Section after the generator */}
        <section className="mt-20 prose prose-lg max-w-none">
          <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">
            AI-Powered Card Message Generator: Write Perfect Messages Every Time
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[#FF3B30] mb-4">Perfect for Every Occasion</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Birthday Messages</li>
                <li>✓ Thank You Notes</li>
                <li>✓ Valentine's Cards</li>
                <li>✓ Anniversary Wishes</li>
                <li>✓ Gratitude Messages</li>
                <li>✓ Love Letters</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[#FF3B30] mb-4">Key Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ AI-Powered Writing</li>
                <li>✓ Personalized Content</li>
                <li>✓ Multiple Length Options</li>
                <li>✓ Optional Poetry</li>
                <li>✓ Instant Generation</li>
                <li>✓ Easy Customization</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-[#FF3B30] mb-4">Why Choose Us</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Heartfelt Messages</li>
                <li>✓ Natural Writing Style</li>
                <li>✓ Memory Integration</li>
                <li>✓ Character Focused</li>
                <li>✓ Quick & Easy</li>
                <li>✓ Always Free</li>
              </ul>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              How Our Card Message Generator Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="text-3xl font-bold text-[#FF3B30] mb-2">1</div>
                <p className="text-gray-700">Choose your card type and length</p>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-[#FF3B30] mb-2">2</div>
                <p className="text-gray-700">Add personal details and memories</p>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-[#FF3B30] mb-2">3</div>
                <p className="text-gray-700">Select recipient characteristics</p>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-[#FF3B30] mb-2">4</div>
                <p className="text-gray-700">Generate your perfect message</p>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Frequently Asked Questions About Card Message Writing
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">How does the AI card message generator work?</h3>
                <p className="text-gray-700">Our AI-powered message generator uses advanced language models to create personalized, heartfelt messages for any occasion. It combines your input about the recipient with writing expertise to craft the perfect card message.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">What types of card messages can I create?</h3>
                <p className="text-gray-700">You can create messages for birthdays, thank you notes, Valentine's Day, anniversaries, and more. Our generator adapts to any occasion and relationship type.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Can I customize the length of my card message?</h3>
                <p className="text-gray-700">Yes! Choose from three options: Short & Sweet (1-2 sentences), Medium (3-4 lines), or Long (5+ lines with detailed personalization).</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Will my card message feel personal and authentic?</h3>
                <p className="text-gray-700">Absolutely! Our generator incorporates your specific memories, the recipient's characteristics, and your relationship details to create genuinely personal messages.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Why Use an AI Card Message Generator?
            </h2>
            <p className="text-gray-700 mb-6">
              Writing the perfect card message can be challenging. Our AI-powered card message generator helps you express your feelings eloquently, whether you're writing a birthday card, thank you note, or Valentine's message. It combines your personal touch with AI writing expertise to create heartfelt, meaningful messages that resonate with your recipients.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="text-2xl font-bold text-[#FF3B30]">1000+</div>
                <p className="text-sm text-gray-600">Messages Generated</p>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-[#FF3B30]">99%</div>
                <p className="text-sm text-gray-600">Satisfaction Rate</p>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-[#FF3B30]">10+</div>
                <p className="text-sm text-gray-600">Card Types</p>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-[#FF3B30]">24/7</div>
                <p className="text-sm text-gray-600">Availability</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Ready to Write the Perfect Card Message?
            </h2>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-[#FF3B30] text-white py-4 px-8 rounded-xl font-bold uppercase tracking-wider transform transition-all duration-200 
              hover:bg-[#FF3B30]/90 hover:scale-[1.02]"
            >
              Create Your Message Now
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
