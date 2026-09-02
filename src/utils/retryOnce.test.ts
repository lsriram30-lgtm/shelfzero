import { retryOnce } from "./retryOnce";

describe("retryOnce", () => {
  it("returns the result on first success without retrying", async () => {
    const fn = jest.fn().mockResolvedValue("ok");
    const result = await retryOnce(fn);
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries exactly once after a failure and returns the retry's result", async () => {
    const fn = jest.fn().mockRejectedValueOnce(new Error("fail")).mockResolvedValueOnce("ok");
    const result = await retryOnce(fn);
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throws the second failure if the retry also fails", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("first"))
      .mockRejectedValueOnce(new Error("second"));
    await expect(retryOnce(fn)).rejects.toThrow("second");
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
