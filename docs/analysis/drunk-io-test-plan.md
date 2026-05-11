# Piano di Test – drunk-io Angular App

**Versione:** 1.0  
**Data:** 2025  
**Autore:** Team QA / Copilot AI  
**Applicazione:** drunk-io — Calcolatore del Tasso Alcolemico

---

## 1. Obiettivo e Scope

### 1.1 Obiettivo
Il presente documento definisce il piano di test per l'applicazione Angular `drunk-io`, un'applicazione web che consente agli utenti di calcolare il proprio tasso alcolemico, gestire profili utente tramite cookie, visualizzare sanzioni e monitorare l'andamento nel tempo tramite grafici.

### 1.2 Scope
I test coprono le seguenti unità:
- **Servizi**: `CookieDrunkService`, `DrunkLibToastService`, `ModalDrunkService`, `APIMFApiImplService`, `VersionamentoMFApiImplService`, `ConfigService`, `UtilityService`
- **Componenti principali**: `AppComponent`, `HomeComponent`, `ProfiloComponent`, `ProfiliComponent`, `CookieComponent`, `ChartComponent`, `CalcoloAlcolemicoComponent`, `RisultatoAlcolemicoComponent`, `ContattiComponent`, `HeaderComponent`, `FooterComponent`
- **Componenti UI**: `DrunkLibToastsComponent`, `GenericModalDrunkComponent`, `GoUpButtonComponent`, `ContentComponent`, `DrunkioPresentazioneComponent`, `FaqComponent`
- **Guard**: `InformativaGuard`, `ProfiloGuard`

### 1.3 Fuori Scope
- Test end-to-end (E2E) con Cypress/Playwright
- Test di performance e load
- Test di compatibilità browser
- Test dell'integrazione reale con backend (mock-based only)

---

## 2. Strategia di Test

### 2.1 Framework e Strumenti
| Strumento | Versione | Ruolo |
|-----------|----------|-------|
| Jasmine | ~4.x | Framework di asserzioni |
| Karma | ~6.x | Test runner |
| Angular TestBed | 15.x | Infrastruttura DI per unit test |
| HttpClientTestingModule | 15.x | Mock richieste HTTP |
| RouterTestingModule | 15.x | Mock routing |
| NgbModule | ~14.x | Supporto componenti Bootstrap Angular |

### 2.2 Approccio
- **Mock-based**: tutte le dipendenze esterne (CookieService, HttpClient, Router, NgbModal) vengono sostituite con spy o stub
- **Test isolati**: ogni unità viene testata indipendentemente dal resto dell'applicazione
- **Coverage target**: >80% per statement, branch, function e line coverage
- **Async testing**: utilizzo di `fakeAsync/tick` o `async/await` con `fixture.whenStable()`

### 2.3 Convenzioni
- I file spec seguono la convenzione `[nome].component.spec.ts` / `[nome].service.spec.ts`
- Ogni `describe` corrisponde a una classe
- Ogni `it` corrisponde a un caso di test atomico
- I mock sono definiti in `beforeEach` per garantire isolamento tra i test

---

## 3. Test Case Dettagliati

