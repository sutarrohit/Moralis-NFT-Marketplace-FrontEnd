import Image from "next/image"
import styles from "../styles/Home.module.css"
import SellNft from "./sellNft"
import Header from "../components/Header"
import NFTBox from "../components/NFTBox"
import { useMoralisQuery, useMoralis } from "react-moralis"

export default function Home() {
    const { data: listedNft, isFetching: fecthingListedNfts } = useMoralisQuery("ActiveItem", (query) =>
        query.limit(10).ascending("tokensId")
    )

    const { isWeb3Enabled, account } = useMoralis()

    return (
        <div className={styles.container}>
            <h1 className="heading">Recently Listed NFTs</h1>

            {isWeb3Enabled ? (
                fecthingListedNfts ? (
                    <div>Loading...</div>
                ) : (
                    listedNft.map((nft) => {
                        const { marketplaceAddress, nftContractAddress, price, seller, tokensId } = nft.attributes
                        return (
                            <div>
                                <NFTBox
                                    marketplaceAddress={marketplaceAddress}
                                    nftContractAddress={nftContractAddress}
                                    price={price}
                                    seller={seller}
                                    tokensId={tokensId}
                                />
                            </div>
                        )
                    })
                )
            ) : (
                <div>Connect wallet</div>
            )}
        </div>
    )
}
