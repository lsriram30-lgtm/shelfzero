import { toggleValue } from "./toggleValue";

describe("toggleValue", () => {
  it("adds a value that isn't in the list", () => {
    expect(toggleValue(["Italian"], "Thai")).toEqual(["Italian", "Thai"]);
  });

  it("removes a value that's already in the list", () => {
    expect(toggleValue(["Italian", "Thai"], "Italian")).toEqual(["Thai"]);
  });

  it("adds to an empty list", () => {
    expect(toggleValue([], "Mexican")).toEqual(["Mexican"]);
  });

  it("removes the last item, leaving an empty list", () => {
    expect(toggleValue(["Mexican"], "Mexican")).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const list = ["Italian"];
    toggleValue(list, "Thai");
    expect(list).toEqual(["Italian"]);
  });
});
