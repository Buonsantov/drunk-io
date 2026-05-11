# drunk-io — Use Cases

> **Versione**: 1.0  
> **Data**: 2025  
> **Riferimento**: `docs/analysis/drunk-io-functional-analysis.md`, `docs/requirements/drunk-io-requirements.md`

---

## UC-01 — Primo Accesso: Accettazione Informativa Cookie

| Campo | Valore |
|---|---|
| **ID** | UC-01 |
| **Attori** | Utente (nuovo o dopo reset cookie) |
| **RF di riferimento** | RF-01 |

### Precondizioni
- Cookie `info` e/o `cookie` assenti o valorizzati a `false`
- L'app è raggiungibile (online o con PWA cached)

### Flusso Principale
1. L'utente apre l'app o naviga su `/#/`
2. Il sistema attiva `InformativaGuard`
3. Il guard verifica `cookie.info === true && cookie.cookie === true` → falso
4. Il sistema reindirizza automaticamente su `/#/informativa`
5. Il sistema mostra `CookieComponent` con il testo completo dell'informativa sulla privacy e sull'uso dei cookie
6. Il sistema mostra il disclaimer legale sull'uso informativo dei dati
7. L'utente legge l'informativa
8. L'utente clicca "Accetto"
9. Il sistema invoca `CookieDrunkService.salvaInfo(true, true)`
10. Il sistema reindirizza su `/#/`
11. `ProfiloGuard` verifica la presenza di un profilo → se assente, avvia UC-02

### Flussi Alternativi

**FA-01: Utente non accetta**
- Al passo 8: l'utente non clicca "Accetto" (abbandona la pagina o chiude il browser)
- Il sistema mantiene `info=false`, `cookie=false`
- Al prossimo accesso, l'utente viene nuovamente reindirizzato a `/#/informativa`

**FA-02: Ritiro consenso (post-accettazione)**
- L'utente naviga a `/#/informativa` in un secondo momento
- Il sistema mostra opzione "Revoca consenso / Cancella tutti i dati"
- L'utente clicca → sistema invoca `deleteAllCookies()` → tutti i dati eliminati
- Sistema reindirizza su `/#/informativa` (stato ripristinato come primo accesso)

### Postcondizioni
- Cookie `info=true`, `cookie=true` salvati con TTL 30gg
- Utente ha accesso alle funzionalità dell'app

### Note/Vincoli
- Nessuna funzionalità dell'app è accessibile senza questa accettazione [BR-01]
- Il testo dell'informativa deve essere chiaro e leggibile anche su schermi piccoli (WCAG 2.1 AA)
- Il bottone di accettazione deve avere un contrasto adeguato e un touch target di almeno 44×44px

---

## UC-02 — Creazione Nuovo Profilo

| Campo | Valore |
|---|---|
| **ID** | UC-02 |
| **Attori** | Utente |
| **RF di riferimento** | RF-02 |

### Precondizioni
- Informativa accettata (UC-01 completato)
- Route `/#/profilo/0` attiva (id=0 indica nuovo profilo)
- Nessun profilo esistente in cookie (primo avvio) oppure utente ha scelto di aggiungere un profilo

### Flusso Principale
1. Il sistema mostra `ProfiloComponent` in modalità creazione (form vuoto)
2. L'utente inserisce il proprio **nome** (campo testo obbligatorio)
3. L'utente seleziona il proprio **sesso**: M o F (pulsanti radio o select)
4. In base al sesso selezionato, il sistema aggiorna la **lista dei pesi disponibili** (range discreti per M o F)
5. L'utente seleziona il proprio **peso** dalla lista discreta
6. L'utente clicca "Salva profilo"
7. Il sistema valida i campi (nome non vuoto, sesso selezionato, peso selezionato)
8. Il sistema genera un **UUID v4** come identificatore del profilo
9. Il sistema invoca `CookieDrunkService.setUser(nuovoUser)`
10. Il sistema invoca `CookieDrunkService.setProfiloSelezionato(nuovoUser.id)`
11. Il sistema reindirizza su `/#/`

### Flussi Alternativi

**FA-01: Validazione fallita**
- Al passo 7: uno o più campi obbligatori mancanti
- Il sistema mostra messaggi di errore inline sui campi non validi
- Il flusso si blocca al passo 7 finché la validazione non passa

