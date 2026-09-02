import { ApiError } from "../api/client";
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

  it("does not retry a 429 - the backend is already telling us it's rate-limited", async () => {
    const error = new ApiError("Too many requests", 429);
    const fn = jest.fn().mockRejectedValue(error);
    await expect(retryOnce(fn)).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("still retries a non-429 ApiError, e.g. a 504", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new ApiError("Timed out", 504))
      .mockResolvedValueOnce("ok");
    const result = await retryOnce(fn);
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
