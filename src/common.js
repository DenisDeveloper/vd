import { VNodeFlags, ChildFlags } from "./Flags";

const callAll = arrayFn => {
  for (let i = 0; i < arrayFn.length; i++) {
    arrayFn[i]();
  }
};

export function removeChild(parentDOM, childNode) {
  parentDOM.removeChild(childNode);
}

export function removeVNodeDOM(vNode, parentDOM) {
  do {
    const flags = vNode.flags;

    if (flags & VNodeFlags.DOMRef) {
      removeChild(parentDOM, vNode.dom);
      return;
    }
    const children = vNode.children;

    if (flags & VNodeFlags.ComponentClass) {
      vNode = children.$LI;
    }
    if (flags & VNodeFlags.ComponentFunction) {
      vNode = children;
    }
    if (flags & VNodeFlags.Fragment) {
      if (vNode.childFlags === ChildFlags.HasVNodeChildren) {
        vNode = children;
      } else {
        for (let i = 0, len = children.length; i < len; ++i) {
          removeVNodeDOM(children[i], parentDOM);
        }
        return;
      }
    }
  } while (vNode);
}

export function findDOMfromVNode(vNode, startEdge) {
  let flags;

  while (vNode) {
    flags = vNode.flags;

    if (flags & VNodeFlags.DOMRef) {
      return vNode.dom;
    }

    vNode = findChildVNode(vNode, startEdge, flags);
  }

  return null;
}

const mountRef = (ref, value, lifecycle) => {
  if (ref && (isFunction(ref) || ref.current !== void 0)) {
    lifecycle.push(() => {
      if (!safeCall1(ref, value) && ref.current !== void 0) {
        ref.current = value;
      }
    });
  }
};

const unmountRef = ref => {
  if (ref) {
    if (!safeCall1(ref, null) && ref.current) {
      ref.current = null;
    }
  }
};

const appendChild = (parentDOM, dom) => {
  parentDOM.appendChild(dom);
};

const insertOrAppend = (parentDOM, newNode, nextNode) => {
  if (isNull(nextNode)) {
    appendChild(parentDOM, newNode);
  } else {
    parentDOM.insertBefore(newNode, nextNode);
  }
};

const documentCreateElement = tag => {
  return document.createElement(tag);
};

const isNullOrUndef = o => {
  return o === void 0 || o === null;
};

const isFunction = o => {
  return typeof o === "function";
};

const isNull = o => {
  return o === null;
};

const isString = o => {
  return typeof o === "string";
};

const isNumber = o => {
  return typeof o === "number";
};

const setTextContent = (dom, children) => {
  dom.textContent = children;
};

const EMPTY_OBJ = {};

const normalizeEventName = name => {
  return name.substr(2).toLowerCase();
};

const safeCall1 = (method, arg1) => {
  return !!isFunction(method) && (method(arg1), true);
};

export {
  mountRef,
  unmountRef,
  safeCall1,
  normalizeEventName,
  callAll,
  documentCreateElement,
  isNullOrUndef,
  isFunction,
  setTextContent,
  isNull,
  insertOrAppend,
  appendChild,
  isString,
  isNumber,
  EMPTY_OBJ
};
