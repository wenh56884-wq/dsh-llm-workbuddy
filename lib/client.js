window.__ModuleLoader__.load({
	id: "dsh-llm-workbuddy-cn",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react3 = require("react");
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");

// src/client/model-select.ts
var import_react = require("react");
var import_react_dom = require("react-dom");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// src/constants.ts
var WORKBUDDY_PROVIDER = "workbuddy";
var WORKBUDDY_APP_VERSION = "5.7.2";
var WORKBUDDY_CLI_VERSION = "2.156.0";
var WORKBUDDY_USER_AGENT = `WorkBuddy/${WORKBUDDY_APP_VERSION} CLI/${WORKBUDDY_CLI_VERSION}`;
var LOGIN_TIMEOUT_MS = 10 * 60 * 1e3;

// src/client/model-select.ts
function parseTag(tag) {
  const badge = /^badge:(.+):#([0-9a-f]{6})$/iu.exec(tag);
  const label = badge?.[1];
  const color = badge?.[2];
  if (label === void 0 || color === void 0) return void 0;
  return { label, color: `#${color}` };
}
function creditsOf(enriched) {
  return enriched?.credits;
}
var BUILTIN_DESCRIPTION_PROVIDER = "deepseek-official";
var camelCase = (id) => id.split("-").map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)).join("");
function builtinDescriptionOf(providerId, model, t) {
  if (providerId !== BUILTIN_DESCRIPTION_PROVIDER || model.description === void 0) return model.description;
  const wide = t;
  const key = `option.${camelCase(model.id)}.description`;
  const localized = wide(key);
  return localized !== key ? localized : model.description;
}
function rowRate(credits, promotion) {
  const promoLabel = promotion?.discountedRate;
  const label = promoLabel ?? credits;
  if (label === void 0) return void 0;
  return {
    label,
    promo: promoLabel !== void 0,
    free: isFreeCredits(label),
    ...promoLabel !== void 0 && promotion?.color !== void 0 ? { tint: promotion.color } : {}
  };
}
function isFreeCredits(credits) {
  return credits !== void 0 && /^x0(?:\.0+)?$/iu.test(credits.trim());
}
function useEnrichedCatalog(rpc, open, catalogKey) {
  const [entries, setEntries] = (0, import_react.useState)(() => /* @__PURE__ */ new Map());
  (0, import_react.useEffect)(() => {
    if (!open) return;
    let stopped = false;
    void rpc.models().then((models) => {
      if (stopped || models === void 0) return;
      const map = /* @__PURE__ */ new Map();
      for (const model of models) map.set(`${WORKBUDDY_PROVIDER}/${model.id}`, model);
      setEntries(map);
    }).catch(() => {
    });
    return () => {
      stopped = true;
    };
  }, [rpc, open, catalogKey]);
  return entries;
}
var richTooltip = ({ label, ...props }, children) => (0, import_react.createElement)(import_dsh_client_ui_primitives.Tooltip, { ...props, label, children });
function modelTooltipContent(providerId, model, enriched, t) {
  const badges = (enriched?.tags ?? []).map(parseTag).filter((tag) => tag !== void 0);
  const promotion = enriched?.promotion;
  const description = enriched?.description ?? builtinDescriptionOf(providerId, model, t);
  const promotionText = promotion?.text;
  return (0, import_react.createElement)(
    "div",
    { className: "cbms-tip" },
    (0, import_react.createElement)(
      "div",
      { className: "cbms-tipNameRow" },
      (0, import_react.createElement)("span", { className: "cbms-tipName" }, model.name),
      (0, import_react.createElement)("span", { className: "cbms-tipId" }, model.id)
    ),
    badges.length > 0 || promotion !== void 0 ? (0, import_react.createElement)(
      "div",
      { className: "cbms-tipTags" },
      badges.map((badge) => (0, import_react.createElement)("span", {
        key: badge.label,
        className: "cbms-tag",
        style: { color: badge.color, borderColor: badge.color }
      }, badge.label)),
      promotion !== void 0 ? (0, import_react.createElement)("span", {
        key: "promotion",
        className: "cbms-tag",
        style: { color: promotion.color, borderColor: promotion.color }
      }, promotion.label) : null
    ) : null,
    description !== void 0 && description.length > 0 ? (0, import_react.createElement)("div", { className: "cbms-tipDesc" }, description) : null,
    promotionText !== void 0 && promotionText.length > 0 ? (0, import_react.createElement)("div", { className: "cbms-tipPromo" }, promotionText) : null
  );
}
function WorkBuddyModelSelect({ locked, available, directory, load, select, rpc, t }) {
  const state = (0, import_react.useSyncExternalStore)(
    (fn) => directory.subscribe(fn),
    () => directory.getSnapshot(),
    // Third argument = server snapshot, keeping hydration reads consistent
    // with the client one (the directory snapshot is safe on the server).
    () => directory.getSnapshot()
  );
  const [open, setOpen] = (0, import_react.useState)(false);
  const [pane, setPane] = (0, import_react.useState)("root");
  const lastActionRef = (0, import_react.useRef)("load");
  const [toast, setToast] = (0, import_react.useState)(null);
  const toastSeq = (0, import_react.useRef)(0);
  const rootRef = (0, import_react.useRef)(null);
  const triggerRef = (0, import_react.useRef)(null);
  const menuRef = (0, import_react.useRef)(null);
  const [menuPos, setMenuPos] = (0, import_react.useState)(null);
  const itemRefs = (0, import_react.useRef)([]);
  const id = (0, import_react.useMemo)(() => `cb-model-${Math.random().toString(36).slice(2, 8)}`, []);
  const catalogKey = (0, import_react.useMemo)(
    () => state.groups.map((group) => `${group.id}:${group.models.map((model) => `${model.id}\0${model.name}\0${model.description ?? ""}`).join(",")}`).join("|"),
    [state.groups]
  );
  const enriched = useEnrichedCatalog(rpc, open, catalogKey);
  const choices = (0, import_react.useMemo)(() => state.groups.flatMap((group) => group.models.map((model) => ({
    group,
    model,
    selection: {
      provider: group.id,
      model: model.id,
      ...model.reasoning?.defaultEffort === void 0 ? {} : { reasoningEffort: model.reasoning.defaultEffort }
    }
  }))), [state.groups]);
  const currentChoice = choices[state.current === null ? -1 : choices.findIndex((c) => c.selection.provider === state.current?.provider && c.selection.model === state.current.model)];
  const reasoning = currentChoice?.model.reasoning;
  const effectiveEffort = state.current?.reasoningEffort ?? reasoning?.defaultEffort;
  const effortLabel = reasoning === void 0 ? void 0 : effectiveEffort === void 0 ? t("effort.providerDefault") : reasoning.efforts.find((level) => level.id === effectiveEffort)?.name ?? effectiveEffort;
  const effortChoices = (0, import_react.useMemo)(() => reasoning === void 0 ? [] : [
    ...reasoning.defaultEffort === void 0 ? [{ key: "provider-default", effort: void 0, label: t("effort.providerDefault") }] : [],
    ...reasoning.efforts.map((effort) => ({ key: `effort:${effort.id}`, effort: effort.id, label: effort.name }))
  ], [reasoning, t]);
  const busy = state.status === "selecting";
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (event.target instanceof Node && rootRef.current?.contains(event.target) === true) return;
      if (event.target instanceof Node && menuRef.current?.contains(event.target) === true) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
    };
  }, [open]);
  const initialRow = () => menuRef.current?.querySelector('[role="menuitemradio"][aria-checked="true"]:not([disabled])') ?? itemRefs.current.find((item) => item !== null && !item.disabled) ?? triggerRef.current;
  const paneFocus = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    const intent = paneFocus.current;
    paneFocus.current = null;
    if (!open || intent === null) return;
    if (intent === "drill") {
      initialRow()?.focus();
      return;
    }
    const cell = itemRefs.current[intent === "effort" ? 1 : 0];
    if (cell !== void 0 && cell !== null && !cell.disabled) cell.focus();
    else triggerRef.current?.focus();
  }, [open, pane]);
  (0, import_react.useLayoutEffect)(() => {
    if (!open) {
      setMenuPos(null);
      return;
    }
    const place = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect === void 0) return;
      const MARGIN = 12;
      const lw = menuRef.current?.offsetWidth ?? 0;
      const lh = menuRef.current?.offsetHeight ?? 0;
      let x = rect.right - lw;
      let y = rect.top - 8 - lh;
      if (lw > 0) x = Math.min(Math.max(x, MARGIN), window.innerWidth - lw - MARGIN);
      if (lh > 0) y = Math.min(Math.max(y, MARGIN), window.innerHeight - lh - MARGIN);
      setMenuPos({ left: x, top: y });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, pane, state]);
  if (!available) return null;
  const reload = () => {
    lastActionRef.current = "load";
    load();
  };
  const show = () => {
    triggerRef.current?.focus();
    setPane("root");
    setOpen(true);
    reload();
  };
  const close = (restoreFocus = false) => {
    setOpen(false);
    setPane("root");
    if (restoreFocus) queueMicrotask(() => {
      triggerRef.current?.focus();
    });
  };
  const drill = (next) => {
    paneFocus.current = "drill";
    setPane(next);
  };
  const back = (from) => {
    paneFocus.current = from;
    setPane("root");
  };
  const moveFocus = (offset) => {
    const items = itemRefs.current.filter((item) => item !== null);
    if (items.length === 0) return;
    const active = items.findIndex((item) => item === document.activeElement);
    items[active === -1 ? offset > 0 ? 0 : items.length - 1 : (active + offset + items.length) % items.length]?.focus();
  };
  const onRootKeyDown = (event) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      if (pane !== "root") back(pane);
      else close(true);
      return;
    }
    if (!open) return;
    if (event.key === "Tab") {
      if (event.shiftKey) {
        event.preventDefault();
        if (pane !== "root") back(pane);
        else close(true);
        return;
      }
      const focused = document.activeElement;
      const rows = itemRefs.current.filter((item) => item !== null);
      if (focused instanceof HTMLButtonElement && rows.includes(focused)) {
        event.preventDefault();
        focused.click();
        return;
      }
      if (focused !== triggerRef.current) return;
      event.preventDefault();
      initialRow()?.focus();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(event.key === "ArrowDown" ? 1 : -1);
    }
  };
  const onBlur = (event) => {
    if (event.relatedTarget instanceof Node && (rootRef.current?.contains(event.relatedTarget) === true || menuRef.current?.contains(event.relatedTarget) === true)) return;
    close();
  };
  const settleSelection = (result) => {
    if (result === void 0) return;
    if (result.ok) {
      if (rootRef.current !== null) close(true);
      return;
    }
    const { error } = result;
    toastSeq.current += 1;
    setToast({
      text: error.code === "session/writer-held" ? t("error.sessionInUse") : t("error.action", { message: `${error.code}: ${error.message}` })
    });
  };
  const submit = (selection) => {
    lastActionRef.current = "select";
    triggerRef.current?.focus();
    void select(selection).then(settleSelection);
  };
  const choose = (selection) => {
    if (state.current?.provider === selection.provider && state.current.model === selection.model) {
      close(true);
      return;
    }
    submit(selection);
  };
  const chooseEffort = (effort) => {
    if (state.current === null) return;
    if (effectiveEffort === effort) {
      close(true);
      return;
    }
    submit({
      provider: state.current.provider,
      model: state.current.model,
      ...effort === void 0 ? {} : { reasoningEffort: effort }
    });
  };
  const waiting = state.current === null && state.status === "loading";
  const modelLabel = waiting ? t("trigger.loading") : currentChoice?.model.name ?? (state.current === null ? t("trigger.fallback") : `${state.current.provider}/${state.current.model}`);
  const triggerAria = waiting ? t("trigger.loading") : state.current === null ? t("trigger.selectAria") : effortLabel === void 0 ? t("trigger.aria", { model: modelLabel }) : t("trigger.ariaEffort", { model: modelLabel, effort: effortLabel });
  itemRefs.current = [];
  let itemIndex = 0;
  const itemRef = () => {
    const at = itemIndex++;
    return (node) => {
      itemRefs.current[at] = node;
    };
  };
  return (0, import_react.createElement)(
    "div",
    {
      ref: rootRef,
      className: "cbms-root",
      onKeyDown: onRootKeyDown,
      onBlur,
      // A row press must not blur the trigger before its click lands: the menu
      // is portaled, so without this the root's blur handler would close it.
      onMouseDown: (event) => {
        if (event.target instanceof Element && event.target.closest("button") !== null) event.preventDefault();
      }
    },
    (0, import_react.createElement)(
      "button",
      {
        ref: triggerRef,
        type: "button",
        className: "cbms-trigger",
        "aria-label": triggerAria,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? `${id}-menu` : void 0,
        title: `${modelLabel}${effortLabel === void 0 ? "" : ` \xB7 ${effortLabel}`}`,
        disabled: locked,
        onClick: () => {
          if (open) close(true);
          else show();
        }
      },
      // The icon slot and the label/effort pair respond to the composer's
      // compact-mode CSS variables, so the seat folds to icon-only with the
      // rest of the composer controls.
      (0, import_react.createElement)(import_dsh_client_ui_primitives.IconDataOutlineRegular, { className: "cbms-triggerIcon", size: 16 }),
      (0, import_react.createElement)("span", { className: "cbms-triggerLabel" }, modelLabel),
      effortLabel !== void 0 ? (0, import_react.createElement)("span", { className: "cbms-triggerEffort" }, effortLabel) : null,
      (0, import_react.createElement)(import_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { className: `cbms-chevron${open ? " cbms-chevronOpen" : ""}` })
    ),
    open ? (0, import_react_dom.createPortal)((0, import_react.createElement)(
      "div",
      {
        ref: menuRef,
        id: `${id}-menu`,
        className: "cbms-menu",
        // Before the placement pass lands, stay hidden at the origin so the
        // menu can be measured (offsetWidth/offsetHeight) without a flash.
        style: menuPos ?? { visibility: "hidden", left: 0, top: 0 },
        role: "menu",
        "aria-label": t("menu.aria"),
        "aria-busy": state.status === "loading" || busy
      },
      pane === "root" ? (0, import_react.createElement)(
        import_react.Fragment,
        null,
        (0, import_react.createElement)(
          "button",
          {
            ref: itemRef(),
            type: "button",
            role: "menuitem",
            className: "cbms-cell",
            onClick: () => {
              drill("model");
            }
          },
          (0, import_react.createElement)("span", { className: "cbms-cellLabel" }, t("menu.model")),
          (0, import_react.createElement)("span", { className: "cbms-cellValue" }, modelLabel),
          (0, import_react.createElement)(import_dsh_client_ui_primitives.IconChevronRightOutlineRegular, { className: "cbms-cellChevron" })
        ),
        reasoning !== void 0 ? (0, import_react.createElement)(
          "button",
          {
            ref: itemRef(),
            type: "button",
            role: "menuitem",
            className: "cbms-cell",
            onClick: () => {
              drill("effort");
            }
          },
          (0, import_react.createElement)("span", { className: "cbms-cellLabel" }, t("menu.effort")),
          (0, import_react.createElement)("span", { className: "cbms-cellValue" }, effortLabel),
          (0, import_react.createElement)(import_dsh_client_ui_primitives.IconChevronRightOutlineRegular, { className: "cbms-cellChevron" })
        ) : null
      ) : null,
      pane === "model" ? (0, import_react.createElement)(
        import_react.Fragment,
        null,
        state.status === "loading" ? (0, import_react.createElement)("div", { className: "cbms-status" }, t("status.loading")) : null,
        state.error !== null && lastActionRef.current === "load" ? (0, import_react.createElement)(
          "div",
          { className: "cbms-error" },
          (0, import_react.createElement)("span", null, t("error.action", { message: state.error })),
          (0, import_react.createElement)("button", { type: "button", className: "cbms-retry", onClick: reload }, t("action.reload"))
        ) : null,
        state.failures.map((failure) => (0, import_react.createElement)(
          "div",
          { className: "cbms-warning", key: failure.id },
          (0, import_react.createElement)("span", null, t("warning.groupLoad", { name: failure.name, message: failure.message })),
          (0, import_react.createElement)("button", { type: "button", className: "cbms-retry", onClick: reload }, t("action.reload"))
        )),
        (0, import_react.createElement)(
          "div",
          { className: "cbms-groups scrollable" },
          state.groups.map((group) => (0, import_react.createElement)(
            "section",
            {
              role: "group",
              "aria-labelledby": `${id}-${group.id}`,
              className: "cbms-group",
              key: group.id
            },
            (0, import_react.createElement)("div", { className: "cbms-groupTitle", id: `${id}-${group.id}` }, group.name),
            group.models.map((model) => {
              const selected = state.current?.provider === group.id && state.current.model === model.id;
              const extra = enriched.get(`${group.id}/${model.id}`);
              const rate = rowRate(creditsOf(extra), extra?.promotion);
              const badges = (extra?.tags ?? []).map(parseTag).filter((tag) => tag !== void 0);
              const promotion = extra?.promotion;
              return richTooltip({
                key: model.id,
                label: modelTooltipContent(group.id, model, extra, t),
                side: "top",
                portal: true,
                delayMs: 300
              }, (0, import_react.createElement)(
                "button",
                {
                  ref: itemRef(),
                  type: "button",
                  role: "menuitemradio",
                  "aria-checked": selected,
                  className: `cbms-option${selected ? " cbms-selected" : ""}`,
                  disabled: busy,
                  onClick: () => {
                    choose({ provider: group.id, model: model.id });
                  }
                },
                (0, import_react.createElement)(
                  "span",
                  { className: "cbms-optionCopy" },
                  (0, import_react.createElement)("span", { className: "cbms-modelName" }, model.name),
                  badges.map((badge) => (0, import_react.createElement)("span", {
                    key: badge.label,
                    className: "cbms-tag",
                    style: { color: badge.color, borderColor: badge.color }
                  }, badge.label)),
                  // The promotion badge rides after the catalog badges.
                  promotion !== void 0 ? (0, import_react.createElement)("span", {
                    key: "promotion",
                    className: "cbms-tag",
                    style: { color: promotion.color, borderColor: promotion.color }
                  }, promotion.label) : null
                ),
                // The selection check comes before the rate, so an
                // unselected row's multiplier sits flush right.
                (0, import_react.createElement)("span", { className: "cbms-check" }, selected ? (0, import_react.createElement)(import_dsh_client_ui_primitives.IconCheckOutlineRegular, null) : null),
                rate !== void 0 ? (0, import_react.createElement)("span", {
                  className: `cbms-credits${rate.promo ? " cbms-creditsPromo" : rate.free ? " cbms-creditsFree" : ""}`,
                  ...rate.tint === void 0 ? {} : { style: { color: rate.tint } }
                }, rate.label) : null
              ));
            })
          ))
        ),
        state.status === "ready" && choices.length === 0 ? (0, import_react.createElement)("div", { className: "cbms-empty" }, t("empty.models")) : null
      ) : null,
      pane === "effort" ? (0, import_react.createElement)(
        import_react.Fragment,
        null,
        state.error !== null && lastActionRef.current === "load" ? (0, import_react.createElement)(
          "div",
          { className: "cbms-error" },
          (0, import_react.createElement)("span", null, t("error.action", { message: state.error })),
          (0, import_react.createElement)("button", { type: "button", className: "cbms-retry", onClick: reload }, t("action.reload"))
        ) : null,
        effortChoices.length === 0 ? (0, import_react.createElement)("div", { className: "cbms-empty" }, t("empty.efforts")) : effortChoices.map((level) => {
          const selected = effectiveEffort === level.effort;
          return (0, import_react.createElement)(
            "button",
            {
              ref: itemRef(),
              type: "button",
              role: "menuitemradio",
              "aria-checked": selected,
              className: `cbms-option${selected ? " cbms-selected" : ""}`,
              key: level.key,
              disabled: busy,
              onClick: () => {
                chooseEffort(level.effort);
              }
            },
            (0, import_react.createElement)(
              "span",
              { className: "cbms-optionCopy" },
              (0, import_react.createElement)("span", { className: "cbms-modelName" }, level.label)
            ),
            (0, import_react.createElement)("span", { className: "cbms-check" }, selected ? (0, import_react.createElement)(import_dsh_client_ui_primitives.IconCheckOutlineRegular, null) : null)
          );
        })
      ) : null
    ), document.body) : null,
    toast !== null ? (0, import_react.createElement)(import_dsh_client_ui_primitives.Toast, {
      key: toastSeq.current,
      text: toast.text,
      icon: (0, import_react.createElement)(import_dsh_client_ui_primitives.IconWarningOutlineRegular, null),
      // Anchored to the composer card, as the official seat's toasts are.
      anchor: rootRef.current?.closest("[data-composer-card]") ?? null,
      onDone: () => {
        setToast(null);
      }
    }) : null
  );
}
var MODEL_SELECT_CSS = `
.cbms-root{min-width:0;position:relative}
.cbms-trigger{min-width:0;max-width:min(360px,45cqw);height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:24px;outline:none;align-items:center;gap:4px;padding:0 4px 0 8px;font-size:13px;font-weight:500;line-height:20px;display:flex}
.cbms-trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.cbms-trigger:focus-visible{box-shadow:0 0 0 2px var(--dsw-alias-border-l3)}
.cbms-trigger:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.cbms-triggerLabel{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}
.cbms-triggerEffort{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-caption);flex-shrink:1000;overflow:hidden}
.cbms-triggerIcon{display:var(--dsh-composer-model-icon-display,none);flex:none}
.cbms-triggerLabel,.cbms-triggerEffort{display:var(--dsh-composer-model-text-display,block)}
.cbms-chevron{color:var(--dsw-alias-label-caption);flex:none;transition:transform .12s}
.cbms-chevronOpen{transform:rotate(180deg)}
.cbms-menu{z-index:1100;background:var(--dsw-specific-menu);-webkit-backdrop-filter:var(--dsw-menu-backdrop-filter);backdrop-filter:var(--dsw-menu-backdrop-filter);--dsw-elevation-stroke-color:var(--dsw-alias-border-l1);width:max-content;min-width:min(300px,100vw - 32px);max-width:min(460px,100vw - 32px);max-height:min(360px,100vh - 96px);box-shadow:var(--dsw-elevation-prominent);color:var(--dsw-alias-label-primary);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);border:0;border-radius:16px;flex-direction:column;padding:3px;display:flex;position:fixed;overflow:hidden}
.cbms-status,.cbms-empty{color:var(--dsw-alias-label-tertiary);padding:8px;font-size:12px;line-height:18px}
.cbms-error,.cbms-warning{background:var(--dsw-alias-interactive-bg-hover-danger);color:var(--dsw-alias-state-error-primary);border-radius:7px;justify-content:space-between;align-items:flex-start;gap:6px;margin-bottom:3px;padding:6px 7px;font-size:11px;line-height:16px;display:flex}
.cbms-warning{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-state-warn-label)}
.cbms-retry{color:inherit;font:inherit;cursor:pointer;background:0 0;border:none;flex:none;padding:0;font-weight:600}
.cbms-groups{min-height:0;overflow-y:auto}
.cbms-group+.cbms-group{margin-top:3px}
.cbms-groupTitle{z-index:1;background:var(--dsw-specific-menu);color:var(--dsw-alias-label-tertiary);padding:4px 7px 2px;font-size:11px;font-weight:500;line-height:16px;position:sticky;top:0}
.cbms-option{box-sizing:border-box;width:auto;min-width:100%;min-height:34px;color:inherit;text-align:left;cursor:pointer;background:0 0;border:none;border-radius:8px;outline:none;align-items:center;gap:6px;padding:5px 7px;display:flex}
.cbms-option:hover:not(:disabled),.cbms-option:focus-visible{background:var(--dsw-alias-interactive-bg-hover)}
.cbms-selected{background:0 0}
.cbms-option:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.cbms-optionCopy{align-items:center;gap:6px;min-width:0;flex:1;display:flex}
.cbms-modelName{color:inherit;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:500;line-height:18px;overflow:hidden}
.cbms-tag{flex:none;border:0.5px solid;border-radius:4px;padding:0 5px;font-size:11px;line-height:16px;font-weight:400}
.cbms-credits{color:var(--dsw-alias-label-tertiary);font-variant-numeric:tabular-nums;white-space:nowrap;flex:none;font-size:12px;line-height:18px;font-weight:400}
.cbms-creditsFree{color:var(--dsw-alias-state-success-primary)}
.cbms-creditsPromo{color:var(--dsw-alias-state-business-primary)}
.cbms-check{color:var(--dsw-alias-label-primary);flex:0 0 14px;place-items:center;display:grid}
.cbms-check svg{width:14px;height:14px}
.cbms-cell{box-sizing:border-box;width:auto;min-width:100%;height:34px;color:var(--dsw-alias-label-primary);cursor:pointer;text-align:left;background:0 0;border:none;border-radius:8px;align-items:center;gap:6px;padding:0 8px;font-size:13px;line-height:20px;display:flex}
.cbms-cell:hover{background:var(--dsw-alias-interactive-bg-hover)}
.cbms-cellLabel{white-space:nowrap;flex:none}
.cbms-cellValue{text-overflow:ellipsis;white-space:nowrap;text-align:right;min-width:0;color:var(--dsw-alias-label-tertiary);flex:auto;overflow:hidden}
.cbms-cellChevron{width:12px;height:12px;color:var(--dsw-alias-label-tertiary);flex:none}
.cbms-tip{color:inherit;max-width:480px;flex-direction:column;gap:4px;display:flex}
.cbms-tipNameRow{align-items:baseline;gap:8px;min-width:0;display:flex;white-space:nowrap;overflow:hidden}
.cbms-tipName{font-weight:500;text-overflow:ellipsis;flex:0 1 auto;overflow:hidden}
.cbms-tipId{opacity:.65;font-size:12px;text-overflow:ellipsis;flex:0 1 auto;overflow:hidden}
.cbms-tipTags{flex-wrap:wrap;gap:4px;display:flex;max-width:280px}
.cbms-tipDesc{opacity:.85;font-size:12px;line-height:18px;max-width:280px}
.cbms-tipPromo{opacity:.85;font-size:12px;line-height:18px;border-top:1px solid color-mix(in srgb, currentColor 25%, transparent);padding-top:6px;max-width:280px}
`;

