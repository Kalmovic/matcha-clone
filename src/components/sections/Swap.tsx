import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronsUpDown, Loader2, ArrowDown } from "lucide-react";
import { cn } from "../../libs/libs";
import React, { useEffect } from "react";
import Image from "next/image";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { POLYGON_TOKENS, POLYGON_TOKENS_BY_SYMBOL } from "../../libs/constants";
import useSWR from "swr";
import { formatUnits, parseUnits } from "viem";
import QueryString from "qs";
import { PriceResponse } from "../../app/api/types";
import { useAccount } from "wagmi";
import { Separator } from "../ui/separator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "../ui/card";

type Token = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

const formSchema = z.object({
  sellAmount: z.string().refine(
    (data) => {
      const numberValue = parseFloat(data);
      return !isNaN(numberValue) && numberValue > 0;
    },
    {
      message: "Sell amount must be a positive number as a string",
    }
  ),
  buyAmount: z.string().refine(
    (data) => {
      const numberValue = parseFloat(data);
      return !isNaN(numberValue) && numberValue > 0;
    },
    {
      message: "Buy amount must be a positive number as a string",
    }
  ),
  sellToken: z.object({
    chainId: z.number(),
    address: z.string(),
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
    logoURI: z.string(),
  }),
  buyToken: z.object({
    chainId: z.number(),
    address: z.string(),
    name: z.string(),
    symbol: z.string(),
    decimals: z.number(),
    logoURI: z.string(),
  }),
});

interface PriceRequestParams {
  sellToken: string;
  buyToken: string;
  buyAmount?: string;
  sellAmount?: string;
  takerAddress?: string;
}

export const fetcher = ([endpoint, params]: [string, PriceRequestParams]) => {
  const { sellAmount, buyAmount } = params;

  if (!sellAmount && !buyAmount) return;
  const query = QueryString.stringify(params);

  return fetch(`${endpoint}?${query}`).then((res) => res.json());
};

