import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Config } from "../model/config";


@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config = new Config();
  constructor(
    private httpClient: HttpClient
  ) {
  }

  public init(): Promise<any> {
    const promise = this.httpClient.get<Config>(this.getPathApp(environment.configFile)).toPromise().then(
      async (data?: Config) => {
        if(data){
          this.config = data;
        }        

        if (environment.production) {
          window.console.log = () => { };
        }
      },
    );
    return promise;
  }


  getPathApp(path: string) {
    return (path);
  }

  public getConfig(): Config {
    return this.config;
  }
}
