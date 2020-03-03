// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/Flags.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChildFlags = exports.VNodeFlags = void 0;
var VNodeFlags = {
  /* First set of bits define shape of vNode */
  HtmlElement: 1,
  ComponentUnknown: 2,
  ComponentFunction: 8,
  Text: 16,

  /* Special flags */
  SvgElement: 32,
  InputElement: 64,
  TextareaElement: 128,
  SelectElement: 256,
  Void: 512,
  Portal: 1024,
  ReCreate: 2048,
  ContentEditable: 4096,
  Fragment: 8192,
  InUse: 16384,
  ForwardRef: 32768,
  Normalized: 65536,

  /* Masks */
  ForwardRefComponent: 32776,
  FormElement: 448,
  Element: 481,
  Component: 14,
  DOMRef: 2033,
  InUseOrNormalized: 81920,
  ClearInUse: -16385,
  ComponentKnown: 12
};
exports.VNodeFlags = VNodeFlags;
var ChildFlags = {
  UnknownChildren: 0,
  // When zero is passed children will be normalized

  /* Second set of bits define shape of children */
  HasInvalidChildren: 1,
  HasVNodeChildren: 1 << 1,
  HasNonKeyedChildren: 1 << 2,
  HasKeyedChildren: 1 << 3,
  HasTextChildren: 1 << 4
};
exports.ChildFlags = ChildFlags;
},{}],"src/common.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMPTY_OBJ = exports.isNumber = exports.isString = exports.appendChild = exports.insertOrAppend = exports.isNull = exports.setTextContent = exports.isFunction = exports.isNullOrUndef = exports.documentCreateElement = exports.callAll = exports.normalizeEventName = exports.safeCall1 = exports.unmountRef = exports.mountRef = void 0;

var callAll = function callAll(arrayFn) {
  for (var i = 0; i < arrayFn.length; i++) {
    arrayFn[i]();
  }
};

exports.callAll = callAll;

var mountRef = function mountRef(ref, value, lifecycle) {
  if (ref && (isFunction(ref) || ref.current !== void 0)) {
    lifecycle.push(function () {
      if (!safeCall1(ref, value) && ref.current !== void 0) {
        ref.current = value;
      }
    });
  }
};

exports.mountRef = mountRef;

var unmountRef = function unmountRef(ref) {
  if (ref) {
    if (!safeCall1(ref, null) && ref.current) {
      ref.current = null;
    }
  }
};

exports.unmountRef = unmountRef;

var appendChild = function appendChild(parentDOM, dom) {
  parentDOM.appendChild(dom);
};

exports.appendChild = appendChild;

var insertOrAppend = function insertOrAppend(parentDOM, newNode, nextNode) {
  if (isNull(nextNode)) {
    appendChild(parentDOM, newNode);
  } else {
    parentDOM.insertBefore(newNode, nextNode);
  }
};

exports.insertOrAppend = insertOrAppend;

var documentCreateElement = function documentCreateElement(tag) {
  return document.createElement(tag);
};

exports.documentCreateElement = documentCreateElement;

var isNullOrUndef = function isNullOrUndef(o) {
  return o === void 0 || o === null;
};

exports.isNullOrUndef = isNullOrUndef;

var isFunction = function isFunction(o) {
  return typeof o === "function";
};

exports.isFunction = isFunction;

var isNull = function isNull(o) {
  return o === null;
};

exports.isNull = isNull;

var isString = function isString(o) {
  return typeof o === "string";
};

exports.isString = isString;

var isNumber = function isNumber(o) {
  return typeof o === "number";
};

exports.isNumber = isNumber;

var setTextContent = function setTextContent(dom, children) {
  dom.textContent = children;
};

exports.setTextContent = setTextContent;
var EMPTY_OBJ = {};
exports.EMPTY_OBJ = EMPTY_OBJ;

var normalizeEventName = function normalizeEventName(name) {
  return name.substr(2).toLowerCase();
};

exports.normalizeEventName = normalizeEventName;

var safeCall1 = function safeCall1(method, arg1) {
  return !!isFunction(method) && (method(arg1), true);
};

exports.safeCall1 = safeCall1;
},{}],"src/events.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleSyntheticEvent = exports.syntheticEvents = void 0;

var _common = require("./common");

var _this = void 0;

