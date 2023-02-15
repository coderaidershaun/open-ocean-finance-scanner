import { arrayBuffer } from "stream/consumers";

export function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}


