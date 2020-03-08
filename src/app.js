const domReady = require("domready");
import { select } from "d3-selection";
import { csv, json } from "d3-fetch";
import "./stylesheets/main.css";
import scatterplot from "./scatterplot";

domReady(() => {
  Promise.all([csv("./data/homicides.csv"), json("./data/text.json")]).then(
    d => {
      const [data, article] = d;
      app(data, article);
    }
  );
});

function app(data, article) {
  function render() {
    scatterplot(data, article);
  }

  render();
}
