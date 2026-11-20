# Roadmap

## Pronto oggi
- Goriziana e italiana con regolamento FIBIS, misure reali, 9+5 diamanti.
- Allenamento con biglie trascinabili, ripeti tiro, due consigli per posizione con schema, diamanti e testi dei manuali.
- Partita contro computer (5 livelli) o amico sullo stesso dispositivo; personaggi e giocatori da selfie.
- Vista in pianta e vista giocatore 3D con zoom; scuola con 12 schede.

## Prossimi passi proposti
1. **Gioco online da due dispositivi.** Sull'artefatto claude.ai si può usare il collegamento in tempo reale fra chi ha la pagina aperta (stanza con codice). Per un prodotto indipendente serve un piccolo backend (WebSocket, es. Cloudflare Durable Objects o Supabase Realtime). Chi tira deve inviare lo stato finale autorevole, perché la simulazione può differire di poco fra browser.
2. **Variante ENDAS a mano** per la goriziana: lancio senza stecca, punteggi e falli ENDAS, mezzeria, fisso e traversino.
3. **Fisica**: strisciamento/rotolamento, curvatura per effetto (massè leggero), birilli che si urtano fra loro, deviazione della battente sui birilli.
4. **Scuola interattiva**: ogni scheda apre la posizione in allenamento; esercizi con obiettivo e punteggio; progressi salvati.
5. **App installabile**: PWA (offline) e, se serve, pacchetti iOS/Android con Capacitor.
6. **Accessibilità e lingue**: inglese, controlli da tastiera, contrasti verificati.
7. **Qualità**: ~~test automatici in CI (punteggi + prova Playwright su pianta, 3D, telefono)~~ fatto il 20/11/2026; resta da dividere `core.js` in moduli (fisica, regole, consigli, computer, disegno) con un bundler leggero.

## Domande aperte per il team
- Pubblico principale: giocatori di circolo, principianti, scuole?
- Prima piattaforma: web, app mobile o entrambe?
- Contenuti didattici: accordo con gli autori dei manuali o redazione propria?
