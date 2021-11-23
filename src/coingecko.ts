import axios from "axios";
import http from "http";
import https from "https";

interface SimplePriceResponse {
  [coinId: string]: {
    [vs_currentcy: string]: number;
  };
}

const coingeckoAPI = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 30_000,
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  maxRedirects: 10,
  maxContentLength: 50 * 1024 * 1024, // 50MB
});

export async function getTokenPrice(coinID: string) {
  const result = await coingeckoAPI.get<SimplePriceResponse>("/simple/price", {
    params: {
      ids: coinID,
      vs_currencies: "usd",
    },
  });
  return result.data[coinID]["usd"];
}
