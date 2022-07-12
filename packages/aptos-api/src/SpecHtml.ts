/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { HttpClient, RequestParams } from "./http-client.js";

export class SpecHtml<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags general
   * @name GetSpecHtml
   * @summary API document
   * @request GET:/spec.html
   * @response `200` `void` Returns OpenAPI specification html document.
   * @response `400` `void` Bad Request
   */
  getSpecHtml = (params: RequestParams = {}) =>
    this.http.request<void, void>({
      path: `/spec.html`,
      method: "GET",
      ...params,
    });
}
