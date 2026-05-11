# drunk-io — Analisi Funzionale

> **Versione**: 1.0  
> **Data**: 2025  
> **Riferimento**: `docs/requirements/drunk-io-requirements.md`, `docs/architecture/drunk-io-domain-model.md`

---

## 1. Requisiti Funzionali (Schede Complete)

### RF-01 — Accettazione Informativa Privacy/Cookie

| Campo | Valore |
|---|---|
| **ID** | RF-01 |
| **Descrizione** | Alla prima apertura dell'app, l'utente deve visualizzare l'informativa sulla privacy e sull'uso dei cookie, e accettarla esplicitamente prima di accedere alle funzionalità principali. |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/_core/guards/informativa.guard.ts`], [CODICE: `src/app/cookie/cookie.component.ts`] |
| **Scenario trigger** | Utente apre l'app per la prima volta o dopo cancellazione cookie |
| **Precondizioni** | Cookie `info` e/o `cookie` assenti o `false` |
| **Postcondizioni** | Cookie `info=true`, `cookie=true` salvati. Utente reindirizzato a `/#/` |
| **Comportamento guard** | `InformativaGuard.canActivate()` verifica `info && cookie` → redirect `/#/informativa` se falso |

---

### RF-02 — Creazione Profilo Utente

| Campo | Valore |
|---|---|
| **ID** | RF-02 |
| **Descrizione** | L'utente può creare un profilo personale con: nome, sesso (M/F), peso (da lista discreta per sesso). |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/content/profilo/profilo.component.ts`], [CODICE: `src/app/_core/model/user-model.ts`] |
| **Scenario trigger** | Primo accesso (nessun profilo in cookie) o click "Crea nuovo profilo" |
| **Precondizioni** | Informativa accettata. Route `/#/profilo/0` (id=0 indica nuovo profilo) |
| **Postcondizioni** | Nuovo `User` salvato in cookie `users`. `profiloSelezionato=true` sul primo profilo creato. |
| **Vincoli** | Nome: obbligatorio. Sesso: M o F. Peso: range discreti differenziati per sesso. UUID v4 generato automaticamente. |

---

### RF-03 — Gestione Multi-Profilo

| Campo | Valore |
|---|---|
| **ID** | RF-03 |
| **Descrizione** | L'app supporta più profili utente sulla stessa installazione. |
| **Priorità** | SHOULD |
| **Fonte** | [CODICE: `src/app/content/profili/profili.component.ts`] |
| **Scenario trigger** | Utente vuole usare l'app per più persone (es. coppia, gruppo) |
| **Precondizioni** | Almeno un profilo esistente. Informativa accettata. |
| **Postcondizioni** | Lista profili disponibile. Selezione e gestione da `ProfiliComponent`. |
| **Vincoli** | Un solo profilo attivo per volta. Max profili: limitato da spazio cookie (~4KB totale). |

---

### RF-04 — Calcolo BAC da Lookup Table

| Campo | Valore |
|---|---|
| **ID** | RF-04 |
| **Descrizione** | Il sistema calcola il tasso alcolemico stimato (BAC) sommando i tassi di ogni bevanda selezionata, filtrati dalla lookup table per: peso utente, sesso, stomaco pieno/vuoto. |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/content/home/calcolo-alcolemico/calcolo-alcolemico.component.ts`], [CODICE: `src/app/_core/model/tabella-alcolemica.ts`] |
| **Scenario trigger** | Utente ha selezionato almeno una bevanda e conferma il calcolo |
| **Precondizioni** | Profilo attivo con peso e sesso definiti. `tabella_alcolemica.json` caricato. |
| **Postcondizioni** | BAC calcolato in g/L. Risultato emesso via `@Output tassoOut`. Bevuta salvata in storico. |
| **Algoritmo** | `Σ(tasso[peso, sesso, stomacoPieno] × quantità)` per ogni bevanda nella lista |

---

### RF-05 — Selezione Bevande e Quantità

| Campo | Valore |
|---|---|
| **ID** | RF-05 |
| **Descrizione** | L'utente seleziona le bevande consumate da una lista (derivata dalla tabella alcolemica), ne specifica la quantità, può aggiungere più voci, rimuovere singole voci o svuotare l'intera lista. |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/content/home/calcolo-alcolemico/calcolo-alcolemico.component.ts`] |
| **Scenario trigger** | Accesso alla schermata di calcolo BAC |
| **Precondizioni** | `tabella_alcolemica.json` caricato con successo. |
| **Postcondizioni** | Lista bevande aggiornata dinamicamente. Calcolo BAC ricalcolato. |
| **Operazioni** | Aggiungi bevanda, modifica quantità, rimuovi singola bevanda, svuota lista |

