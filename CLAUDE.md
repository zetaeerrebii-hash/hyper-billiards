# Istruzioni per Claude su questo repository

Gruppo HYPER FALSE: **HF_APP_HYPER BILLIARDS** (vedi `HF_CORE.md` per le regole dello studio, `STATO.md` per il punto della situazione).

Progetto: **HYPER BILLIARDS** (prima si chiamava Maestria Goriziana), gioco di biliardo (goriziana 9 birilli e italiana 5 birilli, regolamento FIBIS con la stecca). Pagina unica, nessun backend. Lingua dell'interfaccia e dei commenti: italiano.

## Regole di lavoro
- Si modifica solo `src/`. `index.html` e `dist/artifact.html` sono generati: dopo ogni modifica eseguire `python3 tools/build.py`.
- Dopo ogni modifica ai punteggi eseguire `node tests/scoring.test.js` e aggiungere un caso di test per ogni regola nuova o corretta.
- La fisica è **una sola** (`step`, `rail`, `collide` in `src/js/core.js`) e serve tiro, previsione, consigli e computer: non duplicarla. Se cambia una costante fisica, cambiano anche i consigli (es. `ERAIL` deve restare uguale alla restituzione della sponda in `rail`).
- Unità: 1 unità = 2,84 mm (piano 2840 × 1420 mm = 1000 × 500). Le misure regolamentari sono costanti in testa a `core.js`.
- Diamanti: 9 sulle sponde lunghe e 5 sulle corte, angoli compresi, ogni `PW/8`, rombo con il lato lungo verso il panno. Lettura: lunghe 0–8 da sinistra, corte 0–4 dall'alto, 1 punto = 1/10 di diamante.
- Biglie: bianca (giocatore 1), gialla (giocatore 2), pallino rosso, in entrambi i giochi.
- Il Vecio compare con "Cin cin!" quando chi tira beve (punti all'avversario); i punti fatti mostrano il ritratto di chi tira.
- Prima di dire che qualcosa funziona, provarlo nel browser (Playwright: `require('playwright')`), anche a larghezza telefono (390 px) e nella vista 3D.
- La pagina pubblicata come artefatto claude.ai è `dist/artifact.html`: documento HTML completo che inizia con `<!DOCTYPE html>`; three.js da cdnjs (gli artefatti ammettono script solo inline o da pochi CDN, cdnjs compreso; immagini solo come data URI). `index.html` carica three.js da `vendor/three/` (stesso dominio).
- Prova nel browser automatica: `npm run smoke` (pianta, 3D, telefono, partita, scuola, errori JS) su `index.html` e sull'artefatto. In CI gira a ogni pull request insieme a `tools/build.py --check` e ai test dei punteggi.
- Si lavora su un ramo e si apre una pull request; `main` è protetto.

## Regole della Regia HYPER FALSE
- **Chiudi la sessione**: alla fine di ogni sessione aggiornare `STATO.md` (Fatto, Deciso, Prossimi passi, Richieste per il centro, Approvazioni richieste). Resta una pagina.
- Le decisioni prese con il committente vanno anche in `docs/CONTESTO-PROGETTO.md`, nella forma «Decisione · motivo · data».
- `HF_CORE.md` non si modifica qui: arriva dal centro come copia datata.
- Le persone approvano, Claude prepara: pubblicazioni, condivisioni, invii fuori dallo studio e spese (crediti, servizi) solo dopo l'ok di un socio.

## Dove guardare
- Regole e punteggi: `evaluate()` e `pinCount()` in `core.js`; spiegazione in `docs/REGOLE.md`.
- Consigli di tiro: `plans()` (geometria a specchio corretta per la sponda), `refine()` (aggiusta con la fisica), `advice()`, `shotSVG()`.
- Computer: `cpuPlay()` con `LEVELS`.
- 3D e camera: `init3D()`, `render3D()`, `aimPose()`, `standPose()` in `ui.js`.
