import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketPlace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card } from "@web3uikit/core"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListing"

//Concate Owner address string
const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr
    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
}

export default function NFTBox({ marketplaceAddress, nftContractAddress, price, seller, tokensId }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [ImageURI, setImageURI] = useState("")
    const [Name, setImageName] = useState("")
    const [Description, setImageDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

    //Get token URI of a token
    const { error, runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftContractAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokensId,
        },
    })

    //Call Buy NFT Function
    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftContractAddress: nftContractAddress,
            tokenId: tokensId,
        },
    })

    async function updateUI() {
        //get the TokenURI
        const tokenURI = await getTokenURI()
        console.log(tokenURI)
        //Using the Img tag of the TokenURI get the image URI
        if (tokenURI) {
            //Change IPFS URI to HTTP
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            //Get gat data from tokenURI
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const ActualImageURI = tokenURIResponse.image
            const imageURI = await ActualImageURI.replace("ipfs://", "https://ipfs.io/ipfs/")

            console.log("Actual NFT")
            const description = tokenURIResponse.descriptcion
            const name = tokenURIResponse.name
            console.log(tokenURIResponse)
            setImageURI(imageURI)
            setImageName(name)
            setImageDescription(description)
        }
    }

    const isOwnedByUser = seller === account || seller === undefined
    const formatedSellerAddress = isOwnedByUser ? "You" : truncateStr(seller || "", 15)

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: handleBuyItemSuccess,
              })
    }

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }

    return (
        <div>
            <div className="MainModal">
                <UpdateListingModal
                    isVisible={showModal}
                    marketplaceAddress={marketplaceAddress}
                    nftContractAddress={nftContractAddress}
                    tokenId={tokensId}
                    onClose={hideModal}
                />
                <Card title={Name} description={Description} onClick={handleCardClick}>
                    <div>
                        <div className="center"> #{tokensId}</div>
                        <div className="center">Owned by {formatedSellerAddress}</div>
                        {ImageURI ? (
                            <Image loader={() => ImageURI} src={ImageURI} width={400} height={200} />
                        ) : (
                            "Loading"
                        )}
                        <div className="price">Price {ethers.utils.formatUnits(price, "ether")}ETH</div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
