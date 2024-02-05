import { Dispatch, SetStateAction } from "react";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FinnhubQueryKeys,
  StockSymbolsQueryItem,
  stockSymbolsQuery,
} from "../external-apis/finnhub";
import { useParams } from "next/navigation";
import Router from "next/router";
import { Params } from "../pages/params";

export default function StockSymbolInput({
  setTicker,
}: {
  setTicker: Dispatch<SetStateAction<StockSymbolsQueryItem | undefined>>;
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
      setStockSymbolSubmitted(false);
      if (ticker) {
        setTicker(ticker);
        Router.push(`/${ticker.symbol}`);
      } else {
        setStockSymbolNotFound(true);
      }
    }
  }, [
    stockSymbolSubmitted,
    stockSymbols,
    isStockSymbolsLoading,
    stockSymbolsLoadingError,
    stockSymbolInput,
    setTicker,
  ]);
  useEffect(() => {
    // clear error after user starts typing again
    setStockSymbolNotFound(false);
  }, [stockSymbolInput]);

  // Symbol from URL
  const params = useParams<Params>();
  useEffect(() => {
    if (params?.["stock-symbol"]) {
      setStockSymbolInput((symbolInput) => {
        if (symbolInput !== params["stock-symbol"]) {
          // If symbol input is different from the new symbol in the URL, update the input and submit it
          setStockSymbolSubmitted(true);
          return params["stock-symbol"];
        } else {
          return symbolInput;
        }
      });
    }
  }, [params]);

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
              value={stockSymbolInput}
              onInput={(e) => setStockSymbolInput(e.currentTarget.value)}
            />
            {stockSymbolsLoadingError || stockSymbolNotFound ? (
              <div className="label">
                <span className="label-text text-error">
                  {/* Stock Symbol not found */}
                  {stockSymbolNotFound
                    ? `"${stockSymbolInput}" Ticker Symbol is not exist.`
                    : null}

                  {/* Stock Symbols Fetching error */}
                  {stockSymbolsLoadingError ? (
                    <>
                      Unable to load data from finnhub.{" "}
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
