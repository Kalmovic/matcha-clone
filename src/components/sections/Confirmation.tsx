import React from "react";
import { PriceResponse } from "../../app/api/types";
import Image from "next/image";
import { POLYGON_TOKENS_BY_ADDRESS } from "../../libs/constants";
import { formatUnits } from "viem";
import {
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,
} from "wagmi";
import useSWR from "swr";
import { fetcher } from "./Swap";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "../../libs/libs";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

function Confirmation({ data }: { data: PriceResponse }) {
  const sellTokenInfo =
    POLYGON_TOKENS_BY_ADDRESS[data.sellTokenAddress.toLowerCase()];

  const buyTokenInfo =
    POLYGON_TOKENS_BY_ADDRESS[data.buyTokenAddress.toLowerCase()];
  const { address } = useAccount();
  const {
    isLoading: isLoadingPrice,
    data: quote,
    error,
  } = useSWR(
    [
      "/api/quote",
      {
        sellToken: data.sellTokenAddress,
        buyToken: data.buyTokenAddress,
        sellAmount: data.sellAmount,
        // buyAmount: TODO if we want to support buys,
        takerAddress: address,
        // feeRecipient: FEE_RECIPIENT,
        // buyTokenPercentageFee: AFFILIATE_FEE,
      },
    ],
    fetcher,
    {
      onError: (error) => {
        console.log("error", error);
      },
    }
  );
  const { config } = usePrepareSendTransaction({
    to: quote?.to, // The address of the contract to send call data to, in this case 0x Exchange Proxy
    data: quote?.data, // The call data required to be sent to the to contract address.
  });

  console.log("quote", quote);
  const isQuoteInvalid = quote?.code === 105;

  const { sendTransaction } = useSendTransaction(config);

  return (
    <div>
      <h1 className={cn("flex space-x-2 mb-4 text-3xl font-semibold")}>
        Review
      </h1>
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="p-4 rounded-sm mb-3">
            <div className="text-xl mb-2">You pay</div>
            <div className="flex items-center text-lg">
              <Image
                alt={sellTokenInfo.symbol}
                className="h-9 w-9 mr-2 rounded-md"
                src={sellTokenInfo.logoURI}
                width={32}
                height={32}
              />
              {isLoadingPrice || !!error || !quote || isQuoteInvalid ? (
                <Skeleton className="w-12" color="bg-slate-200" />
              ) : (
                <span>
                  {!isQuoteInvalid &&
                    formatUnits(quote?.sellAmount, sellTokenInfo.decimals)}
                </span>
              )}
              <div className="ml-2">{sellTokenInfo.symbol}</div>
            </div>
          </div>
          <Separator />
          <div className="p-4 rounded-sm mb-3">
            <div className="text-xl mb-2">You receive</div>
            <div className="flex items-center text-lg">
              <Image
                alt={
                  POLYGON_TOKENS_BY_ADDRESS[data.buyTokenAddress.toLowerCase()]
                    .symbol
                }
                className="h-9 w-9 mr-2 rounded-md"
                width={32}
                height={32}
                src={
                  POLYGON_TOKENS_BY_ADDRESS[data.buyTokenAddress.toLowerCase()]
                    .logoURI
                }
              />
              {isLoadingPrice || !!error || !quote || isQuoteInvalid ? (
                <Skeleton className="w-12" color="bg-slate-200" />
              ) : (
                <span>
                  {!isQuoteInvalid &&
                    formatUnits(quote?.buyAmount, buyTokenInfo.decimals)}
                </span>
              )}
              <div className="ml-2">{buyTokenInfo.symbol}</div>
            </div>
          </div>

          {/* <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-sm mb-3">
              <div className="text-slate-400">
                {quote && quote.grossBuyAmount
                  ? "Affiliate Fee: " +
                    Number(
                      formatUnits(
                        BigInt(quote.grossBuyAmount),
                        buyTokenInfo.decimals
                      )
                    ) *
                      AFFILIATE_FEE +
                    " " +
                    buyTokenInfo.symbol
                  : null}
              </div>
            </div> */}

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 flex justify-center gap-1"
            // disabled={/* your conditions here */}
            onClick={() => sendTransaction?.()}
          >
            {isLoadingPrice ? (
              <div>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </div>
            ) : isQuoteInvalid ? (
              <span>
                {/* <span className="mr-2">Error</span> */}
                <span className="">{quote.values.message}</span>
              </span>
            ) : (
              <span>Place Order</span>
            )}
          </Button>
        </CardContent>
      </Card>
      {/* </Form> */}
    </div>
  );
}

export default Confirmation;
