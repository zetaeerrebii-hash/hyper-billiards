# Migrazione nell'account team

Il progetto vive oggi in tre posti. Ognuno si sposta in modo diverso.

| Dove | Cosa c'è | Si sposta? |
|---|---|---|
| GitHub `zetaeerrebii-hash/maestria-goriziana` | sorgenti, build, documenti, sito GitHub Pages | sì, con il trasferimento del repository; durante il trasferimento conviene rinominarlo `hyper-billiards` (Settings → General → Repository name: GitHub reindirizza il vecchio nome) |
| Artefatto su claude.ai (account personale) | la pagina giocabile con il link di condivisione | no: si ripubblica dall'account team, il link cambia |
| Conversazione e memoria di Claude | storia delle decisioni | no: sostituita da `docs/CONTESTO-PROGETTO.md` |

## 1. Repository GitHub
1. Assicurati di poter creare repository nell'organizzazione GitHub del team (ruolo *owner* o permesso di creazione).
2. Nel repository: **Settings → General → Danger Zone → Transfer ownership**, scegli l'organizzazione. GitHub reindirizza il vecchio indirizzo e conserva storia, issue e stelle.
   In alternativa, se vuoi tenere la copia personale: crea un repository vuoto nell'organizzazione e fai `git push` di tutti i rami.
3. Riattiva **Settings → Pages**: *Deploy from a branch*, ramo `main`, cartella `/ (root)`. L'indirizzo diventa `https://<organizzazione>.github.io/maestria-goriziana/`.
   Se rendi il repository privato, GitHub Pages richiede un piano a pagamento dell'organizzazione; in alternativa si pubblica `index.html` su Netlify, Vercel o Cloudflare Pages.
4. Proteggi `main` (revisione obbligatoria) e aggiungi una Action che esegua `node tests/scoring.test.js` e `python3 tools/build.py` a ogni pull request.

## 2. Pagina su Claude (artefatto)
Per quanto ne so non esiste un trasferimento diretto di un artefatto da un account personale a uno team: si ripubblica.
1. Nell'account team apri una nuova conversazione (meglio dentro un Progetto, vedi punto 3).
2. Allega `dist/artifact.html` e chiedi di pubblicarlo come artefatto. Oppure, da Claude Code collegato al repository, chiedi di eseguire `python3 tools/build.py` e pubblicare `dist/artifact.html`.
3. Condividi il nuovo link con il team dal menu **Condividi**. Il vecchio link personale resta valido finché non lo elimini: conviene aggiornare chi lo usa.

## 3. Contesto per Claude nell'account team
- Crea un **Progetto** "HYPER BILLIARDS" (istruzioni dettagliate in [PROGETTO-CLAUDE.md](PROGETTO-CLAUDE.md)) e carica come conoscenza: `docs/CONTESTO-PROGETTO.md`, `docs/REGOLE.md`, `docs/ARCHITETTURA.md` e i PDF di riferimento (regolamenti FIBIS ed ENDAS, *Le traiettorie del biliardo*, *La Bibbia del biliardo*), se avete il diritto di usarli internamente.
- Per lavorare sul codice con Claude Code collega il repository dell'organizzazione: `CLAUDE.md` nella radice viene letto automaticamente e contiene le regole di lavoro.
- La memoria personale di Claude non passa all'account team; tutto ciò che serve è nei documenti.

## 4. Dati che non si trasferiscono
- **Giocatori creati da selfie**, vista e zoom preferiti sono salvati nel browser (`localStorage`) per quel dominio. Cambiando indirizzo (nuovo artefatto o nuovo dominio) ripartono da zero. Avvisa chi li ha creati.

## 5. Controllo finale dopo la migrazione
- [ ] `python3 tools/build.py` e `node tests/scoring.test.js` funzionano dal nuovo repository
- [ ] il sito pubblico si apre e una partita contro il computer arriva fino al punteggio finale
- [ ] la vista giocatore 3D si carica (three.js da cdnjs)
- [ ] l'artefatto team è condiviso con le persone giuste
- [ ] i punti aperti di [COMMERCIALE.md](COMMERCIALE.md) hanno un responsabile
