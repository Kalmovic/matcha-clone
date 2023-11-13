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
        "0x-api-key": process.env.NEXT_PUBLIC_0X_API_KEY as string,
      },
    }
  );
  const data = await response.json();
  return NextResponse.json(data);
}
