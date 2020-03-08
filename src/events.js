import { isFunction, normalizeEventName, isNull } from "./common";

const getDelegatedEventObject = v => {
  return {
    onClick: v,
    onDblClick: v,
    onFocusIn: v,
    onFocusOut: v,
    onKeyDown: v,
    onKeyPress: v,
    onKeyUp: v,
    onMouseDown: v,
    onMouseMove: v,
    onMouseUp: v,
    onTouchEnd: v,
    onTouchMove: v,
    onTouchStart: v
  };
};

const getTargetNode = event => {
  return isFunction(event.composedPath)
    ? event.composedPath()[0]
    : event.target;
};

export function unmountSyntheticEvent(name, dom) {
  const eventsObject = dom.$EV;

  if (eventsObject && eventsObject[name]) {
    if (--attachedEventCounts[name] === 0) {
      document.removeEventListener(
        normalizeEventName(name),
        attachedEvents[name]
      );
      attachedEvents[name] = null;
    }
    eventsObject[name] = null;
  }
}

const dispatchEvents = (event, isClick, name, eventData) => {
  let dom = getTargetNode(event);
  do {
    // Html Nodes can be nested fe: span inside button in that scenario browser does not handle disabled attribute on parent,
    // because the event listener is on document.body
    // Don't process clicks on disabled elements
    if (isClick && dom.disabled) {
      return;
    }
    const eventsObject = dom.$EV;

    if (eventsObject) {
      const currentEvent = eventsObject[name];

      if (currentEvent) {
        // linkEvent object
        eventData.dom = dom;
        currentEvent.event
          ? currentEvent.event(currentEvent.data, event)
          : currentEvent(event);
        if (event.cancelBubble) {
          return;
        }
      }
    }
    dom = dom.parentNode;
  } while (!isNull(dom));
};

const stopPropagation = () => {
  this.cancelBubble = true;
  if (!this.immediatePropagationStopped) {
    this.stopImmediatePropagation();
  }
};

const isDefaultPrevented = () => {
  return this.defaultPrevented;
};

const isPropagationStopped = () => {
  return this.cancelBubble;
};

const extendEventProperties = event => {
  // Event data needs to be object to save reference to currentTarget getter
  const eventData = {
    dom: {}
  };

  event.isDefaultPrevented = isDefaultPrevented;
  event.isPropagationStopped = isPropagationStopped;
  event.stopPropagation = stopPropagation;

  Object.defineProperty(event, "currentTarget", {
    configurable: true,
    get: function get() {
      return eventData.dom;
    }
  });

  return eventData;
};

const updateOrAddSyntheticEvent = (name, dom) => {
  let eventsObject = dom.$EV;

  if (!eventsObject) {
    eventsObject = dom.$EV = getDelegatedEventObject(null);
  }
  if (!eventsObject[name]) {
    if (++attachedEventCounts[name] === 1) {
      attachedEvents[name] = attachEventToDocument(name);
    }
  }

  return eventsObject;
};

const handleSyntheticEvent = (name, lastEvent, nextEvent, dom) => {
  if (isFunction(nextEvent)) {
    updateOrAddSyntheticEvent(name, dom)[name] = nextEvent;
  } else if (isLinkEventObject(nextEvent)) {
    if (isLastValueSameLinkEvent(lastEvent, nextEvent)) {
      return;
    }
    updateOrAddSyntheticEvent(name, dom)[name] = nextEvent;
  } else {
    unmountSyntheticEvent(name, dom);
  }
};

const rootEvent = name => {
  return function(event) {
    dispatchEvents(event, false, name, extendEventProperties(event));
  };
};

const rootClickEvent = name => {
  return function(event) {
    if (event.button !== 0) {
      // Firefox incorrectly triggers click event for mid/right mouse buttons.
      // This bug has been active for 17 years.
      // https://bugzilla.mozilla.org/show_bug.cgi?id=184051
      event.stopPropagation();
      return;
    }

    dispatchEvents(event, true, name, extendEventProperties(event));
  };
};

const attachEventToDocument = name => {
  const attachedEvent =
    name === "onClick" || name === "onDblClick"
      ? rootClickEvent(name)
      : rootEvent(name);

  document.addEventListener(normalizeEventName(name), attachedEvent);

  return attachedEvent;
};

const attachedEventCounts = getDelegatedEventObject(0);
const attachedEvents = getDelegatedEventObject(null);
const syntheticEvents = getDelegatedEventObject(true);

export { syntheticEvents, handleSyntheticEvent };
