import { VNodeFlags, ChildFlags } from "./Flags";
import { unmountRef, isNull, removeVNodeDOM } from "./common";
import { syntheticEvents, unmountSyntheticEvent } from "./events";

export function remove(vNode, parentDOM) {
  unmount(vNode);
  removeVNodeDOM(vNode, parentDOM);
}

export function unmount(vNode) {
  const flags = vNode.flags;
  const children = vNode.children;
  let ref;

  if (flags & VNodeFlags.Element) {
    ref = vNode.ref;
    const props = vNode.props;

    unmountRef(ref);

    const childFlags = vNode.childFlags;

    if (!isNull(props)) {
      const keys = Object.keys(props);

      for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i];
        if (syntheticEvents[key]) {
          unmountSyntheticEvent(key, vNode.dom);
        }
      }
    }

    if (childFlags & ChildFlags.MultipleChildren) {
      unmountAllChildren(children);
    } else if (childFlags === ChildFlags.HasVNodeChildren) {
      unmount(children);
    }
  } else if (children) {
    if (flags & VNodeFlags.ComponentClass) {
      if (isFunction(children.componentWillUnmount)) {
        children.componentWillUnmount();
      }
      unmountRef(vNode.ref);
      children.$UN = true;
      unmount(children.$LI);
    } else if (flags & VNodeFlags.ComponentFunction) {
      ref = vNode.ref;

      if (!isNullOrUndef(ref) && isFunction(ref.onComponentWillUnmount)) {
        ref.onComponentWillUnmount(
          findDOMfromVNode(vNode, true),
          vNode.props || EMPTY_OBJ
        );
      }

      unmount(children);
    } else if (flags & VNodeFlags.Portal) {
      remove(children, vNode.ref);
    } else if (flags & VNodeFlags.Fragment) {
      if (vNode.childFlags & ChildFlags.MultipleChildren) {
        unmountAllChildren(children);
      }
    }
  }
}

export function unmountAllChildren(children) {
  for (let i = 0, len = children.length; i < len; ++i) {
    unmount(children[i]);
  }
}
