import React from "react"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Form, useNotification } from "web3uikit"
import { ethers } from "ethers"
import nftMarketplaceAbi from "../constants/NftMarketPlace.json"
import nftAbi from "../constants/BasicNft.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"

const SellNft = () => {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketPlace[0]
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    async function approveAndList(data) {
        console.log("Approving ...")
        const nftContractAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseEther(data.data[2].inputResult, "ether").toString()
        console.log(nftContractAddress, tokenId, price, marketplaceAddress)

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftContractAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => {
                console.log("Approve Success ")
                handleApproveSuccess(nftContractAddress, tokenId, price)
            },
            onError: (error) => {
                console.log("Approve Function ", error)
            },
        })

        console.log("Contract Approved")
    }

    async function handleApproveSuccess(nftContractAddress, tokenId, price) {
        console.log("Lisitng Item on MarketPlace")
        const lsitOpotion = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listNft",
            params: {
                nftContractAddress: nftContractAddress,
                tokenId: tokenId,
                price: price,
            },
        }
        await runContractFunction({
            params: lsitOpotion,
            onSuccess: () => handleLsitSuccess(),
            onError: (error) => {
                console.log("List function", error)
            },
        })
    }

    async function handleLsitSuccess() {
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        })
    }

    ////////////////////////////

    return (
        <div className="sellNft">
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "35%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token Id",
                        type: "number",
                        inputWidth: "35%",
                        value: "",
                        key: "tokenId",
                    },

                    {
                        name: "Price (in ETH)",
                        type: "number",
                        inputWidth: "35%",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT"
                id="Main Form"
            />
        </div>
    )
}

export default SellNft