### 3.1 CookieDrunkService

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-CS-01 | salvaInfo salva correttamente | CookieService spy configurato | Chiamare `salvaInfo(true, true)` | `cookieService.set('Informativa', ...)` chiamato con JSON corretto |
| TC-CS-02 | recuperaInfo quando cookie esiste | Cookie 'Informativa' presente | Chiamare `recuperaInfo()` | Ritorna oggetto parsato dal JSON |
| TC-CS-03 | recuperaInfo quando cookie assente | Nessun cookie 'Informativa' | Chiamare `recuperaInfo()` | Ritorna `{info:false, cookie:false}` |
| TC-CS-04 | setUser senza utenti esistenti | Nessun cookie 'Users' | Chiamare `setUser(user)` | Crea nuovo oggetto Users, chiama `setUsers` |
| TC-CS-05 | setUser con utente già esistente | Cookie 'Users' con utente stesso id | Chiamare `setUser(userModificato)` | Aggiorna utente nell'array |
| TC-CS-06 | getUser utente trovato | Cookie 'Users' con utenti | Chiamare `getUser(id)` | Ritorna utente corrispondente |
| TC-CS-07 | getUser utente non trovato | Cookie 'Users' con altri utenti | Chiamare `getUser(id_inesistente)` | Ritorna null/undefined |
| TC-CS-08 | getUsers con dati presenti | Cookie 'Users' presente | Chiamare `getUsers()` | Ritorna oggetto parsato |
| TC-CS-09 | getUsers senza cookie | Nessun cookie 'Users' | Chiamare `getUsers()` | Ritorna null |
| TC-CS-10 | getProfiloSelezionato trovato | Cookie con profilo selezionato=true | Chiamare `getProfiloSelezionato()` | Ritorna utente con profiloSelezionato=true |
| TC-CS-11 | getProfiloSelezionato senza utenti | Nessun cookie 'Users' | Chiamare `getProfiloSelezionato()` | Ritorna null |
| TC-CS-12 | setProfiloSelezionato | Cookie con utenti | Chiamare `setProfiloSelezionato(id)` | Imposta profiloSelezionato=true per l'utente |
| TC-CS-13 | deleteUser rimuove utente | Cookie con utenti | Chiamare `deleteUser(id)` | Utente rimosso dall'array |
| TC-CS-14 | deleteAllCookies | Qualsiasi stato | Chiamare `deleteAllCookies()` | `cookieService.deleteAll()` chiamato |
| TC-CS-15 | getValueUser ritorna observable | Servizio inizializzato | Chiamare `getValueUser()` | Ritorna Observable |
| TC-CS-16 | setValueUser emette valore | Observable sottoscritto | Chiamare `setValueUser(user)` | Observable emette user |
| TC-CS-17 | initUserExists con profilo selezionato | Cookie con profilo attivo | Costruzione servizio | `setValueUser` chiamato con utente selezionato |

### 3.2 CalcoloAlcolemicoComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-CA-01 | should create | TestBed configurato, tabella impostata | Creare componente | Istanza non nulla |
| TC-CA-02 | getInDrinks drink presente | drinkSelected contiene drink | Chiamare `getInDrinks(nome)` | Ritorna true |
| TC-CA-03 | getInDrinks drink assente | drinkSelected vuoto | Chiamare `getInDrinks(nome)` | Ritorna false |
| TC-CA-04 | aggiungi incrementa num | drinkSelected con drink num=1 | Chiamare `aggiungi(nome)` | num diventa 2 |
| TC-CA-05 | togli decrementa num > 1 | drinkSelected con drink num=2 | Chiamare `togli(nome)` | num diventa 1 |
| TC-CA-06 | togli non decrementa sotto 1 | drinkSelected con drink num=1 | Chiamare `togli(nome)` | num rimane 1 |
| TC-CA-07 | cancella rimuove drink | drinkSelected con drink | Chiamare `cancella(id)` | Drink rimosso da drinkSelected |
| TC-CA-08 | selectDrink aggiunge drink | drinkSelected vuoto | Chiamare `selectDrink(event)` | Drink aggiunto con num=1 |
| TC-CA-09 | calcolo emette tassoOut | drinkSelected configurato, utente mock | Chiamare `calcolo()` | `tassoOut.emit` chiamato con valore numerico |
| TC-CA-10 | salvaAndamento salva su cookie | Utente mock con bevute | Chiamare `salvaAndamento(0.5)` | `cookieDrunkService.setUser` chiamato |

### 3.3 RisultatoAlcolemicoComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-RA-01 | should create | tabella e tasso impostati | Creare componente | Istanza non nulla |
| TC-RA-02 | trim(0.255) → '0.25' | - | Chiamare `trim(0.255)` | Ritorna '0.25' |
| TC-RA-03 | trim(0) → '0.00' | - | Chiamare `trim(0)` | Ritorna '0.00' |
| TC-RA-04 | trim(null) → '' | - | Chiamare `trim(null)` | Ritorna '' |
| TC-RA-05 | retriveCalcolo tasso in range | tabella=[{min:0,max:0.5}], tasso=0.3 | `ngOnInit()` | `this.result` impostato con elemento corrispondente |
| TC-RA-06 | retriveCalcolo tasso fuori range | tabella=[{min:0,max:0.5}], tasso=1.0 | `ngOnInit()` | `this.result` non impostato |
| TC-RA-07 | backCalcolo emette true | - | Chiamare `backCalcolo()` | `back.emit(true)` chiamato |

### 3.4 HomeComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-HO-01 | should create | Servizi mockati | Creare componente | Istanza non nulla |
| TC-HO-02 | recuperaAPI successo | API spy ritornano of(data) | `ngOnInit()` | tabella/sanzioni impostati, mostraCalcolo=true |
| TC-HO-03 | recuperaAPI errore | API spy ritornano throwError | `ngOnInit()` | `alertToast` chiamato |
| TC-HO-04 | handleRisultato(true) | - | Chiamare `handleRisultato(true)` | tasso=null, mostraCalcolo=true |
| TC-HO-05 | handleTasso(0.5) | - | Chiamare `handleTasso(0.5)` | mostraCalcolo=false, tasso=0.5 |

### 3.5 ProfiloComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-PF-01 | should create | Route spy id='0' | Creare componente | Istanza non nulla |
| TC-PF-02 | getSesso utente con sesso | user.sesso='M' | Chiamare `getSesso()` | Ritorna false |
| TC-PF-03 | getSesso utente senza sesso | user.sesso=undefined | Chiamare `getSesso()` | Ritorna true |
| TC-PF-04 | handlerChangeSesso('M') | user inizializzato | Chiamare `handlerChangeSesso('M')` | pesi=pesoM, user.peso=null |
| TC-PF-05 | handlerChangeSesso('F') | user inizializzato | Chiamare `handlerChangeSesso('F')` | pesi=pesoF, user.peso=null |
| TC-PF-06 | handlerChangeSesso('X') | user inizializzato | Chiamare `handlerChangeSesso('X')` | pesi=[], user.peso=null |
| TC-PF-07 | chackUser id='0' → new User | route param='0' | `ngOnInit()` | modify=false, user=new User() |
| TC-PF-08 | chackUser id esistente → cookie | route param='abc', cookie spy | `ngOnInit()` | modify=true, user caricato da cookie |

### 3.6 ProfiliComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-PI-01 | should create | Servizi mockati | Creare componente | Istanza non nulla |
| TC-PI-02 | getProfili imposta profili | Cookie spy ritorna utenti | `ngOnInit()` | `this.profili` impostato |
| TC-PI-03 | getSesso('M') → 'Uomo' | - | Chiamare `getSesso('M')` | Ritorna 'Uomo' |
| TC-PI-04 | getSesso('F') → 'Donna' | - | Chiamare `getSesso('F')` | Ritorna 'Donna' |
| TC-PI-05 | profiloSelezionato con profilo | getProfiloSelezionato ritorna user | Chiamare `profiloSelezionato()` | Ritorna false |
| TC-PI-06 | selezionaProfilo | setProfiloSelezionato spy | Chiamare `selezionaProfilo(id)` | setProfiloSelezionato chiamato, toast, navigate('/') |

### 3.7 CookieComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-CO-01 | should create | recuperaInfo spy | Creare componente | Istanza non nulla, info/cookie impostati |
| TC-CO-02 | accetta info=false | info=false, cookie=true | Chiamare `accetta()` | alertToast chiamato per informativa |
| TC-CO-03 | accetta cookie=false | info=true, cookie=false | Chiamare `accetta()` | alertToast chiamato per cookie |
| TC-CO-04 | accetta entrambi=true | info=true, cookie=true | Chiamare `accetta()` | router.navigate(['/']) chiamato |

