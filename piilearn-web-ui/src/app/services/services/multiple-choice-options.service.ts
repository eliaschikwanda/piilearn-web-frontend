/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { createMcqOption } from '../fn/multiple-choice-options/create-mcq-option';
import { CreateMcqOption$Params } from '../fn/multiple-choice-options/create-mcq-option';

@Injectable({ providedIn: 'root' })
export class MultipleChoiceOptionsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `createMcqOption()` */
  static readonly CreateMcqOptionPath = '/mcq-options';

  /**
   * Create a new multiple choice option.
   *
   * Create a new multiple choice option.
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `createMcqOption()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createMcqOption$Response(params: CreateMcqOption$Params, context?: HttpContext): Observable<StrictHttpResponse<number>> {
    return createMcqOption(this.http, this.rootUrl, params, context);
  }

  /**
   * Create a new multiple choice option.
   *
   * Create a new multiple choice option.
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `createMcqOption$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  createMcqOption(params: CreateMcqOption$Params, context?: HttpContext): Observable<number> {
    return this.createMcqOption$Response(params, context).pipe(
      map((r: StrictHttpResponse<number>): number => r.body)
    );
  }

}
