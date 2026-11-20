# STATO · HF_APP_HYPER BILLIARDS

**Aggiornato:** 20/11/2026 · **HF_CORE in uso:** segnaposto del 20/11/2026 (manca la versione del centro)
**Prodotto:** HYPER BILLIARDS (ex Maestria Goriziana) · **Repository:** github.com/zetaeerrebii-hash/hyper-billiards (account di Daniele, per tutta la fase di test) · **Sito:** https://zetaeerrebii-hash.github.io/hyper-billiards/

> Una pagina, sempre la stessa. Si aggiorna a fine sessione («Chiudi la sessione») e si porta al centro al giro del lunedì.

## Fatto
- Migrazione dall'account personale preparata: codice, build, test e documenti importati e verificati.
- Build adattata all'account team: three.js r128 servito dal sito (`vendor/three/`) invece che da CDN; l'artefatto è ora un documento HTML completo (richiesto dagli artefatti del team).
- Prova automatica nel browser (`tests/smoke.test.js`): pianta, 3D, telefono 390 px, partita, scuola, zero errori. CI GitHub Actions pronta.
- File della Regia aggiunti: `HF_CORE.md` (segnaposto), `STATO.md`.
- Documenti caricati nel Progetto Claude `HF_APP_HYPER BILLIARDS`.
- GitHub: repository rinominato `hyper-billiards`; modifiche della migrazione unite in `main` con la PR #1 (CI verde: build, 19 test, prova nel browser). Sito Pages ripubblicato e provato con la vista 3D. `main` protetto: si modifica solo con pull request e CI verde.
- Artefatto di prova del team pubblicato (privato): «HYPER BILLIARDS · test» https://claude.ai/artifact/Mtr6DrYCnCt1meiQhp4MqF

## Deciso
- Codice su GitHub come fonte di verità; cartella Drive per documenti, build e copie per il team · 20/11/2026.
- Fase di test: decide e approva solo Daniele; il repository resta nel suo account GitHub (`zetaeerrebii-hash`), nessun trasferimento all'organizzazione per ora · 20/11/2026.
- three.js dal proprio dominio sul sito (affidabilità, privacy); l'artefatto resta su cdnjs per restare leggero · 20/11/2026.

## Prossimi passi
1. Avvisare chi usava il vecchio sito `…github.io/maestria-goriziana/` (ora 404) e il vecchio artefatto personale: nuovi link in questa pagina.
2. Clonare in una cartella locale **fuori da Google Drive** per lavorare con Claude Code.
3. Assegnare un responsabile ai punti bloccanti di `docs/COMMERCIALE.md`.
4. Rispondere alle domande aperte della `docs/ROADMAP.md` (pubblico, prima piattaforma, contenuti didattici).

## Richieste per il centro (HYPER FALSE)
- **Registro gruppi:** aggiungere `HF_APP_HYPER BILLIARDS`. Il prodotto arriva già sviluppato da un altro account e non è passato dal test in HF_APP: registrare in HF_APP una scheda test retroattiva con esito «promossa» (proposta in `docs/MIGRAZIONE.md` §6).
- **HF_CORE:** inviare la versione corrente datata.
- **Nome del gruppo:** la convenzione è `HF_APP_NOME`; valutare `HF_APP_HYPER_BILLIARDS` (senza spazio) per coerenza.
- **Marchio "HYPER BILLIARDS":** decisione sui soci per la ricerca UIBM/EUIPO (COMMERCIALE.md, punto 4).

## Approvazioni richieste (in fase di test: Daniele)
- Condivisione dell'artefatto di prova con altre persone.
- Repository pubblico o privato (privato: GitHub Pages a pagamento); togliere l'opzione «Template repository».
- Al termine del test: trasferimento all'organizzazione del team, con l'ok dei soci.
