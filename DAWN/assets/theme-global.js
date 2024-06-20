const commonConfigs = { loop: !0 },
  configs = {
    mobile: { autoHeight: !0, loop: !0 },
    "quick-view": { autoHeight: !0 },
    "layout-4": {},
    "layout-5": {
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: !0,
      watchSlidesVisibility: !0,
      breakpoints: {
        768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 10 },
      },
    },
    "layout-6": {},
    "layout-7": { slidesPerView: 3, speed: 500, centeredSlides: !0 },
  },
  requestDefaultConfigs = {
    mode: "same-origin",
    credentials: "same-origin",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
    },
  };
function getRequestDefaultConfigs() {
  return JSON.parse(JSON.stringify(requestDefaultConfigs));
}
function fetchJSON(e, t = getRequestDefaultConfigs()) {
  return fetch(e, t).then(function (e) {
    if (!e.ok) throw e;
    return e.json();
  });
}
const cache = new Map();
function fetchCache(e, t = getRequestDefaultConfigs()) {
  return new Promise((n, o) => {
    let s = cache.get(e);
    if (s) return n(s);
    fetch(e, t)
      .then((t) => {
        (s = t.text()), cache.set(e, s), n(s);
      })
      .catch(o);
  });
}
const sectionCache = new Map();
function fetchSection(e, t = {}) {
  const { url: n, fromCache: o = !1, params: s = {} } = t;
  return new Promise((t, r) => {
    const i = new URL(n || window.location.href);
    if (
      (i.searchParams.set("section_id", e),
      Object.entries(s).forEach(([e, t]) => i.searchParams.set(e, t)),
      o)
    ) {
      const e = sectionCache.get(i);
      if (e) return t(e);
    }
    fetch(i, getRequestDefaultConfigs())
      .then((t) => {
        if (t.ok) return t.text();
        r(`Failed to load section: ${e}`);
      })
      .then((e) => {
        const n = generateDomFromString(e);
        sectionCache.set(i, n), t(n);
      })
      .catch(r);
  });
}
const cache2 = new Map();
function fetchJsonCache(e, t = requestDefaultConfigs) {
  return new Promise((n, o) => {
    if (cache2.get(e)) return n(cache2.get(e));
    fetch(e, t)
      .then((t) => {
        if (t.ok) {
          const o = t.json();
          return n(o), cache2.set(e, o), o;
        }
        o(t);
      })
      .catch(o);
  });
}
function formatMoney(e, t) {
  "string" == typeof e && (e = e.replace(".", ""));
  let n = "";
  const o = /\{\{\s*(\w+)\s*\}\}/,
    s = t || "${{amount}}";
  function r(e, t = 2, n = ",", o = ".") {
    if (isNaN(e) || null == e) return 0;
    const s = (e = (e / 100).toFixed(t)).split(".");
    return (
      s[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${n}`) +
      (s[1] ? o + s[1] : "")
    );
  }
  switch (s.match(o)[1]) {
    case "amount":
      n = r(e, 2);
      break;
    case "amount_no_decimals":
      n = r(e, 0);
      break;
    case "amount_with_comma_separator":
      n = r(e, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      n = r(e, 0, ".", ",");
  }
  return s.replace(o, n);
}
function validateForm(e) {
  const t = [];
  if (!e) return t;
  return (
    e
      .querySelectorAll(
        '[data-product-custom-field] [name][required]:not([hidden]):not([type="hidden"])'
      )
      .forEach((n) => {
        if ((n.classList.remove("form-control--warning"), "radio" === n.type)) {
          const o = e.querySelectorAll(`input[name="${n.name}"]`);
          Array.from(o).some((e) => e.checked) ||
            (t.push(n), n.classList.add("form-control--warning"));
        } else n.value || (t.push(n), n.classList.add("form-control--warning"));
      }),
    t
  );
}
function generateDomFromString(e, t = "div") {
  const n = document.createElement(t);
  return (n.innerHTML = e), n;
}
function loadAssetsNew(e = [], t, n = () => {}, o = {}) {
  const s = t || Math.random().toString(36).slice(2);
  window.MinimogLibs.loadjs.isDefined(t) || window.MinimogLibs.loadjs(e, s),
    window.MinimogLibs.loadjs.ready(s, n);
}
function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((e) => {
    e.contentWindow.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      "*"
    );
  }),
    document.querySelectorAll(".js-vimeo").forEach((e) => {
      e.contentWindow.postMessage('{"method":"pause"}', "*");
    }),
    document.querySelectorAll("video").forEach((e) => e.pause()),
    document.querySelectorAll("product-model").forEach((e) => {
      e.modelViewerUI && e.modelViewerUI.pause();
    });
}
function getProductSliderConfig(e) {
  const t = configs[e] || configs["layout-4"];
  return Object.assign({}, commonConfigs, t);
}
function loadJS(e, t = document.body, n = !1, o = !0) {
  return new Promise((s, r) => {
    const i = t.ownerDocument,
      c = i.querySelector(`script[src="${e}"]`);
    if (c)
      return c.dataset.loaded
        ? s(!0)
        : void c.addEventListener("load", () => {
            (c.dataset.loaded = !0), s(!0);
          });
    const a = i.createElement("script");
    (a.src = e),
      (a.async = n),
      (a.defer = o),
      a.addEventListener("load", () => {
        (a.dataset.loaded = !0), s(!0);
      }),
      (a.onerror = r),
      t.appendChild(a);
  });
}
function loadCSS(e, t = document.head) {
  return new Promise((n, o) => {
    const s = t.ownerDocument,
      r = s.querySelector(`link[href="${e}"]`);
    if (r)
      return r.dataset.loaded
        ? n(!0)
        : void r.addEventListener("load", () => {
            (r.dataset.loaded = !0), n(!0);
          });
    const i = s.createElement("link");
    (i.rel = "stylesheet"),
      (i.href = e),
      i.addEventListener("load", () => {
        (i.dataset.loaded = !0), n(!0);
      }),
      (i.onerror = o),
      t.appendChild(i);
  });
}
function addEventDelegate({
  context: e = document.documentElement,
  event: t = "click",
  selector: n,
  handler: o,
  capture: s = !1,
}) {
  const r = function (e) {
    for (let t = e.target; t && t !== this; t = t.parentNode)
      if (t.matches(n)) {
        o.call(t, e, t);
        break;
      }
  };
  return (
    e.addEventListener(t, r, s),
    () => {
      e.removeEventListener(t, r, s);
    }
  );
}
const { themeScriptURLs: themeScriptURLs, themeStyleURLs: themeStyleURLs } =
    window,
  themeAssets = {
    js: { urls: themeScriptURLs, load: loadJS },
    css: { urls: themeStyleURLs, load: loadCSS },
  };
function log(e) {}
function loadAssets(e, ...t) {
  return new Promise((n, o) => {
    const s = "string" == typeof e ? [e] : e;
    Promise.all(
      s.map(async (e) => {
        try {
          const [, n, o] = e.match(/(.*)\.(js|css)$/) || [, e, "js"],
            {
              urls: {
                [n]: { url: s },
              },
              load: r,
            } = themeAssets[o];
          await r(s, ...t), log(`${n}.${o}`);
        } catch (e) {}
      })
    )
      .then(n)
      .catch(o);
  });
}
function queryDomNodes(e = {}, t = document) {
  return Object.entries(e).reduce((e, [n, o]) => {
    const s = "string" == typeof o,
      r = s ? "querySelector" : "querySelectorAll",
      i = s ? o : o[0];
    return (e[n] = t?.[r]?.(i)), !s && e[n] && (e[n] = [...e[n]]), e;
  }, {});
}
class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    const e = this.querySelector('[id^="Deferred-Poster-"]');
    e && e.addEventListener("click", this.loadContent.bind(this));
  }
  loadContent(e = !0) {
    if ((window.pauseAllMedia(), !this.getAttribute("loaded"))) {
      const t = document.createElement("div");
      t.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(!0)
      ),
        this.setAttribute("loaded", !0);
      const n = this.appendChild(
        t.querySelector("video, model-viewer, iframe")
      );
      e && n.focus();
    }
  }
}
customElements.define("deferred-media", DeferredMedia);
class QuantityInput extends HTMLElement {
  constructor() {
    super(),
      (this.input = this.querySelector("input")),
      (this.changeEvent = new Event("change", { bubbles: !0 })),
      (this.productId = this.dataset.productId),
      this.querySelectorAll("button").forEach((e) =>
        e.addEventListener("click", this.onButtonClick.bind(this))
      ),
      this.input.addEventListener("change", () => {
        window.MinimogEvents.emit(
          `${this.productId}__QUANTITY_CHANGE`,
          this.input.value,
          this
        );
      });
  }
  onButtonClick(e) {
    e.preventDefault();
    const t = this.input.value;
    "plus" === e.target.closest("button").getAttribute("name")
      ? this.input.stepUp()
      : this.input.stepDown(),
      t !== this.input.value && this.input.dispatchEvent(this.changeEvent);
  }
}
customElements.define("quantity-input", QuantityInput);
