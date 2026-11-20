# Contesto del progetto (da caricare in un Progetto Claude del team)

**Committente:** Daniele Zerbi (Fuzz Atelier S.R.L.). **Lingua:** italiano.
**Prodotto:** HYPER BILLIARDS (nome scelto il 20/11/2026; prima "Maestria Goriziana"), gioco e strumento di apprendimento per il biliardo all'italiana con la stecca. Repository: `maestria-goriziana` (vedi README, ARCHITETTURA, REGOLE).

## Come è nato
Partito da una spiegazione delle sponde e della lettura dei diamanti, è diventato un tavolo d'allenamento e poi un gioco completo, rifinito con il committente in molte iterazioni.

## Decisioni prese con il committente (non cambiarle senza chiedere)
- **Regolamento**: FIBIS con la stecca per goriziana e italiana. Il committente ha scelto FIBIS dopo aver confrontato ENDAS (gioco a mano): fallo di pallino = 4 punti.
- **Colori**: bianca, gialla, pallino rosso anche nella goriziana (il pallino blu non piaceva).
- **Tavolo**: come una foto di riferimento di un tavolo da carambola: legno mogano rosso con giunti a 45°, panno verde, gomma rivestita dello stesso panno, **9 diamanti sulle lunghe e 5 sulle corte compresi quelli d'angolo**, equidistanti, rombi **con il lato lungo verso il panno**. Il committente è attento alla precisione: misure reali ovunque.
- **Apertura**: pallino e gialla sulla linea centrale nella metà destra (gialla sul bollino a 10 cm dalla corta), la bianca si piazza dove si vuole nella metà sinistra.
- **Bilia libera** dopo un fallo: chi tira mette la *propria* biglia nella metà opposta a quella dell'avversaria (non sposta quella dell'avversaria, salvo il tasto "bollino").
- **Il Vecio** compare con "Cin cin!" quando chi tira **beve** (punti all'avversario), mostrando il dettaglio dei punti; i punti fatti mostrano il ritratto di chi ha tirato con il dettaglio.
- **Suggerimenti di traiettoria** sono due caselle indipendenti, spente all'inizio: "Prolungamento" (solo fino al primo impatto, senza birilli) e "Tiro completo" (percorsi e birilli).
- **Punto d'impatto**: slider orizzontale e verticale; torna al centro dopo ogni tiro.
- **Effetto**: l'effetto laterale si specchia sulle sponde nel verso corretto e si trasmette, contrario, alla biglia colpita.
- **Consigli in allenamento**: sempre due (uno diretto, uno di sponda), con tipo di colpo, schema grafico sotto, diamanti, risultato simulato e sintesi dei manuali; devono essere uno strumento di apprendimento.
- **Vista giocatore 3D**: con lo zoom indietro la camera **sale in verticale** dal punto in cui sta chi tira, non si allontana; la stecca deve restare sempre in quadro; dopo il colpo la camera si alza "in piedi" per seguire le biglie.
- **Interfaccia**: nome "HYPER BILLIARDS", look caldo vintage nobile (noce, bordeaux, ottone, avorio, font Cinzel ed EB Garamond); pulsante "Tira" subito sotto il tavolo per l'uso da telefono.
- **Personaggi**: Pietro e Zibi (ritratti pixel senza sfondo), Il Vecio (pixel art originale); il giocatore può crearne di nuovi da selfie.

## Fonti usate
Regolamenti FIBIS ed ENDAS; *Le traiettorie del biliardo* (Margutti, BiliardoWeb Magazine); *La Bibbia del biliardo*. Vedi COMMERCIALE.md per i diritti.
