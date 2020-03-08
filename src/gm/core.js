import * as common from "./common";

export const text = v => {
  return {
    $: false,
    v
  };
};

export const node = (t, c, p, xs) => {
  return {
    $: true,
    t,
    c,
    p,
    xs
  };
};

const mountArrayChildren = (children, dom, nextNode) => {
  for (let i = 0; i < children.length; ++i) {
    let child = children[i];

    // if (child.flags & VNodeFlags.InUse) {
    //   children[i] = child = directClone(child);
    // }
    mount(child, dom, nextNode);
  }
};

const mountText = (vNode, parentDOM, nextNode) => {
  const dom = (vNode.dom = document.createTextNode(vNode.v));

  if (!common.isNull(parentDOM)) {
    common.insertOrAppend(parentDOM, dom, nextNode);
  }
};

const mountElement = (vNode, parentDOM, nextNode) => {
  const flags = vNode.$;
  const props = vNode.p;
  const className = vNode.c;
  let children = vNode.xs;
  const childFlags = 4; // vNode.childFlags; 2 - single, 4 - array, 0 - text
  const dom = (vNode.dom = common.documentCreateElement(vNode.t));

  if (!common.isNullOrUndef(className) && className !== "") {
    dom.className = className;
  }

  if (childFlags === 0) {
    common.setTextContent(dom, children);
  } else {
    if (childFlags === 2) {
      // if (children.flags & VNodeFlags.InUse) {
      //   vNode.children = children = directClone(children);
      // }
      mount(children, dom, null);
    } else if (childFlags === 4) {
      mountArrayChildren(children, dom, null);
    }
  }

  if (!common.isNull(parentDOM)) {
    common.insertOrAppend(parentDOM, dom, nextNode);
  }

  if (!common.isNull(props)) {
    mountProps(vNode, flags, props, dom);
  }

  // mountRef(vNode.ref, dom);
};

const mount = (vNode, parentDOM, nextNode) => {
  if (vNode.$) {
    mountElement(vNode, parentDOM, nextNode);
  } else {
    mountText(vNode, parentDOM, nextNode);
  }
};

export const render = (input, parentDOM) => {
  let rootInput = parentDOM.$V;

  if (common.isNullOrUndef(rootInput)) {
    if (!common.isNullOrUndef(input)) {
      // if (input.flags & VNodeFlags.InUse) {
      //   input = directClone(input);
      // }
      mount(input, parentDOM, null);
      parentDOM.$V = input;
    }
  } else {
    if (common.isNullOrUndef(input)) {
      remove(rootInput, parentDOM);
      parentDOM.$V = null;
    } else {
      // if (input.flags & VNodeFlags.InUse) {
      //   input = directClone(input);
      // }
      patch(rootInput, input, parentDOM, null);
      parentDOM.$V = input;
    }
  }
};
