import { VNodeFlags, ChildFlags } from "./Flags";
import { syntheticEvents, handleSyntheticEvent } from "./events";
import { isNullOrUndef, isString } from "./common";

const patchStyle = (lastAttrValue, nextAttrValue, dom) => {
  if (isNullOrUndef(nextAttrValue)) {
    dom.removeAttribute("style");
    return;
  }
  const domStyle = dom.style;
  let style;
  let value;
  if (isString(nextAttrValue)) {
    domStyle.cssText = nextAttrValue;
    return;
  }

  if (!isNullOrUndef(lastAttrValue) && !isString(lastAttrValue)) {
    for (style in nextAttrValue) {
      // do not add a hasOwnProperty check here, it affects performance
      value = nextAttrValue[style];
      if (value !== lastAttrValue[style]) {
        domStyle.setProperty(style, value);
      }
    }

    for (style in lastAttrValue) {
      if (isNullOrUndef(nextAttrValue[style])) {
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

const patchProp = (
  prop,
  lastValue,
  nextValue,
  dom,
  hasControlledValue,
  lastVNode
) => {
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
      const value = isNullOrUndef(nextValue) ? "" : nextValue;
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
      if (syntheticEvents[prop]) {
        handleSyntheticEvent(prop, lastValue, nextValue, dom);
      } else if (prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110) {
        patchEvent(prop, lastValue, nextValue, dom);
      } else if (isNullOrUndef(nextValue)) {
        dom.removeAttribute(prop);
      } else {
        dom.setAttribute(prop, nextValue);
      }
      break;
  }
};

const mountProps = (vNode, flags, props, dom) => {
  let hasControlledValue = false;
  const isFormElement = (flags & VNodeFlags.FormElement) > 0;
  if (isFormElement) {
    hasControlledValue = isControlledFormElement(props);
    if (hasControlledValue) {
      addFormElementEventHandlers(flags, dom, props);
    }
  }
  for (const prop in props) {
    patchProp(prop, null, props[prop], dom, hasControlledValue, null);
  }
  if (isFormElement) {
    processElement(flags, vNode, dom, props, true, hasControlledValue);
  }
};

export { mountProps, patchProp };
