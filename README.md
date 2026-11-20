# HYPER BILLIARDS

*Nome precedente: Maestria Goriziana.* · Gruppo HYPER FALSE: `HF_APP_HYPER BILLIARDS` · Stato: [STATO.md](STATO.md)

Gioco e strumento di apprendimento per il biliardo all'italiana con la stecca: **goriziana (9 birilli)** e **italiana (5 birilli)**, entrambe con il regolamento FIBIS. Una sola pagina web, senza server: si apre in qualsiasi browser, anche da telefono.

- **Allenamento**: si spostano liberamente le biglie e si provano i tiri. Per ogni posizione l'app propone due colpi (uno diretto e uno di sponda) già verificati con la fisica del gioco, con schema grafico, lettura dei diamanti e una sintesi dei manuali.
- **Partita**: contro il computer (5 livelli) o contro un amico sullo stesso dispositivo, con personaggi pixel art. Si possono creare nuovi giocatori da un selfie.
- **Scuola**: dodici schede sulle traiettorie (specchio, Centri Multipli, effetti zonali, garuffa, bricolla, Angolo 50, due sponde a scendere…) e le regole a confronto.
- **Vista in pianta** e **vista giocatore 3D** (three.js) con zoom.

## Struttura

```
src/
  body.html        markup della pagina
  styles.css       stili (tema unico scuro: noce, bordeaux, ottone, avorio)
  js/core.js       stato, misure reali, fisica, regolamenti, computer, consigli, disegno in pianta
  js/ui.js         vista 3D, scuola, selfie, schermate e modalità
  assets/          ritratti pixel di Pietro, Zibi e Il Vecio
vendor/three/      three.js r128 (MIT) servito dal sito; l'artefatto lo carica da cdnjs
tools/build.py     assembla src/ in index.html (+ dist/artifact.html); --check per la CI
tests/             test dei punteggi (node) e prova nel browser (Playwright)
.github/workflows/ CI: build aggiornata, punteggi, prova nel browser
HF_CORE.md         regole dello studio (copia datata dal centro HYPER FALSE)
STATO.md           punto della situazione, si aggiorna a fine sessione
docs/              documentazione per sviluppo e migrazione
index.html         build pubblicata (GitHub Pages)
```

## Comandi

```bash
python3 tools/build.py        # ricostruisce index.html e dist/artifact.html
node tests/scoring.test.js    # verifica i punteggi di goriziana e italiana
python3 -m http.server        # prova in locale su http://localhost:8000
npm install && npx playwright install chromium   # solo la prima volta, per la prova nel browser
npm run smoke                 # prova nel browser di index.html e dist/artifact.html
```

Per build e test dei punteggi non servono dipendenze. three.js è in `vendor/`; solo i font (Cinzel, EB Garamond) arrivano da Google Fonts.

## Documenti

| File | Contenuto |
|---|---|
| [docs/ARCHITETTURA.md](docs/ARCHITETTURA.md) | come è fatto il codice: unità di misura, fisica, eventi del tiro, consigli, computer, 3D |
| [docs/REGOLE.md](docs/REGOLE.md) | regolamenti implementati e scelte interpretative |
| [docs/MIGRAZIONE.md](docs/MIGRAZIONE.md) | migrazione nell'account team: dove vive cosa, passi GitHub, controllo finale |
| [docs/COMMERCIALE.md](docs/COMMERCIALE.md) | diritti, licenze e privacy da sistemare prima di vendere |
| [docs/ROADMAP.md](docs/ROADMAP.md) | lavoro aperto e idee per la versione commerciale |
| [docs/CONTESTO-PROGETTO.md](docs/CONTESTO-PROGETTO.md) | storia delle decisioni, da caricare in un progetto Claude |
| [docs/PROGETTO-CLAUDE.md](docs/PROGETTO-CLAUDE.md) | come impostare il Progetto Claude del team e il ciclo di lavoro |
| [CLAUDE.md](CLAUDE.md) | istruzioni per Claude Code quando lavora su questo repository |
