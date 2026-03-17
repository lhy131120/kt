import { LoadingContext } from "./LoadingContext";
import { useState, useRef, useCallback } from "react";

export const LoadingProvider = ({ children }) => {

  const [isLoading, setIsLoading] = useState(false);
  const loadingCount = useRef(0);

  const showLoading = useCallback(() => {
    loadingCount.current += 1;
    loadingCount.current === 1 && setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    loadingCount.current = Math.max(0, loadingCount.current - 1);
    loadingCount.current === 0 && setIsLoading(false);
  }, []);

  const forceHideLoading = useCallback(() => {
    loadingCount.current = 0;
    setIsLoading(false);
  }, []);

  const value = {
    isLoading,
    showLoading,
    hideLoading,
    forceHideLoading,
  }

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}
