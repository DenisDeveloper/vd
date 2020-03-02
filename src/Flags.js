export const VNodeFlags = {
  /* First set of bits define shape of vNode */
  HtmlElement: 1,
  ComponentUnknown: 2,
  ComponentClass: 4,
  ComponentFunction: 8,
  Text: 16,

  /* Special flags */
  SvgElement: 32,
  InputElement: 64,
  TextareaElement: 128,
  SelectElement: 256,
  Void: 512,
  Portal: 1024,
  ReCreate: 2048,
  ContentEditable: 4096,
  Fragment: 8192,
  InUse: 16384,
  ForwardRef: 32768,
  Normalized: 65536,

  /* Masks */
  ForwardRefComponent: 32776,
  FormElement: 448,
  Element: 481,
  Component: 14,
  DOMRef: 2033,
  InUseOrNormalized: 81920,
  ClearInUse: -16385,
  ComponentKnown: 12
};

export const ChildFlags = {
  UnknownChildren: 0, // When zero is passed children will be normalized
  /* Second set of bits define shape of children */
  HasInvalidChildren: 1,
  HasVNodeChildren: 1 << 1,
  HasNonKeyedChildren: 1 << 2,
  HasKeyedChildren: 1 << 3,
  HasTextChildren: 1 << 4
};
