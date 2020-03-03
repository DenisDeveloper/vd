import { createVNode, render } from "./core";

const rb = dbs => {
  let length = dbs.length;
  let databases = [];

  for (let i = 0; i < length; i++) {
    let db = dbs[i];
    let lastSample = db.lastSample;
    let children = [
      createVNode(1, "div", "dbname", db.dbname, 16, null, null, null),
      createVNode(
        1,
        "div",
        "query-count",
        createVNode(
          1,
          "div",
          lastSample.countClassName,
          lastSample.nbQueries,
          16,
          null,
          null,
          null
        ),
        2,
        null,
        null,
        null
      )
    ];

    for (let i2 = 0; i2 < 5; i2++) {
      let query = lastSample.topFiveQueries[i2];

      children.push(
        createVNode(
          1,
          "div",
          query.elapsedClassName,
          [
            createVNode(
              1,
              "div",
              null,
              query.formatElapsed,
              16,
              null,
              null,
              null
            ),
            createVNode(
              1,
              "div",
              "popover left",
              [
                createVNode(
                  1,
                  "div",
                  "popover-content",
                  query.query,
                  16,
                  null,
                  null,
                  null
                ),
                createVNode(1, "div", "arrow", null, 1, null, null, null)
              ],
              4,
              null,
              null,
              null
            )
          ],
          4,
          null,
          null,
          null
        )
      );
    }
    databases.push(createVNode(1, "div", null, children, 4, null, null, null));
  }
  return databases;
};

// const data = rb(generateData(false).toArray());

const textContent = v =>
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

const renderApp = v => {
  return createVNode(
    1,
    "div",
    "foo1",
    createVNode(1, "div", "foo2", [textContent(v)], 4, null, null, null),
    2,
    { onClick: () => console.log("root") },
    null,
    (a, b) => console.log(a)
  );
};

// console.log(app);
let count = 0;

render(renderApp(count), elem);
setTimeout(() => {
  count++;
  render(renderApp("ffff"), elem);
}, 2000);

// setInterval(() => {
//   count++;
//   render(renderApp(count), elem);
// }, 300);
