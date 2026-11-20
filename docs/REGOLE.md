# Regole implementate

Entrambe le specialità seguono il **regolamento FIBIS per la stecca**. Ogni regola qui sotto ha un caso in `tests/scoring.test.js`.

## Comuni
- Biglie da 61 mm: bianca (giocatore 1), gialla (giocatore 2), pallino rosso. Interasse birilli 66 mm.
- Apertura: gialla sul bollino a 10 cm dalla sponda corta del quadrato superiore (destra), pallino al centro dello stesso quadrato; la bianca si piazza liberamente nel quadrato inferiore (sinistra).
- Si tira dalla posizione in cui si è fermata la propria biglia. Bilia libera solo dopo un fallo: si piazza nella metà opposta alla bilia del fallo; chi batte può chiedere che l'avversaria vada sul bollino di partenza (tasto dedicato).
- Se un tiro fa punti positivi e negativi insieme, il totale va all'avversario.
- Le penalità non si sommano fra loro e non raddoppiano mai.

## Goriziana · 9 birilli
| Voce | Punti |
|---|---|
| Birillo esterno | 2 |
| Birillo interno | 8 |
| Rosso con altri / da solo | 10 / 30 |
| Pallino (toccato dall'avversaria, o dalla tua dopo averla colpita) | 6 |
| **Tiro indiretto**: la tua tocca una sponda (qualsiasi) e *poi* colpisce l'avversaria, senza aver abbattuto birilli prima | birilli e pallino ×2 |

| Fallo | All'avversario | Bilia libera |
|---|---|---|
| Bilia avversaria mancata | 2 + punti del tiro | sì |
| Pallino colpito per primo | 4 + birilli del tiro | sì |
| Birilli abbattuti con la tua prima dell'avversaria | 2 + punti del tiro | sì |
| Birilli abbattuti con la tua dopo l'avversaria | punti del tiro (×2 se indiretto) | no |

Nei falli il pallino toccato dopo vale 2 (FIBIS art. 24); nel fallo di pallino è già compreso nei 4.

## Italiana · 5 birilli
| Voce | Punti |
|---|---|
| Birillo bianco | 2 |
| Rosso con altri / da solo | 4 / 10 |
| Pallino toccato prima dalla tua (dopo l'avversaria) / dall'avversaria | 4 / 3 |
| Sponda prima dell'avversaria | nessun raddoppio |

Falli come nella goriziana (2, 4, 2 con bilia libera; birilli con la propria dopo l'avversaria: punti all'avversario senza bilia libera).

## Scelte interpretative da confermare con un arbitro o la federazione
1. Pallino nei falli: valore 2 (art. 24.4) anziché 6.
2. Raddoppio anche dei punti che vanno all'avversario quando il tiro era indiretto.
3. Fallo di pallino senza aggiunta del valore del pallino oltre i 4 punti.
4. Bersagli di partita proposti: goriziana 100/200/300/400, italiana 40/60/80/100.

## Regolamento ENDAS (goriziana a mano) — non implementato
Nel corso dello sviluppo si è usato anche il regolamento ENDAS 2023/24, in cui la goriziana si gioca **lanciando la biglia con la mano**: pallino 3 (6 di calcio), raddoppio solo con la sponda corta, falli da 6, regola della mezzeria, tiro di fisso e traversino, si tira sempre dal quadrato opposto alla bersaglio. Il codice conserva alcuni eventi utili per reintrodurlo come variante (`crossed`, `castleStop`, classi `fisso`/`falsofisso`).

## Fonti
- FIBIS, *Regolamenti di gioco* (5 birilli, goriziana): https://www.fibis.it/umbria/images/umbria/20181022_regolamenti_di_gioco.pdf
- ENDAS, *Regolamento di gioco Goriziana 2023/2024* (PDF fornito dal committente).
