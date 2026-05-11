# drunk-io — System Architecture

> **Versione**: 1.0  
> **Data**: 2025  
> **Scope**: Frontend-only SPA Angular 15  
> **Riferimento**: `docs/architecture/drunk-io-domain-model.md`, `docs/requirements/drunk-io-codebase-baseline.md`

---

## 1. Executive Summary

**drunk-io** è una **SPA (Single Page Application) monolitica Angular 15** con le seguenti caratteristiche architetturali:

- **Routing**: hash-based (`useHash: true`) per compatibilità nginx
- **Storage**: cookie browser come unico layer di persistenza (ngx-cookie-service, 30gg TTL)
- **Dati di riferimento**: file JSON statici (`tabella_alcolemica.json`, `sanzioni.json`) serviti da nginx
- **Stato in-app**: BehaviorSubject reattivo in `CookieDrunkService`
- **Configurazione runtime**: `config.json` caricato tramite `APP_INITIALIZER` prima del bootstrap
- **Deploy**: Docker container con nginx — containerizzabile per K8s
- **PWA**: service worker Angular per caching e installabilità offline
- **Nessun backend**: zero endpoint API con logica server-side

[CODICE: `src/app/app-routing.module.ts`], [CODICE: `src/app/_core/services/config.service.ts`]

---

## 2. Inventario Componenti e Moduli

### 2.1 Moduli Angular

| Modulo | Tipo | Responsabilità |
|---|---|---|
| `AppModule` | Root | Bootstrap, routing globale, provider APP_INITIALIZER |
| `ContentModule` | Feature | Layout principale con router-outlet figlio, guard InformativaGuard |
| `HomeModule` | Feature (lazy) | Calcolo BAC, visualizzazione risultato |
| `ProfiloModule` | Feature (lazy) | Creazione/modifica profilo |
| `ProfiliModule` | Feature (lazy) | Lista e selezione profili |
| `ChartModule` | Feature (lazy) | Grafico storico BAC |
| `CookieModule` | Feature | Informativa cookie/privacy |
| `FaqModule` | Feature | FAQ statiche |
| `ContattiModule` | Feature | Pagina contatti |
| `DrunkioPresentazioneModule` | Feature | Landing/presentazione |
| `_CoreModule` | Core | Servizi singleton (CookieDrunkService, APIMFApiImplService, ConfigService), guard, modelli |
| `_LibModule` | Shared | Toast service, Modal service, THEME_COLORS_ENUM |

### 2.2 Servizi Applicativi

| Servizio | Pattern | Scope |
|---|---|---|
| `CookieDrunkService` | Singleton + BehaviorSubject | Root (providedIn: 'root') |
| `APIMFApiImplService` | Singleton HTTP | Root |
| `ConfigService` | Singleton + APP_INITIALIZER | Root |
| `DrunkLibToastService` | Utility | Root |
| `ModalDrunkService` | Utility | Root |

### 2.3 Guards

| Guard | Tipo | Protegge |
|---|---|---|
| `InformativaGuard` | CanActivate | `ContentComponent` e tutto il sotto-albero di routing |
| `ProfiloGuard` | CanActivate | `HomeComponent` |

---

## 3. Stile Architetturale

### 3.1 SPA Monolitica con Feature Modules
L'app segue il pattern **Feature Module** di Angular: ogni funzionalità è racchiusa in un modulo dedicato con i propri componenti, routing e dipendenze. I servizi condivisi risiedono nel `_CoreModule`.

### 3.2 Smart/Dumb Components
- **Smart Components** (es. `HomeComponent`): conoscono i servizi, orchestrano i dumb components, gestiscono lo stato
- **Dumb Components** (es. `CalcoloAlcolemicoComponent`, `RisultatoAlcolemicoComponent`): ricevono dati via `@Input` ed emettono eventi via `@Output`

