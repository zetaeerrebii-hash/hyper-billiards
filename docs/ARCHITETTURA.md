# Architettura

Pagina HTML unica. Il JavaScript è un solo modulo IIFE diviso in due file sorgente (`core.js` e `ui.js`) che `tools/build.py` concatena. Nessun framework; l'unica libreria esterna è three.js r128 per la vista 3D, in `vendor/three/`: `index.html` la carica dallo stesso dominio, `dist/artifact.html` (artefatto claude.ai) la carica da cdnjs, uno dei pochi host ammessi dagli artefatti.

## 1. Unità e misure

| Costante | Valore | Significato |
|---|---|---|
| `MM` | 2,84 | millimetri per unità |
| `PW`, `PH` | 1000, 500 | piano 2840 × 1420 mm |
| `DIA` | `PW/8` = 125 | passo dei diamanti, 355 mm |
| `RB` | 30,5/MM ≈ 10,74 | raggio biglia (61 mm); pallino uguale |
| `PR` | 5/MM ≈ 1,76 | raggio della base del birillo (10 mm) |
| `DPIN` | 66/MM ≈ 23,24 | interasse birilli |
| `SPOT` | 100/MM ≈ 35,2 | bollini a 10 cm dalla sponda corta |
| `CUSH`, `WOOD` | 50/MM, 95/MM | gomma e legno della sponda (14,5 cm totali) |

Coordinate di gioco: origine nell'angolo in alto a sinistra del piano, x verso destra, y verso il basso. Il centro delle biglie non può superare la linea a `r` dal becco.

## 2. Fisica (`core.js`)

Passo fisso `DT = 1/240 s`. Tutto passa da tre funzioni:

- `step(st)`: attrito costante `FR = 270 u/s²`, decadimento di effetto laterale (`side`) e alto/basso (`fol`), urti con le sponde, birilli abbattuti al contatto (centro biglia a meno di `r + PR`), registrazione degli eventi.
- `rail(b,nx,ny)`: restituzione 0,78 sulla componente perpendicolare; l'effetto laterale aggiunge una spinta tangenziale e si dimezza a ogni sponda.
- `collide(st,a,b)`: urto quasi elastico (0,96); con effetto laterale c'è *throw* (deviazione della biglia colpita, circa 4° a effetto pieno) e trasferimento di un quinto dell'effetto, con segno opposto; l'effetto alto/basso agisce dopo il primo urto (segue o torna indietro).

`launch(st,P)` imposta velocità (`speedOf(power)` = 150 + 22,5·forza u/s) ed effetto, e crea l'oggetto evento `st.ev`. `simulate(P, place, record)` esegue un tiro intero su una copia del tavolo: la usano la previsione "Tiro completo", i consigli e il computer. Così ciò che si vede nei suggerimenti coincide con il tiro reale.

### Eventi del tiro (`st.ev`)
`first` (prima biglia toccata dalla battente), `railsBefore` (tipi di sponda toccati prima), `pins` (per ogni birillo: tipo, biglia che l'ha abbattuto, classe), `pinsBeforeFirst`, `palFirstLegit` (chi ha toccato per primo il pallino dopo un contatto valido), `palTouched`, `firstContact` (posizione d'impatto). Alcuni campi (`crossed`, `castleStop`, classi `fisso`) servivano al regolamento ENDAS e oggi non influiscono sul punteggio.

## 3. Regole (`pinCount`, `evaluate`, `negResult`)

`evaluate(ev, gioco)` restituisce `{to:'me'|'opp', pts, parts, text, foul, inHand, offer}`. Dettagli in [REGOLE.md](REGOLE.md). `settle()` applica il risultato: punteggio, popup (ritratto di chi tira o Il Vecio con "Cin cin!"), cambio turno, bilia libera e proposta della penitenza.

## 4. Consigli di tiro

1. `plans(sh, W)`: per la biglia avversaria cerca percorsi verso il birillo rosso, diretti o con una sponda; per ciascuno calcola la "biglia fantasma" `G` e prova la battente diretta, a una sponda e a due sponde. Le sponde sono gestite col **metodo dello specchio corretto**: il punto virtuale sta a `d / 0,78` oltre la sponda, perché la sponda del gioco restituisce il 78% della velocità perpendicolare (`ERAIL`). Scarta i percorsi ostruiti da birilli o biglie e i tagli oltre 65–70°.
2. `refine(o)`: prova mira ±2° e forza ±10 con `simulate`, tiene il tiro che fa più punti mantenendo lo stesso tipo di colpo.
3. `advice()`: sceglie un consiglio "diretto" e uno "di sponda" (nella goriziana premia l'indiretto, che raddoppia), scrive descrizione, lettura dei diamanti, risultato simulato e testo del manuale (`MANUAL`).
4. `shotSVG()`: schema del tavolo con i percorsi simulati.

Tempo di calcolo tipico: 10–40 ms su desktop.

## 5. Computer (`cpuPlay`)

Genera candidati casuali (70% verso la biglia avversaria, 30% in qualsiasi direzione, metà con effetto) più i piani di `plans()`; li valuta con `simulate` + `evaluate` a blocchi da 8 per non bloccare la pagina; i livelli 4–5 rifiniscono i migliori. Poi applica un errore di esecuzione gaussiano su mira e forza. Parametri in `LEVELS` (numero di candidati `N`, errore `na`/`np`, scelta fra i primi `top`). `gen` è un contatore che annulla i calcoli in corso quando si cambia modalità o partita.

## 6. Disegno

- **Pianta**: canvas 2D, `drawTable()` (mogano, gomma, panno, 9+5 diamanti a rombo), `drawPins`, `drawBall`, `drawCue`, suggerimenti `drawBase`/`drawPred`. Nella pianta i birilli sono disegnati più grandi del vero per leggibilità.
- **Vista giocatore** (`ui.js`): scena three.js con misure reali (sponde con becco a 37 mm, birilli torniti alti 25 mm), due lampade, ombre. Camera: `aimPose()` interpola fra posa bassa sulla stecca e posa "in piedi" (`standSpot` + `fitHeight`, sale in verticale finché vede tutto il tavolo), con vincoli che tengono la stecca in quadro. Durante il tiro `standPose()`.

## 7. Stato e salvataggi

Tutto in memoria. In `localStorage` solo preferenze del singolo dispositivo: vista (`mg-view`), zoom (`mg-zoom`), giocatori creati da selfie (`mg-players`, PNG piccoli in data URI). Cambiando dominio questi dati non si portano dietro.

## 8. Limiti noti della simulazione

- Non c'è distinzione fra strisciamento e rotolamento, né *squirt*/*swerve* della stecca.
- I birilli cadono al contatto e non si urtano fra loro; non deviano la biglia (solo un leggero rallentamento).
- Le biglie non saltano né escono dal tavolo.
- Il determinismo dipende da `Math.sin/cos`: per il gioco online fra browser diversi conviene inviare lo stato finale autorevole, non solo i parametri del tiro.
