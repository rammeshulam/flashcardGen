import React from 'react';
import { WordPair } from '../types';
import { Trash2 } from 'lucide-react';

interface WordListProps {
  words: WordPair[];
  onDelete: (id: string) => void;
}

export const WordList: React.FC<WordListProps> = ({ words, onDelete }) => {
  if (words.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-white rounded-lg border border-slate-200 shadow-sm">
        <p>No words added yet. Add some words to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-5">English</div>
        <div className="col-span-5 text-right">Hebrew</div>
        <div className="col-span-1"></div>
      </div>
      <div className="divide-y divide-slate-100">
        {words.map((word, index) => (
          <div key={word.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
            <div className="col-span-1 text-center text-slate-400 font-mono text-xs">
              {index + 1}
            </div>
            <div className="col-span-5 font-medium text-slate-800">
              {word.english}
            </div>
            <div className="col-span-5 text-right font-medium text-slate-800 hebrew-text" dir="rtl">
              {word.hebrew}
            </div>
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => onDelete(word.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                aria-label="Delete word"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
        {words.length} cards total
      </div>
    </div>
  );
};