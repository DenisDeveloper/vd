import { VNodeFlags, ChildFlags } from "./Flags";
import {
  isNullOrUndef,
  EMPTY_OBJ,
  safeCall1,
  unmountRef,
  mountRef
} from "./common";
import { patchProp } from "./props";

const patchSingleTextChild = (lastChildren, nextChildren, parentDOM) => {
  if (lastChildren !== nextChildren) {
    if (lastChildren !== "") {
      parentDOM.firstChild.nodeValue = nextChildren;
    } else {
      setTextContent(parentDOM, nextChildren);
    }
  }
};

const patchNonKeyedChildren = (
  lastChildren,
  nextChildren,
  dom,
  lastChildrenLength,
  nextChildrenLength,
  nextNode,
  lifecycle
) => {
  const commonLength =
    lastChildrenLength > nextChildrenLength
      ? nextChildrenLength
      : lastChildrenLength;
  let i = 0;
  let nextChild;
  let lastChild;

  for (; i < commonLength; ++i) {
    nextChild = nextChildren[i];
    lastChild = lastChildren[i];

    if (nextChild.flags & VNodeFlags.InUse) {
      nextChild = nextChildren[i] = directClone(nextChild);
    }

    patch(lastChild, nextChild, dom, nextNode, lifecycle);
    lastChildren[i] = nextChild;
  }
  if (lastChildrenLength < nextChildrenLength) {
    for (i = commonLength; i < nextChildrenLength; ++i) {
      nextChild = nextChildren[i];

      if (nextChild.flags & VNodeFlags.InUse) {
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

const patchChildren = (
  lastChildFlags,
  nextChildFlags,
  lastChildren,
  nextChildren,
  parentDOM,
  nextNode,
  parentVNode,
  lifecycle
) => {
  switch (lastChildFlags) {
    case ChildFlags.HasVNodeChildren:
      switch (nextChildFlags) {
        case ChildFlags.HasVNodeChildren:
          patch(lastChildren, nextChildren, parentDOM, nextNode, lifecycle);
          break;
        case ChildFlags.HasInvalidChildren:
          remove(lastChildren, parentDOM);
          break;
        case ChildFlags.HasTextChildren:
          unmount(lastChildren);
          setTextContent(parentDOM, nextChildren);
          break;
        default:
          replaceOneVNodeWithMultipleVNodes(
            lastChildren,
            nextChildren,
            parentDOM,
            lifecycle
          );
          break;
      }
      break;
    case ChildFlags.HasInvalidChildren:
      switch (nextChildFlags) {
        case ChildFlags.HasVNodeChildren:
          mount(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle);
          break;
        case ChildFlags.HasInvalidChildren:
          break;
        case ChildFlags.HasTextChildren:
          setTextContent(parentDOM, nextChildren);
          break;
        default:
          mountArrayChildren(nextChildren, parentDOM, nextNode, lifecycle);
          break;
      }
      break;
    case ChildFlags.HasTextChildren:
      switch (nextChildFlags) {
        case ChildFlags.HasTextChildren:
          patchSingleTextChild(lastChildren, nextChildren, parentDOM);
          break;
        case ChildFlags.HasVNodeChildren:
          clearDOM(parentDOM);
          mount(nextChildren, parentDOM, nextNode, lifecycle);
          break;
        case ChildFlags.HasInvalidChildren:
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
        case ChildFlags.HasTextChildren:
          unmountAllChildren(lastChildren);
          setTextContent(parentDOM, nextChildren);
          break;
        case ChildFlags.HasVNodeChildren:
          removeAllChildren(parentDOM, parentVNode, lastChildren);
          mount(nextChildren, parentDOM, nextNode, lifecycle);
          break;
        case ChildFlags.HasInvalidChildren:
          removeAllChildren(parentDOM, parentVNode, lastChildren);
          break;
        default:
          const lastLength = lastChildren.length | 0;
          const nextLength = nextChildren.length | 0;

          // Fast path's for both algorithms
          if (lastLength === 0) {
            if (nextLength > 0) {
              mountArrayChildren(nextChildren, parentDOM, nextNode, lifecycle);
            }
          } else if (nextLength === 0) {
            removeAllChildren(parentDOM, parentVNode, lastChildren);
          } else if (
            nextChildFlags === ChildFlags.HasKeyedChildren &&
            lastChildFlags === ChildFlags.HasKeyedChildren
          ) {
            patchKeyedChildren(
              lastChildren,
              nextChildren,
              parentDOM,
              lastLength,
              nextLength,
              nextNode,
              parentVNode,
              lifecycle
            );
          } else {
            patchNonKeyedChildren(
              lastChildren,
              nextChildren,
              parentDOM,
              lastLength,
              nextLength,
              nextNode,
              lifecycle
            );
          }
          break;
      }
      break;
  }
};

const patchElement = (lastVNode, nextVNode, nextFlags, lifecycle) => {
  const dom = (nextVNode.dom = lastVNode.dom);
  const lastProps = lastVNode.props;
  const nextProps = nextVNode.props;
  let isFormElement = false;
  let hasControlledValue = false;
  let nextPropsOrEmpty;

  // inlined patchProps  -- starts --
  if (lastProps !== nextProps) {
    const lastPropsOrEmpty = lastProps || EMPTY_OBJ;
    nextPropsOrEmpty = nextProps || EMPTY_OBJ;

    if (nextPropsOrEmpty !== EMPTY_OBJ) {
      isFormElement = (nextFlags & VNodeFlags.FormElement) > 0;
      if (isFormElement) {
        hasControlledValue = isControlledFormElement(nextPropsOrEmpty);
      }

      for (const prop in nextPropsOrEmpty) {
        const lastValue = lastPropsOrEmpty[prop];
        const nextValue = nextPropsOrEmpty[prop];
        if (lastValue !== nextValue) {
          patchProp(
            prop,
            lastValue,
            nextValue,
            dom,
            hasControlledValue,
            lastVNode
          );
        }
      }
    }
    if (lastPropsOrEmpty !== EMPTY_OBJ) {
      for (const prop in lastPropsOrEmpty) {
        if (
          isNullOrUndef(nextPropsOrEmpty[prop]) &&
          !isNullOrUndef(lastPropsOrEmpty[prop])
        ) {
          patchProp(
            prop,
            lastPropsOrEmpty[prop],
            null,
            dom,
            hasControlledValue,
            lastVNode
          );
        }
      }
    }
  }
  const nextChildren = nextVNode.children;
  const nextClassName = nextVNode.className;

  // inlined patchProps  -- ends --
  if (lastVNode.className !== nextClassName) {
    if (isNullOrUndef(nextClassName)) {
      dom.removeAttribute("class");
    } else {
      dom.className = nextClassName;
    }
  }

  if (nextFlags & VNodeFlags.ContentEditable) {
    patchContentEditableChildren(dom, nextChildren);
  } else {
    patchChildren(
      lastVNode.childFlags,
      nextVNode.childFlags,
      lastVNode.children,
      nextChildren,
      dom,
      null,
      lastVNode,
      lifecycle
    );
  }

  if (isFormElement) {
    processElement(
      nextFlags,
      nextVNode,
      dom,
      nextPropsOrEmpty,
      false,
      hasControlledValue
    );
  }

  const nextRef = nextVNode.ref;
  const lastRef = lastVNode.ref;

  if (lastRef !== nextRef) {
    unmountRef(lastRef);
    mountRef(nextRef, dom, lifecycle);
  }
};

const patch = (lastVNode, nextVNode, parentDOM, nextNode, lifecycle) => {
  const nextFlags = (nextVNode.flags |= VNodeFlags.InUse);

  if (
    lastVNode.flags !== nextFlags ||
    lastVNode.type !== nextVNode.type ||
    lastVNode.key !== nextVNode.key ||
    nextFlags & VNodeFlags.ReCreate
  ) {
    if (lastVNode.flags & VNodeFlags.InUse) {
      replaceWithNewNode(lastVNode, nextVNode, parentDOM, lifecycle);
    } else {
      mount(nextVNode, parentDOM, nextNode, lifecycle);
    }
  } else if (nextFlags & VNodeFlags.Element) {
    patchElement(lastVNode, nextVNode, nextFlags, lifecycle);
  } else if (nextFlags & VNodeFlags.ComponentClass) {
    patchClassComponent(
      lastVNode,
      nextVNode,
      parentDOM,
      context,
      isSVG,
      nextNode,
      lifecycle
    );
  } else if (nextFlags & VNodeFlags.ComponentFunction) {
    patchFunctionalComponent(
      lastVNode,
      nextVNode,
      parentDOM,
      nextNode,
      lifecycle
    );
  } else if (nextFlags & VNodeFlags.Text) {
    patchText(lastVNode, nextVNode);
  } else if (nextFlags & VNodeFlags.Void) {
    nextVNode.dom = lastVNode.dom;
  } else if (nextFlags & VNodeFlags.Fragment) {
    patchFragment(lastVNode, nextVNode, parentDOM, lifecycle);
  } else {
    patchPortal(lastVNode, nextVNode, lifecycle);
  }
};

export { patch };
