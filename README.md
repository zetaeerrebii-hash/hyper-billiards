# HYPER BILLIARDS

*Nome precedente: Maestria Goriziana.*

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
tools/build.py     assembla src/ in index.html (+ dist/artifact.html)
tests/             test dei punteggi (node)
docs/              documentazione per sviluppo e migrazione
index.html         build pubblicata (GitHub Pages)
```

## Comandi

```bash
python3 tools/build.py        # ricostruisce index.html e dist/artifact.html
node tests/scoring.test.js    # verifica i punteggi di goriziana e italiana
python3 -m http.server        # prova in locale su http://localhost:8000
```

Non ci sono dipendenze da installare. three.js r128 e i font (Cinzel, EB Garamond) si caricano da CDN.

## Documenti

| File | Contenuto |
|---|---|
| [docs/ARCHITETTURA.md](docs/ARCHITETTURA.md) | come è fatto il codice: unità di misura, fisica, eventi del tiro, consigli, computer, 3D |
| [docs/REGOLE.md](docs/REGOLE.md) | regolamenti implementati e scelte interpretative |
| [docs/MIGRAZIONE.md](docs/MIGRAZIONE.md) | come spostare il progetto nell'account team (GitHub e Claude) |
| [docs/COMMERCIALE.md](docs/COMMERCIALE.md) | diritti, licenze e privacy da sistemare prima di vendere |
| [docs/ROADMAP.md](docs/ROADMAP.md) | lavoro aperto e idee per la versione commerciale |
| [docs/CONTESTO-PROGETTO.md](docs/CONTESTO-PROGETTO.md) | storia delle decisioni, da caricare in un progetto Claude |
| [docs/PROGETTO-CLAUDE.md](docs/PROGETTO-CLAUDE.md) | come impostare il Progetto Claude del team e il ciclo di lavoro |
| [CLAUDE.md](CLAUDE.md) | istruzioni per Claude Code quando lavora su questo repository |
