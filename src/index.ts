import "dotenv/config";
import Duration from "@icholy/duration";
import { Command } from "commander";

import { swapCommand } from "./commands/swap";
import { logger } from "./logger";
import { updateTokenAccounts } from "./accounts";
import { TOKENS } from "./constants";
import { keypair } from "./connection";

const cli = new Command();

cli.version("1.0.0");

cli
  .command("twap")
  .description("swap")
  .requiredOption("--interval <interval>")
  .requiredOption("--from <from>")
  .requiredOption("--to <to>")
  .requiredOption("--amount <amount>")
  .option("--transferAddress <transferAddress>")
  .option("--transferThreshold <transferThreshold>")
  .option("--priceThreshold <priceThreshold>")
  .option("--onlyDirectRoutes", "swap without any intermediary paths", true)
  .option("--dryRun", "dry run", false)
  .action(
    async (options: {
      interval: string;
      from: string;
      to: string;
      amount: number;
      transferAddress?: string;
      transferThreshold?: string;
      priceThreshold?: string;
      dryRun: boolean;
      onlyDirectRoutes: boolean,
    }) => {
      logger.info(`using wallet ${keypair.publicKey}`);

      logger.info(`update tokens accounts...`);
      await updateTokenAccounts(
        keypair.publicKey,
        Object.values(TOKENS).map((i) => i.mint)
      );

      logger.info(
        `twap swap of ${options.amount} from ${options.from} to ${options.to} every ${options.interval} ready`
      );

      const runSwap = () => {
        logger.info(`swap starting...`);
        swapCommand(options)
          .then((txId) => {
            if (txId) {
              logger.info(`swap success: ${txId}`);
            }
          })
          .catch((error) => {
            logger.error(`swap failed: ${error}`);
          });
      };

      // Do a first swap at start-up
      runSwap();
      setInterval(runSwap, new Duration(options.interval).milliseconds());
    }
  );

cli.parse(process.argv);
cli.showHelpAfterError();
