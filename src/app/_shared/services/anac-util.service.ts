import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class DrunkUtilService {

  constructor(
    private logger: NGXLogger,
  ) {
    this.logger.info('Util Service');
  }

  // clean the json
  purgeJson(elemento: any) {
    for (const key of Object.keys(elemento)) {
      if (
        (elemento[key] == null || elemento[key] === '') &&
        !Array.isArray(elemento[key])
      ) {
        delete elemento[key];
      }
      if (typeof elemento[key] === 'object') {
        if (Array.isArray(elemento[key])) {
          for (let elem of elemento[key]) {
            elem = this.purgeJson(elem);
          }

          const newArray = [];
          for (const elem of elemento[key]) {
            if ((elem === undefined || !elem) && !Array.isArray(elem)) {
            } else if (
              typeof elem === 'object' &&
              Object.keys(elem).length === 0 &&
              !Array.isArray(elem)
            ) {
            } else {
              newArray.push(elem);
            }
          }
          elemento[key] = [...newArray];
        } else if (elemento[key] && Object.keys(elemento[key]).length === 0) {
          delete elemento[key];
        } else {
          elemento[key] = this.purgeJson(elemento[key]);
          if (
            typeof elemento[key] === 'object' &&
            Object.keys(elemento[key]).length === 0
          ) {
            delete elemento[key];
          }
        }
      }
    }
    return elemento;
  }

  truncate(str: string, n: number) {
    if (!str) {
      return '';
    }
    if (!n) {
      n = 8;
    }
    return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
  }

  downloadFile(data: any, type: string, nomeFile: any) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', url);
    link.setAttribute('download', nomeFile);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

}
