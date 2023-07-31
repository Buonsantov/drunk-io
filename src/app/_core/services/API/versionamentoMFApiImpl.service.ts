import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from './configuration';
import { UtilsApiService } from '../utils-api.service';
import { ConfigService } from 'src/app/_core/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class VersionamentoMFApiImplService {
  protected basePathMF = this.configFile.getConfig().backendAPI.tagURL;
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    private utilsApiService: UtilsApiService,
    protected httpClient: HttpClient,
    private configFile: ConfigService,
  ) { }

  public recuperaTagUsingGET(
    observe?: 'body',
    reportProgress?: boolean
  ): any {
    const queryParameters = this.utilsApiService.setBaseQueryParameters();
    const headers = this.utilsApiService.setBaseHeaders(
      this.defaultHeaders,
      this.configuration,
      false
    );


    return this.httpClient.get<any>(`${this.basePathMF}`, {
      params: queryParameters,
      withCredentials: this.configuration.withCredentials,
      headers,
      observe,
      reportProgress,
    });
  }

}
