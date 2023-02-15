const axios = require("axios");
import { BASE_URL_TOKEN_LIST } from "./../utils/ocean/urls";

export const getTokens = async (chainId: string) => {
  let data: any[] = [];
  await axios.get(`${BASE_URL_TOKEN_LIST}?chainId=${chainId}`)
  .then((result: any) => {
    data = result.data.data;
  })
  .catch(() => {setTimeout(() => {}, 60 * 5 * 1000)})
  return data;
}

export function getTokenInfo(arr: any[], searchAddress: string) {
  for (let i=0; i<arr.length; i++) {
    // console.log(arr[i].address, searchAddress)
    if (arr[i].address === searchAddress) {
      console.log("YES")
      return arr[i].address;
    }
  }
}
