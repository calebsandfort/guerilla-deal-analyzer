export default class ZipcodeData {
  zipcode = 0;
  marketTemperature = 0;
  medianHomeValue = 0;
  center = null;
  geometry = [];

  constructor(zipcode, marketTemperature, medianHomeValue, center, geometry) {
    this.zipcode = zipcode;
    this.marketTemperature = marketTemperature;
    this.medianHomeValue = medianHomeValue;
    this.center = center;
    this.geometry = geometry;
  }
}