// src/client/usage-prefs.ts
var import_react2 = require("react");

// src/settings.ts
var WORKBUDDY_SETTINGS_NAMESPACE = "llm-workbuddy";
var SHOW_USAGE_FIELD = "showUsage";
var CUSTOM_LIMIT_FIELD = "customLimit";
var CUSTOM_LIMIT_UNIT_FIELD = "customLimitUnit";
var DANGER_PCT_FIELD = "dangerPct";
var DEFAULT_SHOW_USAGE = true;
var DEFAULT_DANGER_PCT = 90;
var CUSTOM_LIMIT_MIN = 0;
var CREDIT_UNITS = ["credit", "cny", "usd"];
var DEFAULT_CREDIT_UNIT = "credit";
function isCreditUnit(value) {
  return typeof value === "string" && CREDIT_UNITS.includes(value);
}
var DANGER_PCT_MIN = 1;
var DANGER_PCT_MAX = 100;

// src/client/usage-prefs.ts
var FALLBACK = {
  showUsage: DEFAULT_SHOW_USAGE,
  customLimitUnit: DEFAULT_CREDIT_UNIT,
  dangerPct: DEFAULT_DANGER_PCT
};
function normalize(section) {
  const { showUsage, customLimit, customLimitUnit, dangerPct } = section;
  const next = {
    showUsage: typeof showUsage === "boolean" ? showUsage : DEFAULT_SHOW_USAGE,
    // The unit only ever names a conversion the browser has; an unknown one
    // falls back to credits rather than rendering a figure in no unit at all.
    customLimitUnit: isCreditUnit(customLimitUnit) ? customLimitUnit : DEFAULT_CREDIT_UNIT,
    dangerPct: typeof dangerPct === "number" && Number.isFinite(dangerPct) && dangerPct >= DANGER_PCT_MIN && dangerPct <= DANGER_PCT_MAX ? dangerPct : DEFAULT_DANGER_PCT
  };
  if (typeof customLimit === "number" && Number.isFinite(customLimit) && customLimit >= CUSTOM_LIMIT_MIN) {
    next.customLimit = customLimit;
  }
  return next;
}
function equal(a, b) {
  return a.showUsage === b.showUsage && a.customLimit === b.customLimit && a.customLimitUnit === b.customLimitUnit && a.dangerPct === b.dangerPct;
}
function createUsagePrefs(form) {
  const initial = form.getSnapshot().value;
  let current = initial === void 0 ? FALLBACK : normalize(initial);
  const listeners = /* @__PURE__ */ new Set();
  const persistent = () => {
    const snapshot = form.getSnapshot();
    return snapshot.status === "loading" || snapshot.mode === "host" && snapshot.writable;
  };
  let lastPersistent = persistent();
  const publish = (next) => {
    if (equal(current, next)) return;
    current = next;
    for (const listener of [...listeners]) listener();
  };
  const adopt = () => {
    const snapshot = form.getSnapshot();
    if (snapshot.value !== void 0) publish(normalize(snapshot.value));
    const nextPersistent = persistent();
    if (nextPersistent !== lastPersistent) {
      lastPersistent = nextPersistent;
      for (const listener of [...listeners]) listener();
    }
  };
  const unsubscribeForm = form.subscribe(adopt);
  const write = (optimistic, persist) => {
    publish(optimistic);
    void persist().then(adopt, adopt);
  };
  return {
    getSnapshot: () => current,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    isPersistent: () => lastPersistent,
    setShowUsage: (value) => {
      write({ ...current, showUsage: value }, () => form.set(SHOW_USAGE_FIELD, value));
    },
    setCustomLimit: (value) => {
      const next = {
        showUsage: current.showUsage,
        customLimitUnit: current.customLimitUnit,
        dangerPct: current.dangerPct
      };
      if (value !== void 0) next.customLimit = value;
      write(
        next,
        value === void 0 ? () => form.unset(CUSTOM_LIMIT_FIELD) : () => form.set(CUSTOM_LIMIT_FIELD, value)
      );
    },
    setCustomLimitUnit: (value) => {
      if (value === current.customLimitUnit) return;
      write({ ...current, customLimitUnit: value }, () => form.set(CUSTOM_LIMIT_UNIT_FIELD, value));
    },
    setDangerPct: (value) => {
      write(
        { ...current, dangerPct: value ?? DEFAULT_DANGER_PCT },
        value === void 0 ? () => form.unset(DANGER_PCT_FIELD) : () => form.set(DANGER_PCT_FIELD, value)
      );
    },
    dispose: () => {
      unsubscribeForm();
      listeners.clear();
    }
  };
}
function useUsagePrefs(prefs) {
  return (0, import_react2.useSyncExternalStore)(prefs.subscribe, prefs.getSnapshot);
}
function usePersistentPrefs(prefs) {
  return (0, import_react2.useSyncExternalStore)(prefs.subscribe, prefs.isPersistent);
}

