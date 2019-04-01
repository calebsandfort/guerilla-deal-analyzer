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

export const setKeywordsForList = (list, textPath, search_keywords) => {
  const requiresAction = _.filter(list, function(obj) {
    return obj.keywords_set == false;
  });

  _.each(requiresAction, function(obj) {
    setKeywords(obj, textPath, search_keywords);
  });
};

export const setKeywords = (obj, textPath, search_keywords) => {
  const lowerCaseDescription = obj[textPath].toLowerCase();
  obj.keywords = _.filter(search_keywords, function(skw) {
    return lowerCaseDescription.indexOf(skw.toLowerCase()) > -1;
  });
  obj.keywords_count = obj.keywords.length;
  obj.keywords_set = true;
};