var getDelegatedEventObject = function getDelegatedEventObject(v) {
  return {
    onClick: v,
    onDblClick: v,
    onFocusIn: v,
    onFocusOut: v,
    onKeyDown: v,
    onKeyPress: v,
    onKeyUp: v,
    onMouseDown: v,
    onMouseMove: v,
    onMouseUp: v,
    onTouchEnd: v,
    onTouchMove: v,
    onTouchStart: v
  };
};

var getTargetNode = function getTargetNode(event) {
  return (0, _common.isFunction)(event.composedPath) ? event.composedPath()[0] : event.target;
};

var dispatchEvents = function dispatchEvents(event, isClick, name, eventData) {
  var dom = getTargetNode(event);

  do {
    // Html Nodes can be nested fe: span inside button in that scenario browser does not handle disabled attribute on parent,
    // because the event listener is on document.body
    // Don't process clicks on disabled elements
    if (isClick && dom.disabled) {
      return;
    }

    var eventsObject = dom.$EV;

    if (eventsObject) {
      var currentEvent = eventsObject[name];

      if (currentEvent) {
        // linkEvent object
        eventData.dom = dom;
        currentEvent.event ? currentEvent.event(currentEvent.data, event) : currentEvent(event);

        if (event.cancelBubble) {
          return;
        }
      }
    }

    dom = dom.parentNode;
  } while (!(0, _common.isNull)(dom));
};

var stopPropagation = function stopPropagation() {
  _this.cancelBubble = true;

  if (!_this.immediatePropagationStopped) {
    _this.stopImmediatePropagation();
  }
};

var isDefaultPrevented = function isDefaultPrevented() {
  return _this.defaultPrevented;
};

var isPropagationStopped = function isPropagationStopped() {
  return _this.cancelBubble;
};

var extendEventProperties = function extendEventProperties(event) {
  // Event data needs to be object to save reference to currentTarget getter
  var eventData = {
    dom: {}
  };
  event.isDefaultPrevented = isDefaultPrevented;
  event.isPropagationStopped = isPropagationStopped;
  event.stopPropagation = stopPropagation;
  Object.defineProperty(event, "currentTarget", {
    configurable: true,
    get: function get() {
      return eventData.dom;
    }
  });
  return eventData;
};

var updateOrAddSyntheticEvent = function updateOrAddSyntheticEvent(name, dom) {
  var eventsObject = dom.$EV;

  if (!eventsObject) {
    eventsObject = dom.$EV = getDelegatedEventObject(null);
  }

  if (!eventsObject[name]) {
    if (++attachedEventCounts[name] === 1) {
      attachedEvents[name] = attachEventToDocument(name);
    }
  }

  return eventsObject;
};

var handleSyntheticEvent = function handleSyntheticEvent(name, lastEvent, nextEvent, dom) {
  if ((0, _common.isFunction)(nextEvent)) {
    updateOrAddSyntheticEvent(name, dom)[name] = nextEvent;
  } else if (isLinkEventObject(nextEvent)) {
    if (isLastValueSameLinkEvent(lastEvent, nextEvent)) {
      return;
    }

    updateOrAddSyntheticEvent(name, dom)[name] = nextEvent;
  } else {
    unmountSyntheticEvent(name, dom);
  }
};

exports.handleSyntheticEvent = handleSyntheticEvent;

var rootEvent = function rootEvent(name) {
  return function (event) {
    dispatchEvents(event, false, name, extendEventProperties(event));
  };
};

var rootClickEvent = function rootClickEvent(name) {
  return function (event) {
    if (event.button !== 0) {
      // Firefox incorrectly triggers click event for mid/right mouse buttons.
      // This bug has been active for 17 years.
      // https://bugzilla.mozilla.org/show_bug.cgi?id=184051
      event.stopPropagation();
      return;
    }

    dispatchEvents(event, true, name, extendEventProperties(event));
  };
};

var attachEventToDocument = function attachEventToDocument(name) {
  var attachedEvent = name === "onClick" || name === "onDblClick" ? rootClickEvent(name) : rootEvent(name);
  document.addEventListener((0, _common.normalizeEventName)(name), attachedEvent);
  return attachedEvent;
};

