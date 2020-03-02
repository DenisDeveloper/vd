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

const textContent = createVNode(
  1,
  "div",
  "text",
  "dddddd",
  16,
  null,
  null,
  null
);

const elem = document.getElementById("root");

const app = createVNode(
  1,
  "div",
  "foo1",
  createVNode(1, "div", "foo2", [textContent], 4, null, null, null),
  2,
  null,
  null,
  null
);

console.log(app);

render(app, elem);
