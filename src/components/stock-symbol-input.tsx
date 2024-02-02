import { Dispatch, SetStateAction } from "react";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FinnhubQueryKeys,
  StockSymbolsQueryItem,
  stockSymbolsQuery,
} from "../external-apis/finnhub";

export default function StockSymbolInput({
  setStockSymbol,
}: {
  setStockSymbol: Dispatch<SetStateAction<StockSymbolsQueryItem | undefined>>;
}) {
  // Fetch Stock Symbols
  const {
    isPending: isStockSymbolsLoading,
    error: stockSymbolsLoadingError,
    data: stockSymbols,
    refetch: refetchStockSymbols,
  } = useQuery({
    queryKey: [FinnhubQueryKeys.StockSymbols],
    queryFn: stockSymbolsQuery,
  });

  // Stock Symbol input
  const [stockSymbolInput, setStockSymbolInput] = useState("");
  const [stockSymbolSubmitted, setStockSymbolSubmitted] = useState(false);
  const onStockSymbolSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (stockSymbolInput === "") return; // ignore empty input

      setStockSymbolSubmitted(true);
      console.info("stockSymbol submitted: ", stockSymbolInput);
    },
    [stockSymbolInput]
  );

  // Validate Stock Symbol input
  const [stockSymbolNotFound, setStockSymbolNotFound] = useState(false);
  useEffect(() => {
    // If the ticker symbol has not been submitted or the stock symbols are still loading, we don't want to do anything
    if (!stockSymbolSubmitted || isStockSymbolsLoading) return;

    if (!stockSymbolsLoadingError && stockSymbols) {
      const ticker = stockSymbols.find(
        (stock) => stock.symbol === stockSymbolInput
      );
      console.info("stockSymbol search finished: ", ticker);
      if (ticker) {
        setStockSymbol(ticker);
      } else {
        setStockSymbolNotFound(true);
      }
    }
    setStockSymbolSubmitted(false);
  }, [
    stockSymbolSubmitted,
    stockSymbols,
    isStockSymbolsLoading,
    stockSymbolsLoadingError,
    stockSymbolInput,
    setStockSymbol,
  ]);
  useEffect(() => {
    setStockSymbolNotFound(false);
  }, [stockSymbolInput]);

  return (
    <div className="w-full">
      <form onSubmit={onStockSymbolSubmit}>
        <div className="flex gap-4">
          {/* Stock Symbol Input */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Enter Ticker Symbol</span>
            </div>
            <input
              type="text"
              placeholder="e.g. AAPL, TSLA, GOOG"
              className="input input-bordered w-full focus:input-primary transition"
              onInput={(e) => setStockSymbolInput(e.currentTarget.value)}
            />
            {stockSymbolsLoadingError || stockSymbolNotFound ? (
              <div className="label">
                <span className="label-text text-red-400">
                  {/* Stock Symbol not found */}
                  {stockSymbolNotFound
                    ? `"${stockSymbolInput}" Ticker Symbol is not exist.`
                    : null}

                  {/* Stock Symbols Fetching error */}
                  {stockSymbolsLoadingError ? (
                    <>
                      {stockSymbolsLoadingError?.message}{" "}
                      <button
                        className="underline"
                        onClick={() => refetchStockSymbols()}
                      >
                        Try again.
                      </button>
                    </>
                  ) : null}
                </span>
              </div>
            ) : null}
          </label>

          {/* Submit Button */}
          <button
            className={`btn btn-primary mt-9 ${
              stockSymbolInput === "" || stockSymbolSubmitted
                ? "btn-disabled"
                : ""
            }`}
          >
            {stockSymbolSubmitted ? (
              <span className="loading loading-spinner" />
            ) : null}
            Get Info
          </button>
        </div>
      </form>
    </div>
  );
}