---

### RF-06 — Indicazione Stomaco Pieno/Vuoto

| Campo | Valore |
|---|---|
| **ID** | RF-06 |
| **Descrizione** | L'utente indica se ha lo stomaco pieno o vuoto al momento del consumo. Questo parametro modifica significativamente il tasso alcolemico stimato. |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/_core/model/dettaglio-alcolici.ts`] — campo `stomacoPieno: boolean` |
| **Scenario trigger** | Schermata calcolo BAC |
| **Precondizioni** | — |
| **Postcondizioni** | Il filtro lookup usa `stomacoPieno` corretto per il calcolo. |
| **UI** | Toggle/checkbox "Stomaco pieno" / "Stomaco vuoto" |

---

### RF-07 — Visualizzazione Risultato e Sanzioni

| Campo | Valore |
|---|---|
| **ID** | RF-07 |
| **Descrizione** | Dopo il calcolo, l'app mostra il BAC stimato e la fascia di sanzione corrispondente (effetti fisiologici e conseguenze legali italiane). |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/content/home/risultato-alcolemico/risultato-alcolemico.component.ts`], [CODICE: `src/app/_core/model/pena.ts`] |
| **Scenario trigger** | Emissione evento `tassoOut` da `CalcoloAlcolemicoComponent` |
| **Precondizioni** | `sanzioni.json` caricato. BAC calcolato disponibile. |
| **Postcondizioni** | Utente visualizza BAC + sanzione. Disclaimer visibile. |
| **Lookup sanzione** | Prima `Pena` tale che `pena.min ≤ BAC < pena.max` |

---

### RF-08 — Storico Andamento BAC

| Campo | Valore |
|---|---|
| **ID** | RF-08 |
| **Descrizione** | Ogni calcolo BAC completato viene automaticamente salvato nello storico del profilo attivo come record `{data, grado}`. |
| **Priorità** | SHOULD |
| **Fonte** | [CODICE: `src/app/content/home/calcolo-alcolemico/calcolo-alcolemico.component.ts`] — metodo `salvaAndamento()` |
| **Scenario trigger** | Conferma calcolo BAC |
| **Precondizioni** | Profilo attivo disponibile. |
| **Postcondizioni** | Record aggiunto a `User.bevute[]`. Profilo aggiornato su cookie. |

---

### RF-09 — Grafico BAC nel Tempo

| Campo | Valore |
|---|---|
| **ID** | RF-09 |
| **Descrizione** | L'utente può visualizzare un grafico lineare dello storico BAC filtrato per ultimi 7 o 31 giorni. |
| **Priorità** | SHOULD |
| **Fonte** | [CODICE: `src/app/content/chart/chart.component.ts`] |
| **Scenario trigger** | Navigazione a `/#/chart` |
| **Precondizioni** | Profilo attivo con storico `bevute[]` non vuoto. |
| **Postcondizioni** | Grafico renderizzato con Chart.js. |
| **Filtri** | Toggle 7 giorni / 31 giorni |

---

### RF-10 — Cancellazione Dati Storico

| Campo | Valore |
|---|---|
| **ID** | RF-10 |
| **Descrizione** | L'utente può cancellare manualmente l'intero storico BAC del profilo attivo. |
| **Priorità** | SHOULD |
| **Fonte** | [CODICE: `src/app/content/chart/chart.component.ts`] |
| **Scenario trigger** | Click "Cancella storico" nella schermata grafico |
| **Precondizioni** | Profilo attivo con storico non vuoto. |
| **Postcondizioni** | `User.bevute[]` svuotato. Profilo aggiornato su cookie. Grafico vuoto. |

---

### RF-11 — Selezione Profilo Attivo

