import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"

const APP_ID = process.env.NEXT_PUBLIC_APP_ID
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>NFT Market Place</title>
                <meta name="description" content="NFT Makert Place" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
                <NotificationProvider>
                    <Header />
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp

/**
 * Moralis Command for Connect to server
 * C:/Users/91976/Desktop/Blockchain/BLockchain_2.0/FreeCodeCamp/Full-Stack-NFT/ForentEnd-Moralis-NextJS/full-stack-nft/frp_moralis/frpc.exe -c frpc.ini
 */
