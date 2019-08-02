import qs from "qs";
import rp from "request-promise";
import _ from "lodash";

//key: "AIzaSyBRVBsMsXWrLl0OKH3lu3dsmCE8UNc_jDM",
//cx: 008770600537533351055:8fvrugm6whs

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

export const findPortlandMapsUrl = async address => {
  let portlandMapsUrl = "";

  const params = {
    key: "AIzaSyBRVBsMsXWrLl0OKH3lu3dsmCE8UNc_jDM",
    cx: "008770600537533351055:8fvrugm6whs",
    num: 1,
    q: address.replaceAll(",", "").replaceAll(".", "")
  };

  const url = "https://www.googleapis.com/customsearch/v1?" + qs.stringify(params);

  const options = {
    uri: url
    //headers: {
    //   "user-agent":
    //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    // }
  };

  const html = await rp(options);

  const result = JSON.parse(html);
  const items = _.get(result, "items", []);

  if (items.length > 0) {
    portlandMapsUrl = items[0].link;
  }

  return portlandMapsUrl;
};
