const callAll = arrayFn => {
  for (let i = 0; i < arrayFn.length; i++) {
    arrayFn[i]();
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

export {
  callAll,
  documentCreateElement,
  isNullOrUndef,
  isFunction,
  setTextContent,
  isNull,
  insertOrAppend,
  appendChild,
  isString,
  isNumber
};
