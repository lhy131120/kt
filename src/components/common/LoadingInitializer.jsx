import { useEffect } from "react";
import { useLoading } from "@/hocks";
import { setLoadingController } from "@/services";

// This component is responsible for initializing the loading controller with the functions from the LoadingContext.
// It should be placed at the top level of the app, so that it can set up the loading controller before any API calls are made.
// It uses the useEffect hook to set the loading controller when the component mounts, and it provides the showLoading, hideLoading, and forceHideLoading functions from the LoadingContext to the loadingController.

const LoadingInitializer = ({ children }) => {
  const { showLoading, hideLoading, forceHideLoading } = useLoading();

  useEffect(() => {
    setLoadingController({ show: showLoading, hide: hideLoading, forceHide: forceHideLoading });
  }, [showLoading, hideLoading, forceHideLoading]);

  return children;
}

export default LoadingInitializer;