import { v4 as uuidv4 } from 'uuid';
export class User {
    constructor() {
        this.id = uuidv4();
        this.bevute = [] as any;
    }

    id!: string;
    nome!: string;
    sesso!: 'M' | 'F';
    peso!: number;
    profiloSelezionato = false;
    bevute?: [{ data: Date, grado: number }];
}