| Campo | Valore |
|---|---|
| **ID** | RF-11 |
| **Descrizione** | Dalla lista profili, l'utente seleziona quale profilo usare per il calcolo BAC. Un solo profilo è attivo per volta. |
| **Priorità** | MUST |
| **Fonte** | [CODICE: `src/app/content/profili/profili.component.ts`] |
| **Scenario trigger** | Accesso a `/#/profili` o redirect da ProfiloGuard |
| **Precondizioni** | Almeno un profilo disponibile. |
| **Postcondizioni** | `profiloSelezionato=true` sul profilo scelto. BehaviorSubject aggiornato. Redirect a `/#/`. |

---

### RF-12 — Eliminazione Profilo

| Campo | Valore |
|---|---|
| **ID** | RF-12 |
| **Descrizione** | L'utente può eliminare un profilo esistente dopo conferma tramite modale. |
| **Priorità** | SHOULD |
| **Fonte** | [CODICE: `src/app/content/profili/profili.component.ts`] — ModalDrunkService per conferma |
| **Scenario trigger** | Click "Elimina" su un profilo in lista |
| **Precondizioni** | Profilo esistente. |
| **Postcondizioni** | Profilo rimosso dal cookie `users`. Se era quello selezionato, viene deselezionato. |

---

### RF-13 — Pagina FAQ

| Campo | Valore |
|---|---|
| **ID** | RF-13 |
| **Descrizione** | Pagina con domande frequenti sull'app, sul calcolo BAC e sul disclaimer. |
| **Priorità** | COULD |
| **Fonte** | [CODICE: `src/app/faq/faq.component.ts`] |
| **Scenario trigger** | Navigazione a `/#/faq` |
| **Precondizioni** | Nessuna (accessibile anche senza informativa accettata) |
| **Postcondizioni** | Pagina statica visualizzata. |

---

### RF-14 — Pagina Contatti

| Campo | Valore |
|---|---|
| **ID** | RF-14 |
| **Descrizione** | Pagina con informazioni di contatto dei maintainers. |
| **Priorità** | COULD |
| **Fonte** | [CODICE: `src/app/contatti/contatti.component.ts`] |
| **Scenario trigger** | Navigazione a `/#/contatti` |
| **Precondizioni** | Nessuna |
| **Postcondizioni** | Pagina statica visualizzata. |

---

### RF-15 — Presentazione App

| Campo | Valore |
|---|---|
| **ID** | RF-15 |
| **Descrizione** | Schermata di presentazione/landing che introduce l'app e le sue funzionalità. |
| **Priorità** | COULD |
| **Fonte** | [CODICE: `src/app/drunkio-presentazione/`] |
| **Scenario trigger** | Accesso alla schermata di presentazione |
| **Precondizioni** | Nessuna |
| **Postcondizioni** | Presentazione visualizzata. |

---

## 2. Requisiti Non Funzionali

| ID | Titolo | Descrizione |
|---|---|---|
| RNF-01 | Performance | LCP < 2.5s, FID < 100ms, CLS < 0.1. Caricamento < 3s su 4G. |
| RNF-02 | Accessibilità | WCAG 2.1 AA obbligatorio. Navigazione tastiera. Screen reader compatible. |
| RNF-03 | Responsiveness | Mobile-first. Breakpoint Bootstrap Italia. PWA installabile. Touch target ≥ 44px. |
| RNF-04 | Privacy | Zero dati a server. Cookie solo locale, scadenza 30gg. GDPR compliant. |
| RNF-05 | Sicurezza | No endpoint con dati sensibili. No XSS da input utente. CSP configurabile. |
| RNF-06 | Browser Support | Chrome, Firefox, Safari, Edge (ultimi 2 major). iOS Safari 14+. Android Chrome 88+. |
| RNF-07 | Deployability | Docker + nginx. Config runtime via config.json. K8s ready (ConfigMap). |
| RNF-08 | Manutenibilità | Feature Module pattern. TypeScript tipizzato. Separazione servizi/componenti/modelli. |

---

## 3. Regole di Business

