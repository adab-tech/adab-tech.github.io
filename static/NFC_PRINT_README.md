# NFC + Print Business Card

Your business card is now ready for QR, vCard, NFC, and printing.

## What you have

- **Digital card**: `static/business-card.html` — shareable link with QR code, vCard download, copy actions.
- **Print sheet**: `static/print-sheet.html` — A4 sheet with front/back cards, QR code for printing.
- **NFC ready**: URL is copyable for encoding on NFC cards.

## Printing

1. Open `static/print-sheet.html` in your browser.
2. Print to A4 paper (or cardstock).
3. Cut out the cards.

## NFC Cards

1. Buy blank NFC cards (NTAG213/215/216, ~$0.10 each on AliExpress).
2. Use an NFC app (e.g., NFC Tools on Android) to write the URL as an NDEF record.
3. Test by tapping the card on a phone.

## Customizing

Edit the `card` object in `static/business-card.html` and `static/print-sheet.html` to your details.
