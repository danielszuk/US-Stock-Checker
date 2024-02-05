import { useQuery } from "@tanstack/react-query";
import {
  FinnhubQueryKeys,
  StockSymbolsQueryItem,
  companyPeersQuery,
  quoteQuery,
} from "../external-apis/finnhub";
import { useMemo } from "react";
import Link from "next/link";

export function TickerStatistics({
  ticker,
}: {
  ticker: StockSymbolsQueryItem;
}) {
  // Fetch Quote
  const {
    isPending: isQuoteLoading,
    error: quoteLoadingError,
    data: quote,
    refetch: refetchQuote,
  } = useQuery({
    queryKey: [FinnhubQueryKeys.Quote, ticker.displaySymbol],
    queryFn: () => quoteQuery(ticker.displaySymbol),
  });

  // Fetch Company Peers
  const {
    isPending: isPeersLoading,
    error: peersLoadingerror,
    data: peersData,
    refetch: refetchPeers,
  } = useQuery({
    queryKey: [FinnhubQueryKeys.CompanyPeers, ticker.displaySymbol],
    queryFn: () => companyPeersQuery(ticker.displaySymbol),
  });
  const peers = useMemo(() => peersData?.slice(1, 4), [peersData]); // only show first 3 peers

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
        <div className="flex flex-col gap-1">
          {/* Main data */}
          <span className="text-base">{ticker.displaySymbol}</span>
          <span className="text-xl">{ticker.description}</span>
          <span
            className={`text-xl text-success ${
              isQuoteLoading ? "loading loading-spinner" : ""
            }`}
          >
            {quote?.c}
          </span>
          {/* Network error */}
          {quoteLoadingError ? (
            <span className="text-error">
              Unable to load data from network.{" "}
              <button className="underline" onClick={() => refetchQuote()}>
                Try again.
              </button>
            </span>
          ) : null}
        </div>

        {/* Price indicators */}
        <div className="grid grid-rows-4 grid-cols-2 gap-x-4">
          <TickerStatisticField
            label="Previous Close:"
            value={quote?.pc}
            isLoading={isQuoteLoading}
          />
          <TickerStatisticField
            label="Todays Open:"
            value={quote?.o}
            isLoading={isQuoteLoading}
          />
          <TickerStatisticField
            label="Todays High:"
            value={quote?.h}
            isLoading={isQuoteLoading}
          />
          <TickerStatisticField
            label="Todays Low:"
            value={quote?.l}
            isLoading={isQuoteLoading}
          />
        </div>
      </div>

      {/* Similar Companies */}
      <div>
        <div className="text-base mb-1">Similar Companies</div>
        <div
          className={`flex gap-4 text-lg text-primary ${
            isPeersLoading ? "loading loading-spinner" : ""
          }`}
        >
          {peers?.map((peer) => (
            <Link key={peer} href={`/${peer}`} className="underline">
              {peer}
            </Link>
          ))}
          {/* Network error */}
          {peersLoadingerror ? (
            <span className="text-error">
              Unable to load data from network.{" "}
              <button className="underline" onClick={() => refetchPeers()}>
                Try again.
              </button>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TickerStatisticField({
  label,
  value,
  isLoading,
}: {
  label: string;
  value?: number;
  isLoading: boolean;
}) {
  return (
    <>
      <span className={`text-xs ${isLoading ? "text-slate-400" : ""}`}>
        {label}
      </span>
      <span className="text-xs text-secondary">{value}</span>
    </>
  );
}
