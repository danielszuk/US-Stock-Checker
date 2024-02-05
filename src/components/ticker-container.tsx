import { Inter } from "next/font/google";
import { useState } from "react";
import { StockSymbolsQueryItem } from "../external-apis/finnhub";
import StockSymbolInput from "../components/stock-symbol-input";
import { TickerStatistics } from "../components/ticker-statistics";

const inter = Inter({ subsets: ["latin"] });

export default function TickerContainer() {
  const [ticker, setTicker] = useState<StockSymbolsQueryItem>();

  return (
    <main className={`min-h-screen flex justify-center p-6 ${inter.className}`}>
      <div className="z-10 max-w-5xl w-full flex flex-col items-center gap-8 font-mono text-sm">
        <StockSymbolInput setTicker={setTicker} />
        {ticker ? <TickerStatistics ticker={ticker} /> : null}
      </div>
    </main>
  );
}
