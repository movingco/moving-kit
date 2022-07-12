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

import {
  Account,
  AccountResource,
  Address,
  AptosError,
  Event,
  GetAccountModuleParams,
  GetAccountModulesParams,
  GetAccountResourceParams,
  GetAccountResourcesParams,
  GetAccountTransactionsParams,
  GetEventsByEventHandleParams,
  MoveModule,
  OnChainTransaction,
} from "./data-contracts.js";
import { HttpClient, RequestParams } from "./http-client.js";

export class Accounts<SecurityDataType = unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @tags accounts, state
   * @name GetAccount
   * @summary Get account
   * @request GET:/accounts/{address}
   * @response `200` `Account` Returns the latest account core data resource.
   * @response `400` `(AptosError)`
   * @response `404` `(AptosError)`
   * @response `500` `(AptosError)`
   */
  getAccount = (address: Address, params: RequestParams = {}) =>
    this.http.request<Account, AptosError>({
      path: `/accounts/${address}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts, state
   * @name GetAccountResources
   * @summary Get account resources
   * @request GET:/accounts/{address}/resources
   * @response `200` `(AccountResource)[]` This API returns account resources for a specific ledger version (AKA transaction version). If not present, the latest version is used. The Aptos nodes prune account state history, via a configurable time window (link). If the requested data has been pruned, the server responds with a 404
   * @response `400` `(AptosError)`
   * @response `404` `(AptosError)`
   * @response `500` `(AptosError)`
   */
  getAccountResources = (
    { address, ...query }: GetAccountResourcesParams,
    params: RequestParams = {}
  ) =>
    this.http.request<AccountResource[], AptosError>({
      path: `/accounts/${address}/resources`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * @description This API renders a resource identified by the owner account `address` and the `resource_type`, at a ledger version (AKA transaction version) specified as a query param, otherwise the latest version is used.
   *
   * @tags accounts, state
   * @name GetAccountResource
   * @summary Get resource by account address and resource type.
   * @request GET:/accounts/{address}/resource/{resource_type}
   * @response `200` `AccountResource` Returns a resource.
   * @response `400` `(AptosError)`
   * @response `404` `(AptosError)`
   * @response `500` `(AptosError)`
   */
  getAccountResource = (
    { address, resourceType, ...query }: GetAccountResourceParams,
    params: RequestParams = {}
  ) =>
    this.http.request<AccountResource, AptosError>({
      path: `/accounts/${address}/resource/${resourceType}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags accounts, state
   * @name GetAccountModules
   * @summary Get account modules
   * @request GET:/accounts/{address}/modules
   * @response `200` `(MoveModule)[]` This API returns account modules for a specific ledger version (AKA transaction version). If not present, the latest version is used. The Aptos nodes prune account state history, via a configurable time window (link). If the requested data has been pruned, the server responds with a 404
   * @response `400` `(AptosError)`
   * @response `404` `(AptosError)`
   * @response `500` `(AptosError)`
   */
  getAccountModules = (
    { address, ...query }: GetAccountModulesParams,
    params: RequestParams = {}
  ) =>
    this.http.request<MoveModule[], AptosError>({
      path: `/accounts/${address}/modules`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * @description This API renders a Move module identified by the module id. A module id consists of the module owner `address` and the `module_name`. The module is rendered at a ledger version (AKA transaction version) specified as a query param, otherwise the latest version is used.
   *
   * @tags accounts, state
   * @name GetAccountModule
   * @summary Get module by module id.
   * @request GET:/accounts/{address}/module/{module_name}
   * @response `200` `MoveModule` Returns a move module.
   * @response `400` `(AptosError)`
   * @response `404` `(AptosError)`
   * @response `500` `(AptosError)`
   */
  getAccountModule = (
    { address, moduleName, ...query }: GetAccountModuleParams,
    params: RequestParams = {}
  ) =>
    this.http.request<MoveModule, AptosError>({
      path: `/accounts/${address}/module/${moduleName}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags transactions
   * @name GetAccountTransactions
   * @summary Get account transactions
   * @request GET:/accounts/{address}/transactions
   * @response `200` `(OnChainTransaction)[]` Returns on-chain transactions, paginated.
   * @response `400` `(AptosError)`
   * @response `500` `(AptosError)`
   */
  getAccountTransactions = (
    { address, ...query }: GetAccountTransactionsParams,
    params: RequestParams = {}
  ) =>
    this.http.request<OnChainTransaction[], AptosError>({
      path: `/accounts/${address}/transactions`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * @description This API extracts event key from the account resource identified by the `event_handle_struct` and `field_name`, then returns events identified by the event key.
   *
   * @tags events
   * @name GetEventsByEventHandle
   * @summary Get events by event handle
   * @request GET:/accounts/{address}/events/{event_handle_struct}/{field_name}
   * @response `200` `(Event)[]` Returns events
   * @response `400` `(AptosError)`
   * @response `404` `(AptosError)`
   * @response `500` `(AptosError)`
   */
  getEventsByEventHandle = (
    {
      address,
      eventHandleStruct,
      fieldName,
      ...query
    }: GetEventsByEventHandleParams,
    params: RequestParams = {}
  ) =>
    this.http.request<Event[], AptosError>({
      path: `/accounts/${address}/events/${eventHandleStruct}/${fieldName}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