### BR-01 — Accesso App Subordinato ad Accettazione Informativa
**Descrizione**: Nessun utente può accedere alle funzionalità principali dell'app (calcolo, profili, storico) senza aver prima accettato esplicitamente l'informativa sulla privacy e sull'uso dei cookie.  
**Implementazione**: `InformativaGuard` — verifica `cookie.info === true && cookie.cookie === true`.  
**Fonte**: [CODICE: `src/app/_core/guards/informativa.guard.ts`]

### BR-02 — Calcolo BAC Subordinato a Profilo Attivo Configurato
**Descrizione**: Il calcolo BAC richiede un profilo attivo con peso e sesso definiti, in quanto questi parametri sono essenziali per il filtro della lookup table.  
**Implementazione**: `ProfiloGuard` — verifica profilo selezionato prima di consentire accesso a `HomeComponent`.  
**Fonte**: [CODICE: `src/app/_core/guards/profilo.guard.ts`]

### BR-03 — Tasso Calcolato da Lookup Table (Non Formula Widmark Diretta)
**Descrizione**: Il BAC è calcolato tramite tabella di lookup precompilata, non con la formula di Widmark. Per ogni bevanda: si recupera il tasso corrispondente a (peso, sesso, stomacoPieno), poi si moltiplica per la quantità e si somma.  
**Formula effettiva**: `BAC = Σ(tasso_lookup[peso][sesso][stomaco] × quantità[i])`  
**Fonte**: [CODICE: `src/app/content/home/calcolo-alcolemico/calcolo-alcolemico.component.ts`]

### BR-04 — Peso Selezionabile per Range Discreti (Diversi per M/F)
**Descrizione**: Il peso nel profilo non è un campo libero ma una selezione da range discreti predefiniti, differenziati per sesso M e F, per corrispondere alle categorie della lookup table.  
**Motivazione**: La lookup table usa categorie discrete di peso; un peso intermedio non avrebbe corrispondenza nella tabella.  
**Fonte**: [CODICE: `src/app/content/profilo/profilo.component.ts`]

### BR-05 — Storico Bevute Salvato su Cookie Locale, Scadenza 30gg
**Descrizione**: Ogni bevuta calcolata viene aggiunta all'array `bevute[]` del profilo utente, che è persistito su cookie con scadenza 30 giorni. Non viene mai trasmessa a server.  
**Fonte**: [CODICE: `src/app/_core/services/cookie-drunk.service.ts`], [README]

### BR-06 — Nessun Dato Utente Trasmesso a Server Esterno
**Descrizione**: L'applicazione non invia alcun dato utente (profilo, storico BAC, preferenze) a server esterni. Le uniche richieste HTTP sono per i file statici JSON (`tabella_alcolemica.json`, `sanzioni.json`, `config.json`) che non contengono dati personali.  
**Fonte**: [README] — "I dati collezionati dall'applicazione saranno salvati nei cookie della sessione utente e non sono salvati nei nostri datacenter."

### BR-07 — Disclaimer Obbligatorio
**Descrizione**: In ogni schermata che mostra un risultato BAC o una sanzione, deve essere visibile il disclaimer legale che avverte che i dati non sono attendibili e non sostituiscono strumenti ufficiali.  
**Fonte**: [README]

### BR-08 — Multi-Profilo Supportato, Un Solo Profilo Attivo per Volta
**Descrizione**: Possono esistere più profili sullo stesso dispositivo, ma uno solo può essere "selezionato" (attivo) per i calcoli. La selezione viene persistita nel cookie `profiloSelezionato`.  
**Fonte**: [CODICE: `src/app/_core/services/cookie-drunk.service.ts`] — `setProfiloSelezionato(id)` / `getProfiloSelezionato()`

---

## 4. Scenari Funzionali Principali

### SF-01: Primo Accesso con Creazione Profilo
1. Utente apre `/#/` → `InformativaGuard` → redirect `/#/informativa`
2. Utente legge e accetta informativa → `salvaInfo(true, true)`
3. Redirect `/#/` → `ProfiloGuard` → nessun utente → redirect `/#/profilo/0`
4. Utente compila: nome="Mario", sesso="M", peso=75kg
5. `setUser(nuovoUser)` → `setProfiloSelezionato(id)` → redirect `/#/`
6. `HomeComponent` carica tabella + sanzioni → `CalcoloAlcolemicoComponent` visibile

