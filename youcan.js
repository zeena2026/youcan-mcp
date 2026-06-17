/**
 * YouCan REST API client
 * Handles authentication and all HTTP calls to https://api.youcan.shop
 */

import fetch from "node-fetch";

const BASE_URL = "https://api.youcan.shop";

export class YouCanClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  /** Build full URL with optional query params */
  #url(path, params = {}) {
    const url = new URL(BASE_URL + path);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    });
    return url.toString();
  }

  /** Common headers */
  #headers(extra = {}) {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...extra,
    };
  }

  /** Handle response — throw on error */
  async #handleResponse(res) {
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }

    if (!res.ok) {
      const msg =
        typeof body === "object"
          ? (body.message || body.error || JSON.stringify(body))
          : body;
      throw new Error(`YouCan API error ${res.status}: ${msg}`);
    }

    return body;
  }

  async get(path, params = {}) {
    const res = await fetch(this.#url(path, params), {
      method: "GET",
      headers: this.#headers(),
    });
    return this.#handleResponse(res);
  }

  async post(path, body = {}) {
    const res = await fetch(this.#url(path), {
      method: "POST",
      headers: this.#headers(),
      body: JSON.stringify(body),
    });
    return this.#handleResponse(res);
  }

  async put(path, body = {}) {
    const res = await fetch(this.#url(path), {
      method: "PUT",
      headers: this.#headers(),
      body: JSON.stringify(body),
    });
    return this.#handleResponse(res);
  }

  async delete(path) {
    const res = await fetch(this.#url(path), {
      method: "DELETE",
      headers: this.#headers(),
    });
    return this.#handleResponse(res);
  }
}