var attachedEventCounts = getDelegatedEventObject(0);
var attachedEvents = getDelegatedEventObject(null);
var syntheticEvents = getDelegatedEventObject(true);
exports.syntheticEvents = syntheticEvents;
},{"./common":"src/common.js"}],"src/props.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchProp = exports.mountProps = void 0;

var _Flags = require("./Flags");

var _events = require("./events");

var _common = require("./common");

var patchStyle = function patchStyle(lastAttrValue, nextAttrValue, dom) {
  if ((0, _common.isNullOrUndef)(nextAttrValue)) {
    dom.removeAttribute("style");
    return;
  }

  var domStyle = dom.style;
  var style;
  var value;

  if ((0, _common.isString)(nextAttrValue)) {
    domStyle.cssText = nextAttrValue;
    return;
  }

  if (!(0, _common.isNullOrUndef)(lastAttrValue) && !(0, _common.isString)(lastAttrValue)) {
    for (style in nextAttrValue) {
      // do not add a hasOwnProperty check here, it affects performance
      value = nextAttrValue[style];

      if (value !== lastAttrValue[style]) {
        domStyle.setProperty(style, value);
      }
    }

    for (style in lastAttrValue) {
      if ((0, _common.isNullOrUndef)(nextAttrValue[style])) {
        domStyle.removeProperty(style);
      }
    }
  } else {
    for (style in nextAttrValue) {
      value = nextAttrValue[style];
      domStyle.setProperty(style, value);
    }
  }
};

var patchProp = function patchProp(prop, lastValue, nextValue, dom, hasControlledValue, lastVNode) {
  switch (prop) {
    case "children":
    case "childrenType":
    case "className":
    case "defaultValue":
    case "key":
    case "multiple":
    case "ref":
    case "selectedIndex":
      break;

    case "autoFocus":
      dom.autofocus = !!nextValue;
      break;

    case "allowfullscreen":
    case "autoplay":
    case "capture":
    case "checked":
    case "controls":
    case "default":
    case "disabled":
    case "hidden":
    case "indeterminate":
    case "loop":
    case "muted":
    case "novalidate":
    case "open":
    case "readOnly":
    case "required":
    case "reversed":
    case "scoped":
    case "seamless":
    case "selected":
      dom[prop] = !!nextValue;
      break;

    case "defaultChecked":
    case "value":
    case "volume":
      if (hasControlledValue && prop === "value") {
        break;
      }

      var value = (0, _common.isNullOrUndef)(nextValue) ? "" : nextValue;

      if (dom[prop] !== value) {
        dom[prop] = value;
      }

      break;

    case "style":
      patchStyle(lastValue, nextValue, dom);
      break;

    case "dangerouslySetInnerHTML":
      patchDangerInnerHTML(lastValue, nextValue, lastVNode, dom);
      break;

    default:
      if (_events.syntheticEvents[prop]) {
        (0, _events.handleSyntheticEvent)(prop, lastValue, nextValue, dom);
      } else if (prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110) {
        patchEvent(prop, lastValue, nextValue, dom);
      } else if ((0, _common.isNullOrUndef)(nextValue)) {
        dom.removeAttribute(prop);
      } else {
        dom.setAttribute(prop, nextValue);
      }

      break;
  }
};

exports.patchProp = patchProp;

var mountProps = function mountProps(vNode, flags, props, dom) {
  var hasControlledValue = false;
  var isFormElement = (flags & _Flags.VNodeFlags.FormElement) > 0;

  if (isFormElement) {
    hasControlledValue = isControlledFormElement(props);

    if (hasControlledValue) {
      addFormElementEventHandlers(flags, dom, props);
    }
  }

  for (var prop in props) {
    patchProp(prop, null, props[prop], dom, hasControlledValue, null);
  }

  if (isFormElement) {
    processElement(flags, vNode, dom, props, true, hasControlledValue);
  }
};

exports.mountProps = mountProps;
},{"./Flags":"src/Flags.js","./events":"src/events.js","./common":"src/common.js"}],"src/mounting.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mount = void 0;

var _Flags = require("./Flags");

var _common = require("./common");

var _props = require("./props");

var mountArrayChildren = function mountArrayChildren(children, dom, nextNode, lifecycle) {
  for (var i = 0; i < children.length; ++i) {
    var child = children[i];

    if (child.flags & _Flags.VNodeFlags.InUse) {
      children[i] = child = directClone(child);
    }

    mount(child, dom, nextNode, lifecycle);
  }
};

