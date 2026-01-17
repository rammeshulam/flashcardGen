import React, { useState } from 'react';
import { WordPair } from './types';
import { INITIAL_WORDS } from './constants';
import { WordList } from './components/WordList';
import { WordForm } from './components/WordForm';
import { Languages, Info } from 'lucide-react';
import { generateFlashcardsPDF } from './services/pdfService';

const App: React.FC = () => {
  const [words, setWords] = useState<WordPair[]>(INITIAL_WORDS);

  const handleAddWord = (newWord: Omit<WordPair, 'id'>) => {
    const word: WordPair = {
      ...newWord,
      id: Date.now().toString(),
    };
    setWords([...words, word]);
  };

  const handleDeleteWord = (id: string) => {
    setWords(words.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Languages size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">FlashcardGen</h1>
              <p className="text-xs text-slate-500 font-medium">Hebrew / English Duplex Tool</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Info size={14} />
            <span>Works best with duplex (double-sided) printing</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input and Actions */}
          <div className="lg:col-span-4 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <WordForm onAdd={handleAddWord} words={words} />
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-8 lg:order-1">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Your Word List</h2>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {words.length} items
                </span>
             </div>
             
            <WordList words={words} onDelete={handleDeleteWord} />

            {/* Print Instructions */}
            <div className="mt-8 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-100 flex gap-3">
                <Info className="shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-semibold mb-1">Printing Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 opacity-90">
                    <li>Click "Download PDF".</li>
                    <li>Open the file in your PDF viewer.</li>
                    <li>Select <strong>Print on both sides of paper</strong> (Flip on long edge).</li>
                    <li>Cut along the lines.</li>
                  </ol>
                  <p className="mt-2 text-xs opacity-75">
                    The Hebrew side is printed on page 1, and the English side on page 2. 
                    The English columns are mirrored so they align perfectly when printed back-to-back.
                  </p>
                </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;