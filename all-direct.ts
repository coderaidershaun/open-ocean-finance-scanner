import { tryArb } from "./functions/arb-functions";
import { getTokens, getTokenInfo } from "./functions/token-listing";
import { checkGasPrice } from "./functions/gas-price";
import { delay } from "./utils/timer";
import { sortString, hash } from "./utils/helpers";
import { getChainDetails } from "./utils/ocean/chain-details";
import {
  AMOUNT_IN_USD,
  SLIPPAGE,
  SLEEP_DELAY,
  EXCHANGE,
  MIN_THRESH,
} from "./utils/ocean/constants";

// Constants
const SCRIPT_NAME = "open_ocean_all";
const INCLUDE_PRINTS = false;

async function main() {
  // Select Chain from Args
  const myArgs = process.argv.slice(2);
  if (myArgs.length < 1) {
    console.log("Please Enter a Chain Id");
    process.exit(1);
  }
  const CHAIN_ID = myArgs[0];

  // Get tokens
  const tokens = await getTokens(CHAIN_ID);

  // Guard: Ensure tokens length
  if (tokens?.length < 1) return;

  // Get tokens
  const gasPrice = await checkGasPrice(CHAIN_ID);

  // Guard: Ensure Gas Price
  if (gasPrice < 0) return;

  // Get Chain Info
  const { usdPegSymbol, usdPegAddress, chainName } = getChainDetails(CHAIN_ID);

  // Loop through each base coin
  while (true) {
    for (let i = 0; i < tokens.length; i++) {
      // Get Base Token Info
      const baseName = tokens[i].name;
      const baseSymbol = tokens[i].symbol;
      const baseDecimals = tokens[i].decimals;
      const baseAddress = tokens[i].address;
      const baseImgUrl = tokens[i].icon;

      // Loop through each quote coin and compare to base
      let failUSDCount = 0;
      let failAllCount = 0;
      for (let j = 0; j < tokens.length; j++) {
        // Get Quote Token Info
        const quoteName = tokens[j].name;
        const quoteSymbol = tokens[j].symbol;
        const quoteDecimals = tokens[j].decimals;
        const quoteAddress = tokens[j].address;
        const quoteImgUrl = tokens[j].icon;

        // Guard: Ensure Base and Quote symbol are different
        if (quoteSymbol === baseSymbol) continue;

        // Get USD Equivalent of Base Token
        const { outAmountT1: startingAmount, outAmountT2: ignore } =
          await tryArb(
            usdPegSymbol,
            usdPegAddress,
            baseSymbol,
            baseAddress,
            AMOUNT_IN_USD,
            gasPrice,
            SLIPPAGE,
            EXCHANGE,
            CHAIN_ID,
            false
          );

        // Guard: Ensure Starting Amount
        if (startingAmount === 0) {
          await delay(SLEEP_DELAY);
          failUSDCount++;
          if (failUSDCount >= 5) break;
          continue;
        }

        // Check for arbitrage
        const { outAmountT1, outAmountT2 } = await tryArb(
          baseSymbol,
          baseAddress,
          quoteSymbol,
          quoteAddress,
          startingAmount,
          gasPrice,
          SLIPPAGE,
          EXCHANGE,
          CHAIN_ID,
          false
        );

        // Guard: Ensure Final Returned Amount
        if (outAmountT2 === 0) {
          await delay(SLEEP_DELAY);
          failAllCount++;
          if (failAllCount >= 5) break;
          continue;
        }

        // Upload Result
        if (outAmountT2 > startingAmount * (1 + MIN_THRESH)) {
          // Calculate arbitrage rate
          const arbRate = outAmountT2 / startingAmount - 1;

          // Create unique ID
          const hashId = hash(
            "open_ocean" + CHAIN_ID + sortString(baseAddress + quoteAddress)
          );

          // Timestamp
          const timestamp = Math.round(Date.now() / 1000);

          // Send to Database
          let arbPackage = {};

          // Structure Insert Package
          arbPackage = {
            chain_id: CHAIN_ID,
            chain_name: chainName,
            arb_type: "direct",
            token_name_t1: quoteName,
            token_symbol_t1: quoteSymbol,
            token_decimals_t1: quoteDecimals,
            token_address_t1: quoteAddress,
            token_img_url_t1: quoteImgUrl,
            exchange_t1: EXCHANGE,
            token_name_t2: baseName,
            token_symbol_t2: baseSymbol,
            token_decimals_t2: baseDecimals,
            token_address_t2: baseAddress,
            token_img_url_t2: baseImgUrl,
            exchange_t2: EXCHANGE,
            arb_real_rate: arbRate,
            hash_id: hashId,
            first_seen: timestamp,
            last_seen: timestamp,
            script_name: SCRIPT_NAME,
            starting_amount_local: startingAmount,
            status: "new",
          };

          // Print result
          console.log(arbPackage);
        }

        // Sleep
        await delay(SLEEP_DELAY);
      }
    }
  }
}

// Execute
main();
