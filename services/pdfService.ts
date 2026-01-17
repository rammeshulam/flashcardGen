import jsPDF from 'jspdf';
import { WordPair } from '../types';

// Using Noto Serif Hebrew directly from the source used in the Python script.
// We use the raw.githubusercontent.com URL which is more reliable for direct file access.
const HEBREW_FONT_URL = 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSerifHebrew/NotoSerifHebrew-Regular.ttf';
const FONT_NAME = 'NotoSerifHebrew';
const FONT_FILE = 'NotoSerifHebrew-Regular.ttf';

/**
 * Loads a font from a URL and converts it to a base64 string
 */
async function loadFont(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.statusText} (${response.status})`);
  }
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // Convert binary buffer to binary string
  // We use a simple loop which is safe for large files compared to spread/apply
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return window.btoa(binary);
}

/**
 * Reverses Hebrew text because jsPDF's basic text() function 
 * draws LTR. For proper RTL in basic usage, visual reversal is required.
 */
function fixHebrewText(text: string): string {
  // Check if string contains Hebrew characters
  const hebrewRegex = /[\u0590-\u05FF]/;
  if (hebrewRegex.test(text)) {
    // Reverse the string for visual RTL support in LTR environment
    return text.split('').reverse().join('');
  }
  return text;
}

export const generateFlashcardsPDF = async (words: WordPair[], filename: string = 'flashcards_duplex.pdf') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // A4 Dimensions in mm
  const PAGE_WIDTH = 210;
  const PAGE_HEIGHT = 297;
  
  // Grid Configuration (Matching the Python script: 2 cols, 5 rows)
  const COLS = 2;
  const ROWS = 5;
  const CELL_WIDTH = PAGE_WIDTH / COLS;
  const CELL_HEIGHT = PAGE_HEIGHT / ROWS;

  try {
    // 1. Load and Register Hebrew Font
    const fontBase64 = await loadFont(HEBREW_FONT_URL);
    doc.addFileToVFS(FONT_FILE, fontBase64);
    doc.addFont(FONT_FILE, FONT_NAME, "normal");
  } catch (error) {
    console.error("Failed to load Hebrew font.", error);
    // Rethrow to let the UI know that PDF generation failed due to resources
    throw new Error("Could not load Hebrew font. Please check your internet connection.");
  }

  // Helper to draw a page
  const drawPage = (isHebrew: boolean, pageWords: WordPair[]) => {
    doc.setFontSize(24);
    
    // Switch font based on language
    if (isHebrew) {
      doc.setFont(FONT_NAME, "normal");
    } else {
      // Use standard Helvetica for English to ensure proper rendering
      // The Hebrew font might not map Latin characters correctly in this context
      doc.setFont("helvetica", "normal");
    }
    
    pageWords.forEach((pair, index) => {
      const row = Math.floor(index / COLS);
      const originalCol = index % COLS;

      // Logic from Python script:
      // Page 1 (Hebrew) -> Standard layout
      // Page 2 (English) -> Mirror layout (Col 1 becomes 0, 0 becomes 1)
      // This ensures they match up when printed double-sided.
      let col = originalCol;
      if (!isHebrew) {
        col = 1 - originalCol;
      }

      const x = (col * CELL_WIDTH) + (CELL_WIDTH / 2);
      const y = (row * CELL_HEIGHT) + (CELL_HEIGHT / 2);

      const text = isHebrew ? fixHebrewText(pair.hebrew) : pair.english;
      
      // Draw Text
      doc.text(text, x, y, { align: 'center', baseline: 'middle' });

      // Draw Cutting Lines (Rectangles)
      doc.setDrawColor(200, 200, 200); // Light gray
      doc.rect(col * CELL_WIDTH, row * CELL_HEIGHT, CELL_WIDTH, CELL_HEIGHT);
    });
  };

  // Pagination Logic
  const ITEMS_PER_PAGE = COLS * ROWS;
  const totalPages = Math.ceil(words.length / ITEMS_PER_PAGE);

  for (let p = 0; p < totalPages; p++) {
    const startIdx = p * ITEMS_PER_PAGE;
    const pageWords = words.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    // Page 1 of the set: Hebrew
    if (p > 0) doc.addPage();
    drawPage(true, pageWords);
    
    // Page 2 of the set: English (Mirrored)
    doc.addPage();
    drawPage(false, pageWords);
  }

  doc.save(filename);
};