function Swap({ onReady }: { onReady: (data: PriceResponse) => void }) {
  const { address } = useAccount();
  const [tradeDirection, setTradeDirection] = React.useState("sell");
  const [isLoading, setIsLoading] = React.useState(false);
  const [swapPrice, setSwapPrice] = React.useState({});
  const [openFromTokens, setOpenFromTokens] = React.useState(false);
  const [openToTokens, setOpenToTokens] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  const fsym = searchParams.get("fsym");
  const tsym = searchParams.get("tsym");
  const defaultSellToken = POLYGON_TOKENS[0];
  const defaultBuyToken = POLYGON_TOKENS[1];
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sellAmount: "",
      buyAmount: "",
      sellToken: fsym
        ? POLYGON_TOKENS_BY_SYMBOL[fsym.toLocaleLowerCase()]
        : defaultSellToken,
      buyToken: tsym
        ? POLYGON_TOKENS_BY_SYMBOL[tsym.toLocaleLowerCase()]
        : defaultBuyToken,
    },
  });

  const sellAmount = form.watch("sellAmount");
  const buyAmount = form.watch("buyAmount");
  const sellToken = form.watch("sellToken");
  const buyToken = form.watch("buyToken");

  useEffect(() => {
    if (!fsym && !tsym) {
      router.replace(
        `${pathname}?${createQueryString(
          "fsym",
          defaultSellToken.symbol
        )}&${createQueryString("tsym", defaultBuyToken.symbol)}`
      );
    }
  }, [
    fsym,
    tsym,
    defaultSellToken.symbol,
    defaultBuyToken.symbol,
    pathname,
    createQueryString,
    router,
  ]);

  // React.useEffect(() => {
  //   if (fsym === defaultSellToken.symbol && tsym === defaultBuyToken.symbol) {
  //     return;
  //   }
  //   if (!fsym && !tsym) {
  //     form.setValue(
  //       "sellToken",
  //       POLYGON_TOKENS_BY_SYMBOL[defaultSellToken.symbol.toLocaleLowerCase()]
  //     );
  //     form.setValue(
  //       "buyToken",
  //       POLYGON_TOKENS_BY_SYMBOL[defaultBuyToken.symbol.toLocaleLowerCase()]
  //     );
  // router.replace(
  //   `${pathname}?${createQueryString("fsym", defaultSellToken.symbol)}${
  //     buyToken.symbol
  //       ? `&${createQueryString("tsym", defaultBuyToken.symbol)}`
  //       : ""
  //   }`
  // );
  //   }
  // }, [fsym, tsym, defaultSellToken.symbol, defaultBuyToken.symbol]);

  const sellPolygonToken =
    POLYGON_TOKENS_BY_SYMBOL[sellToken?.symbol.toLowerCase()];
  const buyPolygonToken =
    POLYGON_TOKENS_BY_SYMBOL[buyToken?.symbol.toLowerCase()];

  const parsedSellAmount =
    sellAmount && tradeDirection === "sell"
      ? // sellAmount
        parseUnits(
          `${Number(sellAmount)}`,
          sellPolygonToken?.decimals
        ).toString()
      : undefined;

  const parsedBuyAmount =
    buyAmount && tradeDirection === "buy"
      ? // buyAmount
        parseUnits(`${Number(buyAmount)}`, buyPolygonToken?.decimals).toString()
      : undefined;

  const { isLoading: isLoadingPrice, data: priceData } = useSWR(
    [
      "/api/price",
      {
        buyAmount: parsedBuyAmount,
        takerAddress: address,
        sellToken: sellPolygonToken?.address,
        buyToken: buyPolygonToken?.address,
        sellAmount: parsedSellAmount,
        // feeRecipient: 0,
        // buyTokenPercentageFee: 0,
      },
    ],
    fetcher,
    {
      onSuccess: (data) => {
        setSwapPrice(data);
        if (tradeDirection === "sell") {
          form.setValue(
            "buyAmount",
            formatUnits(data.buyAmount, buyToken.decimals)
          );
        } else {
          form.setValue(
            "sellAmount",
            formatUnits(data.sellAmount, sellToken.decimals)
          );
        }
      },
    }
  );

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <div>
      <h1 className={cn("flex space-x-2 mb-4 text-3xl font-semibold")}>Swap</h1>
      <Card>
        <CardContent className="flex flex-col space-y-4 p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className={cn("flex-col space-x-0 mt-auto space-y-4")}>
                <FormField
                  control={form.control}
                  name="sellToken"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full space-y-4">
                      <FormLabel>Sell</FormLabel>
                      <Popover
                        open={openFromTokens}
                        onOpenChange={setOpenFromTokens}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[150px] justify-between rounded-full",
                                !field.value.symbol && "text-muted-foreground"
                              )}
                            >
                              {field.value.symbol ? (
                                <div
                                  className={cn(
                                    "flex items-center space-x-2",
                                    !field.value.symbol &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  <Image
                                    className="mr-2"
                                    src={field.value.logoURI as string}
                                    alt="token image"
                                    width={20}
                                    height={20}
                                  />
                                  {field.value.symbol}
                                </div>
                              ) : (
                                "Select a token"
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[180px] p-0">
                          <Command>
                            <CommandInput placeholder="Search token..." />
                            <CommandEmpty>No token found.</CommandEmpty>
                            <CommandGroup>
                              {POLYGON_TOKENS.map((token) => (
                                <CommandItem
                                  value={token.symbol}
                                  key={token.symbol}
                                  disabled={tsym === token.symbol}
                                  onSelect={() => {
                                    form.setValue("sellToken", token);
                                    router.replace(
                                      `${pathname}?${createQueryString(
                                        "fsym",
                                        token.symbol
                                      )}`
                                    );
                                    setOpenFromTokens(false);
                                  }}
                                  className={cn(
                                    "flex items-center space-x-2",
                                    token.symbol === field.value.symbol &&
                                      "bg-gray-100",
                                    tsym === token.symbol && "opacity-50"
                                  )}
                                >
                                  <Image
                                    className="mr-2"
                                    src={token.logoURI}
                                    alt="token image"
                                    width={20}
                                    height={20}
                                  />
                                  <div
                                    className={cn("flex flex-col space-x-2")}
                                  >
                                    {token.symbol}
                                    <span
                                      className={cn(
                                        "text-xs text-muted-foreground"
                                      )}
                                    >
                                      {token.name.length > 20
                                        ? token.name.slice(0, 20) + "..."
                                        : token.name}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sellAmount"
                  render={({ field }) => (
                    <FormItem className="ml-0">
                      <FormControl>
                        <Input
                          placeholder="0.0"
                          {...field}
                          className="border-none text-3xl space-y-2"
                          onChange={(e) => {
                            form.setValue("sellAmount", e.target.value);
                            tradeDirection === "buy"
                              ? setTradeDirection("sell")
                              : null;
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col items-center justify-center m-0">
                <Separator className="mt-8" />
                <ArrowDown
                  className={cn(
                    "h-10 w-10 space-y-0 mt-0 mx-auto border rounded-full p-2 relative bottom-5 bg-white",
                    isLoadingPrice && "animate-bounce"
                  )}
                />
              </div>
              <div className={cn("flex flex-col space-x-0 space-y-4")}>
                <FormField
                  control={form.control}
                  name="buyToken"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full space-y-4">
                      <FormLabel>Buy</FormLabel>
                      <Popover
                        open={openToTokens}
                        onOpenChange={setOpenToTokens}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[150px] justify-between rounded-full",
                                !field.value.symbol && "text-muted-foreground"
                              )}
                            >
                              {field.value.symbol ? (
                                <div
                                  className={cn(
                                    "flex items-center space-x-2",
                                    !field.value.symbol &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  <Image
                                    className="mr-2"
                                    src={field.value.logoURI as string}
                                    alt="token image"
                                    width={20}
                                    height={20}
                                  />
                                  {field.value.symbol}
                                </div>
                              ) : (
                                "Select a token"
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[180px] p-0">
                          <Command>
                            <CommandInput placeholder="Search token..." />
                            <CommandEmpty>No token found.</CommandEmpty>
                            <CommandGroup>
                              {POLYGON_TOKENS.map((token) => (
                                <CommandItem
                                  value={token.symbol}
                                  key={token.symbol}
                                  disabled={fsym === token.symbol}
                                  onSelect={() => {
                                    form.setValue("buyToken", token);
                                    router.replace(
                                      `${pathname}?${createQueryString(
                                        "tsym",
                                        token.symbol
                                      )}`
                                    );
                                    setOpenToTokens(false);
                                  }}
                                  className={cn(
                                    "flex items-center space-x-2",
                                    token.symbol === field.value.symbol &&
                                      "bg-gray-100",
                                    fsym === token.symbol && "opacity-50"
                                  )}
                                >
                                  <Image
                                    className="mr-2"
                                    src={token.logoURI}
                                    alt="token image"
                                    width={20}
                                    height={20}
                                  />
                                  <div
                                    className={cn("flex flex-col space-x-2")}
                                  >
                                    {token.symbol}
                                    <span
                                      className={cn(
                                        "text-xs text-muted-foreground"
                                      )}
                                    >
                                      {token.name.length > 20
                                        ? token.name.slice(0, 20) + "..."
                                        : token.name}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="buyAmount"
                  render={({ field }) => (
                    <FormItem className="ml-0">
                      <FormControl>
                        <Input
                          placeholder="0.0"
                          {...field}
                          className="border-none text-3xl space-y-2"
                          onChange={(e) => {
                            form.setValue("buyAmount", e.target.value);
                            tradeDirection === "sell"
                              ? setTradeDirection("buy")
                              : null;
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <span>
                Gas fee:{" "}
                {!swapPrice?.gasPrice
                  ? 0
                  : // : Number(formatUnits(BigInt(swapPrice?.gasPrice), 100))}
                    swapPrice?.gasPrice / 10000000000000}
              </span>
              <br />
              <Button
                type="submit"
                className="w-full bg-emerald-600"
                disabled={
                  sellAmount <= 0 ||
                  buyAmount <= 0 ||
                  !address ||
                  isLoadingPrice
                }
              >
                {isLoadingPrice ? (
                  <div>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </div>
                ) : (
                  <span>Swap</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Swap;
