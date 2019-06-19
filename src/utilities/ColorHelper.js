import colors from "vuetify/es5/util/colors";

export default class ColorHelper {
  static heatColorScale = [
    colors.deepPurple.base,
    colors.indigo.base,
    colors.blue.base,
    colors.teal.base,
    colors.green.base,
    colors.lime.base,
    colors.yellow.base,
    colors.orange.base,
    colors.deepOrange.base,
    colors.red.base
  ];

  static heatColorScaleString = ["deep-purple", "indigo", "blue", "teal", "green", "lime", "yellow", "orange", "deep-orange", "red"];

  static getColorScaleColor(val) {
    let idx = Math.floor(val / 10);
    if ((idx == this.heatColorScale.length) == idx) {
      idx = this.heatColorScale.length - 1;
    }
    return this.heatColorScale[idx];
  }

  static getColorScaleColorString(val) {
    let idx = Math.floor(val / 10);
    if ((idx == this.heatColorScaleString.length) == idx) {
      idx = this.heatColorScale.length - 1;
    }
    return this.heatColorScaleString[idx];
  }
}
