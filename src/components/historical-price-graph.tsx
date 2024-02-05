import { useQuery } from "@tanstack/react-query";
import { PolygonQueryKeys, dailyPricesQuery } from "../external-apis/polygon";
import { StockSymbolsQueryItem } from "../external-apis/finnhub";
import { useCallback, useEffect, useRef } from "react";
import type { ECharts } from "echarts";
import {
  secondaryColor,
  secondaryColorTransparent,
} from "../../tailwind.config";

const graphColor = secondaryColor;
const graphColorTransparent = secondaryColorTransparent;

const today = new Date().getTime();
const oneYearAgo = today - 1000 * 60 * 60 * 24 * 365;

const timestampFormatter = (timestamp: number) =>
  new Date(timestamp).toISOString().split("T")[0];

export default function HistoricalPriceGraph({
  ticker,
}: {
  ticker: StockSymbolsQueryItem;
}) {
  // Fetch Prices Data
  const {
    isPending: isPricesLoading,
    error: pricesLoadingError,
    data: prices,
    refetch: refetchPrices,
  } = useQuery({
    queryKey: [PolygonQueryKeys.DailyPrices, ticker.symbol, oneYearAgo, today],
    queryFn: () => dailyPricesQuery(ticker.symbol, oneYearAgo, today),
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ECharts>();

  const setContainerSize = useCallback(() => {
    if (containerRef.current === null) return;
    containerRef.current.style.height =
      containerRef.current.clientWidth / 1.5 + "px"; // calculate height based on a fix aspect ratio
  }, []);

  useEffect(() => {
    import("echarts").then((echarts) => {
      if (containerRef.current === null || prices === undefined) return;

      if (!chartRef.current) {
        // initialize chart
        setContainerSize(); // calculate height based on a fix aspect ratio
        chartRef.current = echarts.init(containerRef.current);
      }

      const closingPrices = prices.map((price) => [
        timestampFormatter(price.t),
        price.c,
      ]);

      // config chart
      chartRef.current.setOption({
        series: [
          {
            name: "Closing Price",
            data: closingPrices, // load data: [timestamp, price]
            type: "line",
            smooth: true,
            color: graphColor,
          },
        ],
        yAxis: {
          type: "value",
          name: "Daily Closing Prices",
          nameTextStyle: {
            align: "left",
          },
          axisLabel: {
            formatter: "{value} $",
          },
        },
        xAxis: {
          type: "time",
          axisPointer: {
            snap: true,
            lineStyle: {
              color: graphColor,
              width: 2,
            },
            label: {
              show: true,
              formatter: ({ value }: { value: number }) =>
                timestampFormatter(value),
              backgroundColor: graphColor,
            },
            handle: {
              show: true,
              color: graphColor,
            },
          },
        },
        tooltip: {
          triggerOn: "mousemove",
          valueFormatter: (value: number) => `${value} $`,
        },
        toolbox: {
          left: "left",
          itemSize: 20,
          bottom: 0,
          feature: {
            dataZoom: {
              yAxisIndex: "none",
              iconStyle: {
                borderColor: graphColor,
              },
              emphasis: {
                iconStyle: {
                  borderColor: graphColor,
                },
              },
              brushStyle: {
                color: graphColorTransparent,
              },
            },
            restore: {
              iconStyle: {
                borderColor: graphColor,
              },
              emphasis: {
                iconStyle: {
                  borderColor: graphColor,
                },
              },
            },
          },
        },
        dataZoom: [
          {
            type: "inside",
            throttle: 50,
          },
        ],
      });
    });
  }, [prices, setContainerSize]);

  useEffect(() => {
    // clear chart when loading new data
    if (isPricesLoading) chartRef.current?.clear();
  }, [isPricesLoading]);

  // Resize graph on resize
  useEffect(() => {
    const handleResize = () => {
      setContainerSize();
      chartRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setContainerSize]);

  return (
    <div>
      {/* Error */}
      {pricesLoadingError ? (
        <span className="text-error">
          Unable to load data from network.{" "}
          <button className="underline" onClick={() => refetchPrices()}>
            Try again.
          </button>
        </span>
      ) : null}

      {/* Loading */}
      {isPricesLoading ? (
        <div className="loading loading-spinner text-secondary" />
      ) : null}

      {/* Graph container */}
      <div className="w-full" ref={containerRef} />
    </div>
  );
}
