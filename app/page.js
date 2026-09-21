'use client';
import { useState } from 'react';

export default function HomePage() {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const extractPrompt = async () => {
    if (!imageFile) return;
    setLoading(true);
    setPrompt('');

    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];
      try {
        const res = await fetch('/api/generate-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64Data, mimeType: imageFile.type })
        });
        const data = await res.json();
        setPrompt(data.prompt || 'Could not extract prompt. Try another image.');
      } catch (err) {
        setPrompt('Error processing image.');
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 flex-1 w-full">
      <div className="w-full h-20 bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-500 rounded-lg mb-8">
        ADVERTISEMENT BANNER (TOP)
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-white mb-2">Reverse AI Image-to-Prompt Converter</h1>
        <p className="text-slate-400">Upload any image to generate exact Midjourney & Flux.1 prompts instantly.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-slate-300">1. Upload Source Image</label>
          <div className="relative border-2 border-dashed border-sky-500/50 rounded-lg h-52 flex flex-col items-center justify-center bg-slate-950 overflow-hidden cursor-pointer">
            {preview ? (
              <img src={preview} alt="Upload preview" className="h-full w-full object-contain" />
            ) : (
              <p className="text-slate-400 text-sm text-center px-4">Click or drag image here (PNG, JPG, WEBP)</p>
            )}
            <input type="file" accept="image/*" onChange={handleImage} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <button
            onClick={extractPrompt}
            disabled={loading || !imageFile}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg disabled:bg-slate-800 disabled:text-slate-500 transition"
          >
            {loading ? 'Analyzing Image Visuals...' : 'Extract AI Prompt'}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-slate-300">2. Generated Prompt</label>
          <textarea
            readOnly
            value={prompt || 'Your extracted AI prompt will appear here...'}
            className="w-full h-52 p-3 bg-slate-950 border border-slate-800 rounded-lg text-sky-300 font-mono text-sm resize-none focus:outline-none"
          />
          <button
            onClick={() => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            disabled={!prompt}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg disabled:bg-slate-800 disabled:text-slate-500 transition"
          >
            {copied ? '✓ Copied to Clipboard!' : 'Copy Formatted Prompt'}
          </button>
        </div>
      </div>

      <article className="mt-16 space-y-6 text-slate-300 border-t border-slate-800 pt-10">
        <h2 className="text-2xl font-bold text-white">How Reverse Image Prompt Engineering Works</h2>
        <p className="text-sm leading-relaxed">
          Our free AI tool utilizes advanced vision recognition APIs to breakdown uploaded artwork into granular descriptors.
        </p>
      </article>
    </main>
  );
}