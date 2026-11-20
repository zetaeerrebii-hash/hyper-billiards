# Prima di uno sviluppo commerciale: diritti, licenze, privacy

Questa è una checklist pratica, non un parere legale: per i punti segnati come bloccanti conviene sentire un avvocato esperto di proprietà intellettuale.

## Bloccanti
| # | Elemento | Problema | Cosa fare |
|---|---|---|---|
| 1 | **Ritratti di Pietro e Zibi** (`src/assets/`) | volti di persone reali, ricavati da foto | liberatoria scritta per uso commerciale, oppure sostituirli con personaggi inventati |
| 2 | **Testi e schemi dai manuali** (Scuola e "Dal manuale" nei consigli) | sono sintesi e schemi derivati da *Le traiettorie del biliardo* di Margutti (BiliardoWeb Magazine) e da *La Bibbia del biliardo*; nomi dei sistemi e numerazioni sono loro contenuti | chiedere l'autorizzazione agli autori/editori (possibile anche come partnership), oppure riscrivere i contenuti in modo indipendente con un istruttore |
| 3 | **Nomi delle federazioni** (FIBIS, ENDAS) e citazioni degli articoli | i regolamenti come regole del gioco sono fatti, ma nomi e loghi non vanno usati in modo da far pensare a un'approvazione | formula tipo "regole secondo il regolamento FIBIS", nessun logo; valutare un accordo con la federazione |
| 4 | **Nome "HYPER BILLIARDS"** | da verificare la disponibilità come marchio (classi 9, 28 e 41: software, giochi, formazione) e come dominio; "billiards" è descrittivo, la parte distintiva è "Hyper", da confrontare con marchi esistenti, compresi i propri | ricerca su UIBM/EUIPO e registrazione se libero |

## Da sistemare ma non bloccanti
| Elemento | Note |
|---|---|
| three.js r128 | licenza MIT: includere il testo della licenza nei crediti |
| Font Cinzel ed EB Garamond | SIL Open Font License: uso commerciale libero; per un'app nativa conviene incorporarli invece di caricarli da Google |
| Il Vecio | pixel art originale disegnata durante lo sviluppo; la foto di riferimento ricevuta (Getty Images) **non** è stata usata e non va usata |
| Codice | scritto con l'assistenza di Claude. Verificare nei termini commerciali del piano Anthropic usato che la titolarità degli output sia del cliente (nei piani commerciali di norma lo è) e registrare chi ha contribuito |
| Dipendenze da CDN | per un prodotto, servire three.js e i font dal proprio dominio (affidabilità e privacy) |

## Privacy (GDPR)
- **Selfie**: la foto è elaborata solo nel browser e salvata in `localStorage` del dispositivo; non viene inviata a server. In un prodotto serve comunque un'informativa chiara, e se un domani i giocatori finiscono su server (classifiche, gioco online) servono consenso esplicito, conservazione limitata e possibilità di cancellazione: si tratta di immagini di volti.
- Nessun cookie né analisi oggi. Se si aggiungono analytics o account: informativa, banner consensi dove necessario, registro dei trattamenti.

## Possibili modelli di business (da validare)
- App gratuita con modalità Scuola premium (lezioni, sistemi avanzati, esercizi guidati).
- Licenza a circoli e scuole di biliardo (white label con il logo del circolo).
- Partnership con federazioni o riviste (contenuti didattici ufficiali) — risolverebbe anche il punto 2.
