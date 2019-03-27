import _ from "lodash";
import fs from "fs";

export const setPropertyFromObject = (
  source,
  sourcePath,
  target,
  targetPath,
  defaultValue
) => {
  let propValue = _.get(source, sourcePath, defaultValue);
  if (propValue == null) {
    propValue = defaultValue;
  }
  _.set(target, targetPath, propValue);
};

export const writeFile = (fileName, content) => {
  fs.writeFile(fileName, content, err => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log(`${fileName} saved.`);
  });
};
