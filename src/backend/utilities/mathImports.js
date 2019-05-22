import * as math from "mathjs";
import accounting from "accounting-js";

const toFloat = function(val, precision) {
  return parseFloat(accounting.toFixed(val, precision));
};

math.import({
  toFloat
});