### 3.3 Gestione Stato
```
Cookie (persistenza 30gg)
    ↕ ngx-cookie-service
CookieDrunkService
    ↕ BehaviorSubject<User|null>
Componenti Angular (async pipe / subscribe)
```

Nessuno stato globale centralizzato (no NgRx, no Akita). La semplicità del dominio giustifica questa scelta.

### 3.4 Data Flow
```
JSON Statici (nginx)
    → APIMFApiImplService (HTTP GET)
    → HomeComponent (smart)
    → CalcoloAlcolemicoComponent (@Input tabella)
    → [Utente interagisce]
    → Algoritmo BAC (lookup + somma)
    → CookieDrunkService.salvaAndamento()
    → Cookie 'users' aggiornato
    → tassoOut (@Output EventEmitter)
    → HomeComponent mostra RisultatoAlcolemicoComponent
    → RisultatoAlcolemicoComponent (@Input tasso, sanzioni)
```

---

## 4. Deployment

### 4.1 Struttura Container

```
Docker Image: drunk-io
└── Base Image: nginx:alpine
    └── /usr/share/nginx/html/
        ├── index.html             (entry point SPA Angular)
        ├── main.*.js              (bundle applicazione)
        ├── polyfills.*.js
        ├── styles.*.css
        ├── ngsw.json              (service worker manifest)
        ├── ngsw-worker.js         (service worker)
        ├── config.json            (configurazione runtime — montabile come ConfigMap)
        ├── assets/
        │   ├── tabella_alcolemica.json
        │   └── sanzioni.json
        └── nginx.conf             (configurazione nginx)
```

### 4.2 Configurazione nginx
- Serve la SPA Angular in modalità hash routing (nessuna configurazione `try_files` necessaria)
- Gestisce le richieste agli asset statici JSON
- Headers CORS e CSP configurabili

### 4.3 Configurazione Runtime (config.json)
```json
{
  "project": "Drunk.io",
  "isProd": true,
  "backendAPI": {
    "apiBase": "/assets"
  }
}
```
Il file può essere montato come **ConfigMap Kubernetes** per differenziare ambienti senza rebuild.

### 4.4 Pattern K8s Consigliato
- **entrypoint.sh** + env vars da ConfigMap/Secret (per produzione con eventuali segreti)
- ConfigMap volume mount per `config.json` (per configurazione non-secret)

---

## 5. Flussi Critici

### 5.1 Flusso Accettazione Informativa

```mermaid
sequenceDiagram
    actor U as Utente
    participant R as Angular Router
    participant IG as InformativaGuard
    participant CS as CookieDrunkService
    participant CK as CookieComponent

    U->>R: Naviga su /#/
    R->>IG: canActivate()
    IG->>CS: recuperaInfo()
    CS-->>IG: {info: false, cookie: false}
    IG-->>R: redirect /#/informativa
    R->>CK: Mostra CookieComponent
    U->>CK: Accetta informativa
    CK->>CS: salvaInfo(true, true)
    CK->>R: navigate /#/
    R->>IG: canActivate()
    IG->>CS: recuperaInfo()
    CS-->>IG: {info: true, cookie: true}
    IG-->>R: true (accesso consentito)
```

### 5.2 Flusso Selezione/Creazione Profilo

```mermaid
sequenceDiagram
    actor U as Utente
    participant R as Angular Router
    participant PG as ProfiloGuard
    participant CS as CookieDrunkService
    participant PR as ProfiloComponent
    participant PL as ProfiliComponent

    R->>PG: canActivate() per /#/
    PG->>CS: getUsers()
    alt Nessun utente
        CS-->>PG: []
        PG-->>R: redirect /#/profilo/0
        R->>PR: ProfiloComponent (id=0, creazione)
        U->>PR: Inserisce nome, sesso, peso
        PR->>CS: setUser(nuovoUser)
        PR->>CS: setProfiloSelezionato(id)
        PR->>R: navigate /#/
    else Utenti presenti, nessuno selezionato
        CS-->>PG: [users...]
        PG->>CS: getProfiloSelezionato()
        CS-->>PG: null
        PG-->>R: redirect /#/profili
        R->>PL: ProfiliComponent
        U->>PL: Seleziona profilo
        PL->>CS: setProfiloSelezionato(id)
        PL->>R: navigate /#/
    else Profilo selezionato
        PG-->>R: true
    end
```

