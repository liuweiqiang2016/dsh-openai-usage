// src/index.js
import Schema from "@deepseek-ai/schemastery";
import { credentialRef } from "@deepseek-ai/dsh-credentials";

// src/account.js
var DAY = 86400;
var API = "https://api.openai.com/v1";
var AccountError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
};
function timeRange(range, now = /* @__PURE__ */ new Date()) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1e3;
  const endTime = today + DAY;
  const starts = { month: Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1) / 1e3, "7d": today - 6 * DAY, "30d": today - 29 * DAY };
  if (!Object.hasOwn(starts, range)) throw new AccountError("INVALID_RANGE", "\u8BF7\u9009\u62E9\u672C\u6708\u3001\u8FD1 7 \u5929\u6216\u8FD1 30 \u5929\u3002");
  return { startTime: starts[range], endTime, timezone: "UTC" };
}
function malformed() {
  return new AccountError("INVALID_RESPONSE", "OpenAI \u8FD4\u56DE\u7684\u6570\u636E\u683C\u5F0F\u4E0D\u5B8C\u6574\uFF0C\u672C\u9879\u672A\u8BA1\u5165\u7EDF\u8BA1\u3002\u8BF7\u91CD\u8BD5\u6216\u67E5\u770B\u5B98\u65B9\u7528\u91CF\u9875\u3002");
}
function count(value) {
  if (!Number.isSafeInteger(value) || value < 0) throw malformed();
  return value;
}
function rows(buckets) {
  return buckets.flatMap((bucket) => {
    if (!Number.isSafeInteger(bucket.start_time) || !Array.isArray(bucket.results)) throw malformed();
    return bucket.results.map((result) => ({ day: new Date(bucket.start_time * 1e3).toISOString().slice(0, 10), result }));
  });
}
function summarizeUsage(buckets) {
  const total = { inputTokens: 0, cachedTokens: 0, outputTokens: 0, requests: 0 };
  const models = /* @__PURE__ */ new Map();
  for (const { result } of rows(buckets)) {
    const model = typeof result.model === "string" ? result.model : "\u672A\u5206\u7EC4\u6A21\u578B";
    const row = models.get(model) ?? { model, inputTokens: 0, cachedTokens: 0, outputTokens: 0, requests: 0 };
    const values = { inputTokens: count(result.input_tokens), outputTokens: count(result.output_tokens), requests: count(result.num_model_requests), cachedTokens: result.input_cached_tokens == null ? null : count(result.input_cached_tokens) };
    for (const field of Object.keys(values)) {
      for (const target of [total, row]) target[field] = target[field] === null || values[field] === null ? null : target[field] + values[field];
    }
    models.set(model, row);
  }
  return { ...total, models: [...models.values()].sort((a, b) => b.inputTokens + b.outputTokens - a.inputTokens - a.outputTokens) };
}
function summarizeCosts(buckets) {
  const totals = /* @__PURE__ */ new Map(), daily = /* @__PURE__ */ new Map(), items = /* @__PURE__ */ new Map();
  for (const { day, result } of rows(buckets)) {
    const amount = result.amount;
    if (!amount || !Number.isFinite(amount.value) || typeof amount.currency !== "string" || !/^[a-z]{3}$/i.test(amount.currency)) throw malformed();
    const currency = amount.currency.toLowerCase();
    const lineItem = typeof result.line_item === "string" ? result.line_item : "\u672A\u5206\u7EC4\u8D39\u7528";
    const projectId = typeof result.project_id === "string" ? result.project_id : null;
    const dailyKey = `${day}:${currency}`;
    const itemKey = JSON.stringify([currency, lineItem, projectId]);
    totals.set(currency, (totals.get(currency) ?? 0) + amount.value);
    const dateRow = daily.get(dailyKey) ?? { day, currency, value: 0 };
    dateRow.value += amount.value;
    daily.set(dailyKey, dateRow);
    const itemRow = items.get(itemKey) ?? { currency, lineItem, projectId, value: 0 };
    itemRow.value += amount.value;
    items.set(itemKey, itemRow);
  }
  return {
    totals: [...totals].map(([currency, value]) => ({ currency, value })),
    daily: [...daily.values()].sort((a, b) => a.day.localeCompare(b.day)),
    items: [...items.values()].sort((a, b) => b.value - a.value)
  };
}
function safeError(error) {
  if (error instanceof AccountError) return { code: error.code, message: error.message };
  if (error?.name === "AbortError") return { code: "CANCELLED", message: "\u67E5\u8BE2\u5DF2\u53D6\u6D88\u3002" };
  if (error?.name === "TimeoutError") return { code: "TIMEOUT", message: "\u67E5\u8BE2\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002" };
  return { code: "NETWORK", message: "\u65E0\u6CD5\u8FDE\u63A5 OpenAI\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u6216\u4EE3\u7406\u8BBE\u7F6E\u540E\u91CD\u8BD5\u3002" };
}
var OpenAIAccount = class {
  constructor({ fetch: request = globalThis.fetch } = {}) {
    this.fetch = request;
  }
  async get(path, params, key, signal) {
    signal.throwIfAborted();
    const url = new URL(API + path);
    for (const [name2, value] of Object.entries(params)) if (value !== void 0 && value !== "") {
      for (const item of Array.isArray(value) ? value : [value]) url.searchParams.append(name2, String(item));
    }
    const response = await this.fetch(url, { headers: { Authorization: `Bearer ${key}`, Accept: "application/json" }, signal, redirect: "error" });
    if (!response.ok) {
      await response.body?.cancel();
      const messages = {
        401: ["AUTH", "\u7BA1\u7406\u5458\u5BC6\u94A5\u65E0\u6548\u3001\u5DF2\u8FC7\u671F\u6216\u5DF2\u64A4\u9500\u3002\u8BF7\u91CD\u65B0\u914D\u7F6E Admin API Key\u3002"],
        403: ["PERMISSION", "\u6B64\u5BC6\u94A5\u65E0\u6743\u67E5\u8BE2\u672C\u9879\u3002\u8BF7\u786E\u8BA4 Admin API Key \u53CA\u7EC4\u7EC7\u6743\u9650\u3002"],
        404: ["UNAVAILABLE", "\u5F53\u524D\u8D26\u6237\u6216\u63A5\u53E3\u4E0D\u63D0\u4F9B\u672C\u9879\u4FE1\u606F\u3002"],
        429: ["RATE_LIMIT", "OpenAI \u67E5\u8BE2\u9891\u7387\u53D7\u9650\uFF0C\u8BF7\u7A0D\u540E\u70B9\u51FB\u5237\u65B0\u3002"],
        400: ["QUERY_REJECTED", "OpenAI \u672A\u63A5\u53D7\u67E5\u8BE2\u6761\u4EF6\u3002\u8BF7\u68C0\u67E5\u9879\u76EE ID\uFF0C\u6216\u79FB\u9664\u7B5B\u9009\u540E\u91CD\u8BD5\u3002"]
      };
      const [code, message] = messages[response.status] ?? ["UPSTREAM", "OpenAI \u6682\u65F6\u65E0\u6CD5\u63D0\u4F9B\u672C\u9879\u6570\u636E\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002"];
      throw new AccountError(code, message);
    }
    try {
      return await response.json();
    } catch (error) {
      if (signal.aborted) throw signal.reason;
      throw malformed();
    }
  }
  async pages(path, params, key, signal) {
    const buckets = [], seen = /* @__PURE__ */ new Set();
    let cursor;
    do {
      const response = await this.get(path, { ...params, page: cursor }, key, signal);
      if (!response || !Array.isArray(response.data) || typeof response.has_more !== "boolean") throw malformed();
      buckets.push(...response.data);
      if (!response.has_more) return buckets;
      cursor = response.next_page;
      if (typeof cursor !== "string" || !cursor || seen.has(cursor) || seen.size >= 100) throw new AccountError("PAGINATION", "\u5206\u9875\u67E5\u8BE2\u672A\u5B8C\u6574\u7ED3\u675F\uFF0C\u672C\u9879\u4E0D\u663E\u793A\u4E0D\u5B8C\u6574\u7684\u5408\u8BA1\u3002\u8BF7\u91CD\u8BD5\u6216\u7F29\u77ED\u65F6\u95F4\u8303\u56F4\u3002");
      seen.add(cursor);
    } while (true);
  }
  async overview(query, key, signal, now = /* @__PURE__ */ new Date()) {
    if (!query || typeof query !== "object") throw new AccountError("INVALID_QUERY", "\u67E5\u8BE2\u53C2\u6570\u65E0\u6548\u3002");
    const range = timeRange(query.range ?? "month", now);
    const projectId = query.projectId ?? "";
    if (typeof projectId !== "string" || projectId !== "" && !/^proj_[a-zA-Z0-9_-]{1,150}$/.test(projectId)) throw new AccountError("INVALID_PROJECT", "\u9879\u76EE ID \u5E94\u4EE5 proj_ \u5F00\u5934\uFF1B\u7559\u7A7A\u67E5\u8BE2\u6574\u4E2A\u7EC4\u7EC7\u3002");
    const params = { start_time: range.startTime, end_time: range.endTime, bucket_width: "1d", "project_ids[]": projectId };
    const section = async (task) => {
      try {
        return { status: "ready", data: await task() };
      } catch (error) {
        return { status: "error", error: safeError(error) };
      }
    };
    const [usage, costs, limit] = await Promise.all([
      section(async () => summarizeUsage(await this.pages("/organization/usage/completions", { ...params, limit: 31, "group_by[]": "model" }, key, signal))),
      section(async () => summarizeCosts(await this.pages("/organization/costs", { ...params, limit: 31, "group_by[]": ["line_item", "project_id"] }, key, signal))),
      section(async () => {
        const result = await this.get("/organization/spend_limit", {}, key, signal);
        if (!Number.isSafeInteger(result?.threshold_amount) || result.threshold_amount < 0 || result.currency !== "USD" || result.interval !== "month" || !["inactive", "enforcing"].includes(result.enforcement?.status)) throw malformed();
        return { amount: result.threshold_amount / 100, currency: result.currency, interval: result.interval, enforcement: result.enforcement.status };
      })
    ]);
    return { range, projectId, fetchedAt: (/* @__PURE__ */ new Date()).toISOString(), usage, costs, limit, balance: { status: "unsupported", message: "\u5C1A\u65E0\u5DF2\u6838\u5B9E\u7684\u516C\u5F00\u4F59\u989D\u67E5\u8BE2\u63A5\u53E3\uFF0C\u8BF7\u524D\u5F80 OpenAI \u8D26\u5355\u9875\u67E5\u770B\u3002" } };
  }
};

