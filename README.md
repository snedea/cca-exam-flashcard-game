# CCA Exam Flashcard Game

Static study app for the Claude Certified Architect - Foundations guide.

Source used for the built-in pack:

- `../context-foundry/docs/CCA-Exam-Guide.pdf`
- Hosted proof copy: `assets/CCA-Exam-Guide.pdf`

## Run Locally

```bash
python3 -m http.server 8787 --bind 0.0.0.0
```

Open `http://localhost:8787/` on desktop. From a phone on the same network, open the host machine's LAN IP with the same port.

## Add Sources Later

The app supports future sources in two ways:

1. Use the in-app `Sources` tab and paste a source JSON object. This saves to local storage on that device.
2. Add source objects to `data/sources.js`, redeploy the site, and the source becomes available to every device.

A source object needs:

- `id`
- `title`
- `sourcePath` when `Prove it` should open a PDF or web source
- `domains`
- `cards`
- `questions`
- optional `questionSupport` entries for `Explain it`, `Cite it`, and PDF page links

Use the `Sources` tab's `Show template` button for the exact shape.
