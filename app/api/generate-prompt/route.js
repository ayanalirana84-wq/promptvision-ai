import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { base64Data, mimeType } = await req.json();

    if (!base64Data || !mimeType) {
      return NextResponse.json({ error: 'Image data missing' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key missing on server' }, { status: 500 });
    }

    const promptInstruction = `Analyze this image in extreme visual detail and convert it into a high-quality prompt suitable for Midjourney v6 and Flux.1.
Describe:
1. Core Subject & Action
2. Setting, Environment & Atmospheric Mood
3. Art Style, Lighting (e.g. volumetric, rim light, chiaroscuro)
4. Camera Lens Specs (e.g. 85mm lens, f/1.8 aperture, depth of field)

Output ONLY the final prompt in a single paragraph, ending with standard parameters: --ar 16:9 --v 6.0`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptInstruction },
                { inlineData: { data: base64Data, mimeType } }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const generatedPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedPrompt) {
      return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
    }

    return NextResponse.json({ prompt: generatedPrompt.trim() });
  } catch (error) {
    return NextResponse.json({ error: 'Server Connection Error' }, { status: 500 });
  }
}