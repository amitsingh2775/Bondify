
import { useEffect } from "react";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Ensure the Socket.IO server is initialized when the app loads
    fetch("/api/socket");
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