// src/client/units.ts
var CREDITS_PER_USD = 100;
var CNY_PER_USD = 7;
var CREDITS_PER_CNY = CREDITS_PER_USD / CNY_PER_USD;
var CREDIT_PRECISION = 4;
function round(value, places) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}
function creditsToUnit(credits, unit) {
  switch (unit) {
    case "usd":
      return credits / CREDITS_PER_USD;
    case "cny":
      return credits / CREDITS_PER_CNY;
    case "credit":
      return credits;
  }
}
function unitToCredits(value, unit) {
  switch (unit) {
    case "usd":
      return round(value * CREDITS_PER_USD, CREDIT_PRECISION);
    case "cny":
      return round(value * CREDITS_PER_CNY, CREDIT_PRECISION);
    case "credit":
      return value;
  }
}
function unitMinimum(unit, minCredits) {
  return unit === "credit" ? minCredits : round(creditsToUnit(minCredits, unit), 2);
}
function formatInUnit(credits, unit) {
  if (unit === "credit") {
    const rounded = Math.round(credits * 10) / 10;
    return rounded.toLocaleString(void 0, { maximumFractionDigits: 1 });
  }
  const amount = creditsToUnit(credits, unit);
  return amount.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatDraft(value, unit) {
  if (unit === "credit") return String(value);
  const rounded = Math.round(value * 100) / 100;
  return String(rounded);
}

// src/quota.ts
function usedPercent(used, limit) {
  if (limit > 0) return Math.min(Math.max(used / limit * 100, 0), 100);
  return 100;
}

// src/protocol.ts
var WORKBUDDY_AUTH_CHANNEL = "/workbuddy";

// src/client/index.ts
var loginChangeListeners = /* @__PURE__ */ new Set();
function emitLoginChange() {
  for (const listener of loginChangeListeners) listener();
}
function subscribeLoginChange(listener) {
  loginChangeListeners.add(listener);
  return () => {
    loginChangeListeners.delete(listener);
  };
}
function bindWorkBuddyRpc(rpc) {
  return {
    call: (endpoint, payload, signal) => rpc.call(WORKBUDDY_AUTH_CHANNEL, endpoint, payload, signal)
  };
}
var POLL_INTERVAL_MS = 1500;
var POLL_DEADLINE_MS = 10 * 60 * 1e3;
var s = {
  section: { display: "flex", flexDirection: "column", gap: "12px", padding: "8px 0" },
  title: { margin: 0, fontSize: "18px", fontWeight: 600, color: "var(--dsw-alias-label-primary)" },
  desc: { margin: 0, color: "var(--dsw-alias-label-secondary)", fontSize: "14px", lineHeight: "22px" },
  muted: { margin: 0, color: "var(--dsw-alias-label-secondary)", fontSize: "14px" },
  error: { margin: 0, color: "var(--dsw-alias-label-danger, #e5484d)", fontSize: "14px" },
  status: { display: "flex", flexDirection: "column", gap: "8px" },
  row: { display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", borderBottom: "1px solid var(--dsw-alias-border-l2)" },
  rowLabel: { color: "var(--dsw-alias-label-secondary)", fontSize: "14px", minWidth: "160px" },
  rowValue: { color: "var(--dsw-alias-label-primary)", fontSize: "14px", flex: 1, wordBreak: "break-all" },
  actions: { display: "flex", gap: "8px", marginTop: "8px" },
  // Usage indicator: a thin bar above the Settings trigger in the wide column,
  // and a ring in the rail. Both share the danger fill once usage crosses the
  // configured threshold.
  usageWrap: { display: "flex", alignItems: "center", gap: "8px", padding: "0 12px", height: "28px", width: "100%", boxSizing: "border-box" },
  usageBar: { position: "relative", flex: 1, height: "6px", borderRadius: "999px", background: "var(--dsw-alias-border-l2)", overflow: "hidden" },
  usageFill: { position: "absolute", inset: 0, transformOrigin: "left", transition: "width 240ms ease" },
  usagePct: { fontSize: "11px", color: "var(--dsw-alias-label-secondary)", fontVariantNumeric: "tabular-nums", minWidth: "34px", textAlign: "right" },
  usageRail: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "36px" }
};
function StatusRow({ label, value }) {
  return (0, import_react3.createElement)(
    "div",
    { style: s.row },
    (0, import_react3.createElement)("span", { style: s.rowLabel }, label),
    (0, import_react3.createElement)("span", { style: s.rowValue }, value)
  );
}
function AccountHeader({ label, value, expandable, open, onToggle }) {
  if (!expandable) return (0, import_react3.createElement)(StatusRow, { label, value });
  return (0, import_react3.createElement)(
    "button",
    {
      type: "button",
      className: "cb-accountHeader",
      "aria-expanded": open,
      onClick: onToggle
    },
    (0, import_react3.createElement)("span", { style: s.rowLabel }, label),
    (0, import_react3.createElement)("span", { style: s.rowValue }, value),
    // Owning transform lives in the scoped CSS, so the rotation is a pure
    // style concern and this stays a plain state attribute.
    (0, import_react3.createElement)(
      "span",
      { className: "cb-accountChevron", "data-open": open ? "true" : "false" },
      (0, import_react3.createElement)(import_dsh_client_ui_primitives2.IconChevronDownOutlineMedium)
    )
  );
}
function AccountInfo({ status, t }) {
  const [open, setOpen] = (0, import_react3.useState)(false);
  const details = [];
  if (status.uid !== void 0) details.push((0, import_react3.createElement)(StatusRow, { key: "uid", label: t("uid"), value: status.uid }));
  if (status.uin !== void 0) details.push((0, import_react3.createElement)(StatusRow, { key: "uin", label: t("uin"), value: status.uin }));
  if (status.domain !== void 0) details.push((0, import_react3.createElement)(StatusRow, { key: "domain", label: t("domain"), value: status.domain }));
  if (status.enterpriseName !== void 0) {
    details.push((0, import_react3.createElement)(StatusRow, { key: "enterprise", label: t("enterprise"), value: status.enterpriseName }));
  }
  if (status.enterpriseId !== void 0) {
    details.push((0, import_react3.createElement)(StatusRow, { key: "enterpriseId", label: t("enterpriseId"), value: status.enterpriseId }));
  }
  if (status.enterpriseUserName !== void 0) {
    details.push((0, import_react3.createElement)(StatusRow, { key: "enterpriseUser", label: t("enterpriseUser"), value: status.enterpriseUserName }));
  }
  if (status.departmentFullName !== void 0) {
    details.push((0, import_react3.createElement)(StatusRow, {
      key: "department",
      label: t("department"),
      value: decodeDepartment(status.departmentFullName)
    }));
  }
  return (0, import_react3.createElement)(
    import_react3.Fragment,
    null,
    (0, import_react3.createElement)(AccountHeader, {
      label: t("nickname"),
      value: status.nickname ?? "\u2014",
      expandable: details.length > 0,
      open,
      onToggle: () => {
        setOpen((v) => !v);
      }
    }),
    open ? (0, import_react3.createElement)(import_react3.Fragment, null, ...details) : null
  );
}
function decodeDepartment(raw) {
  try {
    const decoded = atob(raw);
    return new TextDecoder().decode(Uint8Array.from(decoded, (c) => c.charCodeAt(0)));
  } catch {
    return raw;
  }
}
function describeError(result) {
  return `${result.error.code}: ${result.error.message}`;
}
function unitSymbol(unit) {
  switch (unit) {
    case "usd":
      return "$";
    case "cny":
      return "\xA5";
    case "credit":
      return "";
  }
}
function amountInUnit(credits, unit) {
  return `${unitSymbol(unit)}${formatInUnit(credits, unit)}`;
}
function usageColor(pct, dangerPct) {
  if (pct === void 0) return "var(--dsw-alias-brand-primary, #3370ff)";
  return pct >= dangerPct ? "var(--dsw-alias-state-error-primary, #e5484d)" : "var(--dsw-alias-brand-primary, #3370ff)";
}
function usageTooltip(window2, t, unit) {
  const used = window2.used !== void 0 ? amountInUnit(window2.used, unit) : "\u2014";
  const total = window2.limit !== void 0 ? amountInUnit(window2.limit, unit) : "\u2014";
  const lines = [t("nav"), `${t("usageUsed")}: ${used} / ${total}`];
  if (window2.resetsAt !== void 0) lines.push(`${t("usageResets")}: ${window2.resetsAt}`);
  return lines.join("\n");
}
function UsageIndicator({ rpc, t, wide, prefs }) {
  const [usage, setUsage] = (0, import_react3.useState)(void 0);
  const { showUsage, customLimit, customLimitUnit, dangerPct } = useUsagePrefs(prefs);
  (0, import_react3.useEffect)(() => subscribeLoginChange(() => {
    void rpc.call("usage", {}).then((result) => {
      if (result.ok && result.value.loggedIn) setUsage(result.value);
      else setUsage(void 0);
    }).catch(() => {
    });
  }), [rpc]);
  (0, import_react3.useEffect)(() => {
    if (!showUsage) return;
    let stopped = false;
    const read = async () => {
      if (stopped) return;
      const result = await rpc.call("usage", {});
      if (stopped) return;
      if (result.ok && result.value.loggedIn) {
        setUsage(result.value);
      } else {
        setUsage(void 0);
      }
    };
    void read();
    const timer = window.setInterval(read, USAGE_REFRESH_MS);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [rpc, showUsage]);
  if (!showUsage) return null;
  const primary = usage?.primary;
  if (primary === void 0 || primary.used === void 0 || primary.limit === void 0) {
    return null;
  }
  const limit = customLimit ?? primary.limit;
  const pct = usedPercent(primary.used, limit);
  const derived = {
    name: primary.name,
    used: primary.used,
    limit,
    usedPercent: pct,
    ...primary.resetsAt === void 0 ? {} : { resetsAt: primary.resetsAt }
  };
  const label = usageTooltip(derived, t, customLimitUnit);
  const color = usageColor(derived.usedPercent, dangerPct);
  if (wide) {
    const anchor2 = (0, import_react3.createElement)(
      "div",
      { style: s.usageWrap },
      (0, import_react3.createElement)(
        "div",
        { style: s.usageBar },
        (0, import_react3.createElement)("div", { style: { ...s.usageFill, width: `${Math.min(pct, 100)}%`, background: color } })
      ),
      (0, import_react3.createElement)("span", { style: s.usagePct }, `${Math.round(pct)}%`)
    );
    return (0, import_react3.createElement)(import_dsh_client_ui_primitives2.Tooltip, { label, side: "top", delayMs: 300, children: anchor2 });
  }
  const size = 28;
  const stroke = 2.5;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.min(pct, 100) / 100 * c;
  const arcTransform = `rotate(-90 ${cx} ${cy})`;
  const anchor = (0, import_react3.createElement)(
    "div",
    { style: s.usageRail },
    (0, import_react3.createElement)(
      "svg",
      { width: size, height: size, viewBox: `0 0 ${size} ${size}` },
      (0, import_react3.createElement)("circle", {
        cx,
        cy,
        r,
        fill: "none",
        stroke: "var(--dsw-alias-border-l2)",
        strokeWidth: stroke
      }),
      (0, import_react3.createElement)("circle", {
        cx,
        cy,
        r,
        fill: "none",
        stroke: color,
        strokeWidth: stroke,
        strokeLinecap: "round",
        strokeDasharray: `${dash} ${c}`,
        transform: arcTransform
      }),
      (0, import_react3.createElement)("text", {
        x: cx,
        y: cy,
        textAnchor: "middle",
        dominantBaseline: "central",
        fill: "var(--dsw-alias-label-primary)",
        fontSize: 8,
        fontWeight: 600
      }, `${Math.round(pct)}`)
    )
  );
  return (0, import_react3.createElement)(import_dsh_client_ui_primitives2.Tooltip, { label, side: "right", delayMs: 300, children: anchor });
}
var USAGE_REFRESH_MS = 6e4;
function WorkBuddySection({ rpc, t, prefs }) {
  const [phase, setPhase] = (0, import_react3.useState)("loading");
  const [status, setStatus] = (0, import_react3.useState)(void 0);
  const [error, setError] = (0, import_react3.useState)(void 0);
  const [loginState, setLoginState] = (0, import_react3.useState)(void 0);
  const [loginSite, setLoginSite] = (0, import_react3.useState)(void 0);
  const starting = (0, import_react3.useRef)(false);
  const refresh = (0, import_react3.useCallback)(async () => {
    try {
      const result = await rpc.call("status", {});
      if (!result.ok) {
        setError(describeError(result));
        setPhase("error");
        return void 0;
      }
      setStatus(result.value);
      setPhase("idle");
      return result.value;
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : String(error2));
      setPhase("error");
      return void 0;
    }
  }, [rpc]);
  (0, import_react3.useEffect)(() => {
    void refresh();
  }, [refresh]);
  const cancelHandshake = (0, import_react3.useCallback)(async (state) => {
    try {
      const result = await rpc.call("cancelLogin", { state });
      return result.ok ? void 0 : describeError(result);
    } catch (error2) {
      return error2 instanceof Error ? error2.message : String(error2);
    }
  }, [rpc]);
  (0, import_react3.useEffect)(() => {
    if (loginState === void 0) return;
    const startedAt = Date.now();
    let stopped = false;
    const giveUp = async () => {
      await cancelHandshake(loginState);
      if (stopped) return;
      const current = await refresh();
      if (stopped) return;
      setLoginState(void 0);
      setLoginSite(void 0);
      if (current?.loggedIn === true) {
        emitLoginChange();
        return;
      }
      setError(t("timeout"));
      setPhase("error");
    };
    const tick = async () => {
      if (stopped) return;
      let result;
      try {
        result = await rpc.call("pollLogin", { state: loginState });
      } catch {
        result = void 0;
      }
      if (stopped) return;
      if (result?.ok === true && result.value.done) {
        setLoginState(void 0);
        setLoginSite(void 0);
        await refresh();
        emitLoginChange();
        return;
      }
      if (Date.now() - startedAt >= POLL_DEADLINE_MS) {
        await giveUp();
        return;
      }
      window.setTimeout(tick, POLL_INTERVAL_MS);
    };
    void tick();
    return () => {
      stopped = true;
    };
  }, [loginState, rpc, refresh, cancelHandshake, t]);
  const startLogin = (0, import_react3.useCallback)(async (site) => {
    if (starting.current) return;
    starting.current = true;
    setError(void 0);
    try {
      let result;
      try {
        result = await rpc.call("startLogin", { site });
      } catch (error2) {
        setError(error2 instanceof Error ? error2.message : String(error2));
        setPhase("error");
        return;
      }
      if (!result.ok) {
        setError(describeError(result));
        setPhase("error");
        return;
      }
      window.open(result.value.authUrl, "_blank", "noopener");
      setLoginSite(site);
      setLoginState(result.value.state);
    } finally {
      starting.current = false;
    }
  }, [rpc]);
  const cancelLogin = (0, import_react3.useCallback)(async () => {
    const state = loginState;
    if (state === void 0) return;
    const failure = await cancelHandshake(state);
    if (failure !== void 0) {
      setError(failure);
      setPhase("error");
      return;
    }
    setLoginState(void 0);
    setLoginSite(void 0);
    const current = await refresh();
    if (current?.loggedIn === true) emitLoginChange();
  }, [cancelHandshake, loginState, refresh]);
  const logout = (0, import_react3.useCallback)(async () => {
    let result;
    try {
      result = await rpc.call("logout", {});
    } catch (error2) {
      setError(error2 instanceof Error ? error2.message : String(error2));
      setPhase("error");
      return;
    }
    if (result.ok) {
      setStatus({ loggedIn: false });
      emitLoginChange();
    } else {
      setError(describeError(result));
      setPhase("error");
    }
  }, [rpc]);
  if (phase === "loading") {
    return (0, import_react3.createElement)("div", { style: s.section }, (0, import_react3.createElement)("p", { style: s.muted }, t("loading")));
  }
  const signedIn = status?.loggedIn === true;
  const account = status ?? { loggedIn: true };
  const usagePrefs = (0, import_react3.createElement)(UsagePrefRows, { t, prefs });
  return (0, import_react3.createElement)(
    "div",
    { style: s.section },
    (0, import_react3.createElement)("h2", { style: s.title }, "WorkBuddy"),
    error !== void 0 ? (0, import_react3.createElement)("p", { style: s.error }, error) : null,
    signedIn ? (0, import_react3.createElement)(
      "div",
      { style: s.status },
      (0, import_react3.createElement)(AccountInfo, {
        // Keyed by the account so replacing it (a new sign-in) starts
        // collapsed rather than inheriting the previous account's state.
        key: account.uid ?? "",
        status: account,
        t
      }),
      (0, import_react3.createElement)(
        "div",
        { style: s.actions },
        (0, import_react3.createElement)(import_dsh_client_ui_primitives2.Button, {
          variant: "outline",
          size: "md",
          onClick: () => {
            void logout();
          }
        }, t("signOut"))
      ),
      usagePrefs
    ) : (0, import_react3.createElement)(
      "div",
      { style: s.status },
      (0, import_react3.createElement)("p", { style: s.desc }, t("intro")),
      (0, import_react3.createElement)(
        "p",
        { style: s.muted },
        // Expired names the remedy; a bare "not signed in" would hide
        // that a sign-in is what is missing.
        loginState !== void 0 ? t("waiting") : status?.expired === true ? t("expired") : t("notSignedIn")
      ),
      // Separate accounts per host: the site must be chosen, not inferred.
      (0, import_react3.createElement)(
        "div",
        { style: s.actions },
        SIGN_IN_SITES.map((site) => (0, import_react3.createElement)(import_dsh_client_ui_primitives2.Button, {
          key: site,
          variant: "primary",
          size: "md",
          disabled: loginState !== void 0,
          onClick: () => {
            void startLogin(site);
          }
        }, loginSite === site ? t("signingIn") : t(site === "intl" ? "signInIntl" : "signInCn"))),
        loginState !== void 0 ? (0, import_react3.createElement)(import_dsh_client_ui_primitives2.Button, {
          variant: "outline",
          size: "md",
          onClick: () => {
            void cancelLogin();
          }
        }, t("cancel")) : null
      ),
      usagePrefs
    )
  );
}
var SIGN_IN_SITES = ["cn", "intl"];
function formatLimit(value, unit) {
  return value === void 0 ? "" : formatDraft(creditsToUnit(value, unit), unit);
}
function UsagePrefRows({ t, prefs }) {
  const { showUsage, customLimit, customLimitUnit, dangerPct } = useUsagePrefs(prefs);
  const [menuOpen, setMenuOpen] = (0, import_react3.useState)(false);
  const [unitMenuOpen, setUnitMenuOpen] = (0, import_react3.useState)(false);
  const [limitText, setLimitText] = (0, import_react3.useState)(() => formatLimit(customLimit, customLimitUnit));
  const [dangerText, setDangerText] = (0, import_react3.useState)(() => String(dangerPct));
  const persistent = usePersistentPrefs(prefs);
  (0, import_react3.useEffect)(() => {
    setLimitText(formatLimit(customLimit, customLimitUnit));
  }, [customLimit, customLimitUnit]);
  (0, import_react3.useEffect)(() => {
    setDangerText(String(dangerPct));
  }, [dangerPct]);
  const unitLabel = (unit) => t(unit === "credit" ? "unitCredit" : unit === "cny" ? "unitCny" : "unitUsd");
  return (0, import_react3.createElement)(
    import_react3.Fragment,
    null,
    // Non-loopback Host: the settings transport stays process-local, so edits
    // live only in this tab.
    !persistent ? (0, import_react3.createElement)("p", { className: "cb-prefNotice" }, t("notPersistedNotice")) : null,
    // Show/hide the usage indicator: a Menu dropdown so the control matches
    // the General-section selector affordance (no Switch ships with shell).
    (0, import_react3.createElement)(
      "div",
      { className: "cb-prefRow" },
      (0, import_react3.createElement)(
        "div",
        { className: "cb-prefRowText" },
        (0, import_react3.createElement)("div", { className: "cb-prefTitle" }, t("showUsage")),
        (0, import_react3.createElement)("div", { className: "cb-prefDesc" }, t("showUsageDesc"))
      ),
      (0, import_react3.createElement)(import_dsh_client_ui_primitives2.Menu, {
        open: menuOpen,
        onClose: () => {
          setMenuOpen(false);
        },
        items: [
          { id: "1", label: t("on") },
          { id: "0", label: t("off") }
        ],
        selectedId: showUsage ? "1" : "0",
        onSelect: (id) => {
          setMenuOpen(false);
          prefs.setShowUsage(id === "1");
        },
        align: "end",
        portal: true,
        anchor: (0, import_react3.createElement)(
          "button",
          {
            type: "button",
            className: "cb-prefSelector",
            "aria-haspopup": "menu",
            "aria-expanded": menuOpen,
            onClick: () => {
              setMenuOpen((v) => !v);
            }
          },
          showUsage ? t("on") : t("off"),
          (0, import_react3.createElement)(import_dsh_client_ui_primitives2.IconChevronDownOutlineMedium)
        )
      })
    ),
    // Custom quota cap: overrides the meter's reported limit. The amount is
    // typed in the selected unit and converted to credits here, the only unit
    // the Host stores. Empty clears it, re-inheriting the meter's own total.
    (0, import_react3.createElement)(
      "div",
      { className: "cb-prefRow" },
      (0, import_react3.createElement)(
        "div",
        { className: "cb-prefRowText" },
        (0, import_react3.createElement)("div", { className: "cb-prefTitle" }, t("customLimit")),
        (0, import_react3.createElement)("div", { className: "cb-prefDesc" }, t("customLimitDesc"))
      ),
      (0, import_react3.createElement)(
        "div",
        { className: "cb-prefControl" },
        (0, import_react3.createElement)(import_dsh_client_ui_primitives2.Input, {
          type: "number",
          inputMode: "decimal",
          // The bound follows the unit. The credit floor is zero, so the
          // currency floor is zero too — only a negative amount is refused.
          min: unitMinimum(customLimitUnit, CUSTOM_LIMIT_MIN),
          // A credit cap need not be whole: one entered as a currency is stored
          // at four-decimal credit precision (¥10 is 142.8571), which a fixed
          // step would flag as invalid. `any` still steps by one on arrow keys.
          step: customLimitUnit === "credit" ? "any" : 0.01,
          placeholder: t("customLimitPlaceholder"),
          className: "cb-prefInput",
          value: limitText,
          onChange: (e) => {
            setLimitText(e.currentTarget.value);
          },
          onBlur: () => {
            const shown = formatLimit(customLimit, customLimitUnit);
            if (limitText === shown) return;
            const parsed = Number(limitText);
            const credits = limitText.length === 0 || !Number.isFinite(parsed) ? void 0 : unitToCredits(parsed, customLimitUnit);
            if (credits === void 0 || credits < CUSTOM_LIMIT_MIN) {
              prefs.setCustomLimit(void 0);
              setLimitText(formatLimit(void 0, customLimitUnit));
              return;
            }
            prefs.setCustomLimit(credits);
            setLimitText(formatLimit(credits, customLimitUnit));
          }
        }),
        // Unit selector: the same dropdown affordance as the row above.
        (0, import_react3.createElement)(import_dsh_client_ui_primitives2.Menu, {
          open: unitMenuOpen,
          onClose: () => {
            setUnitMenuOpen(false);
          },
          items: CREDIT_UNITS.map((unit) => ({ id: unit, label: unitLabel(unit) })),
          selectedId: customLimitUnit,
          onSelect: (id) => {
            setUnitMenuOpen(false);
            if (isCreditUnit(id)) prefs.setCustomLimitUnit(id);
          },
          align: "end",
          portal: true,
          anchor: (0, import_react3.createElement)(
            "button",
            {
              type: "button",
              className: "cb-prefSelector",
              "aria-haspopup": "menu",
              "aria-expanded": unitMenuOpen,
              "aria-label": t("customLimitUnit"),
              onClick: () => {
                setUnitMenuOpen((v) => !v);
              }
            },
            unitLabel(customLimitUnit),
            (0, import_react3.createElement)(import_dsh_client_ui_primitives2.IconChevronDownOutlineMedium)
          )
        })
      )
    ),
    // Danger threshold: above this used-percentage the fill turns red.
    (0, import_react3.createElement)(
      "div",
      { className: "cb-prefRow" },
      (0, import_react3.createElement)(
        "div",
        { className: "cb-prefRowText" },
        (0, import_react3.createElement)("div", { className: "cb-prefTitle" }, t("dangerPct")),
        (0, import_react3.createElement)("div", { className: "cb-prefDesc" }, t("dangerPctDesc"))
      ),
      (0, import_react3.createElement)(import_dsh_client_ui_primitives2.Input, {
        type: "number",
        inputMode: "numeric",
        min: DANGER_PCT_MIN,
        max: DANGER_PCT_MAX,
        step: 1,
        className: "cb-prefInput",
        value: dangerText,
        onChange: (e) => {
          setDangerText(e.currentTarget.value);
        },
        onBlur: () => {
          const parsed = Number(dangerText);
          if (!Number.isFinite(parsed) || parsed < DANGER_PCT_MIN || parsed > DANGER_PCT_MAX) {
            prefs.setDangerPct(void 0);
            setDangerText(String(dangerPct));
          } else {
            prefs.setDangerPct(Math.round(parsed));
          }
        }
      })
    )
  );
}
var NS = "settings.workbuddy";
var DICTS = {
  zh: {
    "nav": "WorkBuddy",
    "intro": "\u4F7F\u7528\u817E\u8BAF WorkBuddy \u8D26\u53F7\u767B\u5F55\u3002",
    "loading": "\u52A0\u8F7D\u4E2D\u2026",
    "notSignedIn": "\u672A\u767B\u5F55\u3002",
    "expired": "\u767B\u5F55\u5DF2\u8FC7\u671F\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55\u3002",
    "waiting": "\u7B49\u5F85\u6D4F\u89C8\u5668\u767B\u5F55\u5B8C\u6210\u2026",
    "signInCn": "\u767B\u5F55\u4E2D\u56FD\u7AD9",
    "signInIntl": "\u767B\u5F55\u56FD\u9645\u7AD9",
    "signingIn": "\u767B\u5F55\u4E2D\u2026",
    "cancel": "\u53D6\u6D88",
    "signOut": "\u9000\u51FA\u767B\u5F55",
    "timeout": "\u767B\u5F55\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5\u3002",
    "nickname": "\u6635\u79F0",
    "uid": "UID",
    "uin": "UIN",
    "domain": "\u57DF\u540D",
    "enterprise": "\u4F01\u4E1A",
    "enterpriseId": "\u4F01\u4E1A ID",
    "enterpriseUser": "\u4F01\u4E1A\u7528\u6237\u540D",
    "department": "\u90E8\u95E8",
    "showUsage": "\u663E\u793A\u989D\u5EA6\u4F59\u91CF",
    "showUsageDesc": "\u5728\u4FA7\u8FB9\u680F\u5E95\u90E8\u8BBE\u7F6E\u6309\u94AE\u4E0A\u65B9\u663E\u793A\u5DF2\u7528\u989D\u5EA6\u8FDB\u5EA6\u3002",
    "notPersistedNotice": "\u5F53\u524D\u8FDE\u63A5\u4E0D\u6301\u4E45\u4FDD\u5B58\u504F\u597D\uFF1A\u5728\u6B64\u5904\u7684\u4FEE\u6539\u4EC5\u5BF9\u672C\u6B21\u4F1A\u8BDD\u751F\u6548\u3002",
    "on": "\u5F00",
    "off": "\u5173",
    "customLimit": "\u81EA\u5B9A\u4E49\u989D\u5EA6\u4E0A\u9650",
    "customLimitDesc": "\u8986\u76D6\u670D\u52A1\u7AEF\u4E0A\u62A5\u7684\u603B\u91CF\uFF0C\u6309\u6B64\u503C\u8BA1\u7B97\u5DF2\u7528\u767E\u5206\u6BD4\u3002\u7559\u7A7A\u5219\u4F7F\u7528\u670D\u52A1\u7AEF\u603B\u91CF\u3002",
    "customLimitPlaceholder": "\u4F7F\u7528\u9ED8\u8BA4",
    "customLimitUnit": "\u989D\u5EA6\u5355\u4F4D",
    "unitCredit": "\u79EF\u5206",
    "unitCny": "\u4EBA\u6C11\u5E01",
    "unitUsd": "\u7F8E\u5143",
    "dangerPct": "\u4F59\u91CF\u544A\u8B66\u767E\u5206\u6BD4",
    "dangerPctDesc": "\u5DF2\u7528\u767E\u5206\u6BD4\u8FBE\u5230\u6B64\u503C\u65F6\uFF0C\u8FDB\u5EA6\u6761\u53D8\u4E3A\u7EA2\u8272\u63D0\u9192\u3002\u9ED8\u8BA4 90%\u3002",
    "usageUsed": "\u5DF2\u7528\u989D\u5EA6",
    "usageResets": "\u91CD\u7F6E\u65F6\u95F4"
  },
  en: {
    "nav": "WorkBuddy",
    "intro": "Sign in with your Tencent WorkBuddy account.",
    "loading": "Loading\u2026",
    "notSignedIn": "Not signed in.",
    "expired": "Your session has expired. Please sign in again.",
    "waiting": "Waiting for the browser sign-in to complete\u2026",
    "signInCn": "Sign in (China)",
    "signInIntl": "Sign in (Intl)",
    "signingIn": "Signing in\u2026",
    "cancel": "Cancel",
    "signOut": "Sign out",
    "timeout": "Sign-in timed out. Please try again.",
    "nickname": "Nickname",
    "uid": "UID",
    "uin": "UIN",
    "domain": "Domain",
    "enterprise": "Enterprise",
    "enterpriseId": "Enterprise ID",
    "enterpriseUser": "Enterprise user",
    "department": "Department",
    "showUsage": "Show usage allowance",
    "showUsageDesc": "Display the used-allowance progress above the Settings button at the sidebar foot.",
    "notPersistedNotice": "Preferences are not persisted over this connection: changes here last only for this session.",
    "on": "On",
    "off": "Off",
    "customLimit": "Custom quota cap",
    "customLimitDesc": "Overrides the server-reported limit when computing the used percentage. Leave empty to use the server value.",
    "customLimitPlaceholder": "Default",
    "customLimitUnit": "Quota unit",
    "unitCredit": "Credits",
    "unitCny": "CNY",
    "unitUsd": "USD",
    "dangerPct": "Low-allowance alert",
    "dangerPctDesc": "The fill turns red once used usage reaches this percentage. Defaults to 90%.",
    "usageUsed": "Usage",
    "usageResets": "Resets at"
  }
};
var inject = [
  "slots",
  "locale",
  "connection",
  "configForms",
  "modelDirectories",
  "sessions",
  "remote",
  "remote.session"
];
var PREF_CSS = `
.cb-prefRow{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--dsw-alias-border-l2)}
.cb-prefRowText{display:flex;flex-direction:column;gap:4px;flex:1;min-width:0;padding-right:48px}
.cb-prefNotice{margin:0;font-size:12px;line-height:1.5;color:var(--dsw-alias-label-tertiary)}
.cb-prefTitle{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}
.cb-prefDesc{color:var(--dsw-alias-label-tertiary);font-size:12px;font-weight:400;line-height:18px}
.cb-prefSelector{background:var(--dsw-alias-bg-module-platform);height:36px;font:inherit;color:var(--dsw-alias-label-primary);cursor:pointer;border:none;border-radius:18px;align-items:center;gap:12px;padding:0 14px;font-size:14px;line-height:22px;display:inline-flex;flex:none}
.cb-prefSelector:hover{background:var(--dsw-alias-interactive-bg-hover)}
.cb-prefSelector:focus-visible{outline:1.5px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.cb-prefInput{width:120px}
.cb-prefControl{display:flex;align-items:center;gap:8px;flex:none}
.cb-accountHeader{display:flex;align-items:center;gap:12px;width:100%;padding:8px 0;border:none;border-bottom:1px solid var(--dsw-alias-border-l2);background:none;font:inherit;text-align:left;cursor:pointer}
.cb-accountHeader:hover .cb-accountChevron{color:var(--dsw-alias-label-secondary)}
.cb-accountHeader:focus-visible{outline:1.5px solid var(--dsw-alias-brand-primary);outline-offset:2px;border-radius:6px}
.cb-accountChevron{display:inline-flex;flex:none;color:var(--dsw-alias-label-tertiary);transition:transform 160ms ease,color 160ms ease}
.cb-accountChevron[data-open="true"]{transform:rotate(180deg)}
`;
var PREF_CSS_TAG = "dsh-llm-workbuddy-cn/pref.module.css";
function injectPrefCss() {
  if (typeof document === "undefined") return;
  if (document.querySelector(`style[data-plugin-css=${JSON.stringify(PREF_CSS_TAG)}]`) !== null) return;
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-llm-workbuddy-cn";
  tag.dataset.pluginCss = PREF_CSS_TAG;
  tag.textContent = PREF_CSS;
  document.head.appendChild(tag);
}
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, DICTS), "dsh-llm-workbuddy-cn: settings copy");
  injectPrefCss();
  injectModelSelectCss();
  const rpc = bindWorkBuddyRpc(ctx.connection.rpc);
  const t = ctx.locale.bind(NS);
  const prefs = createUsagePrefs(ctx.configForms.get(WORKBUDDY_SETTINGS_NAMESPACE));
  ctx.effect(() => () => {
    prefs.dispose();
  }, "dsh-llm-workbuddy-cn: settings form subscription");
  const injected = () => ({ rpc, prefs });
  ctx.effect(() => {
    const locale = ctx.locale;
    let last;
    const report = () => {
      const active = locale.getSnapshot?.()?.active;
      if (active === void 0 || active === last) return;
      last = active;
      void Promise.resolve(rpc.call("locale", active)).catch(() => {
      });
    };
    report();
    return locale.subscribe?.(report) ?? (() => {
    });
  }, "dsh-llm-workbuddy-cn: language reporting");
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "workbuddy",
    order: 25,
    label: () => t("nav"),
    locale: NS,
    inject: injected
  }, WorkBuddySection));
  ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
    name: "sidebar.footer.action",
    id: "workbuddy-usage",
    order: 10,
    locale: NS,
    inject: injected
  }, UsageIndicator));
  ctx.inject(["slots", "modelDirectories", "sessions", "remote", "remote.session"], (scope) => {
    const models = scope.modelDirectories;
    const sessions = scope.sessions;
    const enrichedRpc = {
      models: async () => {
        const result = await rpc.call("models", {});
        return result.ok && result.value.loggedIn ? result.value.models : void 0;
      }
    };
    const modelT = ctx.locale.bind("model");
    scope.slots.inject("conversation.input.model", () => scope.slots.register({
      name: "conversation.input.model",
      // Shadowing requires a lower priority than the shipped default 0.
      priority: -1,
      inject: (sessionId) => {
        const directory = models.directoryFor(sessionId);
        return {
          available: sessions.subagentAddress(sessionId) === void 0,
          directory: directory.store,
          load: () => {
            directory.load().catch(() => {
            });
          },
          select: (selection) => directory.select(selection)
        };
      }
    }, (props) => WorkBuddyModelSelect({
      ...props,
      rpc: enrichedRpc,
      t: modelT
    })));
  });
}
function injectModelSelectCss() {
  if (typeof document === "undefined") return;
  if (document.querySelector('style[data-plugin-css="dsh-llm-workbuddy-cn/model-select.module.css"]') !== null) return;
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-llm-workbuddy-cn";
  tag.dataset.pluginCss = "dsh-llm-workbuddy-cn/model-select.module.css";
  tag.textContent = MODEL_SELECT_CSS;
  document.head.appendChild(tag);
}

		return module.exports;
	}
});
//# sourceMappingURL=client.js.map
