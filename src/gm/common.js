export const appendChild = (parentDOM, dom) => {
  parentDOM.appendChild(dom);
};

export const insertOrAppend = (parentDOM, newNode, nextNode) => {
  if (isNull(nextNode)) {
    appendChild(parentDOM, newNode);
  } else {
    parentDOM.insertBefore(newNode, nextNode);
  }
};

export const documentCreateElement = tag => {
  return document.createElement(tag);
};

export const isNullOrUndef = o => {
  return o === void 0 || o === null;
};

export const isFunction = o => {
  return typeof o === "function";
};

export const isNull = o => {
  return o === null;
};

export const isString = o => {
  return typeof o === "string";
};

export const isNumber = o => {
  return typeof o === "number";
};

export const setTextContent = (dom, children) => {
  dom.textContent = children;
};