### 3.8 ChartComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-CH-01 | should create | Chart.js mockato, lineChartMethod stubbed | Creare componente | Istanza non nulla |
| TC-CH-02 | numDaysBetween calcolo corretto | Due date distanti 2 giorni | Chiamare `numDaysBetween(d1, d2)` | Ritorna valore ~2 |
| TC-CH-03 | calcolaGrafico imposta visualizza | lineChartMethod stubbed | Chiamare `calcolaGrafico()` | visualizza=true dopo chiamata |
| TC-CH-04 | confermaCancella pulisce bevute | Utente mock, lineChart mock | Chiamare `confermaCancella()` | setUser chiamato, bevute=[], toast chiamato |

### 3.9 ContattiComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-CT-01 | should create | FormsModule, toast spy | Creare componente | Istanza non nulla |
| TC-CT-02 | reset pulisce campi | Campi valorizzati | Chiamare `reset()` | fromMail='', subject='', body='' |
| TC-CT-03 | sendMail form invalido | form.valid=false | Chiamare `sendMail()` | alertToast chiamato |

### 3.10 HeaderComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-HE-01 | should create | CookieDrunkService spy, RouterTestingModule | Creare componente | Istanza non nulla |
| TC-HE-02 | checkUserSelezionato sottoscrive | getValueUser ritorna of(user) | `ngOnInit()` | `this.user` impostato con utente |

### 3.11 FooterComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-FO-01 | should create | VersionamentoMFApiImplService spy | Creare componente | Istanza non nulla |
| TC-FO-02 | getData imposta version | recuperaTagUsingGET ritorna {tag:'1.0'} | Costruttore | `this.version='1.0'` |

### 3.12 DrunkLibToastsComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-TT-01 | should create | NgbModule, DrunkLibToastService | Creare componente | Istanza non nulla |
| TC-TT-02 | isTemplate stringa → false | - | Chiamare `isTemplate({textOrTpl:'testo'})` | Ritorna false |

### 3.13 GenericModalDrunkComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-GM-01 | should create | RouterTestingModule, NgbModal spy | Creare componente | Istanza non nulla |
| TC-GM-02 | action chiude modal | bsModalRef spy | Chiamare `action(true)` | `dismissAll` chiamato |

### 3.14 GoUpButtonComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-GU-01 | should create | UtilityService spy randomNumber | Creare componente | Istanza non nulla |
| TC-GU-02 | topFunction chiama scrollTo | window.scrollTo spy | Chiamare `topFunction()` | `window.scrollTo` chiamato |

### 3.15 AppComponent

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-AP-01 | should create | ConfigService mock, RouterTestingModule | Creare componente | Istanza non nulla |

### 3.16 InformativaGuard

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-IG-01 | canActivate cookie+info=true | recuperaInfo={info:true,cookie:true} | `canActivate()` | Ritorna true |
| TC-IG-02 | canActivate cookie+info=false | recuperaInfo={info:false,cookie:false} | `canActivate()` | navigate('/informativa'), ritorna false |

### 3.17 ProfiloGuard

| ID | Nome | Precondizioni | Azioni | Risultato Atteso |
|----|------|---------------|--------|-----------------|
| TC-PG-01 | canActivate nessun utente | getUsers=null | `canActivate()` | navigate('/profilo/0'), ritorna true |
| TC-PG-02 | canActivate utenti senza profilo | getUsers con utenti, getProfiloSelezionato=null | `canActivate()` | navigate('/profili'), ritorna true |
| TC-PG-03 | canActivate utenti con profilo | getUsers con utenti, profilo selezionato | `canActivate()` | Ritorna true |

---

## 4. Matrice di Tracciabilità

