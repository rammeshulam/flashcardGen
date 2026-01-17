# FlashcardGen

A standalone, static HTML application for generating printable English/Hebrew flashcards.

[**Live Demo**](https://rammeshulam.github.io/flashcardGen/index.html)

## Features

*   **Zero Dependencies**: Runs entirely in the browser. No node.js, npm, or server required.
*   **Offline Support**: Hebrew fonts are embedded directly in the file, ensuring PDF generation works even without an internet connection or on restrictive corporate networks.
*   **Bulk Import**: Paste word lists directly from Excel or Google Sheets.
*   **Duplex Printing**: Automatically formats PDFs for double-sided printing (Hebrew on front, English mirrored on back).

## How to Run

1.  Locate the `index.html` file in this folder.
2.  Double-click to open it in any modern web browser (Chrome, Edge, Firefox, Safari).

## Printing Instructions

1.  Add your words to the list.
2.  Click **"Download PDF"**.
3.  **Troubleshooting downloads**:
    *   If clicking "Download PDF" does nothing (common when running from a local file due to browser security), click **"Open in New Tab"**.
    *   This will open the generated PDF in a new browser tab.
    *   From there, use your browser's print function (`Cmd+P` or `Ctrl+P`) or save the file.
4.  **Printer Settings**:
    *   Select **Two-Sided (Duplex)** printing.
    *   Choose **Flip on Long Edge**.

## Deployment

Since the entire application is a single `index.html` file, you can deploy it by simply copying this file to:
*   Any web server
*   GitHub Pages
*   Netlify / Vercel
*   SharePoint / Internal corporate portals
