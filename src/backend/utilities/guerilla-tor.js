import extend from "extend";
import tor from "tor-request";
tor.TorControlPort.password = "giraffe";

const request = async (uri, options) => {
  var params = {};
  if (typeof options === "object") {
    extend(params, options, { uri: uri });
  } else if (typeof uri === "string") {
    extend(params, { uri: uri });
  } else {
    extend(params, uri);
  }

  return await new Promise(function(resolve) {
    tor.request(params, function(err, res, body) {
      resolve(body);
    });
  });
};

const newTorSession = async () => {
  await new Promise(function(resolve) {
    tor.newTorSession(function(err) {
      resolve();
    });
  });

  await new Promise(r => setTimeout(r, 15000));
};

export default {
  request,
  newTorSession
};