var mountElement = function mountElement(vNode, parentDOM, nextNode, lifecycle) {
  // console.log(`vNode: ${vNode.className}, nextNode: ${nextNode}`);
  var flags = vNode.flags;
  var props = vNode.props;
  var className = vNode.className;
  var children = vNode.children;
  var childFlags = vNode.childFlags;
  var dom = vNode.dom = (0, _common.documentCreateElement)(vNode.type);

  if (!(0, _common.isNullOrUndef)(className) && className !== "") {
    dom.className = className;
  }

  if (childFlags === _Flags.ChildFlags.HasTextChildren) {
    (0, _common.setTextContent)(dom, children);
  } else if (childFlags !== _Flags.ChildFlags.HasInvalidChildren) {
    if (childFlags === _Flags.ChildFlags.HasVNodeChildren) {
      if (children.flags & _Flags.VNodeFlags.InUse) {
        vNode.children = children = directClone(children);
      }

      mount(children, dom, null, lifecycle);
    } else if (childFlags === _Flags.ChildFlags.HasKeyedChildren || childFlags === _Flags.ChildFlags.HasNonKeyedChildren) {
      mountArrayChildren(children, dom, null, lifecycle);
    }
  }

  if (!(0, _common.isNull)(parentDOM)) {
    (0, _common.insertOrAppend)(parentDOM, dom, nextNode);
  }

  if (!(0, _common.isNull)(props)) {
    (0, _props.mountProps)(vNode, flags, props, dom);
  }

  (0, _common.mountRef)(vNode.ref, dom, lifecycle);
};

var mount = function mount(vNode, parentDOM, nextNode, lifecycle) {
  var flags = vNode.flags |= _Flags.VNodeFlags.InUse;

  if (flags & _Flags.VNodeFlags.Element) {
    mountElement(vNode, parentDOM, nextNode, lifecycle);
  } else if (flags & _Flags.VNodeFlags.ComponentFunction) {
    mountFunctionalComponent(vNode, parentDOM, nextNode, lifecycle);
    mountFunctionalComponentCallbacks(vNode, lifecycle);
  } else if (flags & _Flags.VNodeFlags.Void || flags & _Flags.VNodeFlags.Text) {
    mountText(vNode, parentDOM, nextNode);
  } else if (flags & _Flags.VNodeFlags.Fragment) {
    mountFragment(vNode, parentDOM, nextNode, lifecycle);
  } else if (flags & _Flags.VNodeFlags.Portal) {
    mountPortal(vNode, parentDOM, nextNode, lifecycle);
  }
};

exports.mount = mount;
},{"./Flags":"src/Flags.js","./common":"src/common.js","./props":"src/props.js"}],"src/patching.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patch = void 0;

var _Flags = require("./Flags");

var _common = require("./common");

var _props = require("./props");

var patchSingleTextChild = function patchSingleTextChild(lastChildren, nextChildren, parentDOM) {
  if (lastChildren !== nextChildren) {
    if (lastChildren !== "") {
      parentDOM.firstChild.nodeValue = nextChildren;
    } else {
      setTextContent(parentDOM, nextChildren);
    }
  }
};

var patchNonKeyedChildren = function patchNonKeyedChildren(lastChildren, nextChildren, dom, lastChildrenLength, nextChildrenLength, nextNode, lifecycle) {
  var commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
  var i = 0;
  var nextChild;
  var lastChild;

  for (; i < commonLength; ++i) {
    nextChild = nextChildren[i];
    lastChild = lastChildren[i];

    if (nextChild.flags & _Flags.VNodeFlags.InUse) {
      nextChild = nextChildren[i] = directClone(nextChild);
    }

    patch(lastChild, nextChild, dom, nextNode, lifecycle);
    lastChildren[i] = nextChild;
  }

  if (lastChildrenLength < nextChildrenLength) {
    for (i = commonLength; i < nextChildrenLength; ++i) {
      nextChild = nextChildren[i];

      if (nextChild.flags & _Flags.VNodeFlags.InUse) {
        nextChild = nextChildren[i] = directClone(nextChild);
      }

      mount(nextChild, dom, context, isSVG, nextNode, lifecycle);
    }
  } else if (lastChildrenLength > nextChildrenLength) {
    for (i = commonLength; i < lastChildrenLength; ++i) {
      remove(lastChildren[i], dom);
    }
  }
};

