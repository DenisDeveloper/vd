import { VNodeFlags } from "./Flags";
import { mount } from "./mounting";
import { callAll, isNullOrUndef } from "./common";
import { isFunction } from "./common";
import { patch } from "./patching";

const options = {
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

const createVNode = (
  flags,
  type,
  className,
  children,
  childFlags,
  props,
  key,
  ref
) => {
  const childFlag = childFlags === void 0 ? 1 : childFlags;
  const vNode = new V(
    childFlag,
    children,
    className,
    flags,
    key,
    props,
    ref,
    type
  );

  if (options.createVNode) {
    options.createVNode(vNode);
  }

  return vNode;
};

const renderCheck = {
  v: false
};

const render = (input, parentDOM) => {
  const lifecycle = [];
  let rootInput = parentDOM.$V;
  // console.log(parentDOM);

  renderCheck.v = true;

  if (isNullOrUndef(rootInput)) {
    if (!isNullOrUndef(input)) {
      if (input.flags & VNodeFlags.InUse) {
        input = directClone(input);
      }
      mount(input, parentDOM, null, lifecycle);
      parentDOM.$V = input;
      rootInput = input;
    }
  } else {
    if (isNullOrUndef(input)) {
      remove(rootInput, parentDOM);
      parentDOM.$V = null;
    } else {
      if (input.flags & VNodeFlags.InUse) {
        input = directClone(input);
      }
      patch(rootInput, input, parentDOM, null, lifecycle);
      rootInput = parentDOM.$V = input;
    }
  }
  callAll(lifecycle);
  renderCheck.v = false;
  if (isFunction(options.renderComplete)) {
    options.renderComplete(rootInput, parentDOM);
  }
};

export { createVNode, render };
