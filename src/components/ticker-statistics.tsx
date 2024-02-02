import { useQuery } from "@tanstack/react-query";
import {
  FinnhubQueryKeys,
  StockSymbolsQueryItem,
  companyPeersQuery,
  quoteQuery,
} from "../external-apis/finnhub";
import { useMemo } from "react";

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
  const peers = useMemo(() => peersData?.slice(1, 5), [peersData]);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
        <div className="flex flex-col gap-1">
          <span className="text-base">{ticker.displaySymbol}</span>
          <span className="text-xl">{ticker.description}</span>
          <span className="text-xl text-secondary">{quote?.c}</span>
        </div>
        <div className="grid grid-rows-4 grid-cols-2 gap-x-4">
          <span className="text-xs">Previous Close:</span>
          <span className="text-xs text-secondary">{quote?.pc}</span>
          <span className="text-xs">Todays Open:</span>
          <span className="text-xs text-secondary">{quote?.o}</span>
          <span className="text-xs">Todays High:</span>
          <span className="text-xs text-secondary">{quote?.h}</span>
          <span className="text-xs">Todays Low:</span>
          <span className="text-xs text-secondary">{quote?.l}</span>
        </div>
      </div>
      <div>
        <span>Similar Companies</span>
        <div>{peers?.join(", ")}</div>
      </div>
    </div>
  );
}
