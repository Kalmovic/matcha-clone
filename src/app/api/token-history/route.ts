import qs from "qs";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import {
  POLYGON_TOKENS_BY_SYMBOL,
  TIME_PERIODS_BY_DAYS,
} from "../../../libs/constants";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const parsed = qs.parse(req.url.split("?")[1]);
  const basedToken = POLYGON_TOKENS_BY_SYMBOL[
    parsed.fsym?.toString().toLocaleLowerCase() as string
  ].id as string;
  const vsToken = parsed.vs_currency?.toString();
  const days = parsed.days?.toString() as string;
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${basedToken}/market_chart?vs_currency=${vsToken}&days=${days}&interval=${TIME_PERIODS_BY_DAYS[days].interval}`,
    {
      next: {
        revalidate: 120,
      },
    }
  );
  const data = await response.json();

  return NextResponse.json(data);
}
