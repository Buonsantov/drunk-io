import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration } from './API/configuration';
import { ConfigService } from 'src/app/_core/services/config.service';
import { CustomHttpUrlEncodingCodec } from './API/encoder';

@Injectable({
  providedIn: 'root',
})
export class UtilsApiService {
  constructor(
    private configFile: ConfigService,
  ) { }

  setBaseQueryParameters() {
    const queryParameters = new HttpParams({
      encoder: new CustomHttpUrlEncodingCodec(),
    });
    return queryParameters;
  }

  setBaseHeaders(
    defaultHeaders: HttpHeaders,
    configuration: Configuration,
    contentType: boolean,
  ) {
    let headers = defaultHeaders;

    // to determine the Accept header
    const httpHeaderAccepts: string[] = ['*/*'];
    const httpHeaderAcceptSelected: string | undefined =
      configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected !== undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
      headers = headers.set('app', this.configFile.getConfig().project.toUpperCase());
    }

    if (contentType) {
      // to determine the Content-Type header
      const consumes: string[] = ['application/json'];
      const httpContentTypeSelected: string | undefined =
        configuration.selectHeaderContentType(consumes);
      if (httpContentTypeSelected !== undefined) {
        headers = headers.set('Content-Type', httpContentTypeSelected);
      }
    }

    return headers;
  }
}
