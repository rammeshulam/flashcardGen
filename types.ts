export interface WordPair {
  id: string;
  english: string;
  hebrew: string;
}

export interface FlashcardConfig {
  rows: number;
  cols: number;
  showGridLines: boolean;
}