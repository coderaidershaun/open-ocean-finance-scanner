const BASE_URL_QUOTE = "https://open-api.openocean.finance/v1/cross/quote"
const axios = require("axios");

// Test for Arbitrage
export const tryArb = async (
  inTokenSymbol: string,
  inTokenAddress: string,
  outTokenSymbol: string,
  outTokenAddress: string,
  inAmount: number,
  gasPrice: number,
  slippage: number,
  exChange: string,
  chainId: string,
  withUsd: boolean,
) => {

  // Construct initial From URL
  const urlFrom = `${BASE_URL_QUOTE}?inTokenSymbol=${inTokenSymbol}&inTokenAddress=${inTokenAddress}&outTokenSymbol=${outTokenSymbol}&outTokenAddress=${outTokenAddress}&amount=${inAmount}&gasPrice=${gasPrice}&slippage=${slippage}&exChange=${exChange}&chainId=${chainId}&withUsd=${withUsd}`

  // Define Vars
  let urlTo = "";
  let outAmountT1 = 0;
  let outAmountT2 = 0;

  // Get initial quote
  await axios.get(urlFrom).then((result: any) => {
    outAmountT1 = result.data.data.outAmount
    urlTo = `${BASE_URL_QUOTE}?inTokenSymbol=${outTokenSymbol}&inTokenAddress=${outTokenAddress}&outTokenSymbol=${inTokenSymbol}&outTokenAddress=${inTokenAddress}&amount=${outAmountT1}&gasPrice=${gasPrice}&slippage=${slippage}&exChange=${exChange}&chainId=${chainId}&withUsd=${withUsd}`
    if (result?.data?.data?.outAmount) {
    }
  }).catch((error: any) => {})
  
  // Get last quote
  if (urlTo !== "") {
    await axios.get(urlTo).then((result: any) => {
      if (result?.data?.data?.outAmount) {
        outAmountT2 = result.data.data.outAmount;
      }
    }).catch((error: any) => {})
  }

  // Return
  return {
    outAmountT1,
    outAmountT2,
  }
}
