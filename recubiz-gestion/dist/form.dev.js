var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all3) => {
  for (var name in all3)
    __defProp(target, name, { get: all3[name], enumerable: true });
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

// global-react:react
var require_react = __commonJS({
  "global-react:react"(exports, module) {
    module.exports = window.React;
  }
});

// global-react:react/jsx-runtime
var require_jsx_runtime = __commonJS({
  "global-react:react/jsx-runtime"(exports, module) {
    module.exports = { jsx: window.React.createElement, jsxs: window.React.createElement, Fragment: window.React.Fragment };
  }
});

// global-react:react-dom
var require_react_dom = __commonJS({
  "global-react:react-dom"(exports, module) {
    module.exports = window.ReactDOM;
  }
});

// src/index.tsx
var import_react8 = __toESM(require_react());

// package.json
var version = "1.0.15";

// node_modules/clsx/dist/clsx.mjs
function r(e) {
  var t, f, n = "";
  if ("string" == typeof e || "number" == typeof e) n += e;
  else if ("object" == typeof e) if (Array.isArray(e)) {
    var o = e.length;
    for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
  } else for (f in e) e[f] && (n && (n += " "), n += f);
  return n;
}
function clsx() {
  for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
  return n;
}

// node_modules/tailwind-merge/dist/bundle-mjs.mjs
var CLASS_PART_SEPARATOR = "-";
var createClassGroupUtils = (config) => {
  const classMap = createClassMap(config);
  const {
    conflictingClassGroups,
    conflictingClassGroupModifiers
  } = config;
  const getClassGroupId = (className) => {
    const classParts = className.split(CLASS_PART_SEPARATOR);
    if (classParts[0] === "" && classParts.length !== 1) {
      classParts.shift();
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
  };
  const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
    const conflicts = conflictingClassGroups[classGroupId] || [];
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
    }
    return conflicts;
  };
  return {
    getClassGroupId,
    getConflictingClassGroupIds
  };
};
var getGroupRecursive = (classParts, classPartObject) => {
  if (classParts.length === 0) {
    return classPartObject.classGroupId;
  }
  const currentClassPart = classParts[0];
  const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart;
  }
  if (classPartObject.validators.length === 0) {
    return void 0;
  }
  const classRest = classParts.join(CLASS_PART_SEPARATOR);
  return classPartObject.validators.find(({
    validator
  }) => validator(classRest))?.classGroupId;
};
var arbitraryPropertyRegex = /^\[(.+)\]$/;
var getGroupIdForArbitraryProperty = (className) => {
  if (arbitraryPropertyRegex.test(className)) {
    const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
    const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(":"));
    if (property) {
      return "arbitrary.." + property;
    }
  }
};
var createClassMap = (config) => {
  const {
    theme,
    prefix
  } = config;
  const classMap = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  const prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
  prefixedClassGroupEntries.forEach(([classGroupId, classGroup]) => {
    processClassesRecursively(classGroup, classMap, classGroupId, theme);
  });
  return classMap;
};
var processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
  classGroup.forEach((classDefinition) => {
    if (typeof classDefinition === "string") {
      const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
      classPartObjectToEdit.classGroupId = classGroupId;
      return;
    }
    if (typeof classDefinition === "function") {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId
      });
      return;
    }
    Object.entries(classDefinition).forEach(([key, classGroup2]) => {
      processClassesRecursively(classGroup2, getPart(classPartObject, key), classGroupId, theme);
    });
  });
};
var getPart = (classPartObject, path) => {
  let currentClassPartObject = classPartObject;
  path.split(CLASS_PART_SEPARATOR).forEach((pathPart) => {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: []
      });
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
  });
  return currentClassPartObject;
};
var isThemeGetter = (func) => func.isThemeGetter;
var getPrefixedClassGroupEntries = (classGroupEntries, prefix) => {
  if (!prefix) {
    return classGroupEntries;
  }
  return classGroupEntries.map(([classGroupId, classGroup]) => {
    const prefixedClassGroup = classGroup.map((classDefinition) => {
      if (typeof classDefinition === "string") {
        return prefix + classDefinition;
      }
      if (typeof classDefinition === "object") {
        return Object.fromEntries(Object.entries(classDefinition).map(([key, value]) => [prefix + key, value]));
      }
      return classDefinition;
    });
    return [classGroupId, prefixedClassGroup];
  });
};
var createLruCache = (maxCacheSize) => {
  if (maxCacheSize < 1) {
    return {
      get: () => void 0,
      set: () => {
      }
    };
  }
  let cacheSize = 0;
  let cache = /* @__PURE__ */ new Map();
  let previousCache = /* @__PURE__ */ new Map();
  const update = (key, value) => {
    cache.set(key, value);
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = /* @__PURE__ */ new Map();
    }
  };
  return {
    get(key) {
      let value = cache.get(key);
      if (value !== void 0) {
        return value;
      }
      if ((value = previousCache.get(key)) !== void 0) {
        update(key, value);
        return value;
      }
    },
    set(key, value) {
      if (cache.has(key)) {
        cache.set(key, value);
      } else {
        update(key, value);
      }
    }
  };
};
var IMPORTANT_MODIFIER = "!";
var createParseClassName = (config) => {
  const {
    separator,
    experimentalParseClassName
  } = config;
  const isSeparatorSingleCharacter = separator.length === 1;
  const firstSeparatorCharacter = separator[0];
  const separatorLength = separator.length;
  const parseClassName = (className) => {
    const modifiers = [];
    let bracketDepth = 0;
    let modifierStart = 0;
    let postfixModifierPosition;
    for (let index = 0; index < className.length; index++) {
      let currentCharacter = className[index];
      if (bracketDepth === 0) {
        if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index, index + separatorLength) === separator)) {
          modifiers.push(className.slice(modifierStart, index));
          modifierStart = index + separatorLength;
          continue;
        }
        if (currentCharacter === "/") {
          postfixModifierPosition = index;
          continue;
        }
      }
      if (currentCharacter === "[") {
        bracketDepth++;
      } else if (currentCharacter === "]") {
        bracketDepth--;
      }
    }
    const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
    const hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
    const baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
    const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
    return {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    };
  };
  if (experimentalParseClassName) {
    return (className) => experimentalParseClassName({
      className,
      parseClassName
    });
  }
  return parseClassName;
};
var sortModifiers = (modifiers) => {
  if (modifiers.length <= 1) {
    return modifiers;
  }
  const sortedModifiers = [];
  let unsortedModifiers = [];
  modifiers.forEach((modifier) => {
    const isArbitraryVariant = modifier[0] === "[";
    if (isArbitraryVariant) {
      sortedModifiers.push(...unsortedModifiers.sort(), modifier);
      unsortedModifiers = [];
    } else {
      unsortedModifiers.push(modifier);
    }
  });
  sortedModifiers.push(...unsortedModifiers.sort());
  return sortedModifiers;
};
var createConfigUtils = (config) => ({
  cache: createLruCache(config.cacheSize),
  parseClassName: createParseClassName(config),
  ...createClassGroupUtils(config)
});
var SPLIT_CLASSES_REGEX = /\s+/;
var mergeClassList = (classList, configUtils) => {
  const {
    parseClassName,
    getClassGroupId,
    getConflictingClassGroupIds
  } = configUtils;
  const classGroupsInConflict = [];
  const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
  let result = "";
  for (let index = classNames.length - 1; index >= 0; index -= 1) {
    const originalClassName = classNames[index];
    const {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    } = parseClassName(originalClassName);
    let hasPostfixModifier = Boolean(maybePostfixModifierPosition);
    let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
    if (!classGroupId) {
      if (!hasPostfixModifier) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      hasPostfixModifier = false;
    }
    const variantModifier = sortModifiers(modifiers).join(":");
    const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    const classId = modifierId + classGroupId;
    if (classGroupsInConflict.includes(classId)) {
      continue;
    }
    classGroupsInConflict.push(classId);
    const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
    for (let i = 0; i < conflictGroups.length; ++i) {
      const group = conflictGroups[i];
      classGroupsInConflict.push(modifierId + group);
    }
    result = originalClassName + (result.length > 0 ? " " + result : result);
  }
  return result;
};
function twJoin() {
  let index = 0;
  let argument;
  let resolvedValue;
  let string = "";
  while (index < arguments.length) {
    if (argument = arguments[index++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
}
var toValue = (mix) => {
  if (typeof mix === "string") {
    return mix;
  }
  let resolvedValue;
  let string = "";
  for (let k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
};
function createTailwindMerge(createConfigFirst, ...createConfigRest) {
  let configUtils;
  let cacheGet;
  let cacheSet;
  let functionToCall = initTailwindMerge;
  function initTailwindMerge(classList) {
    const config = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  }
  function tailwindMerge(classList) {
    const cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    const result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments));
  };
}
var fromTheme = (key) => {
  const themeGetter = (theme) => theme[key] || [];
  themeGetter.isThemeGetter = true;
  return themeGetter;
};
var arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
var fractionRegex = /^\d+\/\d+$/;
var stringLengths = /* @__PURE__ */ new Set(["px", "full", "screen"]);
var tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
var lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
var colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/;
var shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
var imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
var isLength = (value) => isNumber(value) || stringLengths.has(value) || fractionRegex.test(value);
var isArbitraryLength = (value) => getIsArbitraryValue(value, "length", isLengthOnly);
var isNumber = (value) => Boolean(value) && !Number.isNaN(Number(value));
var isArbitraryNumber = (value) => getIsArbitraryValue(value, "number", isNumber);
var isInteger = (value) => Boolean(value) && Number.isInteger(Number(value));
var isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
var isArbitraryValue = (value) => arbitraryValueRegex.test(value);
var isTshirtSize = (value) => tshirtUnitRegex.test(value);
var sizeLabels = /* @__PURE__ */ new Set(["length", "size", "percentage"]);
var isArbitrarySize = (value) => getIsArbitraryValue(value, sizeLabels, isNever);
var isArbitraryPosition = (value) => getIsArbitraryValue(value, "position", isNever);
var imageLabels = /* @__PURE__ */ new Set(["image", "url"]);
var isArbitraryImage = (value) => getIsArbitraryValue(value, imageLabels, isImage);
var isArbitraryShadow = (value) => getIsArbitraryValue(value, "", isShadow);
var isAny = () => true;
var getIsArbitraryValue = (value, label, testValue) => {
  const result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return typeof label === "string" ? result[1] === label : label.has(result[1]);
    }
    return testValue(result[2]);
  }
  return false;
};
var isLengthOnly = (value) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
);
var isNever = () => false;
var isShadow = (value) => shadowRegex.test(value);
var isImage = (value) => imageRegex.test(value);
var getDefaultConfig = () => {
  const colors = fromTheme("colors");
  const spacing = fromTheme("spacing");
  const blur = fromTheme("blur");
  const brightness = fromTheme("brightness");
  const borderColor = fromTheme("borderColor");
  const borderRadius = fromTheme("borderRadius");
  const borderSpacing = fromTheme("borderSpacing");
  const borderWidth = fromTheme("borderWidth");
  const contrast = fromTheme("contrast");
  const grayscale = fromTheme("grayscale");
  const hueRotate = fromTheme("hueRotate");
  const invert = fromTheme("invert");
  const gap = fromTheme("gap");
  const gradientColorStops = fromTheme("gradientColorStops");
  const gradientColorStopPositions = fromTheme("gradientColorStopPositions");
  const inset = fromTheme("inset");
  const margin = fromTheme("margin");
  const opacity = fromTheme("opacity");
  const padding = fromTheme("padding");
  const saturate = fromTheme("saturate");
  const scale = fromTheme("scale");
  const sepia = fromTheme("sepia");
  const skew = fromTheme("skew");
  const space = fromTheme("space");
  const translate = fromTheme("translate");
  const getOverscroll = () => ["auto", "contain", "none"];
  const getOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
  const getSpacingWithAutoAndArbitrary = () => ["auto", isArbitraryValue, spacing];
  const getSpacingWithArbitrary = () => [isArbitraryValue, spacing];
  const getLengthWithEmptyAndArbitrary = () => ["", isLength, isArbitraryLength];
  const getNumberWithAutoAndArbitrary = () => ["auto", isNumber, isArbitraryValue];
  const getPositions = () => ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"];
  const getLineStyles = () => ["solid", "dashed", "dotted", "double", "none"];
  const getBlendModes = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
  const getAlign = () => ["start", "end", "center", "between", "around", "evenly", "stretch"];
  const getZeroAndEmpty = () => ["", "0", isArbitraryValue];
  const getBreaks = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
  const getNumberAndArbitrary = () => [isNumber, isArbitraryValue];
  return {
    cacheSize: 500,
    separator: ":",
    theme: {
      colors: [isAny],
      spacing: [isLength, isArbitraryLength],
      blur: ["none", "", isTshirtSize, isArbitraryValue],
      brightness: getNumberAndArbitrary(),
      borderColor: [colors],
      borderRadius: ["none", "", "full", isTshirtSize, isArbitraryValue],
      borderSpacing: getSpacingWithArbitrary(),
      borderWidth: getLengthWithEmptyAndArbitrary(),
      contrast: getNumberAndArbitrary(),
      grayscale: getZeroAndEmpty(),
      hueRotate: getNumberAndArbitrary(),
      invert: getZeroAndEmpty(),
      gap: getSpacingWithArbitrary(),
      gradientColorStops: [colors],
      gradientColorStopPositions: [isPercent, isArbitraryLength],
      inset: getSpacingWithAutoAndArbitrary(),
      margin: getSpacingWithAutoAndArbitrary(),
      opacity: getNumberAndArbitrary(),
      padding: getSpacingWithArbitrary(),
      saturate: getNumberAndArbitrary(),
      scale: getNumberAndArbitrary(),
      sepia: getZeroAndEmpty(),
      skew: getNumberAndArbitrary(),
      space: getSpacingWithArbitrary(),
      translate: getSpacingWithArbitrary()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", isArbitraryValue]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isTshirtSize]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": getBreaks()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": getBreaks()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [...getPositions(), isArbitraryValue]
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: getOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": getOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": getOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: getOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": getOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": getOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [inset]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [inset]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [inset]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [inset]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [inset]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [inset]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [inset]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [inset]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [inset]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", isInteger, isArbitraryValue]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: getSpacingWithAutoAndArbitrary()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: getZeroAndEmpty()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: getZeroAndEmpty()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", isInteger, isArbitraryValue]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [isAny]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [isAny]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [isInteger, isArbitraryValue]
        }, isArbitraryValue]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [gap]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [gap]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [gap]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal", ...getAlign()]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...getAlign(), "baseline"]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [...getAlign(), "baseline"]
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [padding]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [padding]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [padding]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [padding]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [padding]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [padding]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [padding]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [padding]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [padding]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [margin]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [margin]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [margin]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [margin]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [margin]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [margin]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [margin]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [margin]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [margin]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [space]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [space]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", isArbitraryValue, spacing]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [isArbitraryValue, spacing, "min", "max", "fit"]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [isArbitraryValue, spacing, "none", "full", "min", "max", "fit", "prose", {
          screen: [isTshirtSize]
        }, isTshirtSize]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [isArbitraryValue, spacing, "auto", "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [isArbitraryValue, spacing, "min", "max", "fit", "svh", "lvh", "dvh"]
      }],
      /**
       * Size
       * @see https://tailwindcss.com/docs/size
       */
      size: [{
        size: [isArbitraryValue, spacing, "auto", "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", isTshirtSize, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", isArbitraryNumber]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [isAny]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", isNumber, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", isLength, isArbitraryValue]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", isArbitraryValue]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [colors]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [opacity]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [colors]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [opacity]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...getLineStyles(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", isLength, isArbitraryLength]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", isLength, isArbitraryValue]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [colors]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: getSpacingWithArbitrary()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", isArbitraryValue]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [opacity]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [...getPositions(), isArbitraryPosition]
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", isArbitrarySize]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, isArbitraryImage]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [colors]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [gradientColorStops]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [borderRadius]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [borderRadius]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [borderRadius]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [borderRadius]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [borderRadius]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [borderRadius]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [borderRadius]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [borderRadius]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [borderRadius]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [borderRadius]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [borderRadius]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [borderRadius]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [borderRadius]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [borderRadius]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [borderRadius]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [borderWidth]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [borderWidth]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [borderWidth]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [borderWidth]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [borderWidth]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [borderWidth]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [borderWidth]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [borderWidth]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [borderWidth]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [opacity]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...getLineStyles(), "hidden"]
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [borderWidth]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [borderWidth]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [opacity]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: getLineStyles()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [borderColor]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [borderColor]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [borderColor]
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": [borderColor]
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": [borderColor]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [borderColor]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [borderColor]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [borderColor]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [borderColor]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [borderColor]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: ["", ...getLineStyles()]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [isLength, isArbitraryValue]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [isLength, isArbitraryLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [colors]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: getLengthWithEmptyAndArbitrary()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [colors]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [opacity]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [isLength, isArbitraryLength]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [colors]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", isTshirtSize, isArbitraryShadow]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [isAny]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [opacity]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...getBlendModes(), "plus-lighter", "plus-darker"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": getBlendModes()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [blur]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [brightness]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [contrast]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", isTshirtSize, isArbitraryValue]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [grayscale]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [hueRotate]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [invert]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [saturate]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [sepia]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [blur]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [brightness]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [contrast]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [grayscale]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [hueRotate]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [invert]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [opacity]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [saturate]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [sepia]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [borderSpacing]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [borderSpacing]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [borderSpacing]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", isArbitraryValue]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: getNumberAndArbitrary()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: getNumberAndArbitrary()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", isArbitraryValue]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [scale]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [scale]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [scale]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [isInteger, isArbitraryValue]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [translate]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [translate]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [skew]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [skew]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", isArbitraryValue]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", colors]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryValue]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [colors]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", isArbitraryValue]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [colors, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [isLength, isArbitraryLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [colors, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
};
var twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);

// node_modules/@tyconsa/bizuit-ui-components/dist/index.mjs
var React17 = __toESM(require_react(), 1);
var import_jsx_runtime11 = __toESM(require_jsx_runtime(), 1);
var React26 = __toESM(require_react(), 1);

// node_modules/lucide-react/dist/esm/createLucideIcon.js
var import_react = __toESM(require_react());

// node_modules/lucide-react/dist/esm/defaultAttributes.js
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

// node_modules/lucide-react/dist/esm/createLucideIcon.js
var toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase().trim();
var createLucideIcon = (iconName, iconNode) => {
  const Component = (0, import_react.forwardRef)(
    ({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, ...rest }, ref) => (0, import_react.createElement)(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: ["lucide", `lucide-${toKebabCase(iconName)}`, className].join(" "),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0, import_react.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    )
  );
  Component.displayName = `${iconName}`;
  return Component;
};

// node_modules/lucide-react/dist/esm/icons/alert-circle.js
var AlertCircle = createLucideIcon("AlertCircle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
]);

// node_modules/lucide-react/dist/esm/icons/camera.js
var Camera = createLucideIcon("Camera", [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
]);

// node_modules/lucide-react/dist/esm/icons/check.js
var Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);

// node_modules/lucide-react/dist/esm/icons/circle.js
var Circle = createLucideIcon("Circle", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
]);

// node_modules/lucide-react/dist/esm/icons/download.js
var Download = createLucideIcon("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);

// node_modules/lucide-react/dist/esm/icons/eraser.js
var Eraser = createLucideIcon("Eraser", [
  [
    "path",
    {
      d: "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",
      key: "182aya"
    }
  ],
  ["path", { d: "M22 21H7", key: "t4ddhn" }],
  ["path", { d: "m5 11 9 9", key: "1mo9qw" }]
]);

// node_modules/lucide-react/dist/esm/icons/file-text.js
var FileText = createLucideIcon("FileText", [
  [
    "path",
    { d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z", key: "1nnpy2" }
  ],
  ["polyline", { points: "14 2 14 8 20 8", key: "1ew0cm" }],
  ["line", { x1: "16", x2: "8", y1: "13", y2: "13", key: "14keom" }],
  ["line", { x1: "16", x2: "8", y1: "17", y2: "17", key: "17nazh" }],
  ["line", { x1: "10", x2: "8", y1: "9", y2: "9", key: "1a5vjj" }]
]);

// node_modules/lucide-react/dist/esm/icons/image.js
var Image2 = createLucideIcon("Image", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
]);

// node_modules/lucide-react/dist/esm/icons/loader-2.js
var Loader2 = createLucideIcon("Loader2", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);

// node_modules/lucide-react/dist/esm/icons/map-pin.js
var MapPin = createLucideIcon("MapPin", [
  ["path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z", key: "2oe9fu" }],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }]
]);

// node_modules/lucide-react/dist/esm/icons/maximize.js
var Maximize = createLucideIcon("Maximize", [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3", key: "1dcmit" }],
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3", key: "1e4gt3" }],
  ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3", key: "wsl5sc" }],
  ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3", key: "18trek" }]
]);

// node_modules/lucide-react/dist/esm/icons/pause.js
var Pause = createLucideIcon("Pause", [
  ["rect", { width: "4", height: "16", x: "6", y: "4", key: "iffhe4" }],
  ["rect", { width: "4", height: "16", x: "14", y: "4", key: "sjin7j" }]
]);

