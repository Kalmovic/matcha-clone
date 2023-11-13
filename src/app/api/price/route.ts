import qs from "qs";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const queryString = qs.stringify(qs.parse(req.url.split("?")[1]));
  const response = await fetch(
    `https://polygon.api.0x.org/swap/v1/price?${queryString}`,
    {
      next: {
        revalidate: 120,
      },
      headers: {
        "0x-api-key": "c9f13c84-9fcb-4f42-aa30-a11b0d016aa5", // TODO: move to env
      },
    }
  );
  const data = await response.json();
  return NextResponse.json(data);
}
