import { jest } from "@jest/globals";
import { swapCommand } from "./swap";

describe("Swap some USDC for PRT", () => {
  it("should swap 0.1 USDC to PRT successfully", async () => {
    const txid = await swapCommand({
      from: "USDC",
      to: "PRT",
      amount: 0.1,
    });
    expect(txid).toBeDefined();
  });
});
