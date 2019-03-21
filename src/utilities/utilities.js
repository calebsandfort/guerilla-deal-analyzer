import _ from 'lodash';
import fs from 'fs';

export const setPropertyFromObject = (source, sourcePath, target, targetPath, defaultValue) => {
    _.set(target, targetPath, _.get(source, sourcePath, defaultValue));
};

export const writeFile = (fileName, content) => {
  fs.writeFile(fileName, content, (err => {
      // throws an error, you could also catch it here
      if (err) throw err;

      // success case, the file was saved
      console.log(`${fileName} saved.`);
  }));
};