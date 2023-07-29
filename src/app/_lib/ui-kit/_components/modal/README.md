# Modal

Componente che utilizza bootstrap italia personalizzato per Drunk utilizzato per aprire finestre modali per mostrare contenuti in evidenza, notifiche agli utenti, o contenuti personalizzati.

## Utilizzo

    Il modal e' un entry component.
    Per essere inizializzato:

    opzioniEsistenzaPratiche = new ModalOption();
    opzioniEsistenzaPratiche.closable = false;
    opzioniEsistenzaPratiche.header = header;
    opzioniEsistenzaPratiche.body = body;
    opzioniEsistenzaPratiche.buttons = ...;

    modalNotClosable: NgbModalOptions = { backdrop: 'static', keyboard: false, centered: true };
    subject = new Subject<boolean>();
    modal = this.modalService.open(GenericModalDrunkComponent, modalNotClosable);
    modal.componentInstance.options = opzioniEsistenzaPratiche;
    modal.componentInstance.subject = subject;

## Implementazione

    A questo componente e' affiancato un servizio che offre due funzioni: 
    
    @function() openModalGenerico(header, body, btnArray?) 
    @function() openModalErrore(body, btnArray?, noHome?)

    openModalGenerico -->
    
    @Input() header!: string --> titolo del modale
    @Input() body!: string   --> descrizione del modale
    @Input() btnArray?: any  --> set di bottoni che vogliamo nel modale, se non passato inserisce due bottoni 
    standard (annulla e continua)
    @Input() lang?: 'it-IT' | 'en-EN' -> lingua

    openModalErrore --> 
    
    @Input() body!: string   --> descrizione del modale
    @Input() btnArray?: any  --> set di bottoni che vogliamo nel modale, se non passato crea un bottone di reindirizzamento alla home (se noHome != null) 
    @Input() noHome?: any    --> se != null il bottone creato automaticamente reinderizza alla home  
    @Input() lang?: 'it-IT' | 'en-EN' -> lingua


    ModalOption{
        header: string;    --> titolo del modale
        closable: boolean; --> se chiudibile o meno
        body: string;      --> corpo del modale
        footer: string;    --> corpo del footer
        style?: {          
          width?: string;  
        };
        buttons: {         
          label: string;   --> nome del bottone
          route?: string;  --> routing del bottone
          style?: THEME_COLORS_ENUM;  --> colore del bottone
          functionBtn?: any;  --> funzione associata al bottone
          value?: boolean; --> subject.next
        }
    }

## Esempio

    constructor(
        private genericModalService: ModalDrunkService
    ) { }

    openModalCustom() {

    const funzioneConferma = async (): Promise<void> => {
        this.logMessage('funzione custom');
    };
    const customBtn = [];
    const btn = {
        label: UI_LABELS_Drunk.CHIUDI,
        route: null,
        style: THEME_COLORS_ENUM.PRIMARY_OUTLINE,
        functionBtn: null
    };
    const btn2 = {
        label: UI_LABELS_Drunk.CONFERMA,
        route: null,
        style: THEME_COLORS_ENUM.PRIMARY,
        functionBtn: funzioneConferma
    };
    customBtn.push(btn);
    customBtn.push(btn2);
    this.genericModalService.openModalGenerico('Generic Modal', 'Sei sicuro di voler chiudere la pagina?', customBtn);
    }


    logMessage(message: string) {
        console.log(message);
    }