// src/index.js
var name = "openai-account";
var inject = ["connection", "credentials"];
var Config = Schema.object({
  adminKeyRef: Schema.string().pattern(/^[A-Za-z_][A-Za-z0-9_]*$/).default("OPENAI_ACCOUNT_ADMIN_KEY").description("\u7BA1\u7406\u5458\u5BC6\u94A5\u7684\u51ED\u636E\u5F15\u7528\u540D\uFF1B\u4E0D\u586B\u5199\u5BC6\u94A5\u672C\u8EAB\u3002"),
  timeoutMs: Schema.number().min(1e3).max(12e4).step(1).default(3e4).description("\u8D26\u6237\u67E5\u8BE2\u8D85\u65F6\uFF08\u6BEB\u79D2\uFF09\u3002")
});
function createHandler(credentials, config, lifetime, account = new OpenAIAccount()) {
  const ref = credentialRef(config.adminKeyRef);
  return async (endpoint, payload, signal, peer) => {
    if (peer?.principal?.kind !== "owner") return { ok: false, error: { code: "FORBIDDEN", message: "\u4EC5 Harness \u6240\u6709\u8005\u53EF\u4EE5\u67E5\u770B\u6216\u914D\u7F6E\u8D26\u6237\u4FE1\u606F\u3002", details: {} } };
    try {
      const operationSignal = AbortSignal.any([signal, lifetime, AbortSignal.timeout(config.timeoutMs)]);
      operationSignal.throwIfAborted();
      if (endpoint === "save-key") {
        const key = typeof payload?.key === "string" ? payload.key.trim() : "";
        if (!/^sk-admin-\S{1,1000}$/.test(key)) throw new AccountError("INVALID_KEY", "\u8BF7\u586B\u5199 Admin API Key\uFF08\u4EE5 sk-admin- \u5F00\u5934\uFF09\uFF0C\u666E\u901A\u6A21\u578B\u5BC6\u94A5\u65E0\u6CD5\u67E5\u8BE2\u7EC4\u7EC7\u8D26\u52A1\u3002");
        const info2 = await credentials.describe(ref);
        if (!info2.writable) throw new AccountError("READ_ONLY", "\u5F53\u524D\u51ED\u636E\u5B58\u50A8\u4E0D\u53EF\u5199\uFF0C\u8BF7\u5728 Harness \u7684\u51ED\u636E\u914D\u7F6E\u4E2D\u8BBE\u7F6E\u7BA1\u7406\u5458\u5BC6\u94A5\u3002");
        try {
          await credentials.set(ref, key);
        } catch {
          throw new AccountError("CREDENTIAL_STORAGE", "\u65E0\u6CD5\u4FDD\u5B58\u7BA1\u7406\u5458\u5BC6\u94A5\uFF0C\u8BF7\u68C0\u67E5 Harness \u51ED\u636E\u5B58\u50A8\u7684\u5199\u5165\u6743\u9650\u3002");
        }
        return { ok: true, value: { saved: true } };
      }
      if (endpoint !== "overview") throw new AccountError("NOT_FOUND", "\u672A\u77E5\u7684\u8D26\u6237\u64CD\u4F5C\u3002");
      const info = await credentials.describe(ref);
      const credential = await credentials.resolve(ref);
      const status = { configured: Boolean(credential?.value), writable: info.writable, credentialRef: config.adminKeyRef };
      if (!credential?.value) return { ok: true, value: { ...status, overview: null } };
      const overview = await account.overview(payload, credential.value, operationSignal);
      return { ok: true, value: { ...status, overview } };
    } catch (error) {
      return { ok: false, error: { ...safeError(error), details: {} } };
    }
  };
}
function apply(ctx, config) {
  const lifetime = new AbortController();
  const connection = ctx.connection;
  const handler = createHandler(ctx.credentials, config, lifetime.signal);
  ctx.effect(() => {
    const disposers = ["overview", "save-key"].map((endpoint) => connection.fetch.register({
      path: `/api/openai-account/${endpoint}`,
      methods: ["POST"],
      requestBody: "buffered",
      async fetch(request) {
        const admission = connection.admit(request);
        if ("rejection" in admission) return new Response("unauthorized", { status: admission.rejection });
        const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
        if (contentType !== "application/json") return new Response("unsupported content type", { status: 415 });
        let body;
        try {
          body = await request.json();
        } catch {
          return new Response("invalid JSON", { status: 400 });
        }
        if (body?.type !== "client-request" || typeof body.rpcId !== "string" || body.method !== `openai-account/${endpoint}`) {
          return new Response("invalid RPC envelope", { status: 400 });
        }
        const result = await handler(endpoint, body.payload, request.signal, admission.peer);
        return Response.json({ type: "server-response", rpcId: body.rpcId, result });
      }
    }));
    return async () => {
      lifetime.abort();
      await Promise.all(disposers.map((dispose) => dispose()));
    };
  });
}
export {
  Config,
  apply,
  createHandler,
  inject,
  name
};
