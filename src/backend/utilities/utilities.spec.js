import { expect } from "chai";
import * as utilities from "./utilities";

describe("utilities", () => {
  it("gets a root property", () => {
    const data = {
      prop: 1
    };

    const expected = {
      prop: 1
    };

    const target = {};

    utilities.setPropertyFromObject(data, "prop", target, "prop", 0);

    expect(target).to.eql(expected);
  });

  it("populates with default value", () => {
    const data = {
      prop2: 1
    };

    const expected = {
      prop: 0
    };

    const target = {};

    utilities.setPropertyFromObject(data, "prop", target, "prop", 0);

    expect(target).to.eql(expected);
  });

  it("gets a nested property", () => {
    const data = {
      level1: {
        level2: 5
      }
    };

    const expected = {
      level1: {
        level2: 5
      }
    };

    const target = {};

    utilities.setPropertyFromObject(
      data,
      "level1.level2",
      target,
      "level1.level2",
      0
    );

    expect(target).to.eql(expected);
  });
});