// node_modules/lucide-react/dist/esm/icons/play.js
var Play = createLucideIcon("Play", [
  ["polygon", { points: "5 3 19 12 5 21 5 3", key: "191637" }]
]);

// node_modules/lucide-react/dist/esm/icons/plus.js
var Plus = createLucideIcon("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);

// node_modules/lucide-react/dist/esm/icons/qr-code.js
var QrCode = createLucideIcon("QrCode", [
  ["rect", { width: "5", height: "5", x: "3", y: "3", rx: "1", key: "1tu5fj" }],
  ["rect", { width: "5", height: "5", x: "16", y: "3", rx: "1", key: "1v8r4q" }],
  ["rect", { width: "5", height: "5", x: "3", y: "16", rx: "1", key: "1x03jg" }],
  ["path", { d: "M21 16h-3a2 2 0 0 0-2 2v3", key: "177gqh" }],
  ["path", { d: "M21 21v.01", key: "ents32" }],
  ["path", { d: "M12 7v3a2 2 0 0 1-2 2H7", key: "8crl2c" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M12 3h.01", key: "n36tog" }],
  ["path", { d: "M12 16v.01", key: "133mhm" }],
  ["path", { d: "M16 12h1", key: "1slzba" }],
  ["path", { d: "M21 12v.01", key: "1lwtk9" }],
  ["path", { d: "M12 21v-1", key: "1880an" }]
]);

// node_modules/lucide-react/dist/esm/icons/rotate-cw.js
var RotateCw = createLucideIcon("RotateCw", [
  ["path", { d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8", key: "1p45f6" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }]
]);

// node_modules/lucide-react/dist/esm/icons/trash-2.js
var Trash2 = createLucideIcon("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);

// node_modules/lucide-react/dist/esm/icons/undo.js
var Undo = createLucideIcon("Undo", [
  ["path", { d: "M3 7v6h6", key: "1v2h90" }],
  ["path", { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13", key: "1r6uu6" }]
]);

// node_modules/lucide-react/dist/esm/icons/upload.js
var Upload = createLucideIcon("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);

// node_modules/lucide-react/dist/esm/icons/volume-2.js
var Volume2 = createLucideIcon("Volume2", [
  ["polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5", key: "16drj5" }],
  ["path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07", key: "ltjumu" }],
  ["path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14", key: "1kegas" }]
]);

// node_modules/lucide-react/dist/esm/icons/volume-x.js
var VolumeX = createLucideIcon("VolumeX", [
  ["polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5", key: "16drj5" }],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
]);

// node_modules/lucide-react/dist/esm/icons/x.js
var X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);

// node_modules/@tyconsa/bizuit-ui-components/dist/index.mjs
var import_jsx_runtime12 = __toESM(require_jsx_runtime(), 1);
var React32 = __toESM(require_react(), 1);

// node_modules/@radix-ui/primitive/dist/index.mjs
var canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
  return function handleEvent(event) {
    originalEventHandler?.(event);
    if (checkForDefaultPrevented === false || !event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

// node_modules/@radix-ui/react-compose-refs/dist/index.mjs
var React = __toESM(require_react(), 1);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup == "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup == "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return React.useCallback(composeRefs(...refs), refs);
}

// node_modules/@radix-ui/react-context/dist/index.mjs
var React2 = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext32(rootComponentName, defaultContext) {
    const BaseContext = React2.createContext(defaultContext);
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const value = React2.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext23(consumerName, scope) {
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const context = React2.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext23];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return React2.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return React2.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext32, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return React2.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}

// node_modules/@radix-ui/react-primitive/dist/index.mjs
var React4 = __toESM(require_react(), 1);
var ReactDOM = __toESM(require_react_dom(), 1);

// node_modules/@radix-ui/react-slot/dist/index.mjs
var React3 = __toESM(require_react(), 1);
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = React3.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = React3.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (React3.Children.count(newElement) > 1) return React3.Children.only(null);
          return React3.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children: React3.isValidElement(newElement) ? React3.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = React3.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (React3.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== React3.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return React3.cloneElement(children, props2);
    }
    return React3.Children.count(children) > 1 ? React3.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function isSlottable(child) {
  return React3.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

// node_modules/@radix-ui/react-primitive/dist/index.mjs
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node2 = React4.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node2.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node2 };
}, {});

// node_modules/@radix-ui/react-use-callback-ref/dist/index.mjs
var React5 = __toESM(require_react(), 1);
function useCallbackRef(callback) {
  const callbackRef = React5.useRef(callback);
  React5.useEffect(() => {
    callbackRef.current = callback;
  });
  return React5.useMemo(() => (...args) => callbackRef.current?.(...args), []);
}

// node_modules/@radix-ui/react-id/dist/index.mjs
var React7 = __toESM(require_react(), 1);

// node_modules/@radix-ui/react-use-layout-effect/dist/index.mjs
var React6 = __toESM(require_react(), 1);
var useLayoutEffect2 = globalThis?.document ? React6.useLayoutEffect : () => {
};

// node_modules/@radix-ui/react-id/dist/index.mjs
var useReactId = React7[" useId ".trim().toString()] || (() => void 0);
var count = 0;
function useId(deterministicId) {
  const [id, setId] = React7.useState(useReactId());
  useLayoutEffect2(() => {
    if (!deterministicId) setId((reactId) => reactId ?? String(count++));
  }, [deterministicId]);
  return deterministicId || (id ? `radix-${id}` : "");
}

// node_modules/@radix-ui/react-use-size/dist/index.mjs
var React8 = __toESM(require_react(), 1);
function useSize(element) {
  const [size, setSize] = React8.useState(void 0);
  useLayoutEffect2(() => {
    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
      const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries)) {
          return;
        }
        if (!entries.length) {
          return;
        }
        const entry = entries[0];
        let width;
        let height;
        if ("borderBoxSize" in entry) {
          const borderSizeEntry = entry["borderBoxSize"];
          const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
          width = borderSize["inlineSize"];
          height = borderSize["blockSize"];
        } else {
          width = element.offsetWidth;
          height = element.offsetHeight;
        }
        setSize({ width, height });
      });
      resizeObserver.observe(element, { box: "border-box" });
      return () => resizeObserver.unobserve(element);
    } else {
      setSize(void 0);
    }
  }, [element]);
  return size;
}

// node_modules/@radix-ui/react-presence/dist/index.mjs
var React22 = __toESM(require_react(), 1);
var React9 = __toESM(require_react(), 1);
function useStateMachine(initialState2, machine) {
  return React9.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState2);
}
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child = typeof children === "function" ? children({ present: presence.isPresent }) : React22.Children.only(children);
  const ref = useComposedRefs(presence.ref, getElementRef2(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? React22.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = React22.useState();
  const stylesRef = React22.useRef(null);
  const prevPresentRef = React22.useRef(present);
  const prevAnimationNameRef = React22.useRef("none");
  const initialState2 = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine(initialState2, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  React22.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  useLayoutEffect2(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || styles?.display === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  useLayoutEffect2(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: React22.useCallback((node2) => {
      stylesRef.current = node2 ? getComputedStyle(node2) : null;
      setNode(node2);
    }, [])
  };
}
function getAnimationName(styles) {
  return styles?.animationName || "none";
}
function getElementRef2(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

// node_modules/@radix-ui/react-use-controllable-state/dist/index.mjs
var React10 = __toESM(require_react(), 1);
var React23 = __toESM(require_react(), 1);
var useInsertionEffect = React10[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({
  prop,
  defaultProp,
  onChange = () => {
  },
  caller
}) {
  const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
    defaultProp,
    onChange
  });
  const isControlled = prop !== void 0;
  const value = isControlled ? prop : uncontrolledProp;
  if (true) {
    const isControlledRef = React10.useRef(prop !== void 0);
    React10.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? "controlled" : "uncontrolled";
        const to = isControlled ? "controlled" : "uncontrolled";
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }
  const setValue = React10.useCallback(
    (nextValue) => {
      if (isControlled) {
        const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
        if (value2 !== prop) {
          onChangeRef.current?.(value2);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, onChangeRef]
  );
  return [value, setValue];
}
function useUncontrolledState({
  defaultProp,
  onChange
}) {
  const [value, setValue] = React10.useState(defaultProp);
  const prevValueRef = React10.useRef(value);
  const onChangeRef = React10.useRef(onChange);
  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  React10.useEffect(() => {
    if (prevValueRef.current !== value) {
      onChangeRef.current?.(value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef]);
  return [value, setValue, onChangeRef];
}
function isFunction(value) {
  return typeof value === "function";
}
var SYNC_STATE = Symbol("RADIX:SYNC_STATE");

// node_modules/@tyconsa/bizuit-ui-components/dist/index.mjs
var import_jsx_runtime13 = __toESM(require_jsx_runtime(), 1);
var React42 = __toESM(require_react(), 1);
var import_jsx_runtime14 = __toESM(require_jsx_runtime(), 1);
var React52 = __toESM(require_react(), 1);

// node_modules/@radix-ui/react-direction/dist/index.mjs
var React11 = __toESM(require_react(), 1);
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var DirectionContext = React11.createContext(void 0);
function useDirection(localDir) {
  const globalDir = React11.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}

// node_modules/@radix-ui/react-use-previous/dist/index.mjs
var React12 = __toESM(require_react(), 1);
function usePrevious(value) {
  const ref = React12.useRef({ value, previous: value });
  return React12.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}

// node_modules/@radix-ui/react-collection/dist/index.mjs
var import_react2 = __toESM(require_react(), 1);
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
var import_react3 = __toESM(require_react(), 1);
var import_jsx_runtime6 = __toESM(require_jsx_runtime(), 1);
function createCollection(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope2] = createContextScope(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  );
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = import_react2.default.useRef(null);
    const itemMap = import_react2.default.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
  const CollectionSlot = import_react2.default.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
  const CollectionItemSlot = import_react2.default.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = import_react2.default.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      import_react2.default.useEffect(() => {
        context.itemMap.set(ref, { ref, ...itemData });
        return () => void context.itemMap.delete(ref);
      });
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection2(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = import_react2.default.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection2,
    createCollectionScope2
  ];
}

// node_modules/@tyconsa/bizuit-ui-components/dist/index.mjs
var import_jsx_runtime15 = __toESM(require_jsx_runtime(), 1);
var React62 = __toESM(require_react(), 1);
var import_jsx_runtime16 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime17 = __toESM(require_jsx_runtime(), 1);
var React72 = __toESM(require_react(), 1);

// node_modules/@radix-ui/react-radio-group/dist/index.mjs
var React25 = __toESM(require_react(), 1);

// node_modules/@radix-ui/react-roving-focus/dist/index.mjs
var React14 = __toESM(require_react(), 1);
var import_jsx_runtime7 = __toESM(require_jsx_runtime(), 1);
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = React14.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = React14.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = React14.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = React14.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = React14.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = React14.useState(0);
  React14.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: React14.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: React14.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: React14.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: React14.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = React14.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    React14.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;

// node_modules/@radix-ui/react-radio-group/dist/index.mjs
var React15 = __toESM(require_react(), 1);
var import_jsx_runtime8 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime9 = __toESM(require_jsx_runtime(), 1);
var RADIO_NAME = "Radio";
var [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);
var [RadioProvider, useRadioContext] = createRadioContext(RADIO_NAME);
var Radio = React15.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadio,
      name,
      checked = false,
      required,
      disabled,
      value = "on",
      onCheck,
      form,
      ...radioProps
    } = props;
    const [button, setButton] = React15.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = React15.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(RadioProvider, { scope: __scopeRadio, checked, disabled, children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        Primitive.button,
        {
          type: "button",
          role: "radio",
          "aria-checked": checked,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...radioProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            if (!checked) onCheck?.();
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        RadioBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Radio.displayName = RADIO_NAME;
var INDICATOR_NAME = "RadioIndicator";
var RadioIndicator = React15.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadio, forceMount, ...indicatorProps } = props;
    const context = useRadioContext(INDICATOR_NAME, __scopeRadio);
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Presence, { present: forceMount || context.checked, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...indicatorProps,
        ref: forwardedRef
      }
    ) });
  }
);
RadioIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var RadioBubbleInput = React15.forwardRef(
  ({
    __scopeRadio,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = React15.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    React15.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      Primitive.input,
      {
        type: "radio",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
RadioBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var RADIO_GROUP_NAME = "RadioGroup";
var [createRadioGroupContext, createRadioGroupScope] = createContextScope(RADIO_GROUP_NAME, [
  createRovingFocusGroupScope,
  createRadioScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var useRadioScope = createRadioScope();
var [RadioGroupProvider, useRadioGroupContext] = createRadioGroupContext(RADIO_GROUP_NAME);
var RadioGroup = React25.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadioGroup,
      name,
      defaultValue,
      value: valueProp,
      required = false,
      disabled = false,
      orientation,
      dir,
      loop = true,
      onValueChange,
      ...groupProps
    } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? null,
      onChange: onValueChange,
      caller: RADIO_GROUP_NAME
    });
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      RadioGroupProvider,
      {
        scope: __scopeRadioGroup,
        name,
        required,
        disabled,
        value,
        onValueChange: setValue,
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          Root,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation,
            dir: direction,
            loop,
            children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              Primitive.div,
              {
                role: "radiogroup",
                "aria-required": required,
                "aria-orientation": orientation,
                "data-disabled": disabled ? "" : void 0,
                dir: direction,
                ...groupProps,
                ref: forwardedRef
              }
            )
          }
        )
      }
    );
  }
);
RadioGroup.displayName = RADIO_GROUP_NAME;
var ITEM_NAME2 = "RadioGroupItem";
var RadioGroupItem = React25.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, disabled, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME2, __scopeRadioGroup);
    const isDisabled = context.disabled || disabled;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const radioScope = useRadioScope(__scopeRadioGroup);
    const ref = React25.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const checked = context.value === itemProps.value;
    const isArrowKeyPressedRef = React25.useRef(false);
    React25.useEffect(() => {
      const handleKeyDown = (event) => {
        if (ARROW_KEYS.includes(event.key)) {
          isArrowKeyPressedRef.current = true;
        }
      };
      const handleKeyUp = () => isArrowKeyPressedRef.current = false;
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !isDisabled,
        active: checked,
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          Radio,
          {
            disabled: isDisabled,
            required: context.required,
            checked,
            ...radioScope,
            ...itemProps,
            name: context.name,
            ref: composedRefs,
            onCheck: () => context.onValueChange(itemProps.value),
            onKeyDown: composeEventHandlers((event) => {
              if (event.key === "Enter") event.preventDefault();
            }),
            onFocus: composeEventHandlers(itemProps.onFocus, () => {
              if (isArrowKeyPressedRef.current) ref.current?.click();
            })
          }
        )
      }
    );
  }
);
RadioGroupItem.displayName = ITEM_NAME2;
var INDICATOR_NAME2 = "RadioGroupIndicator";
var RadioGroupIndicator = React25.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, ...indicatorProps } = props;
    const radioScope = useRadioScope(__scopeRadioGroup);
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(RadioIndicator, { ...radioScope, ...indicatorProps, ref: forwardedRef });
  }
);
RadioGroupIndicator.displayName = INDICATOR_NAME2;
var Root2 = RadioGroup;
var Item2 = RadioGroupItem;
var Indicator = RadioGroupIndicator;

// node_modules/@tyconsa/bizuit-ui-components/dist/index.mjs
var import_jsx_runtime18 = __toESM(require_jsx_runtime(), 1);
var React82 = __toESM(require_react(), 1);
var import_jsx_runtime19 = __toESM(require_jsx_runtime(), 1);
var React92 = __toESM(require_react(), 1);
var import_jsx_runtime20 = __toESM(require_jsx_runtime(), 1);
var React102 = __toESM(require_react(), 1);
var import_jsx_runtime21 = __toESM(require_jsx_runtime(), 1);
var React112 = __toESM(require_react(), 1);
var import_jsx_runtime22 = __toESM(require_jsx_runtime(), 1);
var React122 = __toESM(require_react(), 1);

