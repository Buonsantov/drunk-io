export class Config {
  project: string;
  isProd: boolean;
  backendAPI: any;

  constructor() {
    this.project = 'Drunk.io';
    this.isProd = false;
    this.backendAPI = {};
  }
}


