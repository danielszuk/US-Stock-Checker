import { Inter } from "next/font/google";
import { useState } from "react";
import { StockSymbolsQueryItem } from "../external-apis/finnhub";
import StockSymbolInput from "../components/stock-symbol-input";
import { TickerStatistics } from "../components/ticker-statistics";
import TickerHistoricalPriceGraph from "./ticker-historical-price-graph";

const inter = Inter({ subsets: ["latin"] });

export default function TickerContainer() {
  const [ticker, setTicker] = useState<StockSymbolsQueryItem>();

  return (
    <main className={`min-h-screen flex justify-center p-6 ${inter.className}`}>
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-12 font-mono text-sm">
        <div className="md:w-6/12 flex flex-col items-center gap-8">
          <StockSymbolInput setTicker={setTicker} />
          {ticker ? <TickerStatistics ticker={ticker} /> : null}
        </div>
        <div className="md:w-6/12">
          {ticker ? <TickerHistoricalPriceGraph ticker={ticker} /> : null}
        </div>
      </div>
    </main>
  );
}
