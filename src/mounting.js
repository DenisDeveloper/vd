import { VNodeFlags, ChildFlags } from "./Flags";
import {
  documentCreateElement,
  isNullOrUndef,
  setTextContent,
  isNull,
  insertOrAppend,
  isString,
  isFunction,
  safeCall1,
  mountRef
} from "./common";

import { directClone } from "./core";

import { mountProps } from "./props";

const mountArrayChildren = (children, dom, nextNode, lifecycle) => {
  for (let i = 0; i < children.length; ++i) {
    let child = children[i];

    if (child.flags & VNodeFlags.InUse) {
      children[i] = child = directClone(child);
    }
    mount(child, dom, nextNode, lifecycle);
  }
};

const mountText = (vNode, parentDOM, nextNode) => {
  const dom = (vNode.dom = document.createTextNode(vNode.children));

  if (!isNull(parentDOM)) {
    insertOrAppend(parentDOM, dom, nextNode);
  }
};

const mountElement = (vNode, parentDOM, nextNode, lifecycle) => {
  // console.log(vNode.flags);
  const flags = vNode.flags;
  const props = vNode.props;
  const className = vNode.className;
  let children = vNode.children;
  const childFlags = vNode.childFlags;
  const dom = (vNode.dom = documentCreateElement(vNode.type));

  if (!isNullOrUndef(className) && className !== "") {
    dom.className = className;
  }

  if (childFlags === ChildFlags.HasTextChildren) {
    setTextContent(dom, children);
  } else if (childFlags !== ChildFlags.HasInvalidChildren) {
    if (childFlags === ChildFlags.HasVNodeChildren) {
      if (children.flags & VNodeFlags.InUse) {
        vNode.children = children = directClone(children);
      }
      mount(children, dom, null, lifecycle);
    } else if (
      childFlags === ChildFlags.HasKeyedChildren ||
      childFlags === ChildFlags.HasNonKeyedChildren
    ) {
      mountArrayChildren(children, dom, null, lifecycle);
    }
  }

  if (!isNull(parentDOM)) {
    insertOrAppend(parentDOM, dom, nextNode);
  }

  if (!isNull(props)) {
    mountProps(vNode, flags, props, dom);
  }

  mountRef(vNode.ref, dom, lifecycle);
};

const mount = (vNode, parentDOM, nextNode, lifecycle) => {
  const flags = (vNode.flags |= VNodeFlags.InUse);

  if (flags & VNodeFlags.Element) {
    mountElement(vNode, parentDOM, nextNode, lifecycle);
  } else if (flags & VNodeFlags.Void || flags & VNodeFlags.Text) {
    mountText(vNode, parentDOM, nextNode);
  }
};

export { mount };
