import { toggleSelectAll, toggleSelection } from "./shoppingListLogic";

describe("toggleSelection", () => {
  it("adds an id that isn't selected", () => {
    expect(toggleSelection(new Set(), "a")).toEqual(new Set(["a"]));
  });

  it("removes an id that's already selected", () => {
    expect(toggleSelection(new Set(["a", "b"]), "a")).toEqual(new Set(["b"]));
  });

  it("does not mutate the original set", () => {
    const original = new Set(["a"]);
    toggleSelection(original, "b");
    expect(original).toEqual(new Set(["a"]));
  });
});

describe("toggleSelectAll", () => {
  it("selects every id when none are selected", () => {
    expect(toggleSelectAll(["a", "b", "c"], new Set())).toEqual(new Set(["a", "b", "c"]));
  });

  it("selects every id when only some are selected", () => {
    expect(toggleSelectAll(["a", "b", "c"], new Set(["a"]))).toEqual(new Set(["a", "b", "c"]));
  });

  it("deselects all when every id is already selected", () => {
    expect(toggleSelectAll(["a", "b"], new Set(["a", "b"]))).toEqual(new Set());
  });

  it("returns an empty set when there are no ids", () => {
    expect(toggleSelectAll([], new Set())).toEqual(new Set());
  });
});
