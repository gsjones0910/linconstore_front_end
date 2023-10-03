import { useEffect, useState } from "react";
import { handleRateChange } from "../Helpers/Exchange";

export const useCurrency = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rate, setRate] = useState<number>(1);
  const [excangeRate, setExchangeRate] = useState<Record<string, number>>(null);

  const loadExchangeRate = async () => {
    const poundsResponse: number = await handleRateChange("Pounds");
    const euroResponse: number = await handleRateChange("EUR");
    const usdResponse: number = await handleRateChange("USD");
    const exchangeRate: Record<string, number> = {
      USD: usdResponse,
      Pounds: poundsResponse,
      EUR: euroResponse,
    };

    // contextApi.handleRateChange(exchangeRate);
    setExchangeRate(exchangeRate);

    localStorage.setItem("exchange", JSON.stringify(exchangeRate));
  };

  const calculatedRate = (currency: string) => {
    if (!excangeRate) {
      return 1;
    }
    return excangeRate[`${currency}`];
  };

  useEffect(() => {
    const exchangeRateString = localStorage.getItem("exchange");
    setIsLoading(true);
    if (exchangeRateString) {
      setExchangeRate(JSON.parse(exchangeRateString));
    } else {
      loadExchangeRate();
    }
  }, []);

  return calculatedRate;
};