**FA-02: Cambio sesso dopo selezione peso**
- Al passo 5: l'utente cambia il sesso dopo aver già selezionato un peso
- Il sistema resetta la selezione del peso e aggiorna la lista per il nuovo sesso

### Postcondizioni
- Nuovo `User` creato in cookie `users` con `profiloSelezionato=true`
- BehaviorSubject `profiloCorrente$` aggiornato
- Utente accede alla schermata di calcolo BAC

### Note/Vincoli
- Il peso è selezionabile solo da un range discreto predefinito [BR-04]
- Il nome non è usato per calcoli, ma per identificazione personale dell'utente nell'UI
- UUID v4 generato lato client (nessun server coinvolto)

---

## UC-03 — Modifica Profilo Esistente

| Campo | Valore |
|---|---|
| **ID** | UC-03 |
| **Attori** | Utente |
| **RF di riferimento** | RF-02 |

### Precondizioni
- Profilo esistente con ID noto
- Route `/#/profilo/:id` con id ≠ 0

### Flusso Principale
1. Il sistema carica `ProfiloComponent` in modalità modifica
2. Il sistema recupera il profilo tramite `CookieDrunkService.getUser(id)`
3. Il sistema pre-popola il form con nome, sesso, peso del profilo esistente
4. L'utente modifica i campi desiderati
5. L'utente clicca "Salva modifiche"
6. Il sistema valida i campi
7. Il sistema aggiorna il profilo tramite `CookieDrunkService.setUser(profiloAggiornato)`
8. Il sistema reindirizza su `/#/profili` (o `/#/`)

### Flussi Alternativi

**FA-01: Profilo non trovato**
- Al passo 2: l'ID non corrisponde a nessun profilo in cookie
- Il sistema reindirizza su `/#/profili` con messaggio di errore (toast)

**FA-02: Annulla modifiche**
- L'utente clicca "Annulla" o naviga indietro
- Le modifiche non vengono salvate
- Il sistema torna a `/#/profili`

### Postcondizioni
- Profilo aggiornato in cookie
- Se il sesso o il peso sono stati modificati, i calcoli BAC successivi useranno i nuovi valori

### Note/Vincoli
- La modifica del peso aggiorna la lookup table per tutti i calcoli successivi ma non altera lo storico `bevute[]` già salvato
- L'ID del profilo rimane invariato dopo la modifica

---

## UC-04 — Selezione Profilo Attivo

| Campo | Valore |
|---|---|
| **ID** | UC-04 |
| **Attori** | Utente |
| **RF di riferimento** | RF-11 |

### Precondizioni
- Almeno un profilo creato
- `ProfiliComponent` visibile (route `/#/profili`)

### Flusso Principale
1. Il sistema mostra `ProfiliComponent` con la lista di tutti i profili
2. Per ogni profilo, il sistema indica se è quello attualmente selezionato
3. L'utente clicca su un profilo non ancora selezionato
4. Il sistema invoca `CookieDrunkService.setProfiloSelezionato(id)`
5. Il sistema aggiorna `profiloSelezionato=true` sul profilo scelto e `false` su tutti gli altri
6. Il BehaviorSubject `profiloCorrente$` emette il nuovo profilo
7. Il sistema reindirizza su `/#/`

### Flussi Alternativi

**FA-01: Selezione del profilo già attivo**
- Al passo 3: l'utente clicca sul profilo già attivo
- Il sistema non cambia nulla e rimane su `/#/profili`
- Oppure: reindirizza comunque su `/#/`

### Postcondizioni
- Il profilo selezionato è quello attivo per i calcoli BAC successivi
- Cookie `profiloSelezionato` aggiornato

### Note/Vincoli
- Un solo profilo attivo per volta [BR-08]
- Il cambio profilo non cancella lo storico dei profili precedenti

---

## UC-05 — Eliminazione Profilo

| Campo | Valore |
|---|---|
| **ID** | UC-05 |
| **Attori** | Utente |
| **RF di riferimento** | RF-12 |

### Precondizioni
- Almeno un profilo esistente
- `ProfiliComponent` visibile

