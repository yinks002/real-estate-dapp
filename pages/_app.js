import "../styles/globals.css";
import {ChainId, ThirdwebProvider} from "@thirdweb-dev/react"
import { StateContextProvider } from "../context";
export default function App({ Component, pageProps }) {


  return(
    <ThirdwebProvider activeChain={ChainId.Mumbai}>
      <StateContextProvider>
       <Component {...pageProps} />
       </StateContextProvider>
    </ThirdwebProvider>
  );
}