var patchChildren = function patchChildren(lastChildFlags, nextChildFlags, lastChildren, nextChildren, parentDOM, nextNode, parentVNode, lifecycle) {
  switch (lastChildFlags) {
    case _Flags.ChildFlags.HasVNodeChildren:
      switch (nextChildFlags) {
        case _Flags.ChildFlags.HasVNodeChildren:
          patch(lastChildren, nextChildren, parentDOM, nextNode, lifecycle);
          break;

        case _Flags.ChildFlags.HasInvalidChildren:
          remove(lastChildren, parentDOM);
          break;

        case _Flags.ChildFlags.HasTextChildren:
          unmount(lastChildren);
          setTextContent(parentDOM, nextChildren);
          break;

        default:
          replaceOneVNodeWithMultipleVNodes(lastChildren, nextChildren, parentDOM, lifecycle);
          break;
      }

      break;

    case _Flags.ChildFlags.HasInvalidChildren:
      switch (nextChildFlags) {
        case _Flags.ChildFlags.HasVNodeChildren:
          mount(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
          break;

        case _Flags.ChildFlags.HasInvalidChildren:
          break;

        case _Flags.ChildFlags.HasTextChildren:
          setTextContent(parentDOM, nextChildren);
          break;

        default:
          mountArrayChildren(nextChildren, parentDOM, nextNode, lifecycle);
          break;
      }

      break;

    case _Flags.ChildFlags.HasTextChildren:
      switch (nextChildFlags) {
        case _Flags.ChildFlags.HasTextChildren:
          patchSingleTextChild(lastChildren, nextChildren, parentDOM);
          break;

        case _Flags.ChildFlags.HasVNodeChildren:
          clearDOM(parentDOM);
          mount(nextChildren, parentDOM, nextNode, lifecycle);
          break;

        case _Flags.ChildFlags.HasInvalidChildren:
          clearDOM(parentDOM);
          break;

        default:
          clearDOM(parentDOM);
          mountArrayChildren(nextChildren, parentDOM, nextNode, lifecycle);
          break;
      }

      break;

    default:
      switch (nextChildFlags) {
        case _Flags.ChildFlags.HasTextChildren:
          unmountAllChildren(lastChildren);
          setTextContent(parentDOM, nextChildren);
          break;

        case _Flags.ChildFlags.HasVNodeChildren:
          removeAllChildren(parentDOM, parentVNode, lastChildren);
          mount(nextChildren, parentDOM, nextNode, lifecycle);
          break;

        case _Flags.ChildFlags.HasInvalidChildren:
          removeAllChildren(parentDOM, parentVNode, lastChildren);
          break;

        default:
          var lastLength = lastChildren.length | 0;
          var nextLength = nextChildren.length | 0; // Fast path's for both algorithms

          if (lastLength === 0) {
            if (nextLength > 0) {
              mountArrayChildren(nextChildren, parentDOM, nextNode, lifecycle);
            }
          } else if (nextLength === 0) {
            removeAllChildren(parentDOM, parentVNode, lastChildren);
          } else if (nextChildFlags === _Flags.ChildFlags.HasKeyedChildren && lastChildFlags === _Flags.ChildFlags.HasKeyedChildren) {
            patchKeyedChildren(lastChildren, nextChildren, parentDOM, lastLength, nextLength, nextNode, parentVNode, lifecycle);
          } else {
            patchNonKeyedChildren(lastChildren, nextChildren, parentDOM, lastLength, nextLength, nextNode, lifecycle);
          }

          break;
      }

      break;
  }
};

var patchElement = function patchElement(lastVNode, nextVNode, nextFlags, lifecycle) {
  var dom = nextVNode.dom = lastVNode.dom;
  var lastProps = lastVNode.props;
  var nextProps = nextVNode.props;
  var isFormElement = false;
  var hasControlledValue = false;
  var nextPropsOrEmpty; // inlined patchProps  -- starts --

  if (lastProps !== nextProps) {
    var lastPropsOrEmpty = lastProps || _common.EMPTY_OBJ;
    nextPropsOrEmpty = nextProps || _common.EMPTY_OBJ;

    if (nextPropsOrEmpty !== _common.EMPTY_OBJ) {
      isFormElement = (nextFlags & _Flags.VNodeFlags.FormElement) > 0;

      if (isFormElement) {
        hasControlledValue = isControlledFormElement(nextPropsOrEmpty);
      }

      for (var prop in nextPropsOrEmpty) {
        var lastValue = lastPropsOrEmpty[prop];
        var nextValue = nextPropsOrEmpty[prop];

        if (lastValue !== nextValue) {
          (0, _props.patchProp)(prop, lastValue, nextValue, dom, hasControlledValue, lastVNode);
        }
      }
    }

    if (lastPropsOrEmpty !== _common.EMPTY_OBJ) {
      for (var _prop in lastPropsOrEmpty) {
        if ((0, _common.isNullOrUndef)(nextPropsOrEmpty[_prop]) && !(0, _common.isNullOrUndef)(lastPropsOrEmpty[_prop])) {
          (0, _props.patchProp)(_prop, lastPropsOrEmpty[_prop], null, dom, hasControlledValue, lastVNode);
        }
      }
    }
  }

  var nextChildren = nextVNode.children;
  var nextClassName = nextVNode.className; // inlined patchProps  -- ends --

  if (lastVNode.className !== nextClassName) {
    if ((0, _common.isNullOrUndef)(nextClassName)) {
      dom.removeAttribute("class");
    } else {
      dom.className = nextClassName;
    }
  }

  if (nextFlags & _Flags.VNodeFlags.ContentEditable) {
    patchContentEditableChildren(dom, nextChildren);
  } else {
    patchChildren(lastVNode.childFlags, nextVNode.childFlags, lastVNode.children, nextChildren, dom, null, lastVNode, lifecycle);
  }

  if (isFormElement) {
    processElement(nextFlags, nextVNode, dom, nextPropsOrEmpty, false, hasControlledValue);
  }

  var nextRef = nextVNode.ref;
  var lastRef = lastVNode.ref;

  if (lastRef !== nextRef) {
    (0, _common.unmountRef)(lastRef);
    (0, _common.mountRef)(nextRef, dom, lifecycle);
  }
};

var patch = function patch(lastVNode, nextVNode, parentDOM, nextNode, lifecycle) {
  var nextFlags = nextVNode.flags |= _Flags.VNodeFlags.InUse;

  if (lastVNode.flags !== nextFlags || lastVNode.type !== nextVNode.type || lastVNode.key !== nextVNode.key || nextFlags & _Flags.VNodeFlags.ReCreate) {
    if (lastVNode.flags & _Flags.VNodeFlags.InUse) {
      replaceWithNewNode(lastVNode, nextVNode, parentDOM, lifecycle);
    } else {
      mount(nextVNode, parentDOM, nextNode, lifecycle);
    }
  } else if (nextFlags & _Flags.VNodeFlags.Element) {
    patchElement(lastVNode, nextVNode, nextFlags, lifecycle);
  } else if (nextFlags & _Flags.VNodeFlags.ComponentClass) {
    patchClassComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle);
  } else if (nextFlags & _Flags.VNodeFlags.ComponentFunction) {
    patchFunctionalComponent(lastVNode, nextVNode, parentDOM, nextNode, lifecycle);
  } else if (nextFlags & _Flags.VNodeFlags.Text) {
    patchText(lastVNode, nextVNode);
  } else if (nextFlags & _Flags.VNodeFlags.Void) {
    nextVNode.dom = lastVNode.dom;
  } else if (nextFlags & _Flags.VNodeFlags.Fragment) {
    patchFragment(lastVNode, nextVNode, parentDOM, lifecycle);
  } else {
    patchPortal(lastVNode, nextVNode, lifecycle);
  }
};

