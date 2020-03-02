import { VNodeFlags, ChildFlags } from "./Flags";
import {
  documentCreateElement,
  isNullOrUndef,
  setTextContent,
  isNull,
  insertOrAppend,
  isString,
  isFunction
} from "./common";

const mountRef = (ref, value, lifecycle) => {
  if (ref && (isFunction(ref) || ref.current !== void 0)) {
    lifecycle.push(() => {
      if (!safeCall1(ref, value) && ref.current !== void 0) {
        ref.current = value;
      }
    });
  }
};

const mountArrayChildren = (children, dom, nextNode, lifecycle) => {
  for (let i = 0; i < children.length; ++i) {
    let child = children[i];

    if (child.flags & VNodeFlags.InUse) {
      children[i] = child = directClone(child);
    }
    mount(child, dom, nextNode, lifecycle);
  }
};

const mountElement = (vNode, parentDOM, nextNode, lifecycle) => {
  // console.log(`vNode: ${vNode.className}, nextNode: ${nextNode}`);
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
    mountProps(vNode, flags, props, dom, isSVG);
  }

  if (process.env.NODE_ENV !== "production") {
    if (isString(vNode.ref)) {
      throwError(
        'string "refs" are not supported in Inferno 1.0. Use callback ref or Inferno.createRef() API instead.'
      );
    }
  }
  mountRef(vNode.ref, dom, lifecycle);
};

const mount = (vNode, parentDOM, nextNode, lifecycle) => {
  const flags = (vNode.flags |= VNodeFlags.InUse);

  if (flags & VNodeFlags.Element) {
    mountElement(vNode, parentDOM, nextNode, lifecycle);
  } else if (flags & VNodeFlags.ComponentClass) {
    mountClassComponent(vNode, parentDOM, nextNode, lifecycle);
  } else if (flags & VNodeFlags.ComponentFunction) {
    mountFunctionalComponent(vNode, parentDOM, nextNode, lifecycle);
    mountFunctionalComponentCallbacks(vNode, lifecycle);
  } else if (flags & VNodeFlags.Void || flags & VNodeFlags.Text) {
    mountText(vNode, parentDOM, nextNode);
  } else if (flags & VNodeFlags.Fragment) {
    mountFragment(vNode, parentDOM, nextNode, lifecycle);
  } else if (flags & VNodeFlags.Portal) {
    mountPortal(vNode, parentDOM, nextNode, lifecycle);
  }
};

export { mount };
