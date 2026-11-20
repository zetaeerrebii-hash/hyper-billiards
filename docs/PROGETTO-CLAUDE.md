# Il Progetto Claude `HF_APP_HYPER BILLIARDS`

Il progetto è un gruppo della Regia HYPER FALSE (livello «App promosse», convenzione `HF_APP_NOME`). Riceve dal centro **HF_CORE.md** e riporta al centro **STATO.md**.

Due strumenti, due compiti:
- **Progetto su claude.ai**: dove si decide (regole, contenuti della Scuola, grafica, business).
- **Claude Code collegato al repository**: dove si scrive il codice; legge `CLAUDE.md`, lavora su rami, esegue build, test e prova nel browser.

La fonte di verità del prodotto sono i documenti nel repository; il Progetto ne tiene una copia aggiornata a fine ciclo.

## 1. Impostazione
**Nome:** `HF_APP_HYPER BILLIARDS`
**Descrizione:** Gioco e scuola di biliardo all'italiana (goriziana e 5 birilli, regolamento FIBIS). Progettazione, test, pubblicazione.

**Istruzioni del progetto** (da incollare in *Istruzioni*):

```
Questo è il gruppo HF_APP_HYPER BILLIARDS della Regia HYPER FALSE (Fuzz Atelier S.R.L.). Lavoriamo su HYPER BILLIARDS, gioco e strumento di apprendimento per il biliardo all'italiana con la stecca (goriziana 9 birilli e italiana 5 birilli, regolamento FIBIS). Rispondi in italiano.

Regole dello studio: valgono HF_CORE.md (copia datata dal centro) e le cinque regole della Regia. Le persone approvano, Claude prepara: pubblicazioni, condivisioni, invii fuori dallo studio, spese di crediti o servizi e pareri legali richiedono l'ok di un socio (Simone, Massimiliano, Daniele). Materiale di clienti o di altri gruppi non entra qui: passa dal centro.

Fonti di verità, in quest'ordine: HF_CORE, poi i documenti del progetto (STATO, CONTESTO-PROGETTO, REGOLE, ARCHITETTURA, ROADMAP, COMMERCIALE, MIGRAZIONE), poi il regolamento FIBIS, poi i manuali. Se una richiesta contraddice una decisione registrata in CONTESTO-PROGETTO, segnalalo prima di procedere.

Precisione: misure reali del tavolo (2840 x 1420 mm, diamanti ogni 355 mm, 9 sulle lunghe e 5 sulle corte), punteggi verificabili. Quando proponi una regola, cita l'articolo del regolamento; se è un'interpretazione, dillo.

Qui si decide e si progetta; il codice si scrive nel repository hyper-billiards con Claude Code. Quando una decisione è presa, chiudi con un riepilogo da aggiungere a CONTESTO-PROGETTO.md nella forma "Decisione · motivo · data".

Quando ti dico "chiudi la sessione", aggiorna STATO.md (Fatto, Deciso, Prossimi passi, Richieste per il centro, Approvazioni richieste) restando in una pagina, e salvalo nel progetto.

Per diritti, marchi, privacy dei ritratti e contenuti dei manuali fai riferimento a COMMERCIALE.md e ricorda che non sostituisci un legale.
```

**Conoscenza:** HF_CORE, STATO, CONTESTO-PROGETTO (il più importante), REGOLE, ARCHITETTURA, ROADMAP, COMMERCIALE, MIGRAZIONE; il regolamento FIBIS in PDF e la foto di riferimento del tavolo. I manuali (Margutti, Bibbia del biliardo) solo se avete il diritto di usarli internamente. Non caricare il codice: il riferimento è il repository.

## 2. Conversazioni
Una per filone, con prefisso nel titolo: **[Regole]**, **[Gioco]** (fisica, computer), **[Grafica]**, **[Scuola]**, **[Business]**, **[Rilascio]** (pubblicazione, store, artefatto). Conversazioni brevi, documenti aggiornati.

## 3. Ciclo di lavoro
1. **Decidi** nel Progetto; Claude chiude con il riepilogo della decisione.
2. **Implementa** con Claude Code su un ramo, incollando il riepilogo; Claude Code aggiorna `CONTESTO-PROGETTO.md` e `STATO.md`, esegue build, test e `npm run smoke`.
3. **Revisione** della pull request (CI verde) e unione.
4. **Prova di squadra** sull'artefatto «HYPER BILLIARDS · test», ripubblicato sempre allo stesso link (dopo l'ok di un socio se è condiviso).
5. **Chiudi la sessione**: ricarica nel Progetto i documenti cambiati e copia `STATO.md` nella cartella Drive.
6. **Lunedì**: STATO.md va al centro HYPER FALSE per il giro di allineamento.

## 4. Persone
- **Fase di test:** decide e approva solo Daniele; repository nel suo account GitHub.
- Chi ha l'ultima parola sulle regole (giocatore esperto o arbitro).
- Accesso in modifica al Progetto solo a chi decide, in lettura agli altri.
- Un responsabile della checklist COMMERCIALE.

## 5. Memoria
Ogni progetto Claude ha la sua memoria e non legge gli altri: per questo HF_CORE scende e STATO risale in modo esplicito, e ogni ciclo si chiude aggiornando i documenti.
