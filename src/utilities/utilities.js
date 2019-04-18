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

export const setDistanceForList = (list, property) => {
  const requiresAction = _.filter(list, function(obj) {
    return obj.distance_set == false && obj.id != property.id;
  });

  _.each(requiresAction, function(obj) {
    setDistance(obj, property);
  });
};

export const setDistance = (prop1, prop2) => {
  prop1.distance = haversineDistance(
    [prop1.longitude, prop1.latitude],
    [prop2.longitude, prop2.latitude],
    true
  );
  prop1.distance_set = true;
};

export const getDistance = (prop1, prop2) => {
  return haversineDistance(
    [prop1.longitude, prop1.latitude],
    [prop2.longitude, prop2.latitude],
    true
  );
};

export const haversineDistance = function(coords1, coords2, isMiles) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  var lon1 = coords1[0];
  var lat1 = coords1[1];

  var lon2 = coords2[0];
  var lat2 = coords2[1];

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  if (isMiles) d /= 1.60934;

  return d;
};
