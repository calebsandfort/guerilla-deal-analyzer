import _ from "lodash";
import cTable from "console.table";
import chalk from "chalk";

export const formatValidationError = function(e) {
  const formatted = false;

  const message = _.get(e, "message", "");

  if (message == "Validation error") {
    const errors = _.get(e, "extensions.exception.errors", []);
    if (errors) {
      const errorsTable = _.map(errors, function(err) {
        return {
          message: err.message,
          value: err.value
        };
      });

      console.log("\n");
      console.table(chalk.red(message), errorsTable);
      return true;
    }
  }

  return formatted;
};

export const logInfo = function(caller, rows, color = "") {
  let colorFunc = chalk.black;

  if (color == "green") {
    colorFunc = chalk.green;
  } else if (color == "red") {
    colorFunc = chalk.red;
  } else if (color == "magenta") {
    colorFunc = chalk.magenta;
  }

  console.log("\n");
  console.table(colorFunc(caller), rows);
};