// node_modules/@radix-ui/react-tabs/dist/index.mjs
var React16 = __toESM(require_react(), 1);
var import_jsx_runtime10 = __toESM(require_jsx_runtime(), 1);
var TABS_NAME = "Tabs";
var [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope2 = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs = React16.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList = React16.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope2(__scopeTabs);
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger = React16.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope2(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent = React16.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = React16.useRef(isSelected);
    React16.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root22 = Tabs;
var List = TabsList;
var Trigger = TabsTrigger;
var Content = TabsContent;

// node_modules/@tyconsa/bizuit-ui-components/dist/index.mjs
var import_jsx_runtime23 = __toESM(require_jsx_runtime(), 1);
var React132 = __toESM(require_react(), 1);
var import_jsx_runtime24 = __toESM(require_jsx_runtime(), 1);
var React142 = __toESM(require_react(), 1);
var import_jsx_runtime25 = __toESM(require_jsx_runtime(), 1);
var React152 = __toESM(require_react(), 1);
var import_jsx_runtime26 = __toESM(require_jsx_runtime(), 1);
var React162 = __toESM(require_react(), 1);
var import_jsx_runtime27 = __toESM(require_jsx_runtime(), 1);
var React172 = __toESM(require_react(), 1);
var import_jsx_runtime28 = __toESM(require_jsx_runtime(), 1);
var React18 = __toESM(require_react(), 1);
var import_jsx_runtime29 = __toESM(require_jsx_runtime(), 1);
var React19 = __toESM(require_react(), 1);
var import_jsx_runtime30 = __toESM(require_jsx_runtime(), 1);
var React20 = __toESM(require_react(), 1);
var import_jsx_runtime31 = __toESM(require_jsx_runtime(), 1);
var import_react4 = __toESM(require_react(), 1);
var import_jsx_runtime32 = __toESM(require_jsx_runtime(), 1);
var import_react5 = __toESM(require_react(), 1);
var import_jsx_runtime33 = __toESM(require_jsx_runtime(), 1);
var import_jsx_runtime34 = __toESM(require_jsx_runtime(), 1);
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
var Button = React17.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "button",
      {
        className: cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          {
            // Default variant
            "bg-primary text-primary-foreground shadow hover:bg-primary/90": variant === "default",
            // Destructive variant
            "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90": variant === "destructive",
            // Outline variant
            "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground": variant === "outline",
            // Secondary variant
            "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80": variant === "secondary",
            // Ghost variant
            "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
            // Link variant
            "text-primary underline-offset-4 hover:underline": variant === "link"
          },
          {
            // Default size
            "h-9 px-4 py-2": size === "default",
            // Small size
            "h-8 rounded-md px-3 text-xs": size === "sm",
            // Large size
            "h-10 rounded-md px-8": size === "lg",
            // Icon size
            "h-9 w-9": size === "icon"
          },
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
var BizuitRadioButton = React72.forwardRef(
  ({
    options,
    value,
    onChange,
    orientation = "vertical",
    disabled = false,
    className,
    name,
    required = false,
    label,
    error
  }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: cn("space-y-2", className), children: [
      label && /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("label", { className: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", children: [
        label,
        required && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-red-500 ml-1", children: "*" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
        Root2,
        {
          ref,
          className: cn(
            "flex gap-4",
            orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
          ),
          value,
          onValueChange: onChange,
          disabled,
          name,
          required,
          children: options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "flex items-start space-x-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
              Item2,
              {
                value: option.value,
                disabled: option.disabled || disabled,
                className: cn(
                  "aspect-square h-4 w-4 rounded-full border border-primary text-primary",
                  "ring-offset-background focus:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "mt-0.5"
                  // Align with text
                ),
                children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(Circle, { className: "h-2.5 w-2.5 fill-current text-current" }) })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "grid gap-1.5 leading-none", children: [
              /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
                "label",
                {
                  htmlFor: option.value,
                  className: cn(
                    "text-sm font-medium leading-none cursor-pointer",
                    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  ),
                  children: option.label
                }
              ),
              option.description && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-sm text-muted-foreground", children: option.description })
            ] })
          ] }, option.value))
        }
      ),
      error && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-sm text-red-500 mt-1", children: error })
    ] });
  }
);
BizuitRadioButton.displayName = "BizuitRadioButton";
var BizuitSignature = React82.forwardRef(
  ({
    value,
    onChange,
    width = 500,
    height = 200,
    penColor = "#000000",
    penWidth = 2,
    backgroundColor = "#ffffff",
    className,
    label,
    required = false,
    error,
    disabled = false,
    showDownload = true
  }, ref) => {
    const canvasRef = React82.useRef(null);
    const [isDrawing, setIsDrawing] = React82.useState(false);
    const [history, setHistory] = React82.useState([]);
    const [currentHistoryIndex, setCurrentHistoryIndex] = React82.useState(-1);
    React82.useImperativeHandle(ref, () => canvasRef.current);
    React82.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      if (value) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          saveToHistory();
        };
        img.src = value;
      } else {
        saveToHistory();
      }
    }, []);
    const saveToHistory = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataURL = canvas.toDataURL();
      const newHistory = history.slice(0, currentHistoryIndex + 1);
      newHistory.push(dataURL);
      setHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    };
    const startDrawing = (e) => {
      if (disabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      setIsDrawing(true);
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const point = getPoint(e, rect);
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    };
    const draw = (e) => {
      if (!isDrawing || disabled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const point = getPoint(e, rect);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    };
    const stopDrawing = () => {
      if (!isDrawing) return;
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataURL = canvas.toDataURL();
      onChange?.(dataURL);
      saveToHistory();
    };
    const getPoint = (e, rect) => {
      if ("touches" in e) {
        const touch = e.touches[0];
        return {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        };
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      }
    };
    const handleClear = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      const dataURL = canvas.toDataURL();
      onChange?.(dataURL);
      saveToHistory();
    };
    const handleUndo = () => {
      if (currentHistoryIndex <= 0) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        onChange?.(history[newIndex]);
      };
      img.src = history[newIndex];
    };
    const handleDownload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "signature.png";
      link.href = dataURL;
      link.click();
    };
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: cn("space-y-2", className), children: [
      label && /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("label", { className: "text-sm font-medium leading-none", children: [
        label,
        required && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("span", { className: "text-red-500 ml-1", children: "*" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        "div",
        {
          className: cn(
            "border-2 rounded-lg overflow-hidden",
            error ? "border-red-500" : "border-gray-300 dark:border-gray-700",
            disabled && "opacity-50 cursor-not-allowed"
          ),
          style: { width: `${width}px` },
          children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
            "canvas",
            {
              ref: canvasRef,
              width,
              height,
              className: cn(
                "touch-none",
                disabled ? "cursor-not-allowed" : "cursor-crosshair"
              ),
              onMouseDown: startDrawing,
              onMouseMove: draw,
              onMouseUp: stopDrawing,
              onMouseLeave: stopDrawing,
              onTouchStart: startDrawing,
              onTouchMove: draw,
              onTouchEnd: stopDrawing
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: handleClear,
            disabled,
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Eraser, { className: "h-4 w-4" }),
              "Clear"
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: handleUndo,
            disabled: disabled || currentHistoryIndex <= 0,
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Undo, { className: "h-4 w-4" }),
              "Undo"
            ]
          }
        ),
        showDownload && /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: handleDownload,
            disabled,
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Download, { className: "h-4 w-4" }),
              "Download"
            ]
          }
        )
      ] }),
      error && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("p", { className: "text-sm text-red-500", children: error })
    ] });
  }
);
BizuitSignature.displayName = "BizuitSignature";
var BizuitDocumentInput = React92.forwardRef(
  ({
    value = [],
    onChange,
    accept = ".pdf,.doc,.docx,.txt",
    maxSize = 10 * 1024 * 1024,
    // 10MB default
    maxFiles = 5,
    label,
    description,
    className,
    disabled = false,
    required = false,
    error
  }, ref) => {
    const inputRef = React92.useRef(null);
    const [isDragging, setIsDragging] = React92.useState(false);
    const handleFiles = (files) => {
      if (!files || !onChange) return;
      const newFiles = [];
      const currentCount = value.length;
      for (let i = 0; i < files.length && currentCount + newFiles.length < maxFiles; i++) {
        const file = files[i];
        if (file.size > maxSize) {
          continue;
        }
        const documentFile = {
          file,
          id: `${Date.now()}-${i}`
        };
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            documentFile.preview = reader.result;
          };
          reader.readAsDataURL(file);
        }
        newFiles.push(documentFile);
      }
      onChange([...value, ...newFiles]);
    };
    const removeFile = (id) => {
      if (onChange) {
        onChange(value.filter((f) => f.id !== id));
      }
    };
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = () => {
      setIsDragging(false);
    };
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    };
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { ref, className: cn("space-y-2", className), children: [
      label && /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("label", { className: "text-sm font-medium leading-none", children: [
        label,
        required && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "text-red-500 ml-1", children: "*" })
      ] }),
      description && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("p", { className: "text-sm text-muted-foreground", children: description }),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
        "div",
        {
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop,
          onClick: () => !disabled && inputRef.current?.click(),
          className: cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragging && "border-primary bg-primary/5",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-red-500"
          ),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Upload, { className: "h-10 w-10 mx-auto text-muted-foreground mb-2" }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("p", { className: "text-sm text-muted-foreground", children: "Arrastra archivos aqu\xED o haz clic para seleccionar" }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("p", { className: "text-xs text-muted-foreground mt-1", children: [
              "M\xE1x. ",
              maxFiles,
              " archivos, ",
              (maxSize / (1024 * 1024)).toFixed(0),
              "MB cada uno"
            ] })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
        "input",
        {
          ref: inputRef,
          type: "file",
          accept,
          multiple: maxFiles > 1,
          onChange: (e) => handleFiles(e.target.files),
          disabled,
          className: "hidden"
        }
      ),
      value.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "space-y-2", children: value.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)(
        "div",
        {
          className: "flex items-center gap-3 p-3 border rounded-lg bg-card",
          children: [
            doc.preview ? /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(Image2, { className: "h-8 w-8 text-muted-foreground shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(FileText, { className: "h-8 w-8 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("p", { className: "text-sm font-medium truncate", children: doc.file.name }),
              /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("p", { className: "text-xs text-muted-foreground", children: [
                (doc.file.size / 1024).toFixed(2),
                " KB"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
              "button",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  removeFile(doc.id);
                },
                className: "text-muted-foreground hover:text-destructive transition-colors",
                disabled,
                children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(X, { className: "h-5 w-5" })
              }
            )
          ]
        },
        doc.id
      )) }),
      error && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("p", { className: "text-sm text-red-500", children: error })
    ] });
  }
);
BizuitDocumentInput.displayName = "BizuitDocumentInput";
var BizuitGeolocation = React102.forwardRef(
  ({
    value,
    onChange,
    label,
    description,
    showMap = false,
    className,
    disabled = false,
    required = false,
    error
  }, ref) => {
    const [loading, setLoading] = React102.useState(false);
    const [geoError, setGeoError] = React102.useState();
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setGeoError("Geolocalizaci\xF3n no soportada en este navegador");
        return;
      }
      setLoading(true);
      setGeoError(void 0);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          onChange?.(location);
          setLoading(false);
        },
        (error2) => {
          setGeoError(error2.message);
          setLoading(false);
        },
        { enableHighAccuracy: true }
      );
    };
    return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { ref, className: cn("space-y-2", className), children: [
      label && /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("label", { className: "text-sm font-medium leading-none", children: [
        label,
        required && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "text-red-500 ml-1", children: "*" })
      ] }),
      description && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: "text-sm text-muted-foreground", children: description }),
      /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "flex gap-2", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)(
        Button,
        {
          type: "button",
          onClick: getCurrentLocation,
          disabled: disabled || loading,
          variant: "outline",
          className: "w-full",
          children: [
            loading ? /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(MapPin, { className: "h-4 w-4 mr-2" }),
            loading ? "Obteniendo ubicaci\xF3n..." : "Obtener ubicaci\xF3n actual"
          ]
        }
      ) }),
      value && /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "p-4 border rounded-lg bg-card space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "text-muted-foreground", children: "Latitud:" }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: "font-mono", children: value.latitude.toFixed(6) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "text-muted-foreground", children: "Longitud:" }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { className: "font-mono", children: value.longitude.toFixed(6) })
          ] }),
          value.accuracy && /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "col-span-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { className: "text-muted-foreground", children: "Precisi\xF3n:" }),
            /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("p", { className: "font-mono", children: [
              value.accuracy.toFixed(2),
              " metros"
            ] })
          ] })
        ] }),
        showMap && /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { className: "mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
          "a",
          {
            href: `https://www.google.com/maps?q=${value.latitude},${value.longitude}`,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-sm text-primary hover:underline",
            children: "Ver en Google Maps"
          }
        ) })
      ] }),
      (geoError || error) && /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex items-center gap-2 text-sm text-red-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(AlertCircle, { className: "h-4 w-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("span", { children: geoError || error })
      ] })
    ] });
  }
);
BizuitGeolocation.displayName = "BizuitGeolocation";
var BizuitSubForm = React112.forwardRef(
  ({
    fields,
    value = [],
    onChange,
    label,
    description,
    maxRows = 10,
    minRows = 0,
    className,
    disabled = false
  }, ref) => {
    const addRow = () => {
      if (value.length >= maxRows) return;
      const newRow = {
        id: `row-${Date.now()}`
      };
      fields.forEach((field) => {
        newRow[field.name] = "";
      });
      onChange?.([...value, newRow]);
    };
    const removeRow = (id) => {
      if (value.length <= minRows) return;
      onChange?.(value.filter((row) => row.id !== id));
    };
    const updateRow = (id, fieldName, fieldValue) => {
      onChange?.(
        value.map(
          (row) => row.id === id ? { ...row, [fieldName]: fieldValue } : row
        )
      );
    };
    return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { ref, className: cn("space-y-4", className), children: [
      label && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("label", { className: "text-sm font-medium leading-none", children: label }),
      description && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("p", { className: "text-sm text-muted-foreground", children: description }),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "border rounded-lg overflow-hidden", children: [
        value.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("table", { className: "w-full", children: [
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("thead", { className: "bg-muted border-b", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("tr", { children: [
            fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
              "th",
              {
                className: "text-left p-3 text-sm font-medium",
                children: [
                  field.label,
                  field.required && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("span", { className: "text-red-500 ml-1", children: "*" })
                ]
              },
              field.name
            )),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("th", { className: "w-16" })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("tbody", { children: value.map((row, rowIndex) => /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("tr", { className: "border-b last:border-b-0", children: [
            fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("td", { className: "p-2", children: field.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
              "select",
              {
                value: row[field.name] || "",
                onChange: (e) => updateRow(row.id, field.name, e.target.value),
                disabled,
                className: "w-full px-3 py-2 border rounded-md bg-background",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("option", { value: "", children: "Seleccionar..." }),
                  field.options?.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("option", { value: opt.value, children: opt.label }, opt.value))
                ]
              }
            ) : /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              "input",
              {
                type: field.type,
                value: row[field.name] || "",
                onChange: (e) => updateRow(row.id, field.name, e.target.value),
                disabled,
                className: "w-full px-3 py-2 border rounded-md bg-background"
              }
            ) }, field.name)),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("td", { className: "p-2", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: () => removeRow(row.id),
                disabled: disabled || value.length <= minRows,
                children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Trash2, { className: "h-4 w-4 text-destructive" })
              }
            ) })
          ] }, row.id)) })
        ] }) }),
        value.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "p-8 text-center text-muted-foreground", children: "No hay filas agregadas" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: addRow,
          disabled: disabled || value.length >= maxRows,
          className: "w-full",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(Plus, { className: "h-4 w-4 mr-2" }),
            "Agregar fila"
          ]
        }
      ),
      value.length >= maxRows && /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("p", { className: "text-xs text-muted-foreground", children: [
        "M\xE1ximo ",
        maxRows,
        " filas permitidas"
      ] })
    ] });
  }
);
BizuitSubForm.displayName = "BizuitSubForm";
var BizuitTabs = React122.forwardRef(
  ({
    items,
    defaultValue,
    value,
    onChange,
    orientation = "horizontal",
    className,
    variant = "default"
  }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
      Root22,
      {
        ref,
        className: cn("w-full", className),
        defaultValue: defaultValue || items[0]?.value,
        value,
        onValueChange: onChange,
        orientation,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
            List,
            {
              className: cn(
                "inline-flex items-center justify-start",
                orientation === "horizontal" ? "h-10 rounded-md bg-muted p-1 text-muted-foreground w-full" : "flex-col h-auto space-y-1 w-48",
                variant === "underline" && "bg-transparent p-0 border-b",
                variant === "pills" && "bg-transparent p-0 gap-2"
              ),
              children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)(
                Trigger,
                {
                  value: item.value,
                  disabled: item.disabled,
                  className: cn(
                    "inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5",
                    "text-sm font-medium ring-offset-background transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    // Default variant
                    variant === "default" && "rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                    // Pills variant
                    variant === "pills" && "rounded-full border border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
                    // Underline variant
                    variant === "underline" && "border-b-2 border-transparent rounded-none data-[state=active]:border-primary data-[state=active]:text-foreground",
                    orientation === "vertical" && "w-full justify-start"
                  ),
                  children: [
                    item.icon && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: "mr-2", children: item.icon }),
                    item.label
                  ]
                },
                item.value
              ))
            }
          ),
          items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
            Content,
            {
              value: item.value,
              className: cn(
                "mt-2 ring-offset-background focus-visible:outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              ),
              children: item.content
            },
            item.value
          ))
        ]
      }
    );
  }
);
BizuitTabs.displayName = "BizuitTabs";
var BizuitCard = React132.forwardRef(
  ({
    className,
    title,
    description,
    header,
    footer,
    children,
    variant = "default",
    hoverable = false,
    clickable = false,
    ...props
  }, ref) => {
    return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
      "div",
      {
        ref,
        className: cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          variant === "outline" && "border-2",
          variant === "filled" && "bg-muted border-none",
          hoverable && "transition-shadow hover:shadow-md",
          clickable && "cursor-pointer transition-all hover:scale-[1.02]",
          className
        ),
        ...props,
        children: [
          header && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "p-6 pb-0", children: header }),
          (title || description) && /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: cn("p-6", header && "pt-2", footer && children && "pb-0"), children: [
            title && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("h3", { className: "text-2xl font-semibold leading-none tracking-tight", children: title }),
            description && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-sm text-muted-foreground mt-1.5", children: description })
          ] }),
          children && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: cn("p-6", (title || description) && "pt-0"), children }),
          footer && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "flex items-center p-6 pt-0", children: footer })
        ]
      }
    );
  }
);
BizuitCard.displayName = "BizuitCard";
var BizuitStepper = React142.forwardRef(
  ({
    steps,
    currentStep,
    onChange,
    orientation = "horizontal",
    clickable = false,
    className
  }, ref) => {
    const handleStepClick = (index) => {
      if (clickable && onChange) {
        onChange(index);
      }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
      "div",
      {
        ref,
        className: cn(
          "flex",
          orientation === "horizontal" ? "flex-row items-center" : "flex-col",
          className
        ),
        children: steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;
          return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(React142.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
              "div",
              {
                className: cn(
                  "flex items-center",
                  orientation === "vertical" && "w-full"
                ),
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
                    "div",
                    {
                      className: cn(
                        "flex items-center justify-center rounded-full border-2 transition-all",
                        "min-w-[40px] w-10 h-10",
                        isCompleted && "bg-primary border-primary text-primary-foreground",
                        isCurrent && "border-primary text-primary",
                        isUpcoming && "border-muted-foreground/30 text-muted-foreground",
                        clickable && "cursor-pointer hover:scale-110"
                      ),
                      onClick: () => handleStepClick(index),
                      children: isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Check, { className: "h-5 w-5" }) : step.icon ? step.icon : /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "text-sm font-semibold", children: index + 1 })
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
                    "div",
                    {
                      className: cn(
                        "ml-3",
                        orientation === "horizontal" && "max-w-[150px]"
                      ),
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
                          "div",
                          {
                            className: cn(
                              "text-sm font-medium",
                              isCurrent && "text-foreground",
                              (isCompleted || isUpcoming) && "text-muted-foreground"
                            ),
                            children: step.label
                          }
                        ),
                        step.description && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "text-xs text-muted-foreground mt-0.5", children: step.description })
                      ]
                    }
                  )
                ]
              }
            ),
            index < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
              "div",
              {
                className: cn(
                  "bg-muted-foreground/30",
                  orientation === "horizontal" ? "h-[2px] flex-1 mx-4" : "w-[2px] h-12 ml-5 my-2",
                  isCompleted && "bg-primary"
                )
              }
            )
          ] }, index);
        })
      }
    );
  }
);
BizuitStepper.displayName = "BizuitStepper";
var BizuitMedia = React152.forwardRef(
  ({
    src,
    type,
    alt = "Media content",
    width,
    height,
    controls = true,
    autoPlay = false,
    loop = false,
    muted = false,
    className,
    onLoad,
    onError,
    onCapture,
    onQRCodeDetected,
    facingMode = "environment"
  }, ref) => {
    const [isPlaying, setIsPlaying] = React152.useState(autoPlay);
    const [isMuted, setIsMuted] = React152.useState(muted);
    const [isCameraActive, setIsCameraActive] = React152.useState(false);
    const [capturedImage, setCapturedImage] = React152.useState(null);
    const [currentFacingMode, setCurrentFacingMode] = React152.useState(facingMode);
    const [qrDetected, setQrDetected] = React152.useState(null);
    const mediaRef = React152.useRef(null);
    const cameraVideoRef = React152.useRef(null);
    const canvasRef = React152.useRef(null);
    const streamRef = React152.useRef(null);
    const qrScanIntervalRef = React152.useRef(null);
    React152.useEffect(() => {
      return () => {
        stopCamera();
      };
    }, []);
    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (qrScanIntervalRef.current) {
        clearInterval(qrScanIntervalRef.current);
        qrScanIntervalRef.current = null;
      }
      setIsCameraActive(false);
    };
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: currentFacingMode },
          audio: false
        });
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = stream;
          streamRef.current = stream;
          setIsCameraActive(true);
          if (type === "qr-scanner") {
            startQRScanning();
          }
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        onError?.();
      }
    };
    const startQRScanning = () => {
      if (!cameraVideoRef.current || !canvasRef.current) return;
      const video = cameraVideoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;
      qrScanIntervalRef.current = setInterval(() => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = detectQRCode(imageData);
          if (code) {
            setQrDetected(code);
            onQRCodeDetected?.(code);
            stopCamera();
          }
        }
      }, 100);
    };
    const detectQRCode = (imageData) => {
      try {
        if (typeof window !== "undefined" && window.jsQR) {
          const code = window.jsQR(imageData.data, imageData.width, imageData.height);
          return code ? code.data : null;
        }
      } catch (err) {
        console.error("QR detection error:", err);
      }
      return null;
    };
    const capturePhoto = () => {
      if (!cameraVideoRef.current || !canvasRef.current) return;
      const video = cameraVideoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setCapturedImage(dataUrl);
      onCapture?.(dataUrl);
      stopCamera();
    };
    const retakePhoto = () => {
      setCapturedImage(null);
      startCamera();
    };
    const switchCamera = async () => {
      stopCamera();
      setCurrentFacingMode((prev) => prev === "user" ? "environment" : "user");
      setTimeout(() => {
        startCamera();
      }, 100);
    };
    const togglePlay = () => {
      if (mediaRef.current) {
        if (isPlaying) {
          mediaRef.current.pause();
        } else {
          mediaRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
    const toggleMute = () => {
      if (mediaRef.current) {
        mediaRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    };
    const toggleFullscreen = () => {
      if (mediaRef.current && "requestFullscreen" in mediaRef.current) {
        mediaRef.current.requestFullscreen();
      }
    };
    if (type === "image") {
      return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { ref, className: cn("relative overflow-hidden rounded-lg", className), children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
        "img",
        {
          src,
          alt,
          width,
          height,
          onLoad,
          onError,
          className: "w-full h-full object-cover"
        }
      ) });
    }
    if (type === "video") {
      return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { ref, className: cn("relative overflow-hidden rounded-lg bg-black", className), style: { width, height }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
          "video",
          {
            ref: mediaRef,
            src,
            autoPlay,
            loop,
            muted,
            onLoadedData: onLoad,
            onError,
            className: "w-full h-full object-contain",
            controls
          }
        ),
        !controls && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            "button",
            {
              onClick: togglePlay,
              className: "text-white hover:text-primary transition-colors",
              "aria-label": isPlaying ? "Pause" : "Play",
              children: isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Pause, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Play, { className: "h-6 w-6" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            "button",
            {
              onClick: toggleMute,
              className: "text-white hover:text-primary transition-colors",
              "aria-label": isMuted ? "Unmute" : "Mute",
              children: isMuted ? /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(VolumeX, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Volume2, { className: "h-6 w-6" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            "button",
            {
              onClick: toggleFullscreen,
              className: "text-white hover:text-primary transition-colors ml-auto",
              "aria-label": "Fullscreen",
              children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Maximize, { className: "h-6 w-6" })
            }
          )
        ] })
      ] });
    }
    if (type === "audio") {
      return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { ref, className: cn("rounded-lg bg-card border p-4", className), children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
        "audio",
        {
          ref: mediaRef,
          src,
          autoPlay,
          loop,
          muted,
          onLoadedData: onLoad,
          onError,
          controls,
          className: "w-full"
        }
      ) });
    }
    if (type === "camera") {
      return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { ref, className: cn("relative overflow-hidden rounded-lg bg-black", className), style: { width: width || "100%", height: height || 400 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("canvas", { ref: canvasRef, className: "hidden" }),
        !isCameraActive && !capturedImage && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
          "button",
          {
            onClick: startCamera,
            className: "flex flex-col items-center gap-2 text-white hover:text-primary transition-colors",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Camera, { className: "h-12 w-12" }),
              /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("span", { children: "Activar C\xE1mara" })
            ]
          }
        ) }),
        isCameraActive && !capturedImage && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(import_jsx_runtime26.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            "video",
            {
              ref: cameraVideoRef,
              autoPlay: true,
              playsInline: true,
              muted: true,
              className: "w-full h-full object-cover"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-center justify-center gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
              "button",
              {
                onClick: switchCamera,
                className: "text-white hover:text-primary transition-colors",
                "aria-label": "Switch camera",
                children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(RotateCw, { className: "h-6 w-6" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
              "button",
              {
                onClick: capturePhoto,
                className: "bg-white rounded-full p-4 hover:bg-gray-200 transition-colors",
                "aria-label": "Capture photo",
                children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(Camera, { className: "h-8 w-8 text-black" })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
              "button",
              {
                onClick: stopCamera,
                className: "text-white hover:text-primary transition-colors",
                "aria-label": "Close camera",
                children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(X, { className: "h-6 w-6" })
              }
            )
          ] })
        ] }),
        capturedImage && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(import_jsx_runtime26.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("img", { src: capturedImage, alt: "Captured", className: "w-full h-full object-cover" }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-center justify-center gap-4", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            "button",
            {
              onClick: retakePhoto,
              className: "bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors",
              children: "Tomar otra foto"
            }
          ) })
        ] })
      ] });
    }
    if (type === "qr-scanner") {
      return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { ref, className: cn("relative overflow-hidden rounded-lg bg-black", className), style: { width: width || "100%", height: height || 400 }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("canvas", { ref: canvasRef, className: "hidden" }),
        !isCameraActive && !qrDetected && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
          "button",
          {
            onClick: startCamera,
            className: "flex flex-col items-center gap-2 text-white hover:text-primary transition-colors",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(QrCode, { className: "h-12 w-12" }),
              /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("span", { children: "Escanear C\xF3digo QR" })
            ]
          }
        ) }),
        isCameraActive && !qrDetected && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(import_jsx_runtime26.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            "video",
            {
              ref: cameraVideoRef,
              autoPlay: true,
              playsInline: true,
              muted: true,
              className: "w-full h-full object-cover"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "border-4 border-primary w-64 h-64 rounded-lg" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "absolute top-4 left-0 right-0 text-center", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "text-white bg-black/50 inline-block px-4 py-2 rounded-md", children: "Coloca el c\xF3digo QR dentro del recuadro" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            "button",
            {
              onClick: stopCamera,
              className: "text-white hover:text-primary transition-colors",
              "aria-label": "Close scanner",
              children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(X, { className: "h-6 w-6" })
            }
          ) })
        ] }),
        qrDetected && /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("div", { className: "flex flex-col items-center justify-center h-full p-8 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "bg-green-500 text-white p-4 rounded-full mb-4", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(QrCode, { className: "h-12 w-12" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("h3", { className: "text-white text-xl font-semibold mb-2", children: "\xA1C\xF3digo QR detectado!" }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("p", { className: "text-gray-300 mb-4 break-all max-w-md", children: qrDetected }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
            "button",
            {
              onClick: () => {
                setQrDetected(null);
                startCamera();
              },
              className: "bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors",
              children: "Escanear otro c\xF3digo"
            }
          )
        ] })
      ] });
    }
    return null;
  }
);
BizuitMedia.displayName = "BizuitMedia";
var BizuitIFrame = React162.forwardRef(
  ({
    src,
    title,
    width = "100%",
    height = 500,
    loading = "lazy",
    showLoader = true,
    onLoad,
    onError,
    className,
    ...props
  }, ref) => {
    const [isLoading, setIsLoading] = React162.useState(showLoader);
    const [hasError, setHasError] = React162.useState(false);
    const handleLoad = () => {
      setIsLoading(false);
      onLoad?.();
    };
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };
    return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: cn("relative w-full", className), style: { width, height }, children: [
      isLoading && showLoader && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "absolute inset-0 flex items-center justify-center bg-muted rounded-lg border", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }),
      hasError && /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "absolute inset-0 flex items-center justify-center bg-muted rounded-lg border", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { className: "text-center p-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: "text-sm font-medium text-muted-foreground", children: "Error al cargar el contenido" }),
        /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "No se pudo cargar: ",
          src
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
        "iframe",
        {
          ref,
          src,
          title,
          width: "100%",
          height: "100%",
          loading,
          onLoad: handleLoad,
          onError: handleError,
          className: cn(
            "rounded-lg border bg-background",
            isLoading && "opacity-0",
            hasError && "hidden"
          ),
          ...props
        }
      )
    ] });
  }
);
BizuitIFrame.displayName = "BizuitIFrame";
var initialState = {
  theme: "system",
  setTheme: () => null,
  colorTheme: "blue",
  setColorTheme: () => null,
  language: "es",
  setLanguage: () => null
};
var ThemeProviderContext = React172.createContext(initialState);
function BizuitThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "blue",
  defaultLanguage = "es",
  storageKey = "bizuit-ui-theme",
  colorStorageKey = "bizuit-ui-color-theme",
  languageStorageKey = "bizuit-ui-language",
  ...props
}) {
  const [theme, setTheme] = React172.useState(
    () => typeof window !== "undefined" && localStorage.getItem(storageKey) || defaultTheme
  );
  const [colorTheme, setColorTheme] = React172.useState(
    () => typeof window !== "undefined" && localStorage.getItem(colorStorageKey) || defaultColorTheme
  );
  const [language, setLanguage] = React172.useState(
    () => typeof window !== "undefined" && localStorage.getItem(languageStorageKey) || defaultLanguage
  );
  React172.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);
  React172.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("theme-blue", "theme-green", "theme-purple", "theme-orange", "theme-red", "theme-slate");
    root.classList.add(`theme-${colorTheme}`);
  }, [colorTheme]);
  React172.useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("lang", language);
  }, [language]);
  const value = {
    theme,
    setTheme: (theme2) => {
      localStorage.setItem(storageKey, theme2);
      setTheme(theme2);
    },
    colorTheme,
    setColorTheme: (colorTheme2) => {
      localStorage.setItem(colorStorageKey, colorTheme2);
      setColorTheme(colorTheme2);
    },
    language,
    setLanguage: (language2) => {
      localStorage.setItem(languageStorageKey, language2);
      setLanguage(language2);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(ThemeProviderContext.Provider, { ...props, value, children });
}
var BizuitAuthContext = (0, import_react4.createContext)(void 0);

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/bind.js
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/utils.js
var { toString } = Object.prototype;
var { getPrototypeOf } = Object;
var { iterator, toStringTag } = Symbol;
var kindOf = /* @__PURE__ */ ((cache) => (thing) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
var kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
var typeOfTest = (type) => (thing) => typeof thing === type;
var { isArray } = Array;
var isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction2(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
var isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
var isString = typeOfTest("string");
var isFunction2 = typeOfTest("function");
var isNumber2 = typeOfTest("number");
var isObject = (thing) => thing !== null && typeof thing === "object";
var isBoolean = (thing) => thing === true || thing === false;
var isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype3 = getPrototypeOf(val);
  return (prototype3 === null || prototype3 === Object.prototype || Object.getPrototypeOf(prototype3) === null) && !(toStringTag in val) && !(iterator in val);
};
var isEmptyObject = (val) => {
  if (!isObject(val) || isBuffer(val)) {
    return false;
  }
  try {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
  } catch (e) {
    return false;
  }
};
var isDate = kindOfTest("Date");
var isFile = kindOfTest("File");
var isBlob = kindOfTest("Blob");
var isFileList = kindOfTest("FileList");
var isStream = (val) => isObject(val) && isFunction2(val.pipe);
var isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction2(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction2(thing.toString) && thing.toString() === "[object FormData]"));
};
var isURLSearchParams = kindOfTest("URLSearchParams");
var [isReadableStream, isRequest, isResponse, isHeaders] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
var trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    if (isBuffer(obj)) {
      return;
    }
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  if (isBuffer(obj)) {
    return null;
  }
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
var _global = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
var isContextDefined = (context) => !isUndefined(context) && context !== _global;
function merge() {
  const { caseless, skipUndefined } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else if (!skipUndefined || !isUndefined(val)) {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
var extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction2(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
var stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
var inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
var toFlatObject = (sourceObj, destObj, filter2, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null) return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter2 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter2 || filter2(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
var endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
var toArray = (thing) => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber2(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
var isTypedArray = /* @__PURE__ */ ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
var forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];
  const _iterator = generator.call(obj);
  let result;
  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
var matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
var isHTMLForm = kindOfTest("HTMLFormElement");
var toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
var hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
var isRegExp = kindOfTest("RegExp");
var reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
var freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction2(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction2(value)) return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
var toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
var noop = () => {
};
var toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction2(thing.append) && thing[toStringTag] === "FormData" && thing[iterator]);
}
var toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (isBuffer(source)) {
        return source;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
var isAsyncFn = kindOfTest("AsyncFunction");
var isThenable = (thing) => thing && (isObject(thing) || isFunction2(thing)) && isFunction2(thing.then) && isFunction2(thing.catch);
var _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }
  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({ source, data }) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);
    return (cb) => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    };
  })(`axios@${Math.random()}`, []) : (cb) => setTimeout(cb);
})(
  typeof setImmediate === "function",
  isFunction2(_global.postMessage)
);
var asap = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(_global) : typeof process !== "undefined" && process.nextTick || _setImmediate;
var isIterable = (thing) => thing != null && isFunction2(thing[iterator]);
var utils_default = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber: isNumber2,
  isBoolean,
  isObject,
  isPlainObject,
  isEmptyObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction: isFunction2,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
};

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/core/AxiosError.js
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}
utils_default.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils_default.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
var prototype = AxiosError.prototype;
var descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, "isAxiosError", { value: true });
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);
  utils_default.toFlatObject(error, axiosError, function filter2(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  const msg = error && error.message ? error.message : "Error";
  const errCode = code == null && error ? error.code : code;
  AxiosError.call(axiosError, msg, errCode, config, request, response);
  if (error && axiosError.cause == null) {
    Object.defineProperty(axiosError, "cause", { value: error, configurable: true });
  }
  axiosError.name = error && error.name || "Error";
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
var AxiosError_default = AxiosError;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/null.js
var null_default = null;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/toFormData.js
function isVisitable(thing) {
  return utils_default.isPlainObject(thing) || utils_default.isArray(thing);
}
function removeBrackets(key) {
  return utils_default.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils_default.isArray(arr) && !arr.some(isVisitable);
}
var predicates = utils_default.toFlatObject(utils_default, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils_default.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new (null_default || FormData)();
  options = utils_default.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils_default.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils_default.isSpecCompliantForm(formData);
  if (!utils_default.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null) return "";
    if (utils_default.isDate(value)) {
      return value.toISOString();
    }
    if (utils_default.isBoolean(value)) {
      return value.toString();
    }
    if (!useBlob && utils_default.isBlob(value)) {
      throw new AxiosError_default("Blob is not supported. Use a Buffer instead.");
    }
    if (utils_default.isArrayBuffer(value) || utils_default.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === "object") {
      if (utils_default.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils_default.isArray(value) && isFlatArray(value) || (utils_default.isFileList(value) || utils_default.endsWith(key, "[]")) && (arr = utils_default.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(utils_default.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (utils_default.isUndefined(value)) return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path.join("."));
    }
    stack.push(value);
    utils_default.forEach(value, function each(el, key) {
      const result = !(utils_default.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils_default.isString(key) ? key.trim() : key,
        path,
        exposedHelpers
      );
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils_default.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
var toFormData_default = toFormData;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/AxiosURLSearchParams.js
function encode(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData_default(params, this, options);
}
var prototype2 = AxiosURLSearchParams.prototype;
prototype2.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype2.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode);
  } : encode;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
var AxiosURLSearchParams_default = AxiosURLSearchParams;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/buildURL.js
function encode2(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+");
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode2;
  if (utils_default.isFunction(options)) {
    options = {
      serialize: options
    };
  }
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils_default.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams_default(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/core/InterceptorManager.js
var InterceptorManager = class {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils_default.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
};
var InterceptorManager_default = InterceptorManager;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/defaults/transitional.js
var transitional_default = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/platform/browser/classes/URLSearchParams.js
var URLSearchParams_default = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams_default;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/platform/browser/classes/FormData.js
var FormData_default = typeof FormData !== "undefined" ? FormData : null;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/platform/browser/classes/Blob.js
var Blob_default = typeof Blob !== "undefined" ? Blob : null;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/platform/browser/index.js
var browser_default = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams_default,
    FormData: FormData_default,
    Blob: Blob_default
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
};

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/platform/common/utils.js
var utils_exports = {};
__export(utils_exports, {
  hasBrowserEnv: () => hasBrowserEnv,
  hasStandardBrowserEnv: () => hasStandardBrowserEnv,
  hasStandardBrowserWebWorkerEnv: () => hasStandardBrowserWebWorkerEnv,
  navigator: () => _navigator,
  origin: () => origin
});
var hasBrowserEnv = typeof window !== "undefined" && typeof document !== "undefined";
var _navigator = typeof navigator === "object" && navigator || void 0;
var hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ["ReactNative", "NativeScript", "NS"].indexOf(_navigator.product) < 0);
var hasStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
var origin = hasBrowserEnv && window.location.href || "http://localhost";

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/platform/index.js
var platform_default = {
  ...utils_exports,
  ...browser_default
};

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/toURLEncodedForm.js
function toURLEncodedForm(data, options) {
  return toFormData_default(data, new platform_default.classes.URLSearchParams(), {
    visitor: function(value, key, path, helpers) {
      if (platform_default.isNode && utils_default.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    },
    ...options
  });
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/formDataToJSON.js
function parsePropPath(name) {
  return utils_default.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    if (name === "__proto__") return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && utils_default.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils_default.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils_default.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index);
    if (result && utils_default.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils_default.isFormData(formData) && utils_default.isFunction(formData.entries)) {
    const obj = {};
    utils_default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
var formDataToJSON_default = formDataToJSON;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/defaults/index.js
function stringifySafely(rawValue, parser, encoder) {
  if (utils_default.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils_default.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
var defaults = {
  transitional: transitional_default,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils_default.isObject(data);
    if (isObjectPayload && utils_default.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils_default.isFormData(data);
    if (isFormData2) {
      return hasJSONContentType ? JSON.stringify(formDataToJSON_default(data)) : data;
    }
    if (utils_default.isArrayBuffer(data) || utils_default.isBuffer(data) || utils_default.isStream(data) || utils_default.isFile(data) || utils_default.isBlob(data) || utils_default.isReadableStream(data)) {
      return data;
    }
    if (utils_default.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils_default.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils_default.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData_default(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (utils_default.isResponse(data) || utils_default.isReadableStream(data)) {
      return data;
    }
    if (data && utils_default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data, this.parseReviver);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError_default.from(e, AxiosError_default.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform_default.classes.FormData,
    Blob: platform_default.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils_default.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
  defaults.headers[method] = {};
});
var defaults_default = defaults;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/parseHeaders.js
var ignoreDuplicateOf = utils_default.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
var parseHeaders_default = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/core/AxiosHeaders.js
var $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils_default.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
var isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter2, isHeaderNameFilter) {
  if (utils_default.isFunction(filter2)) {
    return filter2.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils_default.isString(value)) return;
  if (utils_default.isString(filter2)) {
    return value.indexOf(filter2) !== -1;
  }
  if (utils_default.isRegExp(filter2)) {
    return filter2.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils_default.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
var AxiosHeaders = class {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils_default.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils_default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils_default.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils_default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders_default(header), valueOrRewrite);
    } else if (utils_default.isObject(header) && utils_default.isIterable(header)) {
      let obj = {}, dest, key;
      for (const entry of header) {
        if (!utils_default.isArray(entry)) {
          throw TypeError("Object iterator must return a key-value pair");
        }
        obj[key = entry[0]] = (dest = obj[key]) ? utils_default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
      }
      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils_default.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils_default.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils_default.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils_default.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils_default.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils_default.forEach(this, (value, header) => {
      const key = utils_default.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils_default.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils_default.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype3 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype3, _header);
        accessors[lHeader] = true;
      }
    }
    utils_default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
};
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils_default.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils_default.freezeMethods(AxiosHeaders);
var AxiosHeaders_default = AxiosHeaders;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/core/transformData.js
function transformData(fns, response) {
  const config = this || defaults_default;
  const context = response || config;
  const headers = AxiosHeaders_default.from(context.headers);
  let data = context.data;
  utils_default.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/cancel/isCancel.js
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/cancel/CanceledError.js
function CanceledError(message, config, request) {
  AxiosError_default.call(this, message == null ? "canceled" : message, AxiosError_default.ERR_CANCELED, config, request);
  this.name = "CanceledError";
}
utils_default.inherits(CanceledError, AxiosError_default, {
  __CANCEL__: true
});
var CanceledError_default = CanceledError;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/core/settle.js
function settle(resolve, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError_default(
      "Request failed with status code " + response.status,
      [AxiosError_default.ERR_BAD_REQUEST, AxiosError_default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/parseProtocol.js
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || "";
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/speedometer.js
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
var speedometer_default = speedometer;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/throttle.js
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1e3 / freq;
  let lastArgs;
  let timer;
  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn(...args);
  };
  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if (passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
var throttle_default = throttle;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/progressEventReducer.js
var progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = speedometer_default(50, 250);
  return throttle_default((e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? "download" : "upload"]: true
    };
    listener(data);
  }, freq);
};
var progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;
  return [(loaded) => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};
var asyncDecorator = (fn) => (...args) => utils_default.asap(() => fn(...args));

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/isURLSameOrigin.js
var isURLSameOrigin_default = platform_default.hasStandardBrowserEnv ? /* @__PURE__ */ ((origin2, isMSIE) => (url) => {
  url = new URL(url, platform_default.origin);
  return origin2.protocol === url.protocol && origin2.host === url.host && (isMSIE || origin2.port === url.port);
})(
  new URL(platform_default.origin),
  platform_default.navigator && /(msie|trident)/i.test(platform_default.navigator.userAgent)
) : () => true;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/cookies.js
var cookies_default = platform_default.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(name, value, expires, path, domain, secure, sameSite) {
      if (typeof document === "undefined") return;
      const cookie = [`${name}=${encodeURIComponent(value)}`];
      if (utils_default.isNumber(expires)) {
        cookie.push(`expires=${new Date(expires).toUTCString()}`);
      }
      if (utils_default.isString(path)) {
        cookie.push(`path=${path}`);
      }
      if (utils_default.isString(domain)) {
        cookie.push(`domain=${domain}`);
      }
      if (secure === true) {
        cookie.push("secure");
      }
      if (utils_default.isString(sameSite)) {
        cookie.push(`SameSite=${sameSite}`);
      }
      document.cookie = cookie.join("; ");
    },
    read(name) {
      if (typeof document === "undefined") return null;
      const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
      return match ? decodeURIComponent(match[1]) : null;
    },
    remove(name) {
      this.write(name, "", Date.now() - 864e5, "/");
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/isAbsoluteURL.js
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/combineURLs.js
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/core/buildFullPath.js
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !isAbsoluteURL(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/core/mergeConfig.js
var headersToObject = (thing) => thing instanceof AxiosHeaders_default ? { ...thing } : thing;
function mergeConfig(config1, config2) {
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, prop, caseless) {
    if (utils_default.isPlainObject(target) && utils_default.isPlainObject(source)) {
      return utils_default.merge.call({ caseless }, target, source);
    } else if (utils_default.isPlainObject(source)) {
      return utils_default.merge({}, source);
    } else if (utils_default.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, prop, caseless) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(a, b, prop, caseless);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a, prop, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils_default.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils_default.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
  };
  utils_default.forEach(Object.keys({ ...config1, ...config2 }), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config2[prop], prop);
    utils_default.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/resolveConfig.js
var resolveConfig_default = (config) => {
  const newConfig = mergeConfig({}, config);
  let { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
  newConfig.headers = headers = AxiosHeaders_default.from(headers);
  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
  if (auth) {
    headers.set(
      "Authorization",
      "Basic " + btoa((auth.username || "") + ":" + (auth.password ? unescape(encodeURIComponent(auth.password)) : ""))
    );
  }
  if (utils_default.isFormData(data)) {
    if (platform_default.hasStandardBrowserEnv || platform_default.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(void 0);
    } else if (utils_default.isFunction(data.getHeaders)) {
      const formHeaders = data.getHeaders();
      const allowedHeaders = ["content-type", "content-length"];
      Object.entries(formHeaders).forEach(([key, val]) => {
        if (allowedHeaders.includes(key.toLowerCase())) {
          headers.set(key, val);
        }
      });
    }
  }
  if (platform_default.hasStandardBrowserEnv) {
    withXSRFToken && utils_default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
    if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin_default(newConfig.url)) {
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies_default.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/adapters/xhr.js
var isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
var xhr_default = isXHRAdapterSupported && function(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = resolveConfig_default(config);
    let requestData = _config.data;
    const requestHeaders = AxiosHeaders_default.from(_config.headers).normalize();
    let { responseType, onUploadProgress, onDownloadProgress } = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;
    function done() {
      flushUpload && flushUpload();
      flushDownload && flushDownload();
      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
      _config.signal && _config.signal.removeEventListener("abort", onCanceled);
    }
    let request = new XMLHttpRequest();
    request.open(_config.method.toUpperCase(), _config.url, true);
    request.timeout = _config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders_default.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError_default("Request aborted", AxiosError_default.ECONNABORTED, config, request));
      request = null;
    };
    request.onerror = function handleError(event) {
      const msg = event && event.message ? event.message : "Network Error";
      const err = new AxiosError_default(msg, AxiosError_default.ERR_NETWORK, config, request);
      err.event = event || null;
      reject(err);
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? "timeout of " + _config.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = _config.transitional || transitional_default;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new AxiosError_default(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError_default.ETIMEDOUT : AxiosError_default.ECONNABORTED,
        config,
        request
      ));
      request = null;
    };
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils_default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils_default.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = _config.responseType;
    }
    if (onDownloadProgress) {
      [downloadThrottled, flushDownload] = progressEventReducer(onDownloadProgress, true);
      request.addEventListener("progress", downloadThrottled);
    }
    if (onUploadProgress && request.upload) {
      [uploadThrottled, flushUpload] = progressEventReducer(onUploadProgress);
      request.upload.addEventListener("progress", uploadThrottled);
      request.upload.addEventListener("loadend", flushUpload);
    }
    if (_config.cancelToken || _config.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError_default(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(_config.url);
    if (protocol && platform_default.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError_default("Unsupported protocol " + protocol + ":", AxiosError_default.ERR_BAD_REQUEST, config));
      return;
    }
    request.send(requestData || null);
  });
};

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/composeSignals.js
var composeSignals = (signals, timeout) => {
  const { length } = signals = signals ? signals.filter(Boolean) : [];
  if (timeout || length) {
    let controller = new AbortController();
    let aborted;
    const onabort = function(reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof AxiosError_default ? err : new CanceledError_default(err instanceof Error ? err.message : err));
      }
    };
    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new AxiosError_default(`timeout ${timeout} of ms exceeded`, AxiosError_default.ETIMEDOUT));
    }, timeout);
    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach((signal2) => {
          signal2.unsubscribe ? signal2.unsubscribe(onabort) : signal2.removeEventListener("abort", onabort);
        });
        signals = null;
      }
    };
    signals.forEach((signal2) => signal2.addEventListener("abort", onabort));
    const { signal } = controller;
    signal.unsubscribe = () => utils_default.asap(unsubscribe);
    return signal;
  }
};
var composeSignals_default = composeSignals;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/trackStream.js
var streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};
var readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};
var readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }
  const reader = stream.getReader();
  try {
    for (; ; ) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};
var trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator2 = readBytes(stream, chunkSize);
  let bytes = 0;
  let done;
  let _onFinish = (e) => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done: done2, value } = await iterator2.next();
        if (done2) {
          _onFinish();
          controller.close();
          return;
        }
        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator2.return();
    }
  }, {
    highWaterMark: 2
  });
};

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/adapters/fetch.js
var DEFAULT_CHUNK_SIZE = 64 * 1024;
var { isFunction: isFunction3 } = utils_default;
var globalFetchAPI = (({ Request, Response }) => ({
  Request,
  Response
}))(utils_default.global);
var {
  ReadableStream: ReadableStream2,
  TextEncoder
} = utils_default.global;
var test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false;
  }
};
var factory = (env) => {
  env = utils_default.merge.call({
    skipUndefined: true
  }, globalFetchAPI, env);
  const { fetch: envFetch, Request, Response } = env;
  const isFetchSupported = envFetch ? isFunction3(envFetch) : typeof fetch === "function";
  const isRequestSupported = isFunction3(Request);
  const isResponseSupported = isFunction3(Response);
  if (!isFetchSupported) {
    return false;
  }
  const isReadableStreamSupported = isFetchSupported && isFunction3(ReadableStream2);
  const encodeText = isFetchSupported && (typeof TextEncoder === "function" ? /* @__PURE__ */ ((encoder) => (str) => encoder.encode(str))(new TextEncoder()) : async (str) => new Uint8Array(await new Request(str).arrayBuffer()));
  const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
    let duplexAccessed = false;
    const hasContentType = new Request(platform_default.origin, {
      body: new ReadableStream2(),
      method: "POST",
      get duplex() {
        duplexAccessed = true;
        return "half";
      }
    }).headers.has("Content-Type");
    return duplexAccessed && !hasContentType;
  });
  const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => utils_default.isReadableStream(new Response("").body));
  const resolvers = {
    stream: supportsResponseStream && ((res) => res.body)
  };
  isFetchSupported && (() => {
    ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((type) => {
      !resolvers[type] && (resolvers[type] = (res, config) => {
        let method = res && res[type];
        if (method) {
          return method.call(res);
        }
        throw new AxiosError_default(`Response type '${type}' is not supported`, AxiosError_default.ERR_NOT_SUPPORT, config);
      });
    });
  })();
  const getBodyLength = async (body) => {
    if (body == null) {
      return 0;
    }
    if (utils_default.isBlob(body)) {
      return body.size;
    }
    if (utils_default.isSpecCompliantForm(body)) {
      const _request = new Request(platform_default.origin, {
        method: "POST",
        body
      });
      return (await _request.arrayBuffer()).byteLength;
    }
    if (utils_default.isArrayBufferView(body) || utils_default.isArrayBuffer(body)) {
      return body.byteLength;
    }
    if (utils_default.isURLSearchParams(body)) {
      body = body + "";
    }
    if (utils_default.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };
  const resolveBodyLength = async (headers, body) => {
    const length = utils_default.toFiniteNumber(headers.getContentLength());
    return length == null ? getBodyLength(body) : length;
  };
  return async (config) => {
    let {
      url,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = "same-origin",
      fetchOptions
    } = resolveConfig_default(config);
    let _fetch = envFetch || fetch;
    responseType = responseType ? (responseType + "").toLowerCase() : "text";
    let composedSignal = composeSignals_default([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
    let request = null;
    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });
    let requestContentLength;
    try {
      if (onUploadProgress && supportsRequestStream && method !== "get" && method !== "head" && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
        let _request = new Request(url, {
          method: "POST",
          body: data,
          duplex: "half"
        });
        let contentTypeHeader;
        if (utils_default.isFormData(data) && (contentTypeHeader = _request.headers.get("content-type"))) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = progressEventDecorator(
            requestContentLength,
            progressEventReducer(asyncDecorator(onUploadProgress))
          );
          data = trackStream(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!utils_default.isString(withCredentials)) {
        withCredentials = withCredentials ? "include" : "omit";
      }
      const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
      const resolvedOptions = {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : void 0
      };
      request = isRequestSupported && new Request(url, resolvedOptions);
      let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
      const isStreamResponse = supportsResponseStream && (responseType === "stream" || responseType === "response");
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
        const options = {};
        ["status", "statusText", "headers"].forEach((prop) => {
          options[prop] = response[prop];
        });
        const responseContentLength = utils_default.toFiniteNumber(response.headers.get("content-length"));
        const [onProgress, flush] = onDownloadProgress && progressEventDecorator(
          responseContentLength,
          progressEventReducer(asyncDecorator(onDownloadProgress), true)
        ) || [];
        response = new Response(
          trackStream(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
            flush && flush();
            unsubscribe && unsubscribe();
          }),
          options
        );
      }
      responseType = responseType || "text";
      let responseData = await resolvers[utils_default.findKey(resolvers, responseType) || "text"](response, config);
      !isStreamResponse && unsubscribe && unsubscribe();
      return await new Promise((resolve, reject) => {
        settle(resolve, reject, {
          data: responseData,
          headers: AxiosHeaders_default.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (err && err.name === "TypeError" && /Load failed|fetch/i.test(err.message)) {
        throw Object.assign(
          new AxiosError_default("Network Error", AxiosError_default.ERR_NETWORK, config, request),
          {
            cause: err.cause || err
          }
        );
      }
      throw AxiosError_default.from(err, err && err.code, config, request);
    }
  };
};
var seedCache = /* @__PURE__ */ new Map();
var getFetch = (config) => {
  let env = config && config.env || {};
  const { fetch: fetch2, Request, Response } = env;
  const seeds = [
    Request,
    Response,
    fetch2
  ];
  let len = seeds.length, i = len, seed, target, map = seedCache;
  while (i--) {
    seed = seeds[i];
    target = map.get(seed);
    target === void 0 && map.set(seed, target = i ? /* @__PURE__ */ new Map() : factory(env));
    map = target;
  }
  return target;
};
var adapter = getFetch();

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/adapters/adapters.js
var knownAdapters = {
  http: null_default,
  xhr: xhr_default,
  fetch: {
    get: getFetch
  }
};
utils_default.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
var renderReason = (reason) => `- ${reason}`;
var isResolvedHandle = (adapter2) => utils_default.isFunction(adapter2) || adapter2 === null || adapter2 === false;
function getAdapter(adapters, config) {
  adapters = utils_default.isArray(adapters) ? adapters : [adapters];
  const { length } = adapters;
  let nameOrAdapter;
  let adapter2;
  const rejectedReasons = {};
  for (let i = 0; i < length; i++) {
    nameOrAdapter = adapters[i];
    let id;
    adapter2 = nameOrAdapter;
    if (!isResolvedHandle(nameOrAdapter)) {
      adapter2 = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
      if (adapter2 === void 0) {
        throw new AxiosError_default(`Unknown adapter '${id}'`);
      }
    }
    if (adapter2 && (utils_default.isFunction(adapter2) || (adapter2 = adapter2.get(config)))) {
      break;
    }
    rejectedReasons[id || "#" + i] = adapter2;
  }
  if (!adapter2) {
    const reasons = Object.entries(rejectedReasons).map(
      ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
    );
    let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
    throw new AxiosError_default(
      `There is no suitable adapter to dispatch the request ` + s,
      "ERR_NOT_SUPPORT"
    );
  }
  return adapter2;
}
var adapters_default = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: knownAdapters
};

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/core/dispatchRequest.js
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new CanceledError_default(null, config);
  }
}
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = AxiosHeaders_default.from(config.headers);
  config.data = transformData.call(
    config,
    config.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter2 = adapters_default.getAdapter(config.adapter || defaults_default.adapter, config);
  return adapter2(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);
    response.data = transformData.call(
      config,
      config.transformResponse,
      response
    );
    response.headers = AxiosHeaders_default.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          config.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders_default.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/env/data.js
var VERSION = "1.13.2";

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/validator.js
var validators = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
var deprecatedWarnings = {};
validators.transitional = function transitional(validator, version2, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator === false) {
      throw new AxiosError_default(
        formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")),
        AxiosError_default.ERR_DEPRECATED
      );
    }
    if (version2 && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version2 + " and will be removed in the near future"
        )
      );
    }
    return validator ? validator(value, opt, opts) : true;
  };
};
validators.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError_default("options must be an object", AxiosError_default.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === void 0 || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError_default("option " + opt + " must be " + result, AxiosError_default.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError_default("Unknown option " + opt, AxiosError_default.ERR_BAD_OPTION);
    }
  }
}
var validator_default = {
  assertOptions,
  validators
};

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/core/Axios.js
var validators2 = validator_default.validators;
var Axios = class {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new InterceptorManager_default(),
      response: new InterceptorManager_default()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};
        Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, "") : "";
        try {
          if (!err.stack) {
            err.stack = stack;
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ""))) {
            err.stack += "\n" + stack;
          }
        } catch (e) {
        }
      }
      throw err;
    }
  }
  _request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig(this.defaults, config);
    const { transitional: transitional2, paramsSerializer, headers } = config;
    if (transitional2 !== void 0) {
      validator_default.assertOptions(transitional2, {
        silentJSONParsing: validators2.transitional(validators2.boolean),
        forcedJSONParsing: validators2.transitional(validators2.boolean),
        clarifyTimeoutError: validators2.transitional(validators2.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils_default.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator_default.assertOptions(paramsSerializer, {
          encode: validators2.function,
          serialize: validators2.function
        }, true);
      }
    }
    if (config.allowAbsoluteUrls !== void 0) {
    } else if (this.defaults.allowAbsoluteUrls !== void 0) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }
    validator_default.assertOptions(config, {
      baseUrl: validators2.spelling("baseURL"),
      withXsrfToken: validators2.spelling("withXSRFToken")
    }, true);
    config.method = (config.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils_default.merge(
      headers.common,
      headers[config.method]
    );
    headers && utils_default.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config.headers = AxiosHeaders_default.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift(...requestInterceptorChain);
      chain.push(...responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = mergeConfig(this.defaults, config);
    const fullPath = buildFullPath(config.baseURL, config.url, config.allowAbsoluteUrls);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  }
};
utils_default.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
utils_default.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
var Axios_default = Axios;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/cancel/CancelToken.js
var CancelToken = class _CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners) return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve) => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError_default(message, config, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  toAbortSignal() {
    const controller = new AbortController();
    const abort = (err) => {
      controller.abort(err);
    };
    this.subscribe(abort);
    controller.signal.unsubscribe = () => this.unsubscribe(abort);
    return controller.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new _CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
};
var CancelToken_default = CancelToken;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/spread.js
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/isAxiosError.js
function isAxiosError(payload) {
  return utils_default.isObject(payload) && payload.isAxiosError === true;
}

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/helpers/HttpStatusCode.js
var HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
var HttpStatusCode_default = HttpStatusCode;

// ../../../packages/bizuit-form-sdk/node_modules/axios/lib/axios.js
function createInstance(defaultConfig) {
  const context = new Axios_default(defaultConfig);
  const instance = bind(Axios_default.prototype.request, context);
  utils_default.extend(instance, Axios_default.prototype, context, { allOwnKeys: true });
  utils_default.extend(instance, context, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
var axios = createInstance(defaults_default);
axios.Axios = Axios_default;
axios.CanceledError = CanceledError_default;
axios.CancelToken = CancelToken_default;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData_default;
axios.AxiosError = AxiosError_default;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders_default;
axios.formToJSON = (thing) => formDataToJSON_default(utils_default.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters_default.getAdapter;
axios.HttpStatusCode = HttpStatusCode_default;
axios.default = axios;
var axios_default = axios;

// ../../../packages/bizuit-form-sdk/node_modules/axios/index.js
var {
  Axios: Axios2,
  AxiosError: AxiosError2,
  CanceledError: CanceledError2,
  isCancel: isCancel2,
  CancelToken: CancelToken2,
  VERSION: VERSION2,
  all: all2,
  Cancel,
  isAxiosError: isAxiosError2,
  spread: spread2,
  toFormData: toFormData2,
  AxiosHeaders: AxiosHeaders2,
  HttpStatusCode: HttpStatusCode2,
  formToJSON,
  getAdapter: getAdapter2,
  mergeConfig: mergeConfig2
} = axios_default;

// ../../../packages/bizuit-form-sdk/dist/index.mjs
var import_react6 = __toESM(require_react(), 1);
var import_jsx_runtime35 = __toESM(require_jsx_runtime(), 1);
var import_react7 = __toESM(require_react(), 1);
var BizuitHttpClient = class {
  constructor(config) {
    this.config = config;
    this.axiosInstance = axios_default.create({
      timeout: config.timeout || 12e4,
      // 2 minutes default
      headers: {
        "Content-Type": "application/json",
        ...config.defaultHeaders
      }
    });
    this.setupInterceptors();
  }
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (true) {
          console.log("[Bizuit API Request]", {
            method: config.method?.toUpperCase(),
            url: config.url,
            headers: this.sanitizeHeaders(config.headers)
          });
        }
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (true) {
          console.log("[Bizuit API Response]", {
            status: response.status,
            url: response.config.url
          });
        }
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }
  sanitizeHeaders(headers) {
    const sanitized = {};
    for (const key in headers) {
      if (key.toLowerCase().includes("token") || key.toLowerCase().includes("auth")) {
        sanitized[key] = "***REDACTED***";
      } else {
        sanitized[key] = headers[key];
      }
    }
    return sanitized;
  }
  handleError(error) {
    const apiError = {
      message: "An unexpected error occurred",
      statusCode: error.response?.status
    };
    if (error.response) {
      const data = error.response.data;
      apiError.message = data?.message || data?.errorMessage || error.message;
      apiError.code = data?.errorType || data?.code;
      apiError.details = data;
    } else if (error.request) {
      apiError.message = "No response from server";
      apiError.code = "NETWORK_ERROR";
    } else {
      apiError.message = error.message;
      apiError.code = "REQUEST_ERROR";
    }
    return apiError;
  }
  /**
   * GET request
   */
  async get(url, config) {
    const response = await this.axiosInstance.get(url, config);
    return response.data;
  }
  /**
   * POST request
   */
  async post(url, data, config) {
    const response = await this.axiosInstance.post(url, data, config);
    return response.data;
  }
  /**
   * PUT request
   */
  async put(url, data, config) {
    const response = await this.axiosInstance.put(url, data, config);
    return response.data;
  }
  /**
   * PATCH request
   */
  async patch(url, data, config) {
    const response = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }
  /**
   * DELETE request
   */
  async delete(url, config) {
    const response = await this.axiosInstance.delete(url, config);
    return response.data;
  }
  /**
   * Add Bizuit-specific headers to request
   */
  withBizuitHeaders(headers) {
    const cleanHeaders = {};
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== void 0 && value !== null) {
        cleanHeaders[key] = String(value);
      }
    });
    this.axiosInstance.defaults.headers.common = {
      ...this.axiosInstance.defaults.headers.common,
      ...cleanHeaders
    };
    return this;
  }
  /**
   * Clear all Bizuit headers
   */
  clearBizuitHeaders() {
    const bizuitHeaderPrefixes = ["BZ-"];
    const headers = this.axiosInstance.defaults.headers.common;
    Object.keys(headers).forEach((key) => {
      if (bizuitHeaderPrefixes.some((prefix) => key.startsWith(prefix))) {
        delete headers[key];
      }
    });
    return this;
  }
  /**
   * Get raw axios instance for advanced usage
   */
  getAxiosInstance() {
    return this.axiosInstance;
  }
};
var BizuitAuthService = class {
  constructor(config) {
    this.client = new BizuitHttpClient(config);
    this.apiUrl = config.apiUrl;
  }
  /**
   * Check form authentication and authorization
   * Validates token and returns login configuration
   */
  async checkFormAuth(request, token) {
    const headers = {
      "BZ-FORM-VIEWER": "true"
    };
    if (token) {
      headers["BZ-AUTH-TOKEN"] = token;
    }
    if (request.formId) {
      headers["BZ-FORM-ID"] = String(request.formId);
    }
    if (request.formName) {
      headers["BZ-FORM-NAME"] = request.formName;
    }
    if (request.processName) {
      headers["BZ-PROCESS-NAME"] = request.processName;
    }
    try {
      const response = await this.client.post(
        `${this.apiUrl}/Login/CheckFormAuth`,
        request,
        { headers }
      );
      return response;
    } catch (error) {
      return {
        success: false,
        canRetry: error.statusCode !== 401,
        errorMessage: error.message,
        errorType: error.code
      };
    }
  }
  /**
   * Get current user information from token
   */
  async getUserInfo(token, userName) {
    this.client.withBizuitHeaders({
      "BZ-AUTH-TOKEN": token,
      "BZ-USER-NAME": userName
    });
    const userInfo = await this.client.get(
      `${this.apiUrl}/Login/UserInfo`
    );
    this.client.clearBizuitHeaders();
    return userInfo;
  }
  /**
   * Get login configuration (OAuth, AD, etc.)
   */
  async getLoginConfiguration() {
    const config = await this.client.get(
      `${this.apiUrl}/Login/LoginConfiguration`
    );
    return config;
  }
  /**
   * Validate token and get user data
   * Returns null if token is invalid
   */
  async validateToken(token) {
    try {
      const decoded = atob(token.replace("Basic ", ""));
      const userName = decoded.split(":")[0];
      const userInfo = await this.getUserInfo(token, userName);
      return userInfo;
    } catch (error) {
      console.error("[BizuitAuthService] Token validation failed:", error);
      return null;
    }
  }
  /**
   * Check if user has required permissions
   */
  async checkPermissions(token, userName, requiredRoles) {
    try {
      const userInfo = await this.getUserInfo(token, userName);
      if (!userInfo.roles || requiredRoles.length === 0) {
        return true;
      }
      return requiredRoles.some((role) => userInfo.roles.includes(role));
    } catch (error) {
      console.error("[BizuitAuthService] Permission check failed:", error);
      return false;
    }
  }
  /**
   * Login methods (delegated to Bizuit Dashboard API)
   */
  async azureLogin(idToken, accessToken) {
    return this.client.post(`${this.apiUrl}/Login/AzureLogin`, {
      idToken,
      accessToken
    });
  }
  async oauthLogin(code, redirectUri) {
    return this.client.get(
      `${this.apiUrl}/Login/GetOauthLoginAsync?code=${code}&redirectUri=${redirectUri}`
    );
  }
  async socialLogin(token, type) {
    return this.client.get(`${this.apiUrl}/Login/SocialLogin?type=${type}`, {
      headers: {
        Authorization: `Basic ${token}`
      }
    });
  }
  /**
   * Login with username and password
   * Uses HTTP Basic Authentication as per Bizuit API specification
   * Returns token and user information
   *
   * Example response from API:
   * {
   *   "token": "ZMdufWTdCsSYUXj7...",
   *   "user": {
   *     "username": "admin",
   *     "userID": 1,
   *     "displayName": "Administrator Account",
   *     "image": null
   *   },
   *   "forceChange": false,
   *   "expirationDate": "2025-11-27T22:07:20.5095101Z"
   * }
   */
  async login(credentials) {
    const { username, password } = credentials;
    const authString = `${username}:${password}`;
    const base64Auth = btoa(authString);
    const authHeader = `Basic ${base64Auth}`;
    try {
      const response = await this.client.get(
        `${this.apiUrl}/Login`,
        {
          headers: {
            "Authorization": authHeader
          }
        }
      );
      const loginResponse = {
        Token: `Basic ${response.token}`,
        // Prepend "Basic " to the token
        User: {
          Username: response.user.username,
          UserID: response.user.userID,
          DisplayName: response.user.displayName,
          Image: response.user.image
        },
        ForceChange: response.forceChange,
        ExpirationDate: response.expirationDate
      };
      return loginResponse;
    } catch (error) {
      if (error.statusCode === 401) {
        throw new Error("Nombre de Usuario y/o Contrase\xF1a incorrectos.");
      } else if (error.statusCode === 403) {
        throw new Error("Acceso denegado, no tiene permiso para acceder.");
      }
      throw error;
    }
  }
};
function toCamelCase2(str) {
  if (!str) return str;
  if (str === str.toUpperCase()) {
    return str.toLowerCase();
  }
  const match = str.match(/^([A-Z]+)([A-Z][a-z].*)$/);
  if (match) {
    return match[1].toLowerCase() + match[2];
  }
  return str.charAt(0).toLowerCase() + str.slice(1);
}
function xmlNodeToJson(node) {
  const obj = {};
  const children = Array.from(node.children);
  if (children.length === 0) {
    const textContent = node.textContent?.trim() || "";
    return textContent;
  }
  const childrenByTag = /* @__PURE__ */ new Map();
  children.forEach((child) => {
    const tagName = toCamelCase2(child.tagName);
    if (!childrenByTag.has(tagName)) {
      childrenByTag.set(tagName, []);
    }
    childrenByTag.get(tagName).push(child);
  });
  childrenByTag.forEach((elements, tagName) => {
    if (elements.length === 1) {
      obj[tagName] = xmlNodeToJson(elements[0]);
    } else {
      obj[tagName] = elements.map((el) => xmlNodeToJson(el));
    }
  });
  return obj;
}
function xmlToJson(xmlString) {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      console.error("XML parsing error:", parserError.textContent);
      return null;
    }
    const rootElement = xmlDoc.documentElement;
    if (!rootElement) {
      console.error("No root element found in XML");
      return null;
    }
    const rootTagName = toCamelCase2(rootElement.tagName);
    const result = {
      [rootTagName]: xmlNodeToJson(rootElement)
    };
    return result;
  } catch (error) {
    console.error("Error converting XML to JSON:", error);
    return null;
  }
}
var BizuitProcessService = class {
  constructor(config) {
    this.client = new BizuitHttpClient(config);
    this.apiUrl = config.apiUrl;
  }
  /**
   * Initialize process - Get parameters for new or existing instance
   * Uses standard Authorization header as per API specification
   */
  async initialize(params) {
    const queryParams = new URLSearchParams();
    queryParams.append("processName", params.processName);
    if (params.activityName) queryParams.append("activityName", params.activityName);
    if (params.version) queryParams.append("version", params.version);
    if (params.instanceId) queryParams.append("instanceId", params.instanceId);
    const headers = {};
    if (params.token) {
      headers["Authorization"] = params.token;
    }
    if (params.sessionToken) {
      headers["BZ-SESSION-TOKEN"] = params.sessionToken;
    }
    if (params.userName) {
      headers["BZ-USER-NAME"] = params.userName;
    }
    if (params.formId) {
      headers["BZ-FORM"] = String(params.formId);
    }
    if (params.formDraftId) {
      headers["BZ-DRAFT-FORM"] = String(params.formDraftId);
    }
    if (params.processName) {
      headers["BZ-PROCESS-NAME"] = params.processName;
    }
    if (params.instanceId) {
      headers["BZ-INSTANCEID"] = params.instanceId;
    }
    if (params.childProcessName) {
      headers["BZ-CHILD-PROCESS-NAME"] = params.childProcessName;
    }
    const processData = await this.client.get(
      `${this.apiUrl}/Process/Initialize?${queryParams.toString()}`,
      { headers }
    );
    return processData;
  }
  /**
   * Start process - Execute process or start new instance
   * Sends JSON directly as per Bizuit API specification
   *
   * Example from curl:
   * POST /api/instances
   * Authorization: Basic TOKEN
   * Content-Type: application/json
   * {
   *   "eventName": "DemoFlow",
   *   "parameters": [
   *     {
   *       "name": "pData",
   *       "value": "A",
   *       "type": "SingleValue",
   *       "direction": "In"
   *     }
   *   ]
   * }
   */
  async start(params, files, token) {
    const headers = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = token;
    }
    const payload = {
      eventName: params.processName,
      parameters: params.parameters || []
    };
    if (params.instanceId) {
      payload.instanceId = params.instanceId;
    }
    if (params.processVersion) {
      payload.eventVersion = params.processVersion;
    }
    if (params.closeOnSuccess !== void 0) {
      payload.closeOnSuccess = params.closeOnSuccess;
    }
    if (params.deletedDocuments && params.deletedDocuments.length > 0) {
      payload.deletedDocuments = params.deletedDocuments;
    }
    if (files && files.length > 0) {
      console.warn("File upload in start is not yet implemented in JSON mode");
    }
    const result = await this.client.post(
      `${this.apiUrl}/instances`,
      payload,
      { headers }
    );
    const parametersArray = result.tyconParameters || result.parameters;
    if (parametersArray && Array.isArray(parametersArray)) {
      parametersArray.forEach((param) => {
        if ((param.parameterType === 2 || param.parameterType === "Xml") && param.value) {
          try {
            const parsedJson = xmlToJson(param.value);
            if (parsedJson !== null) {
              param.value = parsedJson;
              param.parameterType = "Json";
              console.log(`\u2705 Auto-parsed XML parameter: ${param.name}`);
            } else {
              console.warn(`\u26A0\uFE0F Failed to parse XML parameter: ${param.name}, keeping original XML`);
            }
          } catch (error) {
            console.warn(`\u26A0\uFE0F Error parsing XML parameter ${param.name}:`, error);
          }
        }
      });
      if (result.tyconParameters) {
        result.parameters = parametersArray;
      }
    }
    return result;
  }
  /**
   * Get process parameters schema
   * Useful for dynamic form generation
   *
   * Example:
   * GET /api/eventmanager/workflowDefinition/parameters/{processName}?version={version}
   * Authorization: Basic TOKEN
   *
   * Returns array of parameters with:
   * - parameterType: 1 (SingleValue) or 2 (Xml)
   * - parameterDirection: 1 (In), 2 (Out), 3 (Optional)
   * - name, type, schema, isSystemParameter, isVariable
   */
  async getParameters(processName, version2, token) {
    const headers = {};
    if (token) {
      headers["Authorization"] = token;
    }
    const queryParams = new URLSearchParams();
    queryParams.append("version", version2 || "");
    const url = `${this.apiUrl}/eventmanager/workflowDefinition/parameters/${processName}?${queryParams.toString()}`;
    const parameters = await this.client.get(url, { headers });
    return parameters;
  }
  /**
   * Get instance data
   * Uses standard Authorization header
   *
   * Example from curl:
   * GET /api/instances?instanceId=8d2d0e04-ea83-48f2-953d-ff858581e3df
   * Authorization: Basic TOKEN
   */
  async getInstanceData(instanceId, token) {
    const headers = {};
    if (token) {
      headers["Authorization"] = token;
    }
    const data = await this.client.get(
      `${this.apiUrl}/instances?instanceId=${instanceId}`,
      { headers }
    );
    return data;
  }
  /**
   * Acquire pessimistic lock on instance
   * Prevents concurrent editing
   */
  async acquireLock(params) {
    const headers = {
      "Authorization": params.token
    };
    const result = await this.client.post(
      `${this.apiUrl}/ProcessInstance/AcquireLock`,
      { instanceId: params.instanceId },
      { headers }
    );
    return result;
  }
  /**
   * Release pessimistic lock on instance
   */
  async releaseLock(params) {
    const headers = {
      "BZ-SESSION-TOKEN": params.sessionToken
    };
    await this.client.post(
      `${this.apiUrl}/ProcessInstance/ReleaseLock`,
      { instanceId: params.instanceId },
      { headers }
    );
  }
  /**
   * Continue instance with updated parameters
   * Uses PUT method instead of POST
   *
   * Example from curl:
   * PUT /api/instances
   * Authorization: Basic TOKEN
   * Content-Type: application/json
   * {
   *   "eventName": "DemoFlow",
   *   "parameters": [...],
   *   "instanceId": "e3137f94-0ab5-4ae7-b256-10806fe92958"
   * }
   */
  async continue(params, files, token) {
    if (!params.instanceId) {
      throw new Error("instanceId is required for continue");
    }
    const headers = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = token;
    }
    const payload = {
      eventName: params.processName,
      parameters: params.parameters || [],
      instanceId: params.instanceId
    };
    if (params.processVersion) {
      payload.eventVersion = params.processVersion;
    }
    if (params.closeOnSuccess !== void 0) {
      payload.closeOnSuccess = params.closeOnSuccess;
    }
    if (params.deletedDocuments && params.deletedDocuments.length > 0) {
      payload.deletedDocuments = params.deletedDocuments;
    }
    if (files && files.length > 0) {
      console.warn("File upload in continue is not yet implemented in JSON mode");
    }
    const result = await this.client.put(
      `${this.apiUrl}/instances`,
      payload,
      { headers }
    );
    const parametersArray = result.tyconParameters || result.parameters;
    if (parametersArray && Array.isArray(parametersArray)) {
      parametersArray.forEach((param) => {
        if ((param.parameterType === 2 || param.parameterType === "Xml") && param.value) {
          try {
            const parsedJson = xmlToJson(param.value);
            if (parsedJson !== null) {
              param.value = parsedJson;
              param.parameterType = "Json";
              console.log(`\u2705 Auto-parsed XML parameter: ${param.name}`);
            } else {
              console.warn(`\u26A0\uFE0F Failed to parse XML parameter: ${param.name}, keeping original XML`);
            }
          } catch (error) {
            console.warn(`\u26A0\uFE0F Error parsing XML parameter ${param.name}:`, error);
          }
        }
      });
      if (result.tyconParameters) {
        result.parameters = parametersArray;
      }
    }
    return result;
  }
  /**
   * Get Bizuit configuration settings for an organization
   * @param organizationId - Organization identifier
   * @param token - Authentication token
   * @returns Configuration settings object
   */
  async getConfigurationSettings(organizationId, token) {
    const headers = {};
    if (token) {
      headers["Authorization"] = token;
    }
    const result = await this.client.get(
      `${this.apiUrl}/bpmn/configuration-settings?organizationId=${organizationId}`,
      { headers }
    );
    return result;
  }
};
var BizuitInstanceLockService = class {
  constructor(config) {
    this.client = new BizuitHttpClient(config);
    this.apiUrl = config.apiUrl;
  }
  /**
   * Check if instance is locked
   */
  async checkLockStatus(instanceId, activityName, token) {
    this.client.withBizuitHeaders({
      "BZ-AUTH-TOKEN": token
    });
    const status = await this.client.get(
      `${this.apiUrl}/instances/status/${instanceId}?activityName=${activityName}`
    );
    this.client.clearBizuitHeaders();
    return {
      available: status
    };
  }
  /**
   * Lock instance for editing
   */
  async lock(request, token) {
    this.client.withBizuitHeaders({
      "BZ-AUTH-TOKEN": token
    });
    const queryParams = new URLSearchParams({
      activityName: request.activityName,
      operation: String(request.operation),
      processName: request.processName
    });
    const result = await this.client.patch(
      `${this.apiUrl}/instances/lock/${request.instanceId}?${queryParams.toString()}`
    );
    this.client.clearBizuitHeaders();
    return result;
  }
  /**
   * Unlock instance
   */
  async unlock(request, token) {
    this.client.withBizuitHeaders({
      "BZ-AUTH-TOKEN": token
    });
    const result = await this.client.patch(
      `${this.apiUrl}/instances/unlock/${request.instanceId}`,
      request
    );
    this.client.clearBizuitHeaders();
    return result;
  }
  /**
   * Execute a callback with automatic lock/unlock
   * Ensures instance is always unlocked even if callback throws
   */
  async withLock(request, token, callback) {
    const lockResult = await this.lock(request, token);
    if (!lockResult.available) {
      throw new Error(
        `Instance is locked by ${lockResult.user}. Reason: ${lockResult.reason}`
      );
    }
    const sessionToken = lockResult.sessionToken || "";
    try {
      const result = await callback(sessionToken);
      return result;
    } finally {
      try {
        await this.unlock(
          {
            instanceId: request.instanceId,
            activityName: request.activityName,
            sessionToken
          },
          token
        );
      } catch (unlockError) {
        console.error("[BizuitInstanceLockService] Failed to unlock instance:", unlockError);
      }
    }
  }
  /**
   * Force unlock (admin only)
   * Use with caution
   */
  async forceUnlock(instanceId, activityName, token) {
    await this.unlock(
      {
        instanceId,
        activityName
      },
      token
    );
  }
};
function formDataToParameters(formData) {
  const parameters = [];
  for (const [key, value] of Object.entries(formData)) {
    if (value === void 0 || value === null || value === "") {
      continue;
    }
    if (value instanceof File || Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      continue;
    }
    let stringValue;
    let paramType = "SingleValue";
    if (Array.isArray(value)) {
      stringValue = JSON.stringify(value);
    } else if (value instanceof Date) {
      stringValue = value.toISOString();
    } else if (typeof value === "object") {
      stringValue = JSON.stringify(value);
      paramType = "ComplexObject";
    } else if (typeof value === "boolean") {
      stringValue = value.toString();
    } else {
      stringValue = String(value);
    }
    parameters.push({
      name: key,
      value: stringValue,
      type: paramType,
      direction: "In"
    });
  }
  return parameters;
}
function parametersToFormData(parameters) {
  const formData = {};
  for (const param of parameters) {
    if (!param.value) continue;
    try {
      const parsedValue = JSON.parse(param.value);
      formData[param.name] = parsedValue;
    } catch {
      if (isISODate(param.value)) {
        formData[param.name] = new Date(param.value);
      } else if (param.value === "true" || param.value === "false") {
        formData[param.name] = param.value === "true";
      } else if (!isNaN(Number(param.value)) && param.value.trim() !== "") {
        formData[param.name] = Number(param.value);
      } else {
        formData[param.name] = param.value;
      }
    }
  }
  return formData;
}
function isISODate(str) {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  return isoDateRegex.test(str);
}
function createParameter(name, value, type = "SingleValue", direction = "In") {
  return {
    name,
    value: typeof value === "string" ? value : JSON.stringify(value),
    type,
    direction
  };
}
function mapApiParameterToInternal(apiParam) {
  return {
    name: apiParam.name,
    value: typeof apiParam.value === "object" ? JSON.stringify(apiParam.value) : String(apiParam.value || ""),
    type: apiParam.parameterType === "SingleValue" ? "SingleValue" : apiParam.parameterType === "Xml" ? "Xml" : "SingleValue",
    direction: apiParam.parameterDirection === "In" ? "In" : apiParam.parameterDirection === "Out" ? "Out" : apiParam.parameterDirection === "Optional" ? "InOut" : "In"
  };
}
function mapApiParameterToFormParameter(apiParam) {
  let direction = 1;
  if (apiParam.parameterDirection === "Out") direction = 2;
  else if (apiParam.parameterDirection === "Optional") direction = 3;
  else if (apiParam.parameterDirection === "In") direction = 1;
  let paramType = 1;
  if (apiParam.parameterType === "Xml") paramType = 2;
  return {
    name: apiParam.name,
    parameterType: paramType,
    parameterDirection: direction,
    type: guessTypeFromValue(apiParam.value),
    schema: "",
    value: typeof apiParam.value === "object" ? JSON.stringify(apiParam.value) : String(apiParam.value || ""),
    isSystemParameter: apiParam.name === "InstanceId" || apiParam.name === "LoggedUser" || apiParam.name === "ExceptionParameter",
    isVariable: false
    // API doesn't distinguish, assume false for now
  };
}
function guessTypeFromValue(value) {
  if (value === null || value === void 0 || value === "") return "string";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number") return "int";
  if (typeof value === "object") return "string";
  if (!isNaN(Number(value)) && value.toString().trim() !== "") return "int";
  return "string";
}
async function loadInstanceDataForContinue(sdk, options, token) {
  const opts = typeof options === "string" ? { instanceId: options, autoLock: false } : options;
  const { instanceId, activityName, processName, autoLock = false, lockOperation = 1 } = opts;
  const instanceData = await sdk.process.getInstanceData(instanceId, token);
  let formParameters = [];
  let formData = {};
  let lockInfo;
  const apiParameters = instanceData?.results?.tyconParameters?.tyconParameter;
  if (apiParameters && Array.isArray(apiParameters)) {
    const allParams = apiParameters.map(mapApiParameterToFormParameter);
    formParameters = allParams.filter((param) => {
      if (param.isSystemParameter) return false;
      if (param.parameterDirection === 2) return false;
      return true;
    });
    const parameters = apiParameters.map(mapApiParameterToInternal);
    formData = parametersToFormData(parameters);
  }
  if (autoLock) {
    if (!activityName || !processName) {
      throw new Error("activityName and processName are required when autoLock is true");
    }
    try {
      const lockResult = await sdk.lock.lock(
        {
          instanceId,
          activityName,
          processName,
          operation: lockOperation
        },
        token
      );
      if (lockResult.available) {
        lockInfo = {
          isLocked: true,
          sessionToken: lockResult.sessionToken
        };
      } else {
        lockInfo = {
          isLocked: false,
          lockedBy: lockResult.user,
          lockFailReason: lockResult.reason || "Instance is locked by another user"
        };
      }
    } catch (err) {
      lockInfo = {
        isLocked: false,
        lockFailReason: err.message || "Failed to acquire lock"
      };
    }
  }
  return {
    instanceData,
    processName: processName || "",
    // Use provided processName if available
    eventName: "",
    // Must be provided by user separately
    formParameters,
    formData,
    lockInfo
  };
}
async function releaseInstanceLock(sdk, options, token) {
  try {
    await sdk.lock.unlock(options, token);
  } catch (err) {
    if (true) {
      console.warn("[releaseInstanceLock] Failed to release lock:", err.message);
    }
  }
}
function buildParameters(mapping, formData) {
  const parameters = [];
  for (const [formFieldName, config] of Object.entries(mapping)) {
    let value = formData[formFieldName];
    if (value === void 0) {
      continue;
    }
    if ((value === null || value === "") && !config.transform) {
      continue;
    }
    if (config.transform) {
      value = config.transform(value);
    }
    let stringValue;
    let paramType = config.type || "SingleValue";
    if (value instanceof File || Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      continue;
    } else if (Array.isArray(value)) {
      stringValue = JSON.stringify(value);
    } else if (value instanceof Date) {
      stringValue = value.toISOString();
    } else if (typeof value === "object" && value !== null) {
      stringValue = JSON.stringify(value);
      if (!config.type) {
        paramType = "ComplexObject";
      }
    } else if (typeof value === "boolean") {
      stringValue = value.toString();
    } else {
      stringValue = String(value);
    }
    parameters.push({
      name: config.parameterName,
      value: stringValue,
      type: paramType,
      direction: config.direction || "In"
    });
  }
  return parameters;
}
var BizuitFormService = class {
  constructor(sdk) {
    this.sdk = sdk;
  }
  /**
   * Prepares a form for STARTING a new process
   *
   * @returns Parameters ready to render the form
   */
  async prepareStartForm(options) {
    const processData = await this.sdk.process.initialize({
      processName: options.processName,
      version: options.version,
      token: options.token
    });
    const parameters = processData.parameters || [];
    const formData = {};
    parameters.forEach((param) => {
      if (param.value !== null && param.value !== void 0) {
        formData[param.name] = param.value;
      }
    });
    return { parameters, formData };
  }
  /**
   * Starts a new process combining:
   * - Parameters mapped from form fields
   * - Additional parameters (not associated with fields)
   *
   * @example
   * ```typescript
   * // Only form data (send all fields)
   * await formService.startProcess({
   *   processName: 'ExpenseRequest',
   *   token,
   *   formData: { empleado: 'Juan', monto: '5000' }
   * })
   *
   * // Form data with selective mapping
   * await formService.startProcess({
   *   processName: 'ExpenseRequest',
   *   token,
   *   formData,
   *   fieldMapping: {
   *     'empleado': { parameterName: 'pEmpleado' },
   *     'monto': {
   *       parameterName: 'pMonto',
   *       transform: (val) => parseFloat(val).toFixed(2)
   *     }
   *   }
   * })
   *
   * // Form data + additional parameters
   * await formService.startProcess({
   *   processName: 'ExpenseRequest',
   *   token,
   *   formData,
   *   fieldMapping,
   *   additionalParameters: formService.createParameters([
   *     { name: 'pUsuarioCreador', value: currentUser.username },
   *     { name: 'pFechaCreacion', value: new Date().toISOString() }
   *   ])
   * })
   * ```
   */
  async startProcess(options) {
    const parameters = [];
    if (options.formData && options.fieldMapping) {
      const mappedParams = buildParameters(options.fieldMapping, options.formData);
      parameters.push(...mappedParams);
    } else if (options.formData && !options.fieldMapping) {
      const allParams = formDataToParameters(options.formData);
      parameters.push(...allParams);
    }
    if (options.additionalParameters) {
      parameters.push(...options.additionalParameters);
    }
    return await this.sdk.process.start({
      processName: options.processName,
      processVersion: options.processVersion,
      parameters
    }, options.files, options.token);
  }
  /**
   * Prepares a form for CONTINUING an existing instance
   *
   * @returns Instance data ready to render and edit
   */
  async prepareContinueForm(options) {
    const result = await loadInstanceDataForContinue(
      this.sdk,
      {
        instanceId: options.instanceId,
        processName: options.processName,
        activityName: options.activityName,
        autoLock: options.autoLock
      },
      options.token
    );
    return {
      parameters: result.formParameters,
      formData: result.formData,
      lockInfo: result.lockInfo,
      instanceData: result.instanceData
    };
  }
  /**
   * Continues an existing process combining:
   * - Parameters mapped from form fields
   * - Additional parameters (not associated with fields)
   *
   * @example
   * ```typescript
   * // Form data + context parameters
   * await formService.continueProcess({
   *   instanceId: '123-456',
   *   processName: 'ExpenseRequest',
   *   token,
   *   formData,
   *   fieldMapping: {
   *     'aprobado': {
   *       parameterName: 'vAprobado',
   *       isVariable: true
   *     },
   *     'comentarios': { parameterName: 'pComentarios' }
   *   },
   *   additionalParameters: formService.createParameters([
   *     { name: 'vAprobador', value: currentUser.username },
   *     { name: 'vFechaAprobacion', value: new Date().toISOString() }
   *   ])
   * })
   * ```
   */
  async continueProcess(options) {
    const parameters = [];
    if (options.formData && options.fieldMapping) {
      const mappedParams = buildParameters(options.fieldMapping, options.formData);
      parameters.push(...mappedParams);
    } else if (options.formData && !options.fieldMapping) {
      const allParams = formDataToParameters(options.formData);
      parameters.push(...allParams);
    }
    if (options.additionalParameters) {
      parameters.push(...options.additionalParameters);
    }
    return await this.sdk.process.continue({
      processName: options.processName,
      instanceId: options.instanceId,
      parameters
    }, options.files, options.token);
  }
  /**
   * Releases a lock acquired during prepareContinueForm
   */
  async releaseLock(options) {
    return await releaseInstanceLock(
      this.sdk,
      {
        instanceId: options.instanceId,
        activityName: options.activityName,
        sessionToken: options.sessionToken
      },
      options.token
    );
  }
  /**
   * Helper to create a single parameter easily
   */
  createParameter(name, value, options) {
    return createParameter(
      name,
      value,
      options?.type || "SingleValue",
      options?.direction || "In"
    );
  }
  /**
   * Helper to create multiple parameters easily
   *
   * @example
   * ```typescript
   * const params = formService.createParameters([
   *   { name: 'pUsuario', value: currentUser.username },
   *   { name: 'pFecha', value: new Date().toISOString() },
   *   { name: 'pConfig', value: { theme: 'dark' }, type: 'ComplexObject' }
   * ])
   * ```
   */
  createParameters(params) {
    return params.map((p) => this.createParameter(p.name, p.value, {
      type: p.type,
      direction: p.direction
    }));
  }
};
var BizuitSDK = class {
  constructor(config) {
    this.config = config;
    this.auth = new BizuitAuthService(config);
    this.process = new BizuitProcessService(config);
    this.instanceLock = new BizuitInstanceLockService(config);
    this.forms = new BizuitFormService(this);
  }
  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.auth = new BizuitAuthService(this.config);
    this.process = new BizuitProcessService(this.config);
    this.instanceLock = new BizuitInstanceLockService(this.config);
    this.forms = new BizuitFormService(this);
  }
};
var BizuitSDKContext = (0, import_react6.createContext)(null);

