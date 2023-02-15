const axios = require("axios");
import { BASE_URL_GAS_PRICE } from "./../utils/ocean/urls";

export const checkGasPrice = async (chainId: string) => {
  let data = -1;
  await axios.get(`${BASE_URL_GAS_PRICE}?chainId=${chainId}`)
  .then((result: any) => {
    data = result.data.data.gasPrice;
  })
  .catch(() => {setTimeout(() => {}, 60 * 5 * 1000)})
  return data;
}