### Flusso Principale
1. L'utente clicca "Elimina" su un profilo nella lista
2. Il sistema mostra una modale di conferma tramite `ModalDrunkService` ("Sei sicuro di voler eliminare il profilo X?")
3. L'utente conferma l'eliminazione
4. Il sistema invoca `CookieDrunkService.deleteUser(id)`
5. Il sistema rimuove il profilo dal cookie `users`
6. Se il profilo eliminato era quello attivo (`profiloSelezionato=true`), il sistema deseleziona il profilo corrente
7. La lista si aggiorna automaticamente

### Flussi Alternativi

**FA-01: Utente annulla eliminazione**
- Al passo 3: l'utente clicca "Annulla" nella modale
- La modale si chiude, nessuna modifica

**FA-02: Eliminazione dell'unico profilo**
- Al passo 6: non ci sono altri profili disponibili
- `ProfiloGuard` al prossimo accesso a `/#/` reindirizza a `/#/profilo/0`
- L'utente è forzato a creare un nuovo profilo

### Postcondizioni
- Profilo e relativo storico `bevute[]` eliminati definitivamente dal cookie
- Cookie `users` aggiornato

### Note/Vincoli
- L'eliminazione è irreversibile (nessun backup, nessun server)
- La modale di conferma è obbligatoria per prevenire eliminazioni accidentali

---

## UC-06 — Calcolo Tasso Alcolemico

| Campo | Valore |
|---|---|
| **ID** | UC-06 |
| **Attori** | Utente |
| **RF di riferimento** | RF-04, RF-05, RF-06, RF-08 |

### Precondizioni
- Informativa accettata (UC-01)
- Profilo attivo configurato (UC-02 o UC-04)
- `tabella_alcolemica.json` caricato correttamente da `HomeComponent`
- Route `/#/` attiva

### Flusso Principale
1. Il sistema mostra `CalcoloAlcolemicoComponent` con la lista delle bevande disponibili
2. L'utente seleziona una bevanda dalla lista (es. "Birra 33cl")
3. L'utente specifica la quantità (es. "2")
4. L'utente può aggiungere ulteriori bevande (torna al passo 2)
5. L'utente indica se ha lo stomaco pieno o vuoto (toggle/checkbox)
6. L'utente clicca "Calcola"
7. Il sistema esegue l'algoritmo: per ogni bevanda → filtra `dettaglioAlcolici[peso=utente.peso][sesso=utente.sesso][stomaco=input]` → somma `tasso × quantità`
8. Il sistema invoca `CookieDrunkService.salvaAndamento({data: now, grado: BACcalcolato})`
9. Il sistema emette `@Output tassoOut(BACcalcolato)` verso `HomeComponent`
10. `HomeComponent` mostra `RisultatoAlcolemicoComponent` (vedi UC-07)

### Flussi Alternativi

**FA-01: Lista bevande vuota**
- Al passo 6: nessuna bevanda selezionata
- Il sistema mostra errore/avviso (toast o messaggio inline): "Seleziona almeno una bevanda"
- Il calcolo non viene eseguito

**FA-02: Rimozione bevanda dalla lista**
- L'utente clicca "Rimuovi" su una voce della lista
- La voce viene rimossa dall'array locale
- Il calcolo verrà ricalcolato senza quella bevanda

**FA-03: Svuota lista**
- L'utente clicca "Cancella tutto"
- L'array locale `bevandeSel` viene azzerato
- Nessun calcolo viene eseguito

**FA-04: Errore caricamento tabella**
- `tabella_alcolemica.json` non disponibile (offline, errore nginx)
- Il sistema mostra errore tramite `DrunkLibToastService`
- Il calcolo non è disponibile finché il file non viene caricato

### Postcondizioni
- BAC calcolato disponibile
- Record `{data, grado}` aggiunto a `user.bevute[]` e persistito su cookie
- Schermata risultato visualizzata (UC-07)

### Note/Vincoli
- Il risultato è una stima informativa, non un dato attendibile [BR-07]
- Il calcolo usa i parametri del profilo attivo (peso, sesso) [BR-02]
- La quantità delle bevande deve essere > 0

---

## UC-07 — Visualizzazione Risultato e Sanzioni

