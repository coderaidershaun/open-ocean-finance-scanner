// Get details for key coins depending on Chain Id
export const getChainDetails = (chainId: string) => {
  let chainName = "";
  let usdPegSymbol = "";
  let usdPegAddress = "";
  let baseSymbol = "";
  let baseName = "";
  let baseDecimals = 0;
  let baseUrl = "";
  let baseAddress = "";

  switch (chainId) {
    case "1":
      chainName = "eth";
      usdPegSymbol = "USDC";
      usdPegAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      baseSymbol = "WETH";
      baseName = "Wrapped ETH";
      baseAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
      baseDecimals = 18;
      baseUrl = "https://cloudstorage.openocean.finance/images/1660273405742_6830679887854216.png";
      break;
    case "56":
      chainName = "bsc";
      usdPegSymbol = "BUSD";
      usdPegAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
      baseSymbol = "WBNB";
      baseName = "Wrapped BNB";
      baseDecimals = 18;
      baseUrl = "https://ethapi.openocean.finance/logos/bsc/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png";
      baseAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
      break;
    case "137":
      chainName = "polygon";
      usdPegSymbol = "USDC";
      usdPegAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
      baseSymbol = "WMATIC";
      baseAddress = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
      baseName = "Wrapped MATIC";
      baseDecimals = 18;
      baseUrl = "https://cloudstorage.openocean.finance/images/1637561049975_1903381661429342.png";
      break;
  }

  return {
    chainName,
    usdPegSymbol,
    usdPegAddress,
    baseSymbol,
    baseName,
    baseDecimals,
    baseUrl,
    baseAddress,
  }
}