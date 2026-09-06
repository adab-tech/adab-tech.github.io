# NFC and print business card

- Digital card: [`static/business-card.html`](../static/business-card.html) — QR, vCard download, copy actions
- Print sheet: [`static/print-sheet.html`](../static/print-sheet.html) — A4 front/back cards for print
- NFC: copy the card URL and write it as an NDEF record (NTAG213/215/216)

## Printing

1. Open `static/print-sheet.html` in your browser.
2. Print to A4 paper or cardstock.
3. Cut out the cards.

## NFC

Use an app such as NFC Tools (Android) to write the card URL, then tap a phone to test.

## Customizing

Edit the `card` object in `static/business-card.html` and `static/print-sheet.html`.