### 5.3 Flusso Calcolo BAC

```mermaid
sequenceDiagram
    actor U as Utente
    participant H as HomeComponent
    participant API as APIMFApiImplService
    participant CA as CalcoloAlcolemicoComponent
    participant RA as RisultatoAlcolemicoComponent
    participant CS as CookieDrunkService

    H->>API: recuperaTabAlcolemicaUsingGET()
    API-->>H: TabellaAlcolemica[]
    H->>API: recuperaSanzioniUsingGET()
    API-->>H: Pena[]
    H->>CA: @Input tabella, show=true
    U->>CA: Seleziona bevande, quantità, stomaco
    CA->>CA: Calcola BAC (lookup + somma)
    U->>CA: Conferma calcolo
    CA->>CS: salvaAndamento(bevuta)
    CA-->>H: @Output tassoOut(tasso)
    H->>RA: @Input tasso, tabella(sanzioni)
    RA->>RA: Filtra sanzione (min ≤ tasso < max)
    RA-->>U: Mostra risultato + sanzioni
```

### 5.4 Flusso Visualizzazione Storico

```mermaid
sequenceDiagram
    actor U as Utente
    participant CH as ChartComponent
    participant CS as CookieDrunkService

    U->>CH: Naviga su /#/chart
    CH->>CS: getProfiloSelezionato()
    CS-->>CH: User (profilo attivo)
    CH->>CH: Filtra bevute[] (7gg o 31gg)
    CH->>CH: Renderizza grafico lineare (Chart.js)
    alt Utente cancella storico
        U->>CH: Click "Cancella storico"
        CH->>CS: updateUser({...user, bevute: []})
        CH->>CH: Re-render grafico (vuoto)
    else Utente cambia filtro
        U->>CH: Toggle 7gg/31gg
        CH->>CH: Re-filtra e re-render
    end
```

---

## 6. Diagramma C4 — Context Level

```mermaid
C4Context
    title Sistema drunk-io — Context Level

    Person(utente, "Utente", "Consumatore di alcool che vuole stimare il proprio BAC")

    System(drunkio, "drunk-io PWA", "Progressive Web App Angular 15 per stima BAC e informazione sui rischi alcool")

    System_Ext(browser_cookie, "Browser Cookie Storage", "Persistenza dati profilo e storico (locale, no server)")
    System_Ext(nginx, "nginx (Container)", "Serve SPA + file JSON statici")

    Rel(utente, drunkio, "Usa via browser / PWA installata")
    Rel(drunkio, browser_cookie, "Legge/scrive profili e storico BAC")
    Rel(drunkio, nginx, "HTTP GET config.json, tabella_alcolemica.json, sanzioni.json")
```

---

## 7. Diagramma Componenti