exports.patch = patch;
},{"./Flags":"src/Flags.js","./common":"src/common.js","./props":"src/props.js"}],"src/core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.createVNode = void 0;

var _Flags = require("./Flags");

var _mounting = require("./mounting");

var _common = require("./common");

var _patching = require("./patching");

var options = {
  componentComparator: null,
  createVNode: null,
  renderComplete: null
};

function V(childFlags, children, className, flags, key, props, ref, type) {
  this.childFlags = childFlags;
  this.children = children;
  this.className = className;
  this.dom = null;
  this.flags = flags;
  this.key = key === void 0 ? null : key;
  this.props = props === void 0 ? null : props;
  this.ref = ref === void 0 ? null : ref;
  this.type = type;
}

var createVNode = function createVNode(flags, type, className, children, childFlags, props, key, ref) {
  var childFlag = childFlags === void 0 ? 1 : childFlags;
  var vNode = new V(childFlag, children, className, flags, key, props, ref, type);

  if (options.createVNode) {
    options.createVNode(vNode);
  }

  return vNode;
};

exports.createVNode = createVNode;
var renderCheck = {
  v: false
};

var render = function render(input, parentDOM) {
  var lifecycle = [];
  var rootInput = parentDOM.$V; // console.log(parentDOM);

  renderCheck.v = true;

  if ((0, _common.isNullOrUndef)(rootInput)) {
    if (!(0, _common.isNullOrUndef)(input)) {
      if (input.flags & _Flags.VNodeFlags.InUse) {
        input = directClone(input);
      }

      (0, _mounting.mount)(input, parentDOM, null, lifecycle);
      parentDOM.$V = input;
      rootInput = input;
    }
  } else {
    if ((0, _common.isNullOrUndef)(input)) {
      remove(rootInput, parentDOM);
      parentDOM.$V = null;
    } else {
      if (input.flags & _Flags.VNodeFlags.InUse) {
        input = directClone(input);
      }

      (0, _patching.patch)(rootInput, input, parentDOM, null, lifecycle);
      rootInput = parentDOM.$V = input;
    }
  }

  (0, _common.callAll)(lifecycle);
  renderCheck.v = false;

  if ((0, _common.isFunction)(options.renderComplete)) {
    options.renderComplete(rootInput, parentDOM);
  }
};