| ID Test | Requisito | Componente/Servizio |
|---------|-----------|---------------------|
| TC-CS-01, TC-CS-02, TC-CS-03 | RF-01 | CookieDrunkService |
| TC-CS-04, TC-CS-05, TC-CS-06, TC-CS-07, TC-CS-08, TC-CS-09 | RF-02 | CookieDrunkService |
| TC-CS-10, TC-CS-11, TC-CS-12, TC-PI-05, TC-PI-06 | RF-03 | CookieDrunkService, ProfiliComponent |
| TC-CS-13, TC-CS-14, TC-CH-04 | RF-04 | CookieDrunkService, ChartComponent |
| TC-CA-09, TC-CA-10 | RF-05 | CalcoloAlcolemicoComponent |
| TC-CA-10, TC-CH-03 | RF-06 | CalcoloAlcolemicoComponent |
| TC-RA-01, TC-RA-05, TC-RA-06, TC-RA-07 | RF-07 | RisultatoAlcolemicoComponent |
| TC-IG-01, TC-IG-02 | RF-08 | InformativaGuard |
| TC-PG-01, TC-PG-02, TC-PG-03 | RF-09 | ProfiloGuard |
| TC-HO-02 | RF-10 | HomeComponent |
| TC-HO-03 | RF-11 | HomeComponent |
| TC-CH-01, TC-CH-02, TC-CH-03, TC-CH-04 | RF-12 | ChartComponent |
| TC-CT-03 | RF-13 | ContattiComponent |
| TC-CO-04, TC-FO-02 | RF-14 | CookieComponent, FooterComponent |
| TC-TT-01, TC-TT-02 | RF-15 | DrunkLibToastsComponent |

### Legenda Requisiti Funzionali
| ID | Descrizione |
|----|-------------|
| RF-01 | Salvataggio e lettura cookie informativa |
| RF-02 | Gestione multi-utente tramite cookie |
| RF-03 | Selezione profilo attivo |
| RF-04 | Cancellazione profilo/dati |
| RF-05 | Calcolo tasso alcolemico |
| RF-06 | Salvataggio andamento bevute |
| RF-07 | Visualizzazione risultato alcolemico con sanzioni |
| RF-08 | Navigazione con guard informativa |
| RF-09 | Navigazione con guard profilo |
| RF-10 | Recupero dati da API (tabella alcoolemica + sanzioni) |
| RF-11 | Gestione errori API |
| RF-12 | Visualizzazione grafico andamento |
| RF-13 | Invio email contatti |
| RF-14 | Download PDF tabella alcoolemica |
| RF-15 | Notifiche toast (successo/errore) |

---

## 5. Gap e Raccomandazioni

### 5.1 Gap Identificati
1. **Guard spec mancanti**: `InformativaGuard` e `ProfiloGuard` non hanno file spec — raccomandato crearli.
2. **Chart.js mocking**: `ChartComponent` richiede mock di `Chart` globale o stub di `lineChartMethod` per evitare errori DOM.
3. **Email.send globale**: `ContattiComponent.sendMail()` dipende da `declare let Email: any` (libreria esterna) — necessario stub globale nei test.
4. **window.scrollTo**: deve essere stubbed in `CalcoloAlcolemicoComponent` e `RisultatoAlcolemicoComponent` per evitare errori nel costruttore/ngOnInit.
5. **ConfigService.init()**: carica config via HTTP — mockare con `useValue` per evitare chiamate reali.

### 5.2 Raccomandazioni
1. Aggiungere `coverageReporter` in `karma.conf.js` per monitorare coverage obiettivo >80%.
2. Considerare test di integrazione leggeri con `HttpClientTestingModule` e `HttpTestingController` per verificare la costruzione delle URL API.
3. Separare i test di `CookieDrunkService` in un file dedicato con setup/teardown per i cookie.
4. Introdurre factory functions per i mock utente (`createMockUser()`) per ridurre la duplicazione.
5. Documentare in Italiano i blocchi `describe` e `it` per allineamento con gli standard del progetto.
