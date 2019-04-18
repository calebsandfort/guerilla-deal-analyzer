import _ from "lodash";
import chalk from "chalk";

export const errorHandler = err => {
  if (
    _.get(err, "networkError", null) != null &&
    _.get(err, "networkError.result", null) != null &&
    _.get(err, "networkError.result.errors", null) != null &&
    err.networkError.result.errors.length > 0
  ) {
    const errTable = [];

    err.networkError.result.errors.forEach(function(e) {
      errTable.push({
        message: e.message,
        stack_trace: e.extensions.exception.stacktrace[0]
      });

      for (let i = 1; i < e.extensions.exception.stacktrace.length; i++) {
        errTable.push({
          message: "",
          stack_trace: e.extensions.exception.stacktrace[i]
        });
      }
    });

    console.table(errTable);
  } else if (_.get(err, "message", "") != "") {
    console.log(chalk.red(_.get(err, "message", "")));
  }
};