| Campo | Valore |
|---|---|
| **ID** | UC-07 |
| **Attori** | Utente |
| **RF di riferimento** | RF-07 |

### Precondizioni
- UC-06 completato con successo
- `sanzioni.json` caricato correttamente
- BAC calcolato disponibile

### Flusso Principale
1. `HomeComponent` riceve `tassoOut(bac)` da `CalcoloAlcolemicoComponent`
2. Il sistema mostra `RisultatoAlcolemicoComponent` con:
   - BAC calcolato (es. "0.82 g/L")
   - Fascia di rischio corrispondente
   - Effetti fisiologici della fascia
   - Sanzioni legali italiane della fascia
   - Disclaimer legale obbligatorio
3. L'utente legge il risultato
4. L'utente può cliccare "Torna al calcolo" per un nuovo calcolo

### Flussi Alternativi

**FA-01: BAC = 0**
- Il sistema mostra "0.00 g/L — nessuna fascia di rischio"
- Il disclaimer è comunque visibile

**FA-02: BAC fuori range sanzioni**
- Il sistema non trova una fascia corrispondente
- Il sistema mostra il BAC calcolato con un messaggio di default

**FA-03: Torna al calcolo**
- Al passo 4: l'utente emette `@Output back()`
- `HomeComponent` torna a mostrare `CalcoloAlcolemicoComponent`
- La lista bevande precedente viene resettata

### Postcondizioni
- L'utente ha visualizzato il risultato BAC e le sanzioni associate

### Note/Vincoli
- Disclaimer sempre visibile in questa schermata [BR-07]
- Il lookup sanzione usa: `sanzioni.find(p => bac >= p.min && bac < p.max)` [CODICE: `risultato-alcolemico.component.ts`]

---

## UC-08 — Visualizzazione Storico BAC (Grafico)

| Campo | Valore |
|---|---|
| **ID** | UC-08 |
| **Attori** | Utente |
| **RF di riferimento** | RF-09 |

### Precondizioni
- Profilo attivo con almeno una voce in `bevute[]`
- Route `/#/chart` attiva

### Flusso Principale
1. L'utente naviga su `/#/chart`
2. Il sistema carica `ChartComponent`
3. Il sistema legge il profilo attivo tramite `CookieDrunkService.getProfiloSelezionato()`
4. Il sistema estrae l'array `bevute[]` dal profilo
5. Il sistema applica il filtro predefinito: ultimi 7 giorni
6. Il sistema renderizza il grafico lineare (Chart.js) con:
   - Asse X: date delle bevute
   - Asse Y: BAC (g/L) per ogni bevuta
7. L'utente può cambiare il filtro tra "7 giorni" e "31 giorni"
8. Il grafico si aggiorna con il nuovo filtro

### Flussi Alternativi

**FA-01: Storico vuoto**
- Al passo 4: `bevute[]` è vuoto
- Il sistema mostra un messaggio: "Nessun dato disponibile. Esegui un calcolo BAC per popolare lo storico."

**FA-02: Cambio filtro**
- Al passo 7: l'utente seleziona "31 giorni"
- Il sistema re-filtra i dati e aggiorna il grafico senza ricaricare la pagina

**FA-03: Nessun dato nel periodo selezionato**
- Tutti i record `bevute[]` sono antecedenti al periodo selezionato
- Il grafico mostra una linea piatta o un messaggio "Nessun dato nel periodo selezionato"

### Postcondizioni
- L'utente ha visualizzato il proprio storico BAC nel periodo selezionato

### Note/Vincoli
- I dati provengono esclusivamente dal cookie locale del dispositivo
- Il grafico è accessibile (WCAG 2.1 AA) con alternative testuali per screen reader

---

## UC-09 — Cancellazione Storico BAC

| Campo | Valore |
|---|---|
| **ID** | UC-09 |
| **Attori** | Utente |
| **RF di riferimento** | RF-10 |

### Precondizioni
- Profilo attivo con storico `bevute[]` non vuoto
- Route `/#/chart` attiva

### Flusso Principale
1. L'utente clicca "Cancella storico" nella schermata grafico
2. Il sistema mostra una modale di conferma: "Sei sicuro di voler cancellare tutto lo storico BAC?"
3. L'utente conferma
4. Il sistema svuota `bevute[]` nel profilo attivo
5. Il sistema aggiorna il profilo in cookie tramite `CookieDrunkService.setUser()`
6. Il grafico viene aggiornato mostrando "Nessun dato disponibile"