### SF-02: Calcolo BAC Completo
1. `HomeComponent` attivo con tabella e sanzioni caricati
2. Utente seleziona: 2 birre (500ml), 1 calice vino (125ml)
3. Utente indica: stomaco vuoto
4. Algoritmo: per ogni bevanda → filtra `dettaglioAlcolici[sesso=M][peso=75][stomaco=false]` → tasso × quantità
5. BAC totale = 0.82 g/L (esempio)
6. `salvaAndamento({data: now, grado: 0.82})`
7. `tassoOut` emesso → `RisultatoAlcolemicoComponent` mostra: "0.82 g/L — Fascia: 0.5-0.8 — Sanzione: patente sospesa..."
8. Disclaimer visibile sotto il risultato

### SF-03: Visualizzazione e Cancellazione Storico
1. Utente naviga a `/#/chart`
2. `ChartComponent` carica profilo attivo → estrae `bevute[]`
3. Grafico lineare renderizzato (ultimi 7gg di default)
4. Utente cambia filtro → 31gg → grafico aggiornato
5. Utente click "Cancella storico" → modale conferma
6. Conferma → `bevute[]` svuotato → grafico vuoto

---

## 5. Matrice di Tracciabilità RF ↔ Componente

| RF | Componente Principale | Servizio | Guard |
|---|---|---|---|
| RF-01 | `CookieComponent` | `CookieDrunkService` | `InformativaGuard` |
| RF-02 | `ProfiloComponent` | `CookieDrunkService` | `ProfiloGuard` |
| RF-03 | `ProfiliComponent` | `CookieDrunkService` | `ProfiloGuard` |
| RF-04 | `CalcoloAlcolemicoComponent` | `APIMFApiImplService`, `CookieDrunkService` | — |
| RF-05 | `CalcoloAlcolemicoComponent` | `APIMFApiImplService` | — |
| RF-06 | `CalcoloAlcolemicoComponent` | — | — |
| RF-07 | `RisultatoAlcolemicoComponent` | `APIMFApiImplService` | — |
| RF-08 | `CalcoloAlcolemicoComponent` | `CookieDrunkService` | — |
| RF-09 | `ChartComponent` | `CookieDrunkService` | — |
| RF-10 | `ChartComponent` | `CookieDrunkService` | — |
| RF-11 | `ProfiliComponent` | `CookieDrunkService` | — |
| RF-12 | `ProfiliComponent` | `CookieDrunkService`, `ModalDrunkService` | — |
| RF-13 | `FaqComponent` | — | — |
| RF-14 | `ContattiComponent` | — | — |
| RF-15 | `DrunkioPresentazioneComponent` | — | — |

---

## 6. Glossario Termini

| Termine | Definizione |
|---|---|
| **BAC** | Blood Alcohol Concentration — Tasso alcolemico nel sangue, espresso in g/L |
| **Lookup Table** | Tabella precompilata di valori BAC per combinazioni (bevanda, peso, sesso, stomaco) |
| **stomacoPieno** | Parametro booleano che indica se l'utente ha consumato cibo prima/durante il consumo di alcool. Lo stomaco pieno rallenta l'assorbimento. |
| **Profilo** | Insieme di dati personali (nome, sesso, peso) usati come parametri per il calcolo BAC |
| **Profilo attivo** | Il profilo selezionato come corrente per i calcoli BAC |
| **Bevuta** | Record `{data: Date, grado: number}` che rappresenta un calcolo BAC salvato nello storico |
| **Fascia sanzionatoria** | Intervallo `[min, max[` di BAC con associate sanzioni legali italiane ed effetti fisiologici |
| **PWA** | Progressive Web App — app web installabile con capacità offline |
| **Hash routing** | Modalità di routing Angular che usa `/#/` nell'URL per compatibilità con server statici |
| **InformativaGuard** | Guard Angular che impedisce accesso alle rotte principali senza consenso privacy |
| **ProfiloGuard** | Guard Angular che indirizza alla creazione/selezione profilo se necessario |

---

*Documento prodotto da analisi codebase. Versione: 1.0 — Data: 2025*
