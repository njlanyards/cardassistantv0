import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await request.json();
    
    const client = new Groq({
      apiKey: apiKey,
    });

    const completion = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `{
  "parameters": {
    "writing_style": "Match user's provided style or default to natural and authentic",
    "card_type": "Adapt tone to specified card type (birthday, sympathy, etc.)",
    "message_length": {
      "type": "Determined by user selection",
      "rules": {
        "short_sweet": {
          "max_sentences": 2,
          "max_words": 40,
          "no_paragraph_breaks": true,
          "skip_intros": true,
          "allow_fragments": true,
          "no_emojis": true,
          "start_with": "Dear [Name],"
        },
        "medium": {
          "lines": 4,
          "max_paragraph_breaks": 1,
          "allow_brief_intros": true
        },
        "long": {
          "min_lines": 5,
          "allow_anecdotes": true,
          "allow_paragraphs": true
        }
      }
    },
    "recipient_name": "Use provided relationship type",
    "recent_memory": "Include naturally, without elaborate setup",
    "recipient_characteristics": "Highlight key traits concisely",
    "special_qualities": "Reference specific memories/traits directly",
    "include_poem": "Only if explicitly requested AND not short_sweet",
    
    "poem_rules": {
      "enabled": "{{Include a poem}} && message_length != 'short_sweet'",
      "rhyme_schemes": ["AABB", "ABAB"],
      "line_limit": [4, 6],
      "syllables_per_line": [6, 8],
      "focus_element": "key_trait_or_memory",
      "example_structure": [
        "Your spirit bright and true, (A)",
        "In everything you do, (A)",
        "Brings laughter to each day, (B)",
        "In your own special way (B)"
      ]
    },

    "output_rules": {
      "required_greeting": "Dear [Name],",
      "phrasing": {
        "concise": true,
        "avoid_wordy_phrases": [
          "I've been reminiscing",
          "I couldn't help but smile",
          "Your unwavering support",
          "It means the world to me",
          "I just wanted to say"
        ],
        "preferred_phrasing": {
          "verbose": "Your unwavering support and unconditional love have played an immeasurable role",
          "concise": "Thank you for always supporting me"
        }
      },
      "signature_format": "—[Your Name]",
      "language_complexity": "simple_everyday"
    },

    "example_outputs": {
      "short_sweet": {
        "message": "Dear Friend,\nYour laughter at our cookout still brightens my day. Thank you for filling life with joy.\n—[Your Name]",
        "word_count": 17
      },
      "with_poem": {
        "message": "Dear Friend,\nYour wit on the court brings joy,\nMaking every game a treat to deploy.\nSkills sharp as can be,\nYou inspire us to see,\nThe fun in each moment we share,\nWith your spirit so bright and rare.\n—[Your Name]",
        "rhyme_scheme": "AABBCC"
      }
    }
  },
  
  "instructions": "Generate only the card message itself using provided parameters. Strictly enforce length rules and poem constraints. Ensure poems always rhyme when requested. Focus on emotional impact and personal connection while maintaining specified brevity."
}`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    return NextResponse.json({ 
      message: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
} 