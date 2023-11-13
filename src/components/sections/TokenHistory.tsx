"use client";
import QueryString from "qs";
import React from "react";
import useSWR from "swr";
import { useAppQueryString } from "../../hooks/useAppQueryString";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FormControl } from "../ui/form";
import { Button } from "../ui/button";
import { cn } from "../../libs/libs";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  POLYGON_TOKENS_BY_SYMBOL,
  TIME_PERIODS,
  TIME_PERIODS_BY_DAYS,
  VS_CURRENCIES,
} from "../../libs/constants";
import { usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Toggle } from "../ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface TokenHistoryParams {
  fsym: string;
  tsym: string;
  vs_currency: string;
  days: string;
}

export const fetcher = ([endpoint, params]: [string, TokenHistoryParams]) => {
  const query = QueryString.stringify(params);

  return fetch(`${endpoint}?${query}`).then((res) => res.json());
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    // Format date to "MMM dd, h:mm a"
    const formattedDate = format(new Date(data[0]), "MMM dd, h:mm a");

    // Format value with dollar sign
    const formattedValue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(data[1]);

    return (
      <div
        className="bg-white p-4 rounded-md shadow-md"
        style={{ minWidth: "200px" }}
      >
        <p className="text-xl font-semibold">{formattedValue}</p>
        <p className="text-gray-500 text-sm">{formattedDate}</p>
      </div>
    );
  }

  return null;
};

function TokenHistory() {
  const router = useRouter();
  const pathname = usePathname();
  const [openFromTokens, setOpenFromTokens] = React.useState(false);
  const { createQueryString, searchParams } = useAppQueryString();
  const fsym = searchParams.get("fsym");
  const tsym = searchParams.get("tsym");
  const vs_currency = searchParams.get("vs_currency") ?? "usd";
  const days = searchParams.get("days") ?? "1";

  const { isLoading, data: chartData } = useSWR(
    [
      "/api/token-history",
      {
        fsym,
        vs_currency,
        days,
        // limit: "10",
      },
    ],
    fetcher,
    {
      onSuccess: (data) => {
        console.log("data", data);
      },
    }
  );
  const loadingData = !fsym || isLoading;
  const isChartPositive =
    chartData?.prices[0][1] <
    chartData?.prices[chartData?.prices.length - 1][1];
  const lastPrice = chartData?.prices
    ? chartData?.prices[chartData?.prices.length - 1][1]
    : 0;
  const percentChange = chartData?.prices
    ? ((lastPrice - chartData?.prices[0][1]) / chartData?.prices[0][1]) * 100
    : 0;
  return (
    <div>
      <div>
        {!!fsym ? (
          <h1 className="flex space-x-2 mb-4 items-center">
            <Image
              src={
                POLYGON_TOKENS_BY_SYMBOL?.[fsym?.toLocaleLowerCase()].logoURI
              }
              alt={fsym}
              width={32}
              height={32}
            />
            <span className="text-3xl font-semibold">
              {POLYGON_TOKENS_BY_SYMBOL?.[fsym?.toLocaleLowerCase()].name}
            </span>
            <span className="text-md">
              ({POLYGON_TOKENS_BY_SYMBOL?.[fsym?.toLocaleLowerCase()].symbol})
            </span>
          </h1>
        ) : (
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
      </div>
      <Card>
        <CardContent
          className={cn(
            "flex flex-col space-y-4 p-4",
            loadingData && "animate-pulse"
          )}
        >
          <div className="flex justify-between items-center">
            <div className={"flex flex-col"}>
              {loadingData ? (
                <Skeleton className="h-8 w-[50px]" />
              ) : (
                <h2 className="text-2xl fontt-semibold">
                  ${lastPrice.toFixed(2)}
                </h2>
              )}
              {loadingData ? (
                <Skeleton className="h-4 w-[150px]" />
              ) : (
                <div
                  className={cn(
                    "text-sm",
                    percentChange > 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {percentChange > 0 ? "+" : ""}
                  {percentChange.toFixed(2)}%
                  <span className="text-gray-500 cursor-pointer">
                    {" "}
                    Last {TIME_PERIODS_BY_DAYS[days].description}
                  </span>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Popover open={openFromTokens} onOpenChange={setOpenFromTokens}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[150px] justify-between rounded-xl bg-gray-100"
                      // !field.value.symbol && "text-muted-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center space-x-2"
                        // !field.value.symbol && "text-muted-foreground"
                      )}
                    >
                      {fsym} / {vs_currency.toUpperCase()}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[180px] p-0">
                  <Command>
                    <CommandInput placeholder="Search currency..." />
                    <CommandEmpty>No token found.</CommandEmpty>
                    <CommandGroup>
                      {VS_CURRENCIES.map(({ currency, name }) => (
                        <CommandItem
                          value={name}
                          key={currency}
                          disabled={vs_currency === currency}
                          onSelect={() => {
                            router.replace(
                              `${pathname}?${createQueryString(
                                "vs_currency",
                                currency
                              )}`
                            );
                            setOpenFromTokens(false);
                          }}
                          className={cn(
                            "flex items-center space-x-2",
                            // currency.symbol === field.value.symbol && "bg-gray-100",
                            vs_currency === currency && "opacity-50"
                          )}
                        >
                          <div className={cn("flex flex-col space-x-2")}>
                            {vs_currency.toUpperCase()} / {name}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <ToggleGroup type="single">
                {TIME_PERIODS.map((time) => (
                  <ToggleGroupItem
                    variant="outline"
                    key={time.days}
                    value={time.days}
                    className={cn(time.days === days && "bg-gray-100")}
                    onClick={() => {
                      router.replace(
                        `${pathname}?${createQueryString("days", time.days)}`
                      );
                    }}
                  >
                    {time.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: 352,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ResponsiveContainer>
              {loadingData || !chartData?.prices ? (
                <CartesianGrid strokeDasharray="3 3" />
              ) : (
                <AreaChart
                  data={chartData?.prices}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="30%"
                        stopColor="#82ca9d"
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="95%"
                        stopColor="#FFFFFF"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="30%"
                        stopColor="#f87171"
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="95%"
                        stopColor="#FFFFFF"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  {/* <XAxis
                    dataKey={(entry) =>
                      format(
                        new Date(entry[0]),
                        TIME_PERIODS_BY_DAYS[days].formatDate
                      )
                    }
                    // tick={<CustomizedAxisTick />}
                  /> */}
                  {/* <YAxis domain={["dataMin", "dataMax"]} /> */}
                  <Tooltip content={CustomTooltip} />
                  <Area
                    // yAxisId="left"
                    animationDuration={0}
                    type="monotone"
                    dataKey={(entry) => entry[1]}
                    stroke={
                      isLoading
                        ? "#ccc"
                        : isChartPositive
                        ? "#82ca9d"
                        : "#f87171"
                    }
                    strokeWidth={3}
                    fill={
                      isLoading
                        ? "#ccc"
                        : isChartPositive
                        ? "url(#colorGreen)"
                        : "url(#colorRed)"
                    }
                    height={200}
                  />
                  <Tooltip />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TokenHistory;