// src/index.tsx
var import_jsx_runtime36 = __toESM(require_jsx_runtime());
var SDK_CONFIG = {
  processName: "RB_ObtenerProximaGestion"
};
async function obtenerIdGestorPorUsuario(sdk, userName, token) {
  console.log(`\u{1F4DD} obtenerIdGestorPorUsuario('${userName}') \u2192 999 (hardcoded)`);
  return Promise.resolve(999);
}
var MOCK_DEUDAS_HISTORIAL = [
  {
    id: "D-2023-089",
    deudor: "Mar\xEDa Gonz\xE1lez",
    numeroDocumento: "27-45678902-3",
    cuit: "27456789023",
    fechaNacimiento: "1985-07-20",
    fechaAlta: "2023-12-10",
    estado: "gestionando",
    detalles: [
      {
        id: 1,
        fecha: "2023-10-15",
        importeOriginal: 5e4,
        importe: 55e3,
        producto: "1040754306",
        descripcion: "Notebook Samsung Galaxy Book"
      },
      {
        id: 2,
        fecha: "2023-11-20",
        importeOriginal: 3e4,
        importe: 3e4,
        producto: "1040754307",
        descripcion: "Mouse Logitech MX Master 3"
      }
    ],
    contactos: []
  },
  {
    id: "D-2023-045",
    deudor: "Pedro Mart\xEDnez",
    numeroDocumento: "23-12345678-9",
    cuit: "23123456789",
    fechaNacimiento: "1978-05-10",
    fechaAlta: "2023-08-20",
    estado: "gestionando",
    detalles: [
      {
        id: 1,
        fecha: "2023-07-05",
        importeOriginal: 95e3,
        importe: 95e3,
        producto: "1040754308",
        descripcion: 'Smart TV 55" Samsung QLED'
      }
    ],
    contactos: []
  }
];
var MOCK_ACCIONES_PREVIAS = [
  {
    id: "A001",
    fecha: "15/01/2024",
    hora: "10:30",
    tipo: "Gesti\xF3n",
    contacto: "Tel\xE9fono M\xF3vil: 351 663 9967",
    observaciones: "Primera llamada telef\xF3nica. No contesta. Se deja mensaje."
  },
  {
    id: "A002",
    fecha: "16/01/2024",
    hora: "14:15",
    tipo: "Gesti\xF3n",
    contacto: "Email Personal: deudor@email.com",
    observaciones: "Env\xEDo de email con detalle de deuda y opciones de pago."
  },
  {
    id: "A003",
    fecha: "18/01/2024",
    hora: "11:00",
    tipo: "Gesti\xF3n",
    contacto: "Tel\xE9fono M\xF3vil: 351 663 9967",
    observaciones: "Contacto telef\xF3nico exitoso. Promete pago parcial en 48hs."
  },
  {
    id: "A004",
    fecha: "20/01/2024",
    hora: "09:45",
    tipo: "Gesti\xF3n",
    contacto: "WhatsApp: 351 663 9967",
    observaciones: "Se realiz\xF3 contacto v\xEDa WhatsApp con el deudor. Manifest\xF3 estar atravesando una situaci\xF3n econ\xF3mica complicada debido a la p\xE9rdida de su empleo hace 3 meses. Expres\xF3 su voluntad de regularizar la deuda pero indic\xF3 que necesita un plazo mayor. Se le ofreci\xF3 un plan de pagos en 12 cuotas con una quita del 15% sobre los intereses acumulados. El deudor solicit\xF3 48 horas para evaluar la propuesta y consultar con su familia. Se acord\xF3 retomar el contacto el d\xEDa 22/01/2024 a las 14:00 hs para confirmar su decisi\xF3n. Mostr\xF3 buena predisposici\xF3n y agradeci\xF3 la flexibilidad ofrecida."
  }
];
var MOTIVOS_RECHAZO = [
  { label: "Deuda inexistente", value: "inexistente" },
  { label: "Deuda ya cancelada", value: "cancelada" },
  { label: "Monto incorrecto", value: "monto_incorrecto" },
  { label: "Datos del deudor incorrectos", value: "datos_incorrectos" },
  { label: "Fuera de jurisdicci\xF3n", value: "jurisdiccion" },
  { label: "Otro motivo", value: "otro" }
];
function DeudaRow({ deuda, onClick, index }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount);
  };
  const totalDeuda = deuda.detalles.reduce((sum, d) => sum + d.importe, 0);
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
    "tr",
    {
      onClick,
      className: `hover:bg-orange-50 cursor-pointer transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "text-sm font-medium text-gray-900", children: deuda.id }) }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "text-sm font-medium text-gray-900", children: deuda.deudor }) }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "text-sm text-gray-600", children: deuda.numeroDocumento }) }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "text-sm font-semibold text-gray-900", children: formatCurrency(totalDeuda) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800", children: deuda.estado }) })
      ]
    }
  );
}
function DetalleDeudaRow({ detalle, index }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("tr", { className: index % 2 === 0 ? "bg-gray-50" : "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: formatDate(detalle.fecha) }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: formatCurrency(detalle.importeOriginal) }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-bold text-orange-600", children: formatCurrency(detalle.importe) }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-600", children: detalle.producto || "-" }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 text-sm text-gray-900", children: detalle.descripcion || "-" })
  ] });
}
function ContactoCard({ contacto, onClick }) {
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
    "div",
    {
      onClick,
      className: "bg-gray-50 rounded-xl shadow-sm hover:shadow-xl hover:bg-orange-50 hover:border-l-8 transition-all border-l-4 border-orange-500 p-4 cursor-pointer",
      children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center", children: getContactIcon(contacto.tipoContacto || contacto.tipo) }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-xs font-semibold text-gray-700 uppercase tracking-wide", children: contacto.tipoContacto || contacto.tipo || "Contacto" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-base font-bold text-gray-900", children: contacto.contacto || contacto.valor || "Sin informaci\xF3n" })
        ] })
      ] })
    }
  );
}
function AccionRow({ accion, index, onClick }) {
  const truncateText = (text, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
    "tr",
    {
      onClick,
      className: `cursor-pointer hover:bg-orange-50 transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: accion.fecha }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: accion.hora }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: accion.tipo }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 text-sm text-gray-600", children: accion.contacto }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 text-sm text-gray-900", children: truncateText(accion.observaciones) })
      ]
    }
  );
}
function getContactIcon(tipoContacto) {
  const tipo = (tipoContacto || "").toLowerCase();
  if (tipo.includes("tel\xE9fono") || tipo.includes("telefono") || tipo.includes("m\xF3vil") || tipo.includes("movil") || tipo.includes("celular") || tipo.includes("phone")) {
    return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) });
  }
  if (tipo.includes("email") || tipo.includes("correo") || tipo.includes("mail")) {
    return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) });
  }
  if (tipo.includes("whatsapp") || tipo.includes("wpp")) {
    return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) });
  }
  if (tipo.includes("instagram") || tipo.includes("facebook") || tipo.includes("twitter") || tipo.includes("social")) {
    return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" }),
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z" })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" }) });
}
function RecubizGestionFormInner({ dashboardParams }) {
  const [screen, setScreen] = (0, import_react8.useState)("dashboard");
  const [deudaActual, setDeudaActual] = (0, import_react8.useState)(null);
  const [contactoSeleccionado, setContactoSeleccionado] = (0, import_react8.useState)(null);
  const [observaciones, setObservaciones] = (0, import_react8.useState)("");
  const [accionesHistorial, setAccionesHistorial] = (0, import_react8.useState)(MOCK_ACCIONES_PREVIAS);
  const [mostrarRechazo, setMostrarRechazo] = (0, import_react8.useState)(false);
  const [motivoRechazo, setMotivoRechazo] = (0, import_react8.useState)("");
  const [descripcionRechazo, setDescripcionRechazo] = (0, import_react8.useState)("");
  const [mostrarConfirmacionFinalizar, setMostrarConfirmacionFinalizar] = (0, import_react8.useState)(false);
  const [mostrarConfirmacionSolicitar, setMostrarConfirmacionSolicitar] = (0, import_react8.useState)(false);
  const [accionSeleccionada, setAccionSeleccionada] = (0, import_react8.useState)(null);
  const [mostrarHistorial, setMostrarHistorial] = (0, import_react8.useState)(false);
  const [mostrarModalRegistrarAccion, setMostrarModalRegistrarAccion] = (0, import_react8.useState)(false);
  const apiUrl = dashboardParams?.apiUrl || dashboardParams?.devApiUrl;
  if (!apiUrl) {
    throw new Error(
      "API URL not provided. Production: FormLoader must pass apiUrl in dashboardParams. Dev: Provide devApiUrl in dev-credentials.js"
    );
  }
  const sdk = (0, import_react8.useMemo)(() => new BizuitSDK({ apiUrl }), [apiUrl]);
  console.log(`\u{1F517} Using API URL: ${apiUrl}`);
  const [authToken, setAuthToken] = (0, import_react8.useState)("");
  const [idGestor, setIdGestor] = (0, import_react8.useState)(null);
  const [isLoading, setIsLoading] = (0, import_react8.useState)(false);
  const [loadingMessage, setLoadingMessage] = (0, import_react8.useState)("");
  const [error, setError] = (0, import_react8.useState)(null);
  (0, import_react8.useEffect)(() => {
    const authenticate = async () => {
      try {
        setIsLoading(true);
        setLoadingMessage("Autenticando...");
        let token = "";
        if (dashboardParams?.token) {
          console.log("\u2705 Using Dashboard token");
          token = dashboardParams.token;
          setAuthToken(token);
        } else if (dashboardParams?.devUsername && dashboardParams?.devPassword) {
          console.warn("\u26A0\uFE0F Dev mode: Using credentials from dashboardParams (FormLoader)");
          console.log("   devUsername:", dashboardParams.devUsername);
          console.log("   apiUrl from dashboardParams:", dashboardParams.apiUrl || dashboardParams.devApiUrl || "NOT SET");
          const loginResult = await sdk.auth.login({
            username: dashboardParams.devUsername,
            password: dashboardParams.devPassword
          });
          if (loginResult.Token) {
            token = loginResult.Token;
            setAuthToken(token);
          } else {
            throw new Error("Error al autenticar. Verifique las credenciales de dev.");
          }
        } else {
          throw new Error(
            "No token provided. In production, token must come from Dashboard. In dev mode, provide devUsername and devPassword in dashboardParams."
          );
        }
        const userName = dashboardParams?.userName || "Gestor Demo";
        const gestorId = await obtenerIdGestorPorUsuario(sdk, userName, token);
        setIdGestor(gestorId);
        console.log(`\u2705 ID Gestor: ${gestorId} para usuario: ${userName}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido al autenticar";
        setError({
          message: errorMessage,
          retry: () => {
            setError(null);
            authenticate();
          }
        });
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    };
    authenticate();
  }, [dashboardParams?.token]);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };
  const handleSeleccionarDeuda = (deuda) => {
    setDeudaActual(deuda);
    setScreen(deuda.estado === "nueva" ? "detail" : "management");
  };
  const handleSolicitarNuevaDeuda = () => {
    setMostrarConfirmacionSolicitar(true);
  };
  const handleConfirmarSolicitud = async () => {
    setMostrarConfirmacionSolicitar(false);
    try {
      setIsLoading(true);
      setLoadingMessage("Solicitando nueva deuda...");
      if (!idGestor) {
        throw new Error("ID Gestor no disponible. Por favor espere a que se complete la autenticaci\xF3n.");
      }
      const result = await sdk.forms.startProcess({
        processName: SDK_CONFIG.processName,
        additionalParameters: sdk.forms.createParameters([
          { name: "idGestor", value: String(idGestor) }
        ]),
        token: authToken
      });
      console.log("\u{1F50D} SDK Response (raw):", JSON.stringify(result, null, 2));
      const datosParam = result.parameters?.find((p) => p.name === "Datosgestion");
      console.log("\u{1F50D} Datosgestion parameterType:", datosParam?.parameterType);
      console.log("\u{1F50D} Datosgestion value type:", typeof datosParam?.value);
      console.log(
        "\u{1F50D} Datosgestion value (first 200 chars):",
        typeof datosParam?.value === "string" ? datosParam.value.substring(0, 200) : JSON.stringify(datosParam?.value).substring(0, 200)
      );
      if (result.status === "Error") {
        throw new Error(result.errorMessage || "Error al solicitar nueva deuda");
      }
      const datosGestionParam = result.parameters?.find((p) => p.name === "Datosgestion");
      if (!datosGestionParam || !datosGestionParam.value) {
        throw new Error("No se recibieron datos de gesti\xF3n del proceso");
      }
      console.log("\u{1F50D} Datosgestion parameter:", datosGestionParam);
      const datosGestion = datosGestionParam.value;
      console.log("\u{1F50D} Parsed JSON structure:", JSON.stringify(datosGestion, null, 2));
      const datosPersonales = datosGestion?.deudor?.datosPersonales || {};
      const idPersonal = datosPersonales.id || `D-${Date.now()}`;
      const nombre = datosPersonales.nombre || "Sin nombre";
      const cuit = datosPersonales.cuit || "Sin CUIT";
      const numeroDocumento = datosPersonales.numeroDocumento || "Sin documento";
      const fechaNacimiento = datosPersonales.fechaNacimiento || (/* @__PURE__ */ new Date()).toISOString();
      console.log("\u{1F50D} DatosPersonales:", { idPersonal, nombre, cuit, numeroDocumento, fechaNacimiento });
      const deudasArray = datosGestion?.deudor?.deudas?.deuda || [];
      const detalles = [];
      const deudas = Array.isArray(deudasArray) ? deudasArray : [deudasArray];
      deudas.forEach((deuda) => {
        const detallesArray = deuda?.detalles?.detalle || [];
        const detallesItems = Array.isArray(detallesArray) ? detallesArray : [detallesArray];
        detallesItems.forEach((detalle) => {
          const detalleItem = {
            id: parseInt(detalle.id || String(detalles.length + 1)),
            fecha: detalle.fecha || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            importeOriginal: parseFloat(detalle.importeOriginal || "0"),
            importe: parseFloat(detalle.importe || "0"),
            producto: detalle.producto || void 0,
            descripcion: detalle.descripcion || void 0,
            acreedorOriginal: detalle.acreedorOriginal || void 0,
            active: detalle.active === "true" || detalle.active === true
          };
          detalles.push(detalleItem);
        });
      });
      console.log("\u{1F50D} Detalles extracted:", detalles);
      const primeraDeuda = deudas[0] || {};
      const idDeuda = parseInt(primeraDeuda.id || "0");
      console.log("\u{1F50D} IDs for process:", { idDeudor: parseInt(idPersonal), idDeuda });
      const contactosArray = datosGestion?.deudor?.contactos?.contacto || [];
      const contactos = [];
      const contactosItems = Array.isArray(contactosArray) ? contactosArray : [contactosArray];
      contactosItems.forEach((contacto) => {
        if (!contacto || Object.keys(contacto).length === 0) return;
        const contactoItem = {
          id: contacto.id || `C${contactos.length + 1}`,
          idTipoContacto: contacto.idTipoContacto ? parseInt(contacto.idTipoContacto) : void 0,
          tipoContacto: contacto.tipoContacto || void 0,
          tipo: contacto.tipoContacto || void 0,
          // For UI compatibility
          contacto: contacto.contacto || void 0,
          valor: contacto.contacto || void 0,
          // For UI compatibility
          estado: contacto.estado || "INICIAL",
          fecha: contacto.fecha || void 0,
          piso: contacto.piso || void 0,
          depto: contacto.depto || void 0
        };
        contactos.push(contactoItem);
      });
      console.log("\u{1F50D} Contactos extracted:", contactos);
      const nuevaDeuda = {
        id: idPersonal,
        deudor: nombre,
        numeroDocumento,
        cuit,
        fechaNacimiento,
        fechaAlta: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        estado: "nueva",
        detalles,
        contactos,
        // Internal fields for process management
        idDeudor: parseInt(idPersonal),
        idDeuda
      };
      setDeudaActual(nuevaDeuda);
      setScreen("detail");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al solicitar deuda";
      setError({
        message: errorMessage,
        retry: () => {
          setError(null);
          setMostrarConfirmacionSolicitar(true);
        }
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };
  const handleAceptarDeuda = async () => {
    if (!deudaActual || !deudaActual.idDeudor || !deudaActual.idDeuda) {
      alert("Faltan datos necesarios para iniciar la gesti\xF3n");
      return;
    }
    try {
      setIsLoading(true);
      setLoadingMessage("Iniciando gesti\xF3n...");
      if (!idGestor) {
        throw new Error("ID Gestor no disponible.");
      }
      const result = await sdk.forms.startProcess({
        processName: "RB_IniciarGestion",
        additionalParameters: sdk.forms.createParameters([
          { name: "idGestor", value: String(idGestor) },
          { name: "idDeudor", value: String(deudaActual.idDeudor) },
          { name: "idDeuda", value: String(deudaActual.idDeuda) }
        ]),
        token: authToken
      });
      console.log("\u{1F50D} RB_IniciarGestion response:", result);
      if (result.status === "Error") {
        throw new Error(result.errorMessage || "Error al iniciar gesti\xF3n");
      }
      setDeudaActual({
        ...deudaActual,
        instanceIdGestion: result.instanceId,
        estado: "gestionando"
      });
      console.log("\u2705 Gesti\xF3n iniciada. InstanceId:", result.instanceId);
      setScreen("management");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al iniciar gesti\xF3n";
      setError({
        message: errorMessage,
        retry: handleAceptarDeuda
      });
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };
  const handleRechazarDeuda = () => {
    setMostrarRechazo(true);
  };
  const handleConfirmarRechazo = () => {
    if (!motivoRechazo || !descripcionRechazo.trim()) {
      alert("Complete todos los campos obligatorios");
      return;
    }
    alert(`Deuda ${deudaActual?.id} rechazada
Motivo: ${motivoRechazo}
${descripcionRechazo}`);
    setMostrarRechazo(false);
    setMotivoRechazo("");
    setDescripcionRechazo("");
    setDeudaActual(null);
    setScreen("dashboard");
  };
  const handleAgregarAccion = () => {
    if (!contactoSeleccionado) {
      alert("Seleccione un contacto de la tabla");
      return;
    }
    if (!observaciones.trim()) {
      alert("Complete las observaciones");
      return;
    }
    const ahora = /* @__PURE__ */ new Date();
    const nuevaAccion = {
      id: `A${Date.now()}`,
      fecha: ahora.toLocaleDateString("es-AR"),
      hora: ahora.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      tipo: "Gesti\xF3n",
      contacto: `${contactoSeleccionado.tipo}: ${contactoSeleccionado.valor}`,
      observaciones
    };
    setAccionesHistorial([...accionesHistorial, nuevaAccion]);
    setObservaciones("");
    setMostrarModalRegistrarAccion(false);
    setContactoSeleccionado(null);
    alert("Acci\xF3n registrada exitosamente");
  };
  const handleFinalizarGestion = () => {
    const totalAcciones = accionesHistorial.length;
    if (totalAcciones === 0) {
      alert("Registre al menos una acci\xF3n antes de finalizar");
      return;
    }
    setMostrarConfirmacionFinalizar(true);
  };
  const handleConfirmarFinalizar = () => {
    const totalAcciones = accionesHistorial.length;
    alert(`Gesti\xF3n de deuda ${deudaActual?.id} finalizada
Total de acciones: ${totalAcciones}`);
    setMostrarConfirmacionFinalizar(false);
    setDeudaActual(null);
    setAccionesHistorial(MOCK_ACCIONES_PREVIAS);
    setContactoSeleccionado(null);
    setScreen("dashboard");
  };
  const handleVolverDashboard = () => {
    setDeudaActual(null);
    setAccionesHistorial(MOCK_ACCIONES_PREVIAS);
    setContactoSeleccionado(null);
    setScreen("dashboard");
  };
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "min-h-screen bg-[#faf9f7]", children: [
    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "bg-white shadow-sm border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "max-w-7xl mx-auto px-8 py-6", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3 mb-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "text-white text-2xl font-bold", children: "R" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h1", { className: "text-2xl font-bold text-gray-900", children: "Recubiz" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-500", children: "Sistema de Gesti\xF3n de Cobranzas" })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-4", children: [
        screen !== "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Button, { variant: "default", onClick: handleVolverDashboard, children: "\u2190 Dashboard" }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "text-right", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600", children: dashboardParams?.userName || "Gestor" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("p", { className: "text-xs text-gray-400", children: [
            "v",
            version
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "max-w-7xl mx-auto px-8 py-8", children: [
      screen === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Dashboard" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-gray-600", children: "Vista general del sistema de gesti\xF3n de cobranzas" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
            "div",
            {
              className: "bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-emerald-500 p-6 cursor-pointer",
              onClick: handleSolicitarNuevaDeuda,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600 mb-1", children: "Nueva Gesti\xF3n" }),
                    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-lg font-bold text-gray-900", children: "Solicitar deuda" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-6 h-6 text-emerald-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
                  Button,
                  {
                    size: "sm",
                    onClick: (e) => {
                      e.stopPropagation();
                      handleSolicitarNuevaDeuda();
                    },
                    className: "w-full",
                    children: "+ Solicitar"
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500 p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600 mb-1", children: "Gestiones Activas" }),
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-3xl font-bold text-gray-900", children: MOCK_DEUDAS_HISTORIAL.length })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-6 h-6 text-orange-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "mt-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-4 h-4 inline text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "text-xs text-gray-600 ml-1", children: "En proceso" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500 p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600 mb-1", children: "Acciones (7d)" }),
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-3xl font-bold text-gray-900", children: "12" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-6 h-6 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "mt-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-4 h-4 inline text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "text-xs text-gray-600 ml-1", children: "\xDAltimos 7 d\xEDas" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500 p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600 mb-1", children: "Monto en Gesti\xF3n" }),
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-3xl font-bold text-gray-900", children: "$ 180K" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-6 h-6 text-green-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" }) }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("span", { className: "text-xs text-gray-600", children: "2 deudas activas" }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "px-6 py-4 border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h3", { className: "text-lg font-bold text-gray-900", children: "Mis Gestiones" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("p", { className: "text-sm text-gray-600 mt-1", children: [
                MOCK_DEUDAS_HISTORIAL.length,
                " gestiones en proceso"
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("table", { className: "w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("thead", { className: "bg-gray-100 border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "ID" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Deudor" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Documento" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Deuda Actual" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Estado" })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("tbody", { className: "divide-y divide-gray-100", children: MOCK_DEUDAS_HISTORIAL.map((d, index) => /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
              DeudaRow,
              {
                deuda: d,
                onClick: () => handleSeleccionarDeuda(d),
                index
              },
              d.id
            )) })
          ] }) })
        ] })
      ] }),
      screen === "detail" && deudaActual && /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Detalle de Deuda" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-gray-600", children: deudaActual.id })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "px-6 py-4 border-b border-gray-200 bg-gray-100", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h3", { className: "text-lg font-bold text-gray-900", children: "Datos del Deudor" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600", children: "Informaci\xF3n personal" })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "p-8", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2", children: "Nombre" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-base font-semibold text-gray-900", children: deudaActual.deudor })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2", children: "N\xFAmero Documento" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-base font-semibold text-gray-900", children: deudaActual.numeroDocumento })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2", children: "CUIT" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-base font-semibold text-gray-900", children: deudaActual.cuit })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2", children: "Fecha Nacimiento" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-base text-gray-900", children: formatDate(deudaActual.fechaNacimiento) })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "px-6 py-4 border-b border-gray-200 bg-gray-100", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h3", { className: "text-lg font-bold text-gray-900", children: "Datos de la Deuda" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("p", { className: "text-sm text-gray-600", children: [
                deudaActual.detalles.length,
                " ",
                deudaActual.detalles.length === 1 ? "registro" : "registros"
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("table", { className: "w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("thead", { className: "bg-gray-100 border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Fecha" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Importe Original" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Importe Actual" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Producto" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Descripci\xF3n" })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("tbody", { className: "divide-y divide-gray-100", children: deudaActual.detalles.map((detalle, index) => /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
              DetalleDeudaRow,
              {
                detalle,
                index
              },
              detalle.id
            )) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("tfoot", { className: "bg-gray-100 border-t-2 border-gray-300", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 text-sm font-bold text-gray-900", colSpan: 2, children: "TOTAL" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-lg font-bold text-red-600", children: formatCurrency(deudaActual.detalles.reduce((sum, d) => sum + d.importe, 0)) }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { colSpan: 2 })
            ] }) })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex gap-3 justify-end", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Button, { variant: "destructive", size: "lg", onClick: handleRechazarDeuda, children: "Rechazar" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Button, { variant: "default", size: "lg", onClick: handleAceptarDeuda, children: "Aceptar y Gestionar" })
        ] })
      ] }),
      screen === "management" && deudaActual && /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Gesti\xF3n Activa" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("p", { className: "text-gray-600", children: [
            deudaActual.id,
            " - ",
            deudaActual.deudor
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border-l-4 border-orange-500 p-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-start gap-4 mb-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-6 h-6 text-orange-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h3", { className: "text-xl font-bold text-gray-900 mb-1", children: "Informaci\xF3n del Deudor" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600", children: "Datos personales y deuda total" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1", children: "Nombre" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-base font-semibold text-gray-900", children: deudaActual.deudor })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1", children: "Documento" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-base font-medium text-gray-900", children: deudaActual.numeroDocumento })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1", children: "CUIT" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-base font-medium text-gray-900", children: deudaActual.cuit })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1", children: "Fecha Nacimiento" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-base text-gray-900", children: formatDate(deudaActual.fechaNacimiento) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "pt-4 border-t border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wide", children: "Productos" }),
                /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("p", { className: "text-lg font-bold text-gray-900", children: [
                  deudaActual.detalles.length,
                  " ",
                  deudaActual.detalles.length === 1 ? "producto" : "productos"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-xs font-semibold text-gray-500 uppercase tracking-wide", children: "Deuda Total" }),
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-xl font-bold text-red-600", children: formatCurrency(deudaActual.detalles.reduce((sum, d) => sum + d.importe, 0)) })
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "px-6 py-4 border-b border-gray-200 bg-gray-100", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h3", { className: "text-lg font-bold text-gray-900", children: "Datos de la Deuda" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("p", { className: "text-sm text-gray-600", children: [
                deudaActual.detalles.length,
                " ",
                deudaActual.detalles.length === 1 ? "registro" : "registros"
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("table", { className: "w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("thead", { className: "bg-gray-100 border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Fecha" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Importe Original" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Importe Actual" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Producto" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Descripci\xF3n" })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("tbody", { className: "divide-y divide-gray-100", children: deudaActual.detalles.map((detalle, index) => /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
              DetalleDeudaRow,
              {
                detalle,
                index
              },
              detalle.id
            )) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("tfoot", { className: "bg-gray-100 border-t-2 border-gray-300", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 text-sm font-bold text-gray-900", colSpan: 2, children: "TOTAL" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-lg font-bold text-red-600", children: formatCurrency(deudaActual.detalles.reduce((sum, d) => sum + d.importe, 0)) }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("td", { colSpan: 2 })
            ] }) })
          ] }) })
        ] }),
        accionesHistorial.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            "div",
            {
              className: "px-6 py-4 border-b border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors",
              onClick: () => setMostrarHistorial(!mostrarHistorial),
              children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" }) }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h3", { className: "text-lg font-bold text-gray-900", children: "Historial de Acciones" }),
                    /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("p", { className: "text-sm text-gray-600 mt-1", children: [
                      accionesHistorial.length,
                      " acciones registradas"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
                  "svg",
                  {
                    className: `w-6 h-6 text-gray-600 transition-transform ${mostrarHistorial ? "rotate-180" : ""}`,
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
                  }
                )
              ] })
            }
          ),
          mostrarHistorial && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "overflow-x-auto", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("table", { className: "w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("thead", { className: "bg-gray-100 border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Fecha" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Hora" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Tipo" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Contacto" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Observaciones" })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("tbody", { className: "divide-y divide-gray-100", children: accionesHistorial.map((a, index) => /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
              AccionRow,
              {
                accion: a,
                index,
                onClick: () => setAccionSeleccionada(a)
              },
              a.id
            )) })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h3", { className: "text-lg font-bold text-gray-900", children: "Contactos del Deudor" }),
              /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600", children: "Click en un contacto para registrar acci\xF3n" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: deudaActual.contactos && deudaActual.contactos.length > 0 ? deudaActual.contactos.map((contacto) => /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            ContactoCard,
            {
              contacto,
              onClick: () => {
                setContactoSeleccionado(contacto);
                setMostrarModalRegistrarAccion(true);
              }
            },
            contacto.id
          )) : /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "col-span-full text-center py-8 text-gray-500", children: "No hay contactos disponibles para este deudor" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "flex justify-center pt-4", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Button, { size: "lg", onClick: handleFinalizarGestion, children: "\u2713 Finalizar Gesti\xF3n" }) })
      ] }),
      mostrarConfirmacionSolicitar && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-2xl max-w-md w-full p-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-start gap-4 mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-6 h-6 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { className: "text-xl font-bold text-gray-900 mb-1", children: "Solicitar Nueva Deuda" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600", children: "Confirmar solicitud" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "mb-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-700", children: "\xBFEst\xE1 seguro que desea solicitar una nueva deuda para gestionar?" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600 mt-2", children: "Se le asignar\xE1 la pr\xF3xima deuda disponible en el sistema." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            Button,
            {
              variant: "outline",
              onClick: () => setMostrarConfirmacionSolicitar(false),
              className: "flex-1",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Button, { variant: "default", onClick: handleConfirmarSolicitud, className: "flex-1", children: "Confirmar Solicitud" })
        ] })
      ] }) }),
      mostrarConfirmacionFinalizar && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-2xl max-w-md w-full p-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-start gap-4 mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-6 h-6 text-green-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { className: "text-xl font-bold text-gray-900 mb-1", children: "Finalizar Gesti\xF3n" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600", children: deudaActual?.id })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "mb-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-700", children: "\xBFEst\xE1 seguro que desea finalizar la gesti\xF3n de esta deuda?" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("p", { className: "text-sm text-gray-600 mt-2", children: [
            "Se han registrado ",
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("span", { className: "font-bold", children: [
              accionesHistorial.length,
              " acciones"
            ] }),
            " en total."
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            Button,
            {
              variant: "outline",
              onClick: () => setMostrarConfirmacionFinalizar(false),
              className: "flex-1",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Button, { variant: "default", onClick: handleConfirmarFinalizar, className: "flex-1", children: "Confirmar Finalizaci\xF3n" })
        ] })
      ] }) }),
      mostrarRechazo && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-2xl max-w-md w-full p-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-start gap-4 mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-6 h-6 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { className: "text-xl font-bold text-gray-900 mb-1", children: "Rechazar Deuda" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600", children: deudaActual?.id })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "space-y-5 mb-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Motivo de Rechazo *" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)(
              "select",
              {
                value: motivoRechazo,
                onChange: (e) => setMotivoRechazo(e.target.value),
                className: "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-300 transition-colors",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("option", { value: "", children: "Seleccione un motivo..." }),
                  MOTIVOS_RECHAZO.map((m) => /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("option", { value: m.value, children: m.label }, m.value))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Descripci\xF3n *" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
              "textarea",
              {
                value: descripcionRechazo,
                onChange: (e) => setDescripcionRechazo(e.target.value),
                rows: 4,
                className: "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors",
                placeholder: "Ingrese una descripci\xF3n detallada del rechazo..."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            Button,
            {
              variant: "outline",
              onClick: () => {
                setMostrarRechazo(false);
                setMotivoRechazo("");
                setDescripcionRechazo("");
              },
              className: "flex-1",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Button, { variant: "destructive", onClick: handleConfirmarRechazo, className: "flex-1", children: "Confirmar Rechazo" })
        ] })
      ] }) }),
      mostrarModalRegistrarAccion && contactoSeleccionado && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-2xl max-w-lg w-full p-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-start justify-between mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "flex-1", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { className: "text-2xl font-bold text-gray-900 mb-1", children: "Registrar Nueva Acci\xF3n" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            "button",
            {
              onClick: () => {
                setMostrarModalRegistrarAccion(false);
                setContactoSeleccionado(null);
                setObservaciones("");
              },
              className: "text-gray-400 hover:text-gray-600 transition-colors",
              children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "mb-6 p-4 bg-gray-50 border-l-4 border-orange-500 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0", children: (contactoSeleccionado.tipo || "").toLowerCase().includes("email") ? /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) : (contactoSeleccionado.tipo || "").toLowerCase().includes("whatsapp") ? /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }) : (contactoSeleccionado.tipo || "").toLowerCase().includes("instagram") ? /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z" })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-orange-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1", children: "Contacto seleccionado" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-xs font-semibold text-gray-700 uppercase tracking-wide", children: contactoSeleccionado.tipo }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-base font-bold text-gray-900", children: contactoSeleccionado.valor })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Observaciones *" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            "textarea",
            {
              value: observaciones,
              onChange: (e) => setObservaciones(e.target.value),
              rows: 6,
              className: "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors",
              placeholder: "Describa la acci\xF3n realizada...",
              autoFocus: true
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            Button,
            {
              variant: "outline",
              onClick: () => {
                setMostrarModalRegistrarAccion(false);
                setContactoSeleccionado(null);
                setObservaciones("");
              },
              className: "flex-1",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            Button,
            {
              variant: "default",
              onClick: handleAgregarAccion,
              className: "flex-1",
              children: "Guardar Acci\xF3n"
            }
          )
        ] })
      ] }) }),
      isLoading && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "bg-white rounded-xl shadow-2xl max-w-md w-full p-8", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { className: "text-xl font-bold text-gray-900 mb-2", children: loadingMessage || "Procesando..." }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600 text-center", children: "Por favor espere..." })
      ] }) }) }),
      error && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-2xl max-w-md w-full p-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-start gap-4 mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-6 h-6 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { className: "text-xl font-bold text-gray-900 mb-1", children: "Error" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-600", children: "Ha ocurrido un error" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "mb-8", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-sm text-gray-700", children: error.message }) }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            Button,
            {
              variant: "outline",
              onClick: () => setError(null),
              className: "flex-1",
              children: "Cerrar"
            }
          ),
          error.retry && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            Button,
            {
              variant: "default",
              onClick: () => {
                const retryFn = error.retry;
                if (retryFn) retryFn();
              },
              className: "flex-1",
              children: "Reintentar"
            }
          )
        ] })
      ] }) }),
      accionSeleccionada && /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "bg-white rounded-xl shadow-2xl max-w-lg w-full p-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-start justify-between mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("h2", { className: "text-2xl font-bold text-gray-900 mb-1", children: "Detalle de Acci\xF3n" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("p", { className: "text-sm text-gray-600", children: [
              accionSeleccionada.tipo,
              " - ",
              accionSeleccionada.fecha,
              " ",
              accionSeleccionada.hora
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            "button",
            {
              onClick: () => setAccionSeleccionada(null),
              className: "text-gray-400 hover:text-gray-600 transition-colors",
              children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "mb-6 p-4 bg-gray-50 border-l-4 border-blue-500 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0", children: accionSeleccionada.contacto.toLowerCase().includes("email") ? /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }) }) : accionSeleccionada.contacto.toLowerCase().includes("whatsapp") ? /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" }) }) : accionSeleccionada.contacto.toLowerCase().includes("instagram") ? /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z" })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("svg", { className: "w-5 h-5 text-blue-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1", children: "Contacto utilizado" }),
            /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("p", { className: "text-base font-bold text-gray-900", children: accionSeleccionada.contacto })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", { className: "mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Observaciones" }),
          /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(
            "textarea",
            {
              value: accionSeleccionada.observaciones,
              readOnly: true,
              rows: 6,
              className: "w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none resize-none"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", { className: "flex justify-end", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(Button, { variant: "outline", onClick: () => setAccionSeleccionada(null), children: "Cerrar" }) })
      ] }) })
    ] })
  ] });
}
function RecubizGestionForm(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(BizuitThemeProvider, { defaultTheme: "light", defaultColorTheme: "orange", children: /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(RecubizGestionFormInner, { ...props }) });
}
export {
  RecubizGestionForm as default
};
/*! Bundled license information:

lucide-react/dist/esm/defaultAttributes.js:
lucide-react/dist/esm/createLucideIcon.js:
lucide-react/dist/esm/icons/alert-circle.js:
lucide-react/dist/esm/icons/camera.js:
lucide-react/dist/esm/icons/check.js:
lucide-react/dist/esm/icons/circle.js:
lucide-react/dist/esm/icons/download.js:
lucide-react/dist/esm/icons/eraser.js:
lucide-react/dist/esm/icons/file-text.js:
lucide-react/dist/esm/icons/image.js:
lucide-react/dist/esm/icons/loader-2.js:
lucide-react/dist/esm/icons/map-pin.js:
lucide-react/dist/esm/icons/maximize.js:
lucide-react/dist/esm/icons/pause.js:
lucide-react/dist/esm/icons/play.js:
lucide-react/dist/esm/icons/plus.js:
lucide-react/dist/esm/icons/qr-code.js:
lucide-react/dist/esm/icons/rotate-cw.js:
lucide-react/dist/esm/icons/trash-2.js:
lucide-react/dist/esm/icons/undo.js:
lucide-react/dist/esm/icons/upload.js:
lucide-react/dist/esm/icons/volume-2.js:
lucide-react/dist/esm/icons/volume-x.js:
lucide-react/dist/esm/icons/x.js:
lucide-react/dist/esm/lucide-react.js:
  (**
   * @license lucide-react v0.302.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=form.dev.js.map
