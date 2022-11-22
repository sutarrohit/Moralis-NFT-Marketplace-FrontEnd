import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketPlace.json"
import nftAbi from "../constants/BasicNft.json"
import { ethers } from "ethers"

export default function UpdateListingModal({ isVisible, marketplaceAddress, nftContractAddress, tokenId, onClose }) {
    const dispatch = useNotification()
    const [PriceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const handleUpdateListingSuccess = async (tx) => {
        console.log("handleUpdateListingSuccess", tx)
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing Updated -please refresh",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith("0")
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftContractAddress: nftContractAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(PriceToUpdateListingWith || "0"),
        },
    })

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: handleUpdateListingSuccess,
                })
            }}
        >
            <Input
                label="Update lisitng price in L1 currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
                // onOk ={()}
            />
        </Modal>
    )
}
