import React, { useState, useRef } from 'react';
import { WordPair } from '../types';
import { Plus, Download } from 'lucide-react';
import { generateFlashcardsPDF } from '../services/pdfService';

interface WordFormProps {
  onAdd: (word: Omit<WordPair, 'id'>) => void;
  words: WordPair[];
}

export const WordForm: React.FC<WordFormProps> = ({ onAdd, words }) => {
  const [english, setEnglish] = useState('');
  const [hebrew, setHebrew] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Ref for focus management
  const englishInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!english.trim() || !hebrew.trim()) return;

    onAdd({
      english: english.trim(),
      hebrew: hebrew.trim()
    });

    setEnglish('');
    setHebrew('');
    
    // Return focus to English input for rapid entry
    englishInputRef.current?.focus();
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateFlashcardsPDF(words, 'flashcards_duplex.pdf');
    } catch (e: any) {
      console.error(e);
      // Show the specific error message (e.g. font loading failed)
      alert(e.message || "Error generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-600" />
          Add New Card
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="english" className="block text-sm font-medium text-slate-700 mb-1">English</label>
            <input
              ref={englishInputRef}
              id="english"
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="e.g. Apple"
              className="w-full px-4 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor="hebrew" className="block text-sm font-medium text-slate-700 mb-1">Hebrew</label>
            <input
              id="hebrew"
              type="text"
              dir="rtl"
              value={hebrew}
              onChange={(e) => setHebrew(e.target.value)}
              placeholder="e.g. תפוח"
              className="w-full px-4 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hebrew-text"
            />
          </div>
          <button
            type="submit"
            disabled={!english || !hebrew}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add to List
          </button>
        </form>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
        <h3 className="text-indigo-900 font-semibold mb-2">Ready to Print?</h3>
        <p className="text-indigo-700 text-sm mb-4">
          Generates a double-sided PDF (A4). 
          <br/>
          <span className="opacity-75 text-xs">Page 1: Hebrew, Page 2: English (Mirrored)</span>
        </p>
        <button
          onClick={handleDownload}
          disabled={words.length === 0 || isGenerating}
          className="w-full bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {isGenerating ? (
            <span className="animate-pulse">Generating...</span>
          ) : (
            <>
              <Download size={18} />
              Download PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
};