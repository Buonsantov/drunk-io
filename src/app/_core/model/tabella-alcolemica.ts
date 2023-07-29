import { DettaglioAlcolici } from './dettaglio-alcolici';

export class TabellaAlcolemica {
    nome!: string;
    dettaglioAlcolici!: Array<DettaglioAlcolici>;
    gradazione!: number;
}
