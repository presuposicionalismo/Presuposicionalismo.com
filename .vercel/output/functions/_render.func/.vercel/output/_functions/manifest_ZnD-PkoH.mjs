import { a2 as bold, a3 as red, a4 as yellow, a5 as dim, a6 as blue } from './chunks/astro_BllRs4tC.mjs';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at ".concat(i));
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at ".concat(j));
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at ".concat(i));
            if (!pattern)
                throw new TypeError("Missing pattern at ".concat(i));
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function () {
        var result = "";
        var value;
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
        }
        return path;
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/astro@4.4.3_typescript@5.3.3/node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CmqX_CMT.js"}],"styles":[{"type":"external","src":"/_astro/index.-qmUEXZv.css"},{"type":"inline","content":"time[data-astro-cid-baakmyjh]{font-size:var(--font-size-sm);display:block}\n:root{--size-header-3: 35ch;--size-3: 1rem;--size-fluid-1: clamp(.5rem, 1vw, 1rem);--size-fluid-3: clamp(1.5rem, 3vw, 2rem);--radius-3: 1rem;--shadow-strength: 1%}h1[data-astro-cid-ffijqjw4]{max-inline-size:var(--size-header-3);font-size:var(--font-size-xl);display:inline-flex;align-items:center;gap:var(--size-3);text-wrap:balance;padding-bottom:var(--size-fluid-1)}.card[data-astro-cid-ffijqjw4]{margin-left:auto;margin-right:auto;max-width:80vw;padding-top:var(--size-fluid-3);padding-bottom:var(--size-fluid-3);display:grid;grid-template-columns:1fr;place-content:center;grid-gap:20px;border-radius:8px}.card__image[data-astro-cid-ffijqjw4]{margin-left:auto;margin-right:auto;display:grid;grid-column:1;grid-gap:20px;width:65vw}img[data-astro-cid-ffijqjw4]{max-width:100%;height:auto;object-fit:cover;border-radius:var(--radius-3)}@media (min-width: 601px){.card[data-astro-cid-ffijqjw4]{grid-template-columns:5fr 8fr}.card__image[data-astro-cid-ffijqjw4]{display:grid;grid-column:1;grid-gap:20px;width:25vw}}.rad-shadow[data-astro-cid-ffijqjw4]{border:1px solid hsl(var(--brand-hue) 10% 50% / 15%);box-shadow:0 1rem .5rem -.5rem;box-shadow:0 2.8px 2.2px hsl(var(--surface-shadow) / calc(var(--shadow-strength) + 3%)),0 6.7px 5.3px hsl(var(--surface-shadow) / calc(var(--shadow-strength) + 1%)),0 12.5px 10px hsl(var(--surface-shadow) / calc(var(--shadow-strength) + 2%)),0 22.3px 17.9px hsl(var(--surface-shadow) / calc(var(--shadow-strength) + 2%)),0 41.8px 33.4px hsl(var(--surface-shadow) / calc(var(--shadow-strength) + 3%)),0 100px 80px hsl(var(--surface-shadow) / var(--shadow-strength))}@media (prefers-color-scheme: dark){:root{--shadow-strength: 25%}}\n:root{--size-4: 1.25rem;--size-1: .25rem;--size-3: 1rem;--size-2: .5rem;--font-weight-6: 600;--font-lineheight-1: 1.25;--size-header-3: 35ch;--size-fluid-1: clamp(.5rem, 1vw, 1rem);--font-size-5: 2rem;--size-header-2: 25ch;--font-size-4: 1.5rem;--font-size-3: 1.25rem;--font-size-2: 1.1rem;--font-weight-4: 400;--size-fluid-2: clamp(1rem, 2vw, 1.5rem);--lime-5: #94d82d;--lime-4: #a9e34b}article{margin-top:var(--size-4);margin-bottom:var(--size-1);margin-left:auto;margin-right:auto;max-width:90vw}:where(h2,h3,h4,h5,h6){margin-top:var(--size-3);margin-bottom:var(--size-2);min-width:100%;font-weight:var(--font-weight-6);line-height:var(--font-lineheight-1)}:where(h1){font-size:var(--font-size-xl);font-weight:var(--font-weight-6);line-height:var(--font-lineheight-1);max-inline-size:var(--size-header-3);padding-bottom:var(--size-fluid-1)}:where(h2){font-size:var(--font-size-5);max-inline-size:var(--size-header-2);padding-bottom:var(--size-fluid-1)}:where(h3){font-size:var(--font-size-4)}:where(h4){font-size:var(--font-size-3)}:where(h5){font-size:var(--font-size-2)}:where(h2,h3,h4,h5,h6,dt){max-inline-size:var(--size-header-3);padding-bottom:var(--size-fluid-1)}p{margin-left:auto;margin-right:auto;max-width:100%;padding-bottom:var(--size-fluid-1);font-size:var(--font-size-base);font-weight:var(--font-weight-4);text-indent:1rem}sup{font-size:var(--font-size-xs)}img{max-width:100%;object-fit:cover}hr{margin:var(--size-2);width:30%;max-width:40vw}ol{list-style-type:decimal;font-size:var(--font-size-sm);font-weight:var(--font-weight-4);padding-block:var(--size-fluid-2);padding:var(--size-fluid-1);margin:var(--size-fluid-1);background-color:var(--surface-2)}ol li p,ol em{font-size:var(--font-size-base);font-weight:var(--font-weight-4);padding-block:var(--size-fluid-1)}ol li{margin-left:auto;margin-right:auto;padding-left:var(--size-fluid-2);max-width:95%}section.footnotes ol{list-style-type:decimal;font-size:var(--font-size-sm);font-weight:var(--font-weight-4);background-color:var(--surface-1)}section.footnotes ol em{font-size:var(--font-size-sm);font-weight:var(--font-weight-4);padding-block:var(--size-fluid-1)}section.footnotes ol li{padding-left:var(--size-fluid-2);max-width:90%}section.footnotes ol li p{margin-left:auto;padding-bottom:var(--size-fluid-1);font-size:var(--font-size-sm);font-weight:var(--font-weight-4);text-indent:0}.author{--_accent-1: var(--lime-5);--_accent-2: var(--lime-4);--_bg: var(--surface-2);--_ink: var(--text-1);padding:var(--size-fluid-1);margin:var(--size-fluid-0);color:var(--_ink);border-color:var(--_accent-2);display:block;margin-top:var(--size-fluid-1);font-size:var(--font-size-base);font-weight:var(--font-weight-6);font-style:normal}cite{--_accent-1: var(--lime-5);--_accent-2: var(--lime-4);--_bg: var(--surface-2);--_ink: var(--text-1);padding:var(--size-fluid-1);margin:var(--size-fluid-0);color:var(--_ink);border-color:var(--_accent-2);display:block;margin-top:var(--size-fluid-1);font-size:var(--font-size-base);font-weight:var(--font-weight-6)}blockquote{--_accent-1: var(--lime-5);--_accent-2: var(--lime-4);--_bg: var(--surface-2);--_ink: var(--text-1);padding:var(--size-fluid-1);margin:var(--size-fluid-1);max-width:90%;color:var(--_ink);border-color:var(--_accent-2);background-color:var(--_bg);justify-self:flex-start}blockquote p{margin:var(--size-fluid-1);text-align:left;font-size:var(--font-size-base)}blockquote cite{--_accent-1: var(--lime-5);--_accent-2: var(--lime-4);--_bg: var(--surface-2);--_ink: var(--text-1);padding:var(--size-fluid-1);margin:var(--size-fluid-0);color:var(--_ink);border-color:var(--_accent-2);display:block;margin-top:var(--size-fluid-1);font-size:var(--font-size-sm)}\n"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CmqX_CMT.js"}],"styles":[{"type":"external","src":"/_astro/index.-qmUEXZv.css"},{"type":"inline","content":"time[data-astro-cid-baakmyjh]{font-size:var(--font-size-sm);display:block}\n:root{--shadow-color: 220 3% 15%;--shadow-strength: 1%;--size-header-3: 35ch;--font-weight-5: 500;--size-3: 1rem;--size-fluid-1: clamp(.5rem, 1vw, 1rem);--shadow-2: 0 3px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 7px 14px -5px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%));--size-fluid-2: clamp(1rem, 2vw, 1.5rem);--border-size-1: 1px;--radius-3: 1rem;--shadow-5: 0 -1px 2px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 2%)), 0 2px 1px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 5px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 10px 10px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 4%)), 0 20px 20px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%)), 0 40px 40px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 7%));--font-size-fluid-0: clamp(.75rem, 2vw, 1rem);--font-weight-4: 400;--font-lineheight-1: 1.25}:root{--size-header-3: 35ch;--font-weight-5: 500;--size-3: 1rem;--size-fluid-1: clamp(.5rem, 1vw, 1rem);--font-size-fluid-0: clamp(.75rem, 2vw, 1rem);--font-weight-4: 400;--font-lineheight-1: 1.25;--radius-3: 1rem;--shadow-2: 0 3px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 7px 14px -5px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%));--size-fluid-2: clamp(1rem, 2vw, 1.5rem);--border-size-1: 1px;--shadow-5: 0 -1px 2px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 2%)), 0 2px 1px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 5px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 10px 10px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 4%)), 0 20px 20px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%)), 0 40px 40px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 7%));--shadow-color: 220 3% 15%;--shadow-strength: 1%}h2[data-astro-cid-5tznm7mj]{max-inline-size:var(--size-header-3);font-size:var(--font-size-lg);font-weight:var(--font-weight-5);display:inline-flex;align-items:center;gap:var(--size-3);text-wrap:balance;padding-bottom:var(--size-fluid-1)}.warp[data-astro-cid-5tznm7mj]{display:flex;justify-content:center;margin-left:auto;margin-right:auto;padding-block:var(--size-fluid-1)}.card[data-astro-cid-5tznm7mj]{max-width:52rem;box-shadow:var(--shadow-2);background-color:var(--surface-2);color:var(--text-2);padding-left:var(--size-fluid-2);padding-right:var(--size-fluid-2);padding-top:var(--size-fluid-2);padding-bottom:var(--size-fluid-2);display:grid;grid-template-columns:1fr;place-content:center;grid-gap:20px;border:var(--border-size-1) solid var(--surface-2);border-radius:var(--radius-3)}.card[data-astro-cid-5tznm7mj]:hover{border:var(--border-size-1) solid var(--surface-3);background-color:var(--surface-1);box-shadow:var(--shadow-5)}.description[data-astro-cid-5tznm7mj]{font-size:var(--font-size-fluid-0);font-weight:var(--font-weight-4);text-indent:1rem;line-height:var(--font-lineheight-1);overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:5}.card__image[data-astro-cid-5tznm7mj]{display:grid;grid-column:1;grid-gap:20px}.title[data-astro-cid-5tznm7mj]{display:grid;grid-column:1;grid-gap:10px;margin-top:0;line-height:--font-lineheight-1}img[data-astro-cid-5tznm7mj]{max-width:100%;height:14rem;width:18rem;object-fit:cover;border-radius:var(--radius-3)}@media (min-width: 601px){.card[data-astro-cid-5tznm7mj]{grid-template-columns:5fr 8fr}}@media (prefers-color-scheme: dark){:root{--shadow-color: 220 40% 2%;--shadow-strength: 25%}}\n"}],"routeData":{"route":"/blog","isIndex":true,"type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CmqX_CMT.js"}],"styles":[{"type":"inline","content":".grid[data-astro-cid-q3bjbg2w]{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px;place-content:center;padding-left:7vw;padding-right:7vw}:root{--shadow-color: 220 3% 15%;--shadow-strength: 1%;--ease-3: cubic-bezier(.25, 0, .3, 1);--size-fluid-1: clamp(.5rem, 1vw, 1rem);--size-5: 1.5rem;--size-6: 1.75rem;--size-2: .5rem;--shadow-2: 0 3px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 7px 14px -5px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%));--border-size-1: 1px;--radius-3: 1rem;--shadow-5: 0 -1px 2px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 2%)), 0 2px 1px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 5px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 10px 10px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 4%)), 0 20px 20px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%)), 0 40px 40px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 7%));--animation-slide-in-up: slide-in-up .5s var(--ease-3);--font-weight-6: 600;--size-fluid-3: clamp(1.5rem, 3vw, 2rem);--font-size-fluid-0: clamp(.75rem, 2vw, 1rem);--font-weight-4: 400;--font-lineheight-1: 1.25;--radius-2: 5px}:root{--size-fluid-1: clamp(.5rem, 1vw, 1rem);--size-5: 1.5rem;--size-6: 1.75rem;--size-2: .5rem;--font-weight-6: 600;--size-fluid-3: clamp(1.5rem, 3vw, 2rem);--font-size-fluid-0: clamp(.75rem, 2vw, 1rem);--font-weight-4: 400;--font-lineheight-1: 1.25;--radius-2: 5px;--shadow-2: 0 3px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 7px 14px -5px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%));--border-size-1: 1px;--radius-3: 1rem;--shadow-5: 0 -1px 2px 0 hsl(var(--shadow-color) / calc(var(--shadow-strength) + 2%)), 0 2px 1px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 5px 5px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 3%)), 0 10px 10px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 4%)), 0 20px 20px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 5%)), 0 40px 40px -2px hsl(var(--shadow-color) / calc(var(--shadow-strength) + 7%));--animation-slide-in-up: slide-in-up .5s var(--ease-3);--shadow-color: 220 3% 15%;--shadow-strength: 1%;--ease-3: cubic-bezier(.25, 0, .3, 1)}.content[data-astro-cid-pki3utf7]{position:absolute;right:var(--size-fluid-1);left:var(--size-fluid-1);bottom:var(--size-fluid-1);padding-top:var(--size-5);padding-bottom:var(--size-5);padding-left:var(--size-6);padding-right:var(--size-6);margin:var(--size-2);border-radius:var(--size-2);height:max-content;background-color:var(--surface-1);visibility:hidden;animation-duration:.5s}.card[data-astro-cid-pki3utf7]{position:relative;box-shadow:var(--shadow-2);background-color:var(--surface-2);color:var(--text-2);margin-inline:auto;padding:var(--size-fluid-1);border:var(--border-size-1) solid var(--surface-2);border-radius:var(--radius-3);overflow:hidden}.card[data-astro-cid-pki3utf7]:hover{border:var(--border-size-1) solid var(--surface-3);background-color:var(--surface-1);box-shadow:var(--shadow-5)}.card[data-astro-cid-pki3utf7]:hover .content[data-astro-cid-pki3utf7]{visibility:visible;animation:var(--animation-slide-in-up) forwards}h2[data-astro-cid-pki3utf7]{font-size:var(--font-size-base);font-weight:var(--font-weight-6);text-wrap:balance;padding-bottom:8px}.warp[data-astro-cid-pki3utf7]{display:flex;justify-content:center;margin-left:auto;margin-right:auto;padding-block:var(--size-fluid-3)}.description[data-astro-cid-pki3utf7]{font-size:var(--font-size-fluid-0);font-weight:var(--font-weight-4);text-indent:1rem;line-height:var(--font-lineheight-1);overflow:hidden;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:5}img[data-astro-cid-pki3utf7]{border-radius:var(--radius-2);height:350px;max-width:100%;aspect-ratio:1 / 1.414}@media (prefers-color-scheme: dark){:root{--shadow-color: 220 40% 2%;--shadow-strength: 25%}}@keyframes slide-in-up{0%{transform:translateY(100%)}}\n"},{"type":"external","src":"/_astro/index.-qmUEXZv.css"}],"routeData":{"route":"/libros","isIndex":true,"type":"page","pattern":"^\\/libros\\/?$","segments":[[{"content":"libros","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/libros/index.astro","pathname":"/libros","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.DuJHqYs2.js"}],"styles":[{"type":"external","src":"/_astro/index.-qmUEXZv.css"},{"type":"inline","content":":root{--font-weight-7: 700;--size-fluid-3: clamp(1.5rem, 3vw, 2rem);--font-lineheight-1: 1.25}h1[data-astro-cid-bbe6dxrz]{max-inline-size:70vw;font-size:var(--font-size-xl);font-weight:var(--font-weight-7);margin-top:var(--size-fluid-3);line-height:var(--font-lineheight-1);text-align:center}p[data-astro-cid-bbe6dxrz]{text-align:center;max-inline-size:80vw;font-size:var(--font-size-base)}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://presuposicionalismo.com","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/blog/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/libros/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/blog/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/libros/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/libros/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/libros/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/rss.xml.js",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@js",{"propagation":"in-tree","containsHead":false}],["/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/src/pages/rss.xml.js":"chunks/pages/rss_CM0h_SoL.mjs","\u0000@astrojs-manifest":"manifest_ZnD-PkoH.mjs","\u0000@astro-page:node_modules/.pnpm/astro@4.4.3_typescript@5.3.3/node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_BY0Jmem5.mjs","\u0000@astro-page:src/pages/about@_@astro":"chunks/about_CN0YG4ON.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"chunks/index_CU0D6i9H.mjs","\u0000@astro-page:src/pages/blog/[...slug]@_@astro":"chunks/_.._Dmd3dvIu.mjs","\u0000@astro-page:src/pages/libros/index@_@astro":"chunks/index_D_dKQGR7.mjs","\u0000@astro-page:src/pages/libros/[...slug]@_@astro":"chunks/_.._QvOprmkD.mjs","\u0000@astro-page:src/pages/rss.xml@_@js":"chunks/rss_LVozDM5L.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_DZaFwFiQ.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/El Problema Del Mal.md?astroContentCollectionEntry=true":"chunks/El Problema Del Mal_BspL9wa3.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/La incoherencia de los LGBT - parte 2.md?astroContentCollectionEntry=true":"chunks/La incoherencia de los LGBT - parte 2_BbRNKA66.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/La incoherencia de los LGBT.md?astroContentCollectionEntry=true":"chunks/La incoherencia de los LGBT_DkHAvzvM.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/lógica.md?astroContentCollectionEntry=true":"chunks/lógica_CZz9k4vR.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/¿30.000 denominaciones protestantes.md?astroContentCollectionEntry=true":"chunks/¿30.000 denominaciones protestantes_BVx2yMeK.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/¿Van Til dijo que los incrédulos no saben nada.md?astroContentCollectionEntry=true":"chunks/¿Van Til dijo que los incrédulos no saben nada_DOnFg41_.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Apologetica Reformada.mdx?astroContentCollectionEntry=true":"chunks/Apologetica Reformada_B3ay83Xt.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Argumento transcendental.mdx?astroContentCollectionEntry=true":"chunks/Argumento transcendental_DUo-lMHz.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Civilazacion cristiana I.mdx?astroContentCollectionEntry=true":"chunks/Civilazacion cristiana I_BC1GETkY.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Civilazacion cristiana II.mdx?astroContentCollectionEntry=true":"chunks/Civilazacion cristiana II_Cz8CyBbv.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/La apologetica de Justino.mdx?astroContentCollectionEntry=true":"chunks/La apologetica de Justino_CMz5rH8P.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Siempre Listos.mdx?astroContentCollectionEntry=true":"chunks/Siempre Listos_YrPDGymH.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/El Problema Del Mal.md?astroPropagatedAssets":"chunks/El Problema Del Mal_Bo6CIr3o.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/La incoherencia de los LGBT - parte 2.md?astroPropagatedAssets":"chunks/La incoherencia de los LGBT - parte 2_BBI4JK_i.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/La incoherencia de los LGBT.md?astroPropagatedAssets":"chunks/La incoherencia de los LGBT_CHtyDjAv.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/lógica.md?astroPropagatedAssets":"chunks/lógica_Bg_8o9ag.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/¿30.000 denominaciones protestantes.md?astroPropagatedAssets":"chunks/¿30.000 denominaciones protestantes_Bs51jUED.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/¿Van Til dijo que los incrédulos no saben nada.md?astroPropagatedAssets":"chunks/¿Van Til dijo que los incrédulos no saben nada_4VurbZle.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Apologetica Reformada.mdx?astroPropagatedAssets":"chunks/Apologetica Reformada_BqixytPC.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Argumento transcendental.mdx?astroPropagatedAssets":"chunks/Argumento transcendental_BzWDFIlJ.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Civilazacion cristiana I.mdx?astroPropagatedAssets":"chunks/Civilazacion cristiana I_DlIYR6NS.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Civilazacion cristiana II.mdx?astroPropagatedAssets":"chunks/Civilazacion cristiana II_CpprHnH_.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/La apologetica de Justino.mdx?astroPropagatedAssets":"chunks/La apologetica de Justino_DAl6mLyj.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Siempre Listos.mdx?astroPropagatedAssets":"chunks/Siempre Listos_ax1mMOjq.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/El Problema Del Mal.md":"chunks/El Problema Del Mal_6BFomW4l.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/La incoherencia de los LGBT - parte 2.md":"chunks/La incoherencia de los LGBT - parte 2_kt3UOgY7.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/La incoherencia de los LGBT.md":"chunks/La incoherencia de los LGBT_oCQQCYmW.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/lógica.md":"chunks/lógica_7oMBdHsT.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/¿30.000 denominaciones protestantes.md":"chunks/¿30.000 denominaciones protestantes_C8BObyjg.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/blog/¿Van Til dijo que los incrédulos no saben nada.md":"chunks/¿Van Til dijo que los incrédulos no saben nada_CgdnsDbG.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Apologetica Reformada.mdx":"chunks/Apologetica Reformada_BgT50oFm.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Argumento transcendental.mdx":"chunks/Argumento transcendental_DMI5nY3g.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Civilazacion cristiana I.mdx":"chunks/Civilazacion cristiana I_BzTEeyzd.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Civilazacion cristiana II.mdx":"chunks/Civilazacion cristiana II_DLvX3wu6.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/La apologetica de Justino.mdx":"chunks/La apologetica de Justino_DCti5oen.mjs","/home/luis/Documentos/GitHub/Presuposicionalismo.com/src/content/libros/Siempre Listos.mdx":"chunks/Siempre Listos_NhQjkSBX.mjs","/astro/hoisted.js?q=1":"_astro/hoisted.DuJHqYs2.js","/astro/hoisted.js?q=0":"_astro/hoisted.CmqX_CMT.js","astro:scripts/before-hydration.js":""},"assets":["/_astro/jost-cyrillic-wght-italic.CjOuG9WY.woff2","/_astro/jost-cyrillic-wght-normal.B0_vFdaS.woff2","/_astro/jost-latin-ext-wght-italic.B3PBOdBn.woff2","/_astro/jost-latin-ext-wght-normal.B4kqP43q.woff2","/_astro/jost-latin-wght-italic.BWuA6d7j.woff2","/_astro/jost-latin-wght-normal.CfFW3YMY.woff2","/_astro/index.-qmUEXZv.css","/Portada.png","/blog-placeholder-1.jpg","/blog-placeholder-2.jpg","/blog-placeholder-3.jpg","/blog-placeholder-4.jpg","/blog-placeholder-5.jpg","/blog-placeholder-about.jpg","/favicon.png","/favicon.svg","/_astro/hoisted.CmqX_CMT.js","/_astro/hoisted.DuJHqYs2.js","/coverbook/rtfesko.webp","/fonts/atkinson-bold.woff","/fonts/atkinson-regular.woff"],"buildFormat":"directory"});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