exports.render = render;
},{"./Flags":"src/Flags.js","./mounting":"src/mounting.js","./common":"src/common.js","./patching":"src/patching.js"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _core = require("./core");

var rb = function rb(dbs) {
  var length = dbs.length;
  var databases = [];

  for (var i = 0; i < length; i++) {
    var db = dbs[i];
    var lastSample = db.lastSample;
    var children = [(0, _core.createVNode)(1, "div", "dbname", db.dbname, 16, null, null, null), (0, _core.createVNode)(1, "div", "query-count", (0, _core.createVNode)(1, "div", lastSample.countClassName, lastSample.nbQueries, 16, null, null, null), 2, null, null, null)];

    for (var i2 = 0; i2 < 5; i2++) {
      var query = lastSample.topFiveQueries[i2];
      children.push((0, _core.createVNode)(1, "div", query.elapsedClassName, [(0, _core.createVNode)(1, "div", null, query.formatElapsed, 16, null, null, null), (0, _core.createVNode)(1, "div", "popover left", [(0, _core.createVNode)(1, "div", "popover-content", query.query, 16, null, null, null), (0, _core.createVNode)(1, "div", "arrow", null, 1, null, null, null)], 4, null, null, null)], 4, null, null, null));
    }

    databases.push((0, _core.createVNode)(1, "div", null, children, 4, null, null, null));
  }

  return databases;
}; // const data = rb(generateData(false).toArray());


var textContent = function textContent(v) {
  return (0, _core.createVNode)(1, "div", "text", v, 16, {
    style: "width: 40px;",
    onClick: function onClick() {
      return console.log("child");
    }
  }, null, null);
};

var elem = document.getElementById("root");

var renderApp = function renderApp(v) {
  return (0, _core.createVNode)(1, "div", "foo1", (0, _core.createVNode)(1, "div", "foo2", [textContent(v)], 4, null, null, null), 2, {
    onClick: function onClick() {
      return console.log("root");
    }
  }, null, function (a, b) {
    return console.log(a);
  });
}; // console.log(app);


var count = 0;
(0, _core.render)(renderApp(count), elem);
setTimeout(function () {
  count++;
  (0, _core.render)(renderApp("ffff"), elem);
}, 2000); // setInterval(() => {
//   count++;
//   render(renderApp(count), elem);
// }, 300);
},{"./core":"src/core.js"}],"../../.npm-global/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "41273" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../.npm-global/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map