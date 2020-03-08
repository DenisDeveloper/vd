import { createVNode, render } from "./core";
import * as GM from "./gm/core";

const txt = v =>
  createVNode(
    16,
    "div",
    "text",
    v,
    16,
    { style: "width: 40px;", onClick: () => console.log("child") },
    null,
    null
  );

const div = v =>
  createVNode(
    1,
    "div",
    "text",
    v,
    16,
    { style: "width: 40px;", onClick: () => console.log("child") },
    null,
    null
  );

const elem = document.getElementById("root");

const foo1 = (a, b) =>
  createVNode(1, "div", "foo1_2", [a, b, b, b], 4, null, null, null);
const foo2 = (a, b) => {
  return createVNode(1, "div", "foo2_2", [b, a], 4, null, null, null);
};

const renderApp = v => {
  return createVNode(
    1,
    "div",
    "foo1",
    v,
    2,
    { onClick: () => console.log("root") },
    null,
    null
  );
};

// console.log(app);
let count = 0;

render(renderApp(foo1(txt("a"), div("b"))), elem);
setTimeout(() => {
  count++;
  render(renderApp(foo2(txt("a"), div("b"))), elem);
}, 2000);

// setInterval(() => {
//   count++;
//   render(renderApp(count), elem);
// }, 300);

const elem2 = document.getElementById("root2");
const app = v => GM.node("div", "gm-foo", null, [v]);
const gmTxt = v => GM.text("gm_text");
const gmDiv = v => GM.node("h3", null, null, [v]);

// todo: patching
GM.render(app(gmDiv(gmTxt())), elem2);
