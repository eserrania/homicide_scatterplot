const domReady = require("domready");
import { select } from "d3-selection";
import { csv, json, text } from "d3-fetch";
import "./stylesheets/main.css";
import scatterplot from "./scatterplot";

domReady(() => {
  Promise.all([
    csv("./data/homicides.csv"),
    json("./data/text.json"),
    json("./data/states.geojson"),
    json("./data/municipalities.geojson")
  ]).then(d => {
    const [data, article, states, muns] = d;
    app(data, article, states, muns);
  });
});

function app(data, article, states, muns) {
  function render() {
    scatterplot(data, article, states, muns);
  }

  render();
}
