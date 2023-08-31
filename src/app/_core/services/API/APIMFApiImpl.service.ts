import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from './configuration';
import { UtilsApiService } from '../utils-api.service';
import { ConfigService } from 'src/app/_core/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class APIMFApiImplService {
  protected basePathMF = this.configFile.getConfig().backendAPI.apiBase;
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    private utilsApiService: UtilsApiService,
    protected httpClient: HttpClient,
    private configFile: ConfigService,
  ) { }

  public recuperaTabAlcolemicaUsingGET(
    observe?: 'body',
    reportProgress?: boolean
  ): any {
    const queryParameters = this.utilsApiService.setBaseQueryParameters();
    const headers = this.utilsApiService.setBaseHeaders(
      this.defaultHeaders,
      this.configuration,
      false
    );


    return this.httpClient.get<any>(`${this.basePathMF}/tabella_alcolemica.json`, {
      params: queryParameters,
      withCredentials: this.configuration.withCredentials,
      headers,
      observe,
      reportProgress,
    });
  }

  public recuperaSanzioniUsingGET(
    observe?: 'body',
    reportProgress?: boolean
  ): any {
    const queryParameters = this.utilsApiService.setBaseQueryParameters();
    const headers = this.utilsApiService.setBaseHeaders(
      this.defaultHeaders,
      this.configuration,
      false
    );


    return this.httpClient.get<any>(`${this.basePathMF}/sanzioni.json`, {
      params: queryParameters,
      withCredentials: this.configuration.withCredentials,
      headers,
      observe,
      reportProgress,
    });
  }

}