```mermaid
graph TD
    subgraph Router["Angular Router (Hash)"]
        R_ROOT["/#/"]
        R_INFO["/#/informativa"]
        R_FAQ["/#/faq"]
        R_CONT["/#/contatti"]
        R_PROFILO["/#/profilo/:id"]
        R_PROFILI["/#/profili"]
        R_CHART["/#/chart"]
    end

    subgraph Guards["Guards"]
        IG[InformativaGuard]
        PG[ProfiloGuard]
    end

    subgraph Components["Componenti"]
        CONTENT[ContentComponent]
        HOME[HomeComponent]
        CALCOLO[CalcoloAlcolemicoComponent]
        RISULTATO[RisultatoAlcolemicoComponent]
        PROFILO[ProfiloComponent]
        PROFILI[ProfiliComponent]
        CHART[ChartComponent]
        COOKIE[CookieComponent]
        FAQ[FaqComponent]
        CONTATTI[ContattiComponent]
        PRES[DrunkioPresentazioneComponent]
    end

    subgraph Services["Servizi Core"]
        CS[CookieDrunkService<br/>BehaviorSubject]
        API[APIMFApiImplService]
        CFG[ConfigService]
        TOAST[DrunkLibToastService]
        MODAL[ModalDrunkService]
    end

    subgraph Storage["Storage"]
        COOKIE_S[(Cookie Browser)]
        JSON_TAB[(tabella_alcolemica.json)]
        JSON_SAN[(sanzioni.json)]
        JSON_CONF[(config.json)]
    end

    R_ROOT --> IG --> CONTENT --> PG --> HOME
    HOME --> CALCOLO
    HOME --> RISULTATO
    R_INFO --> COOKIE
    R_FAQ --> FAQ
    R_CONT --> CONTATTI
    R_PROFILO --> PROFILO
    R_PROFILI --> PROFILI
    R_CHART --> CHART

    HOME --> API
    API --> JSON_TAB
    API --> JSON_SAN
    CFG --> JSON_CONF

    CALCOLO --> CS
    PROFILO --> CS
    PROFILI --> CS
    CHART --> CS
    COOKIE --> CS
    CS --> COOKIE_S
```

---

## 8. Diagramma Deployment

```mermaid
graph TD
    subgraph K8s_Cluster["Kubernetes Cluster (opzionale)"]
        subgraph Pod["Pod: drunk-io"]
            subgraph Container["Container: nginx:alpine"]
                NGINX[nginx process]
                SPA[Angular SPA<br/>main.js, styles.css, index.html]
                SW[Service Worker<br/>ngsw-worker.js]
                CONF[config.json<br/>montato da ConfigMap]
                ASSETS[assets/<br/>tabella_alcolemica.json<br/>sanzioni.json]
            end
        end
        CM[ConfigMap<br/>config.json]
    end

    subgraph User_Device["Dispositivo Utente"]
        BROWSER[Browser / PWA]
        COOKIE_STORE[(Cookie Storage<br/>locale)]
        SW_CACHE[(Service Worker Cache<br/>offline assets)]
    end

    CM -->|volume mount| CONF
    BROWSER -->|HTTPS GET| NGINX
    NGINX -->|serve| SPA
    NGINX -->|serve| ASSETS
    NGINX -->|serve| CONF
    BROWSER -->|installa SW| SW
    SW -->|cache| SW_CACHE
    SPA -->|legge/scrive| COOKIE_STORE
```

---

## 9. Cross-Cutting Concerns

### 9.1 Accessibilità (WCAG 2.1 AA)
- **Obbligatoria** per tutti i componenti
- Bootstrap Italia 2.6.1 fornisce componenti già parzialmente conformi
- Richiede audit manuale per: focus management nelle navigazioni programmatiche, labels ARIA su form, contrasto colori tema personalizzato
- `DrunkLibToastService` e `ModalDrunkService` devono gestire l'accessibilità delle notifiche dinamiche (live regions ARIA)

### 9.2 Privacy-by-Design
- Zero dati trasmessi a server esterni [README]
- Cookie con scadenza 30gg
- `deleteAllCookies()` per diritto all'oblio
- Nessun tracker, nessuna analytics

### 9.3 PWA
- Service worker Angular (`@angular/service-worker`)
- `ngsw-config.json` definisce strategia caching
- App installabile su mobile e desktop
- Funzionamento offline dopo primo caricamento

### 9.4 Disclaimer Legale
- Visibile in ogni schermata di calcolo e risultato
- Obbligatorio per conformità all'uso responsabile dell'app

---

*Documento prodotto da analisi codebase. Versione: 1.0 — Data: 2025*
