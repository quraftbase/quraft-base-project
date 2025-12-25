// pages/_app.tsx
import "@/styles/globals.css";
import '@fontsource/bangers';
import type { AppProps } from "next/app";
import { ThemeProvider } from "../components/ThemeProvider";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