### Flussi Alternativi

**FA-01: Utente annulla**
- Al passo 3: l'utente clicca "Annulla" nella modale
- Nessuna modifica, grafico invariato

### Postcondizioni
- `bevute[]` del profilo attivo è vuoto
- Cookie `users` aggiornato
- Grafico vuoto

### Note/Vincoli
- La cancellazione è irreversibile
- La modale di conferma è obbligatoria

---

## UC-10 — Consultazione FAQ

| Campo | Valore |
|---|---|
| **ID** | UC-10 |
| **Attori** | Utente (qualsiasi, anche senza profilo) |
| **RF di riferimento** | RF-13 |

### Precondizioni
- Route `/#/faq` accessibile (non richiede InformativaGuard)

### Flusso Principale
1. L'utente naviga su `/#/faq`
2. Il sistema mostra `FaqComponent` con la lista delle domande frequenti
3. L'utente espande/collassa le domande di interesse (accordion Bootstrap Italia)
4. L'utente trova le informazioni cercate
5. L'utente naviga verso un'altra sezione dell'app

### Flussi Alternativi
Nessuno rilevante (pagina statica).

### Postcondizioni
- L'utente ha letto le FAQ

### Note/Vincoli
- Pagina accessibile anche senza accettazione informativa e senza profilo
- Contenuto statico (nessuna dipendenza da servizi o cookie)
- WCAG 2.1 AA: accordion con tasti freccia per espansione/collasso

---

## UC-11 — Pagina Contatti

| Campo | Valore |
|---|---|
| **ID** | UC-11 |
| **Attori** | Utente (qualsiasi) |
| **RF di riferimento** | RF-14 |

### Precondizioni
- Route `/#/contatti` accessibile

### Flusso Principale
1. L'utente naviga su `/#/contatti`
2. Il sistema mostra `ContattiComponent` con le informazioni di contatto dei maintainers (Buonsanto Vito, Favia Fabrizio) [README]
3. L'utente consulta le informazioni e/o contatta i maintainers tramite i canali indicati

### Postcondizioni
- L'utente ha visualizzato le informazioni di contatto

### Note/Vincoli
- Pagina accessibile senza profilo e senza informativa accettata
- Contenuto statico

---

## UC-12 — Revoca Consenso Cookie (Eliminazione Tutti i Dati)

| Campo | Valore |
|---|---|
| **ID** | UC-12 |
| **Attori** | Utente |
| **RF di riferimento** | RF-01, RNF-04 |

### Precondizioni
- Utente ha precedentemente accettato l'informativa
- Route `/#/informativa` accessibile

### Flusso Principale
1. L'utente naviga manualmente su `/#/informativa`
2. Il sistema mostra `CookieComponent` con l'informativa e un'opzione "Revoca consenso / Cancella tutti i dati"
3. L'utente clicca l'opzione di revoca
4. Il sistema mostra una modale di conferma: "Questa azione eliminerà TUTTI i tuoi profili, lo storico BAC e le preferenze. Sei sicuro?"
5. L'utente conferma
6. Il sistema invoca `CookieDrunkService.deleteAllCookies()`
7. Tutti i cookie applicativi vengono cancellati: `info`, `cookie`, `users`, `profiloSelezionato`
8. Il sistema reindirizza su `/#/informativa` (stato ripristinato come primo accesso)

### Flussi Alternativi

**FA-01: Utente annulla revoca**
- Al passo 5: l'utente clicca "Annulla"
- Nessuna modifica, l'utente rimane su `/#/informativa`

### Postcondizioni
- Tutti i cookie applicativi eliminati
- Tutti i profili e lo storico BAC eliminati definitivamente
- App nello stato equivalente al primo accesso

### Note/Vincoli
- La revoca è irreversibile
- È l'unico modo per esercitare il "diritto all'oblio" nell'app [RNF-04]
- Implementato da `deleteAllCookies()` in `CookieDrunkService`

---

*Documento prodotto da analisi codebase. Versione: 1.0 — Data: 2025*
