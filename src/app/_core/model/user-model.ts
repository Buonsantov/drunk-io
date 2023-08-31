import { v4 as uuidv4 } from 'uuid';
export class User {
    constructor() {
        this.id = uuidv4();
    }

    id!: string;
    nome!: string;
    sesso!: 'M' | 'F';
    peso!: number;
    profiloSelezionato = false;
}
