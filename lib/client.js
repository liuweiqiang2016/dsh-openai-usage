window.__ModuleLoader__.load({id:"dsh-openai-account",factory:(require)=>{const module={exports:{}};const exports=module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  AccountPanel: () => AccountPanel,
  apply: () => apply,
  inject: () => inject,
  money: () => money
});
module.exports = __toCommonJS(client_exports);
var import_react = __toESM(require("react"), 1);

// src/styles.js
var styles = `
.oa-panel{--oa-text:#202b3d;--oa-muted:#687487;--oa-border:#e2e7ee;--oa-card:#fff;--oa-soft:#f4f7fa;--oa-accent:#137a66;color:var(--oa-text);font-family:inherit;font-size:14px;line-height:1.6;width:100%;max-width:1000px;margin:0 auto;padding:8px 4px 24px;box-sizing:border-box}
.oa-panel *{box-sizing:border-box}.oa-panel h2{font-size:27px;font-weight:650;letter-spacing:-.8px;margin:0}.oa-panel h3{font-size:15px;font-weight:650;margin:0 0 12px}.oa-panel p{margin:8px 0}.oa-panel a{color:var(--oa-accent);text-decoration:none}.oa-panel a:hover{text-decoration:underline}.oa-eyebrow{font-size:10px;letter-spacing:2px;color:var(--oa-accent);font-weight:700}.oa-header,.oa-toolbar,.oa-card-title{display:flex;justify-content:space-between;align-items:center;gap:16px}.oa-header{margin-bottom:24px}.oa-muted,.oa-note{color:var(--oa-muted);font-size:12px}.oa-button,.oa-ranges button{font:inherit;cursor:pointer;border:1px solid var(--oa-border);border-radius:8px;background:var(--oa-card);color:var(--oa-text);padding:7px 12px;white-space:nowrap}.oa-button:hover{background:var(--oa-soft)}.oa-button:disabled{opacity:.55;cursor:default}.oa-panel button:focus-visible,.oa-panel input:focus-visible,.oa-panel a:focus-visible{outline:2px solid var(--oa-accent);outline-offset:3px}.oa-primary{background:var(--oa-accent);border-color:var(--oa-accent);color:white}.oa-primary:hover{background:#106955}.oa-ranges{display:flex;background:var(--oa-soft);padding:3px;border-radius:9px}.oa-ranges button{background:transparent;border-color:transparent;padding:5px 13px;font-size:13px}.oa-ranges button[aria-pressed=true]{background:var(--oa-card);border-color:var(--oa-border);color:var(--oa-accent)}.oa-panel input{font:inherit;min-width:0;background:var(--oa-card);color:var(--oa-text);border:1px solid var(--oa-border);border-radius:7px;padding:8px 10px}.oa-project-form{display:flex;gap:8px;align-items:center;margin-top:16px}.oa-project-form label{font-size:12px;white-space:nowrap}.oa-project-form input{flex:1;font-size:12px}.oa-status{font-size:11px;color:var(--oa-muted);margin:12px 0 18px;overflow-wrap:anywhere}.oa-metrics{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:12px;margin-bottom:18px}.oa-metric,.oa-card{background:var(--oa-card);border:1px solid var(--oa-border);border-radius:12px;padding:18px}.oa-metric strong{font-size:23px;line-height:1.3;display:block;font-weight:650;margin:10px 0;overflow-wrap:anywhere}.oa-metric:first-child{border-top:3px solid var(--oa-accent);padding-top:16px}.oa-label{color:var(--oa-muted);font-size:12px}.oa-card{margin-bottom:16px}.oa-card-title h3{margin-bottom:0}.oa-card-title{margin-bottom:16px}.oa-card-title a{font-size:12px}.oa-limits{display:grid;grid-template-columns:1fr 1fr;gap:24px}.oa-limits strong{display:block;margin-top:7px;font-size:16px}.oa-limits>div+div{border-left:1px solid var(--oa-border);padding-left:24px}.oa-error{background:#fff2ef;color:#a23b2c;padding:10px 12px;border-radius:7px;font-size:12px;overflow-wrap:anywhere}.oa-setup{background:var(--oa-soft)}.oa-setup ol{padding-left:20px;margin:12px 0;line-height:1.9;font-size:13px}.oa-key-form label{display:block;font-size:12px;margin-bottom:6px}.oa-inline{display:flex;gap:8px}.oa-inline input{flex:1}.oa-trend{display:grid;gap:7px;margin-top:10px;max-height:280px;overflow:auto}.oa-trend-row{display:grid;grid-template-columns:45px minmax(50px,1fr) 120px;gap:12px;align-items:center;font-size:11px;font-variant-numeric:tabular-nums}.oa-trend-row>span{text-align:right}.oa-track{height:12px;background:var(--oa-soft);border-radius:3px;overflow:hidden}.oa-bar{height:100%;background:#3b9a86;border-radius:3px;min-width:1px}.oa-adjustment{background:#b7944c}.oa-table-wrap{width:100%;overflow:auto}.oa-panel table{border-collapse:collapse;width:100%;font-size:12px;font-variant-numeric:tabular-nums}.oa-panel th{font-weight:500;color:var(--oa-muted);white-space:nowrap}.oa-panel td,.oa-panel th{padding:10px 9px;text-align:right;border-bottom:1px solid var(--oa-border)}.oa-panel td:first-child,.oa-panel th:first-child{text-align:left;max-width:260px;overflow-wrap:anywhere}.oa-panel tr:last-child td{border-bottom:0}.oa-panel summary{cursor:pointer;font-size:13px;font-weight:600}.oa-note{line-height:1.8}.oa-footer{border-top:1px solid var(--oa-border);padding-top:14px;margin-top:20px;display:flex;flex-wrap:wrap;gap:18px;font-size:12px}.oa-footer span{margin-left:auto;color:var(--oa-muted)}
.oa-toolbar{flex-wrap:wrap;gap:10px}
@media(prefers-color-scheme:dark){.oa-panel{--oa-text:#e3e9f0;--oa-muted:#9aa9bb;--oa-border:#35404d;--oa-card:#202831;--oa-soft:#27313d;--oa-accent:#73cbb4}.oa-primary{background:#217660;border-color:#217660;color:#fff}.oa-error{background:#402824;color:#f3ae9e}}
@media(max-width:640px){.oa-metrics{grid-template-columns:1fr}.oa-header{align-items:flex-start}.oa-header h2{font-size:23px}.oa-limits{grid-template-columns:1fr;gap:12px}.oa-limits>div+div{border-left:0;padding-left:0;border-top:1px solid var(--oa-border);padding-top:12px}.oa-card,.oa-metric{padding:14px}.oa-inline{flex-wrap:wrap}.oa-inline input{flex-basis:100%}.oa-project-form{flex-wrap:wrap}.oa-project-form input{flex-basis:65%}.oa-trend-row{grid-template-columns:40px minmax(30px,1fr) 110px;gap:6px}.oa-footer span{margin-left:0}}
`;

// locale/zh.json
var zh_default = {
  meta: { title: "OpenAI \u7528\u91CF", description: "\u67E5\u8BE2 OpenAI \u5B98\u65B9\u8D26\u6237\u7528\u91CF\u3001\u8D39\u7528\u548C\u6708\u5EA6\u6D88\u8D39\u4E0A\u9650\u3002" },
  ui: {
    nav: "OpenAI \u7528\u91CF",
    title: "\u7528\u91CF\u4E0E\u8D39\u7528",
    subtitle: "\u5728 Harness \u4E2D\u67E5\u770B OpenAI \u5B98\u65B9\u8D26\u6237\u6570\u636E",
    configure: "\u914D\u7F6E\u5BC6\u94A5",
    closeSetup: "\u6536\u8D77\u914D\u7F6E",
    replaceKey: "\u66F4\u6362\u7BA1\u7406\u5458\u5BC6\u94A5",
    connect: "\u8FDE\u63A5\u4F60\u7684 OpenAI \u8D26\u6237",
    keyHelp: "\u67E5\u8BE2\u8D26\u6237\u7528\u91CF\u548C\u8D39\u7528\u9700\u8981\u5355\u72EC\u7684 Admin API Key\u3002\u6A21\u578B\u8C03\u7528\u4F7F\u7528\u7684\u666E\u901A API Key \u4E0D\u9002\u7528\u4E8E\u6B64\u5904\u3002",
    openAdmin: "OpenAI \u7BA1\u7406\u5458\u5BC6\u94A5\u9875",
    setupOrganization: "\u6253\u5F00\u7BA1\u7406\u5458\u5BC6\u94A5\u9875\uFF0C\u786E\u8BA4\u9009\u4E2D\u8981\u67E5\u770B\u7684\u7EC4\u7EC7\u3002",
    setupCreate: "\u521B\u5EFA\u4E13\u7528\u4E8E\u672C\u63D2\u4EF6\u7684\u7BA1\u7406\u5458\u5BC6\u94A5\uFF1B\u5982\u679C\u6CA1\u6709\u521B\u5EFA\u5165\u53E3\uFF0C\u8BF7\u8054\u7CFB\u8BE5\u7EC4\u7EC7\u7684\u7BA1\u7406\u5458\u3002",
    setupSave: "\u5728\u4E0B\u65B9\u7C98\u8D34\u5E76\u4FDD\u5B58\u3002\u5BC6\u94A5\u7531\u672C\u673A Harness \u51ED\u636E\u670D\u52A1\u7BA1\u7406\uFF0C\u4E0D\u4F1A\u5199\u5165\u804A\u5929\u5185\u5BB9\u3002",
    saving: "\u4FDD\u5B58\u4E2D\u2026",
    save: "\u4FDD\u5B58\u5E76\u67E5\u8BE2",
    storageReadOnly: "\u51ED\u636E\u5B58\u50A8\u4E0D\u53EF\u5199\uFF0C\u8BF7\u901A\u8FC7 Harness \u7684\u51ED\u636E\u914D\u7F6E\u8BBE\u7F6E {ref}\u3002",
    replaceNote: "\u4EC5\u4FDD\u5B58\u5230\u672C\u63D2\u4EF6\u7684\u51ED\u636E\u5F15\u7528\uFF1B\u66F4\u6362\u65F6\u4F1A\u8986\u76D6\u4E4B\u524D\u4E3A\u672C\u63D2\u4EF6\u4FDD\u5B58\u7684\u7BA1\u7406\u5458\u5BC6\u94A5\u3002",
    range: "\u7EDF\u8BA1\u65F6\u95F4\u8303\u56F4",
    month: "\u672C\u6708",
    "7d": "\u8FD1 7 \u5929",
    "30d": "\u8FD1 30 \u5929",
    querying: "\u67E5\u8BE2\u4E2D\u2026",
    refresh: "\u5237\u65B0\u6570\u636E",
    project: "\u9879\u76EE\u7B5B\u9009",
    projectPlaceholder: "proj_\u2026\uFF08\u7559\u7A7A\u4E3A\u6574\u4E2A\u7EC4\u7EC7\uFF09",
    apply: "\u5E94\u7528",
    loading: "\u6B63\u5728\u8BFB\u53D6\u5B98\u65B9\u6570\u636E\u2026",
    scope: "\u7EDF\u8BA1\u8303\u56F4\uFF1A{project} \xB7 UTC \u65E5\u754C\u7EBF \xB7 \u66F4\u65B0\u4E8E {updated}",
    organization: "\u6574\u4E2A\u7EC4\u7EC7",
    setupRequired: "\u914D\u7F6E\u7BA1\u7406\u5458\u5BC6\u94A5\u540E\u5373\u53EF\u67E5\u8BE2\u3002",
    periodCosts: "\u6240\u9009\u671F\u95F4\u8D39\u7528",
    noCosts: "\u65E0\u8D39\u7528\u8BB0\u5F55",
    unavailable: "\u6682\u4E0D\u53EF\u7528",
    officialCosts: "OpenAI \u5B98\u65B9\u8FD4\u56DE\u8D39\u7528",
    inputTokens: "\u8F93\u5165 token",
    cachedDetail: "\u5176\u4E2D\u7F13\u5B58 {count}\uFF08\u5DF2\u542B\u5728\u8F93\u5165\u5185\uFF09",
    waitingUsage: "\u7B49\u5F85\u5B98\u65B9\u7528\u91CF\u6570\u636E",
    outputTokens: "\u8F93\u51FA token",
    requestsDetail: "{count} \u6B21\u6A21\u578B\u8BF7\u6C42",
    limits: "\u989D\u5EA6\u4E0E\u4F59\u989D",
    openBilling: "\u6253\u5F00\u5B98\u65B9\u8D26\u5355",
    monthlyLimit: "\u7EC4\u7EC7\u6708\u5EA6\u6D88\u8D39\u4E0A\u9650",
    limitUnavailable: "\u6682\u4E0D\u53EF\u67E5\u8BE2",
    enforcing: "\u6B63\u5728\u6267\u884C \xB7 \u6574\u4E2A\u7EC4\u7EC7 \xB7 \u6BCF\u6708",
    notEnforcing: "\u5F53\u524D\u672A\u6267\u884C\u8BE5\u4E0A\u9650",
    limitHelp: "\u7531 OpenAI \u8D26\u6237\u6743\u9650\u548C\u63A5\u53E3\u53EF\u7528\u6027\u51B3\u5B9A",
    balance: "\u8D26\u6237\u4F59\u989D\uFF0F\u8D60\u9001\u989D\u5EA6",
    viewBilling: "\u8BF7\u5728\u5B98\u65B9\u8D26\u5355\u9875\u67E5\u770B",
    balanceHelp: "\u5C1A\u65E0\u5DF2\u6838\u5B9E\u7684\u516C\u5F00\u4F59\u989D\u63A5\u53E3\uFF1B\u6D88\u8D39\u4E0A\u9650\u4E0D\u4EE3\u8868\u8D26\u6237\u4F59\u989D\u3002",
    dailyCosts: "\u6BCF\u65E5\u8D39\u7528",
    noDailyCosts: "\u6240\u9009\u671F\u95F4\u6682\u65E0\u8D39\u7528\u8BB0\u5F55\u3002",
    dailyLabel: "{currency} \u6BCF\u65E5\u8D39\u7528",
    modelUsage: "\u6309\u6A21\u578B\u67E5\u770B\u7528\u91CF",
    modelHelp: "\u672C\u8868\u6765\u81EA\u5B98\u65B9\u6A21\u578B\u7528\u91CF\u63A5\u53E3\uFF1B\u8D26\u6237\u8D39\u7528\u8FD8\u53EF\u80FD\u5305\u542B\u5B58\u50A8\u3001\u56FE\u7247\u3001\u5DE5\u5177\u7B49\u5176\u4ED6\u6536\u8D39\u9879\u76EE\u3002",
    model: "\u6A21\u578B",
    input: "\u8F93\u5165",
    cached: "\u5176\u4E2D\u7F13\u5B58",
    output: "\u8F93\u51FA",
    requests: "\u8BF7\u6C42",
    noUsage: "\u6240\u9009\u671F\u95F4\u6682\u65E0\u6A21\u578B\u7528\u91CF\u8BB0\u5F55\u3002",
    costDetails: "\u8D39\u7528\u660E\u7EC6 \xB7 {count} \u9879",
    lineItem: "\u6536\u8D39\u9879\u76EE",
    projectId: "\u9879\u76EE ID",
    amount: "\u91D1\u989D",
    unassigned: "\u672A\u5F52\u5C5E\u9879\u76EE",
    ungroupedModel: "\u672A\u5206\u7EC4\u6A21\u578B",
    ungroupedCosts: "\u672A\u5206\u7EC4\u8D39\u7528",
    notProvided: "\u672A\u63D0\u4F9B",
    costNote: "\u8D39\u7528\u6309 OpenAI \u8FD4\u56DE\u7684\u8BB0\u5F55\u6C47\u603B\uFF0C\u53EF\u80FD\u5EF6\u8FDF\u6216\u8C03\u6574\uFF0C\u4E0D\u7B49\u540C\u4E8E\u6700\u7EC8\u53D1\u7968\u3001\u5145\u503C\u8BB0\u5F55\u6216\u5DF2\u4ED8\u6B3E\u91D1\u989D\u3002\u65E5\u671F\u6309 UTC \u7EDF\u8BA1\uFF0C\u66F4\u65B0\u65F6\u95F4\u6309\u672C\u673A\u65F6\u533A\u663E\u793A\u3002",
    usagePage: "\u5B98\u65B9\u7528\u91CF\u9875",
    billingPage: "\u5B98\u65B9\u8D26\u5355\u9875",
    readOnly: "\u53EA\u8BFB\u67E5\u8BE2 \xB7 \u4E0D\u8C03\u7528\u6A21\u578B",
    "error.FORBIDDEN": "\u4EC5 Harness \u6240\u6709\u8005\u53EF\u4EE5\u67E5\u770B\u6216\u914D\u7F6E\u8D26\u6237\u4FE1\u606F\u3002",
    "error.INVALID_KEY": "\u8BF7\u586B\u5199 Admin API Key\uFF08\u4EE5 sk-admin- \u5F00\u5934\uFF09\uFF0C\u666E\u901A\u6A21\u578B\u5BC6\u94A5\u65E0\u6CD5\u67E5\u8BE2\u7EC4\u7EC7\u8D26\u52A1\u3002",
    "error.READ_ONLY": "\u5F53\u524D\u51ED\u636E\u5B58\u50A8\u4E0D\u53EF\u5199\uFF0C\u8BF7\u5728 Harness \u7684\u51ED\u636E\u914D\u7F6E\u4E2D\u8BBE\u7F6E\u7BA1\u7406\u5458\u5BC6\u94A5\u3002",
    "error.CREDENTIAL_STORAGE": "\u65E0\u6CD5\u4FDD\u5B58\u7BA1\u7406\u5458\u5BC6\u94A5\uFF0C\u8BF7\u68C0\u67E5 Harness \u51ED\u636E\u5B58\u50A8\u7684\u5199\u5165\u6743\u9650\u3002",
    "error.NOT_FOUND": "\u672A\u77E5\u7684\u8D26\u6237\u64CD\u4F5C\u3002",
    "error.INVALID_RANGE": "\u8BF7\u9009\u62E9\u672C\u6708\u3001\u8FD1 7 \u5929\u6216\u8FD1 30 \u5929\u3002",
    "error.INVALID_RESPONSE": "OpenAI \u8FD4\u56DE\u7684\u6570\u636E\u683C\u5F0F\u4E0D\u5B8C\u6574\uFF0C\u672C\u9879\u672A\u8BA1\u5165\u7EDF\u8BA1\u3002\u8BF7\u91CD\u8BD5\u6216\u67E5\u770B\u5B98\u65B9\u7528\u91CF\u9875\u3002",
    "error.CANCELLED": "\u67E5\u8BE2\u5DF2\u53D6\u6D88\u3002",
    "error.TIMEOUT": "\u67E5\u8BE2\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
    "error.NETWORK": "\u65E0\u6CD5\u8FDE\u63A5 OpenAI\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u6216\u4EE3\u7406\u8BBE\u7F6E\u540E\u91CD\u8BD5\u3002",
    "error.AUTH": "\u7BA1\u7406\u5458\u5BC6\u94A5\u65E0\u6548\u3001\u5DF2\u8FC7\u671F\u6216\u5DF2\u64A4\u9500\u3002\u8BF7\u91CD\u65B0\u914D\u7F6E Admin API Key\u3002",
    "error.PERMISSION": "\u6B64\u5BC6\u94A5\u65E0\u6743\u67E5\u8BE2\u672C\u9879\u3002\u8BF7\u786E\u8BA4 Admin API Key \u53CA\u7EC4\u7EC7\u6743\u9650\u3002",
    "error.UNAVAILABLE": "\u5F53\u524D\u8D26\u6237\u6216\u63A5\u53E3\u4E0D\u63D0\u4F9B\u672C\u9879\u4FE1\u606F\u3002",
    "error.RATE_LIMIT": "OpenAI \u67E5\u8BE2\u9891\u7387\u53D7\u9650\uFF0C\u8BF7\u7A0D\u540E\u70B9\u51FB\u5237\u65B0\u3002",
    "error.QUERY_REJECTED": "OpenAI \u672A\u63A5\u53D7\u67E5\u8BE2\u6761\u4EF6\u3002\u8BF7\u68C0\u67E5\u9879\u76EE ID\uFF0C\u6216\u79FB\u9664\u7B5B\u9009\u540E\u91CD\u8BD5\u3002",
    "error.UPSTREAM": "OpenAI \u6682\u65F6\u65E0\u6CD5\u63D0\u4F9B\u672C\u9879\u6570\u636E\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
    "error.PAGINATION": "\u5206\u9875\u67E5\u8BE2\u672A\u5B8C\u6574\u7ED3\u675F\uFF0C\u672C\u9879\u4E0D\u663E\u793A\u4E0D\u5B8C\u6574\u7684\u5408\u8BA1\u3002\u8BF7\u91CD\u8BD5\u6216\u7F29\u77ED\u65F6\u95F4\u8303\u56F4\u3002",
    "error.INVALID_QUERY": "\u67E5\u8BE2\u53C2\u6570\u65E0\u6548\u3002",
    "error.INVALID_PROJECT": "\u9879\u76EE ID \u5E94\u4EE5 proj_ \u5F00\u5934\uFF1B\u7559\u7A7A\u67E5\u8BE2\u6574\u4E2A\u7EC4\u7EC7\u3002",
    "error.CONNECTION": "\u65E0\u6CD5\u8FDE\u63A5 Harness \u67E5\u8BE2\u670D\u52A1\uFF0C\u8BF7\u786E\u8BA4\u63D2\u4EF6\u5DF2\u542F\u7528\u540E\u91CD\u8BD5\u3002",
    "error.SAVE_FAILED": "\u4FDD\u5B58\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5 Harness \u8FDE\u63A5\u540E\u91CD\u8BD5\u3002",
    "error.UNKNOWN": "\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u6216\u67E5\u770B\u5B98\u65B9\u7528\u91CF\u9875\u3002"
  }
};

// locale/en.json
var en_default = {
  meta: { title: "OpenAI Usage", description: "View official OpenAI account usage, costs, and monthly spend limit." },
  ui: {
    nav: "OpenAI Usage",
    title: "Usage and costs",
    subtitle: "View your official OpenAI account data in Harness",
    configure: "Configure key",
    closeSetup: "Close setup",
    replaceKey: "Replace admin key",
    connect: "Connect your OpenAI account",
    keyHelp: "Account usage and costs require a separate Admin API Key. A regular model API key cannot be used here.",
    openAdmin: "OpenAI admin keys",
    setupOrganization: "Open the admin keys page and select the organization you want to view.",
    setupCreate: "Create a dedicated admin key for this plugin. If the option is unavailable, contact your organization administrator.",
    setupSave: "Paste and save the key below. Harness manages it locally through its credential service; it is never added to chat content.",
    saving: "Saving\u2026",
    save: "Save and query",
    storageReadOnly: "Credential storage is read-only. Configure {ref} through Harness credentials.",
    replaceNote: "The key is saved under this plugin's credential reference. Replacing it overwrites the key previously saved for this plugin.",
    range: "Date range",
    month: "This month",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    querying: "Loading\u2026",
    refresh: "Refresh",
    project: "Project filter",
    projectPlaceholder: "proj_\u2026 (blank for all projects)",
    apply: "Apply",
    loading: "Loading official data\u2026",
    scope: "Scope: {project} \xB7 UTC day boundaries \xB7 Updated {updated}",
    organization: "Entire organization",
    setupRequired: "Configure an admin key to view usage.",
    periodCosts: "Costs for selected period",
    noCosts: "No cost records",
    unavailable: "Unavailable",
    officialCosts: "Costs reported by OpenAI",
    inputTokens: "Input tokens",
    cachedDetail: "Includes {count} cached tokens",
    waitingUsage: "Waiting for official usage data",
    outputTokens: "Output tokens",
    requestsDetail: "Model requests: {count}",
    limits: "Limits and balance",
    openBilling: "Open billing",
    monthlyLimit: "Organization monthly spend limit",
    limitUnavailable: "Not available",
    enforcing: "Enforced \xB7 Organization-wide \xB7 Monthly",
    notEnforcing: "This limit is not currently enforced",
    limitHelp: "Availability depends on account permissions and API support",
    balance: "Account balance / credit grants",
    viewBilling: "View on the billing page",
    balanceHelp: "No verified public balance API is available. A spend limit is not an account balance.",
    dailyCosts: "Daily costs",
    noDailyCosts: "No cost records for the selected period.",
    dailyLabel: "Daily costs in {currency}",
    modelUsage: "Usage by model",
    modelHelp: "This table uses the official model usage API. Account costs may also include storage, images, tools, and other charges.",
    model: "Model",
    input: "Input",
    cached: "Cached input",
    output: "Output",
    requests: "Requests",
    noUsage: "No model usage records for the selected period.",
    costDetails: "Cost details \xB7 {count} items",
    lineItem: "Line item",
    projectId: "Project ID",
    amount: "Amount",
    unassigned: "Unassigned",
    ungroupedModel: "Ungrouped model",
    ungroupedCosts: "Ungrouped costs",
    notProvided: "Not provided",
    costNote: "Costs are aggregated from OpenAI records and may be delayed or adjusted. They are not final invoices, credit purchases, or payments. Dates use UTC; the update time uses your local time zone.",
    usagePage: "OpenAI usage",
    billingPage: "OpenAI billing",
    readOnly: "Read-only queries \xB7 No model calls",
    "error.FORBIDDEN": "Only the Harness owner can view or configure account information.",
    "error.INVALID_KEY": "Enter an Admin API Key starting with sk-admin-. A regular model key cannot query organization billing.",
    "error.READ_ONLY": "Credential storage is read-only. Set the admin key through Harness credentials.",
    "error.CREDENTIAL_STORAGE": "Could not save the admin key. Check the write permissions for Harness credential storage.",
    "error.NOT_FOUND": "Unknown account operation.",
    "error.INVALID_RANGE": "Choose this month, the last 7 days, or the last 30 days.",
    "error.INVALID_RESPONSE": "OpenAI returned incomplete data. This section is excluded from the totals. Retry or check the official usage page.",
    "error.CANCELLED": "Query cancelled.",
    "error.TIMEOUT": "The query timed out. Please try again later.",
    "error.NETWORK": "Cannot connect to OpenAI. Check your network or proxy settings and retry.",
    "error.AUTH": "The admin key is invalid, expired, or revoked. Configure a new Admin API Key.",
    "error.PERMISSION": "This key cannot access this data. Check the Admin API Key and organization permissions.",
    "error.UNAVAILABLE": "This account or API does not provide this information.",
    "error.RATE_LIMIT": "OpenAI has rate-limited these queries. Refresh again later.",
    "error.QUERY_REJECTED": "OpenAI rejected the query. Check the project ID or retry without filters.",
    "error.UPSTREAM": "OpenAI cannot provide this data right now. Please retry later.",
    "error.PAGINATION": "Not all pages could be retrieved, so an incomplete total is not shown. Retry or select a shorter period.",
    "error.INVALID_QUERY": "Invalid query parameters.",
    "error.INVALID_PROJECT": "Project IDs must start with proj_. Leave the field blank to query the entire organization.",
    "error.CONNECTION": "Cannot connect to the Harness query service. Check that the plugin is enabled and retry.",
    "error.SAVE_FAILED": "Could not save the key. Check the Harness connection and retry.",
    "error.UNKNOWN": "The operation failed. Please retry or check the official usage page."
  }
};

// src/client.jsx
var inject = ["slots", "connection", "locale"];
var namespace = "openai-account";
var links = {
  admin: "https://platform.openai.com/settings/organization/admin-keys",
  usage: "https://platform.openai.com/usage",
  billing: "https://platform.openai.com/settings/organization/billing/overview"
};
var money = (value, currency, language = "zh-CN") => `${new Intl.NumberFormat(language, { minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(value)} ${currency.toUpperCase()}`;
var External = ({ href, children }) => /* @__PURE__ */ import_react.default.createElement("a", { href, target: "_blank", rel: "noopener noreferrer" }, children, " \u2197");
var errorMessage = (error, t) => t(Object.hasOwn(en_default.ui, `error.${error?.code}`) ? `error.${error.code}` : "error.UNKNOWN");
var Problem = ({ section, t }) => section?.status === "error" ? /* @__PURE__ */ import_react.default.createElement("p", { className: "oa-error", role: "alert" }, errorMessage(section.error, t)) : null;
function Metric({ title, value, detail }) {
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-metric" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-label" }, title), /* @__PURE__ */ import_react.default.createElement("strong", null, value), /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-muted" }, detail));
}
function AccountPanel({ rpc, t, locale }) {
  const { active } = (0, import_react.useSyncExternalStore)(locale.subscribe, locale.getSnapshot);
  const language = active.toLowerCase().startsWith("zh") ? "zh-CN" : "en-US";
  const number = (value) => value == null ? t("notProvided") : new Intl.NumberFormat(language).format(value);
  const formatMoney = (value, currency) => money(value, currency, language);
  const dayLabel = (day) => new Intl.DateTimeFormat(language, { month: "2-digit", day: "2-digit", timeZone: "UTC" }).format(/* @__PURE__ */ new Date(`${day}T00:00:00Z`));
  const [range, setRange] = (0, import_react.useState)("month");
  const [projectDraft, setProjectDraft] = (0, import_react.useState)("");
  const [projectId, setProjectId] = (0, import_react.useState)("");
  const [revision, setRevision] = (0, import_react.useState)(0);
  const [state, setState] = (0, import_react.useState)({ loading: true, data: null, error: "" });
  const [editing, setEditing] = (0, import_react.useState)(false);
  const [key, setKey] = (0, import_react.useState)("");
  const [save, setSave] = (0, import_react.useState)({ pending: false, error: "" });
  const saveAbort = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => () => saveAbort.current?.abort(), []);
  (0, import_react.useEffect)(() => {
    const controller = new AbortController();
    setState({ loading: true, data: null, error: "" });
    rpc("overview", { range, projectId }, controller.signal).then((result) => {
      if (controller.signal.aborted) return;
      if (!result.ok) setState({ loading: false, data: null, error: result.error });
      else setState({ loading: false, data: result.value, error: "" });
    }).catch(() => {
      if (!controller.signal.aborted) setState({ loading: false, data: null, error: { code: "CONNECTION" } });
    });
    return () => controller.abort();
  }, [rpc, range, projectId, revision]);
  async function saveKey(event) {
    event.preventDefault();
    saveAbort.current?.abort();
    const controller = new AbortController();
    saveAbort.current = controller;
    setSave({ pending: true, error: "" });
    try {
      const result = await rpc("save-key", { key }, controller.signal);
      if (controller.signal.aborted) return;
      if (!result.ok) {
        setSave({ pending: false, error: result.error });
        return;
      }
      setKey("");
      setEditing(false);
      setSave({ pending: false, error: "" });
      setRevision((value) => value + 1);
    } catch {
      if (!controller.signal.aborted) setSave({ pending: false, error: { code: "SAVE_FAILED" } });
    }
  }
  const data = state.data;
  const overview = data?.overview;
  const usage = overview?.usage.status === "ready" ? overview.usage.data : null;
  const costs = overview?.costs.status === "ready" ? overview.costs.data : null;
  const limit = overview?.limit.status === "ready" ? overview.limit.data : null;
  const showSetup = editing || data?.configured === false;
  const currencies = [...new Set(costs?.daily.map((row) => row.currency) ?? [])];
  const updated = overview ? new Date(overview.fetchedAt).toLocaleString(language, { hour12: false }) : "";
  return /* @__PURE__ */ import_react.default.createElement("section", { className: "oa-panel", "aria-label": t("nav"), lang: language }, /* @__PURE__ */ import_react.default.createElement("style", null, styles), /* @__PURE__ */ import_react.default.createElement("header", { className: "oa-header" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("span", { className: "oa-eyebrow" }, "OPENAI USAGE"), /* @__PURE__ */ import_react.default.createElement("h2", null, t("title")), /* @__PURE__ */ import_react.default.createElement("p", { className: "oa-muted" }, t("subtitle"))), /* @__PURE__ */ import_react.default.createElement("button", { className: "oa-button", onClick: () => {
    setEditing(!editing);
    setKey("");
    setSave({ pending: false, error: "" });
  }, disabled: save.pending }, t(editing ? "closeSetup" : "configure"))), showSetup && /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-card oa-setup" }, /* @__PURE__ */ import_react.default.createElement("h3", null, t(data?.configured ? "replaceKey" : "connect")), /* @__PURE__ */ import_react.default.createElement("p", null, t("keyHelp")), /* @__PURE__ */ import_react.default.createElement("ol", null, /* @__PURE__ */ import_react.default.createElement("li", null, t("setupOrganization"), " ", /* @__PURE__ */ import_react.default.createElement(External, { href: links.admin }, t("openAdmin"))), /* @__PURE__ */ import_react.default.createElement("li", null, t("setupCreate")), /* @__PURE__ */ import_react.default.createElement("li", null, t("setupSave"))), /* @__PURE__ */ import_react.default.createElement("form", { onSubmit: saveKey, className: "oa-key-form" }, /* @__PURE__ */ import_react.default.createElement("label", { htmlFor: "oa-admin-key" }, "Admin API Key"), /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-inline" }, /* @__PURE__ */ import_react.default.createElement("input", { id: "oa-admin-key", type: "password", autoComplete: "off", spellCheck: false, placeholder: "sk-admin-\u2026", value: key, onChange: (event) => setKey(event.target.value), disabled: save.pending || data?.writable === false, required: true }), /* @__PURE__ */ import_react.default.createElement("button", { className: "oa-button oa-primary", type: "submit", disabled: save.pending || !key.trim() || data?.writable === false }, t(save.pending ? "saving" : "save")))), data?.writable === false && /* @__PURE__ */ import_react.default.createElement("p", { className: "oa-error" }, t("storageReadOnly", { ref: data.credentialRef })), save.error && /* @__PURE__ */ import_react.default.createElement("p", { role: "alert", className: "oa-error" }, errorMessage(save.error, t)), /* @__PURE__ */ import_react.default.createElement("p", { className: "oa-muted" }, t("replaceNote"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-toolbar" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-ranges", role: "group", "aria-label": t("range") }, ["month", "7d", "30d"].map((value) => /* @__PURE__ */ import_react.default.createElement("button", { key: value, "aria-pressed": range === value, onClick: () => setRange(value) }, t(value)))), /* @__PURE__ */ import_react.default.createElement("button", { className: "oa-button", disabled: state.loading, onClick: () => setRevision((value) => value + 1) }, t(state.loading ? "querying" : "refresh"))), /* @__PURE__ */ import_react.default.createElement("form", { className: "oa-project-form", onSubmit: (event) => {
    event.preventDefault();
    setProjectId(projectDraft.trim());
  } }, /* @__PURE__ */ import_react.default.createElement("label", { htmlFor: "oa-project" }, t("project")), /* @__PURE__ */ import_react.default.createElement("input", { id: "oa-project", placeholder: t("projectPlaceholder"), value: projectDraft, onChange: (event) => setProjectDraft(event.target.value) }), /* @__PURE__ */ import_react.default.createElement("button", { className: "oa-button", type: "submit" }, t("apply"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-status", "aria-live": "polite" }, state.loading ? t("loading") : state.error ? errorMessage(state.error, t) : overview ? t("scope", { project: projectId || t("organization"), updated }) : t("setupRequired")), overview && /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-metrics" }, /* @__PURE__ */ import_react.default.createElement(Metric, { title: t("periodCosts"), value: costs ? costs.totals.length ? costs.totals.map((row) => /* @__PURE__ */ import_react.default.createElement("span", { key: row.currency }, formatMoney(row.value, row.currency), /* @__PURE__ */ import_react.default.createElement("br", null))) : t("noCosts") : t("unavailable"), detail: t("officialCosts") }), /* @__PURE__ */ import_react.default.createElement(Metric, { title: t("inputTokens"), value: usage ? number(usage.inputTokens) : "\u2014", detail: usage ? t("cachedDetail", { count: number(usage.cachedTokens) }) : t("waitingUsage") }), /* @__PURE__ */ import_react.default.createElement(Metric, { title: t("outputTokens"), value: usage ? number(usage.outputTokens) : "\u2014", detail: usage ? t("requestsDetail", { count: number(usage.requests) }) : t("waitingUsage") })), /* @__PURE__ */ import_react.default.createElement(Problem, { section: overview.costs, t }), /* @__PURE__ */ import_react.default.createElement(Problem, { section: overview.usage, t }), /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-card" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-card-title" }, /* @__PURE__ */ import_react.default.createElement("h3", null, t("limits")), /* @__PURE__ */ import_react.default.createElement(External, { href: links.billing }, t("openBilling"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-limits" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-label" }, t("monthlyLimit")), /* @__PURE__ */ import_react.default.createElement("strong", null, limit ? formatMoney(limit.amount, limit.currency) : t("limitUnavailable")), /* @__PURE__ */ import_react.default.createElement("p", { className: "oa-muted" }, t(limit ? limit.enforcement === "enforcing" ? "enforcing" : "notEnforcing" : "limitHelp"))), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-label" }, t("balance")), /* @__PURE__ */ import_react.default.createElement("strong", null, t("viewBilling")), /* @__PURE__ */ import_react.default.createElement("p", { className: "oa-muted" }, t("balanceHelp")))), /* @__PURE__ */ import_react.default.createElement(Problem, { section: overview.limit, t })), costs && /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-card" }, /* @__PURE__ */ import_react.default.createElement("h3", null, t("dailyCosts")), !costs.daily.length ? /* @__PURE__ */ import_react.default.createElement("p", { className: "oa-muted" }, t("noDailyCosts")) : currencies.map((currency) => {
    const daily = costs.daily.filter((row) => row.currency === currency);
    const max = Math.max(...daily.map((row) => Math.abs(row.value)), 1e-6);
    return /* @__PURE__ */ import_react.default.createElement("div", { key: currency, className: "oa-trend", "aria-label": t("dailyLabel", { currency: currency.toUpperCase() }) }, daily.map((row) => /* @__PURE__ */ import_react.default.createElement("div", { key: row.day, className: "oa-trend-row" }, /* @__PURE__ */ import_react.default.createElement("time", { dateTime: row.day }, dayLabel(row.day)), /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-track" }, /* @__PURE__ */ import_react.default.createElement("div", { className: row.value < 0 ? "oa-bar oa-adjustment" : "oa-bar", style: { width: `${Math.abs(row.value) / max * 100}%` } })), /* @__PURE__ */ import_react.default.createElement("span", null, formatMoney(row.value, currency)))));
  })), usage && /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-card" }, /* @__PURE__ */ import_react.default.createElement("h3", null, t("modelUsage")), /* @__PURE__ */ import_react.default.createElement("p", { className: "oa-muted" }, t("modelHelp")), /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-table-wrap" }, /* @__PURE__ */ import_react.default.createElement("table", null, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", null, ["model", "input", "cached", "output", "requests"].map((key2) => /* @__PURE__ */ import_react.default.createElement("th", { key: key2 }, t(key2))))), /* @__PURE__ */ import_react.default.createElement("tbody", null, usage.models.map((row) => /* @__PURE__ */ import_react.default.createElement("tr", { key: row.model }, /* @__PURE__ */ import_react.default.createElement("td", null, row.model === "\u672A\u5206\u7EC4\u6A21\u578B" ? t("ungroupedModel") : row.model), /* @__PURE__ */ import_react.default.createElement("td", null, number(row.inputTokens)), /* @__PURE__ */ import_react.default.createElement("td", null, number(row.cachedTokens)), /* @__PURE__ */ import_react.default.createElement("td", null, number(row.outputTokens)), /* @__PURE__ */ import_react.default.createElement("td", null, number(row.requests))))))), !usage.models.length && /* @__PURE__ */ import_react.default.createElement("p", { className: "oa-muted" }, t("noUsage"))), costs && costs.items.length > 0 && /* @__PURE__ */ import_react.default.createElement("details", { className: "oa-card" }, /* @__PURE__ */ import_react.default.createElement("summary", null, t("costDetails", { count: number(costs.items.length) })), /* @__PURE__ */ import_react.default.createElement("div", { className: "oa-table-wrap" }, /* @__PURE__ */ import_react.default.createElement("table", null, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", null, ["lineItem", "projectId", "amount"].map((key2) => /* @__PURE__ */ import_react.default.createElement("th", { key: key2 }, t(key2))))), /* @__PURE__ */ import_react.default.createElement("tbody", null, costs.items.map((row, index) => /* @__PURE__ */ import_react.default.createElement("tr", { key: index }, /* @__PURE__ */ import_react.default.createElement("td", null, row.lineItem === "\u672A\u5206\u7EC4\u8D39\u7528" ? t("ungroupedCosts") : row.lineItem), /* @__PURE__ */ import_react.default.createElement("td", null, row.projectId ?? t("unassigned")), /* @__PURE__ */ import_react.default.createElement("td", null, formatMoney(row.value, row.currency)))))))), /* @__PURE__ */ import_react.default.createElement("p", { className: "oa-note" }, t("costNote"))), /* @__PURE__ */ import_react.default.createElement("footer", { className: "oa-footer" }, /* @__PURE__ */ import_react.default.createElement(External, { href: links.usage }, t("usagePage")), /* @__PURE__ */ import_react.default.createElement(External, { href: links.billing }, t("billingPage")), /* @__PURE__ */ import_react.default.createElement("span", null, t("readOnly"))));
}
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(namespace, { zh: zh_default.ui, en: en_default.ui }));
  const t = ctx.locale.bind(namespace);
  const locale = { subscribe: (listener) => ctx.locale.subscribe(listener), getSnapshot: () => ctx.locale.getSnapshot() };
  const rpc = (endpoint, payload, signal) => ctx.connection.rpc.call("/api", `openai-account/${endpoint}`, payload, signal);
  ctx.effect(() => ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "openai-account",
    label: () => t("nav"),
    locale: namespace,
    order: 85
  }, () => /* @__PURE__ */ import_react.default.createElement(AccountPanel, { rpc, t, locale }))));
}

return module.exports;}});
