/**
 * Create a new table Active item list
 * Add item when thsy listed on the marketplace
 * Remove item whem they sell or cancle listing
 */

Moralis.Cloud.afterSave("itemListed", async (request) => {
    //Event trigger twise first event goes through when get confirmed
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info("Looking for confirmed transaction")

    if (confirmed) {
        logger.info("Found Item")
        //Create new Table ActiveItem
        const ActiveItem = Moralis.Object.extend("ActiveItem")

        //Check if item is already listed or not
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftContractAddress", request.object.get("nftContractAddress"))
        query.equalTo("tokensId", request.object.get("tokensId"))
        query.equalTo("seller", request.object.get("seller"))
        const alreadyListed = await query.first()

        if (alreadyListed) {
            logger.info(`Deleting alredy listed item ${request.object.get("objectId")}`)
            await alreadyListed.destroy()
            logger.info(
                `Deleting item with token Id ${request.object.get("tokensId")} address ${request.object.get(
                    "address"
                )} since it's been already listed`
            )
        }

        //Add column into the ActiveItem Table
        const activeItem = new ActiveItem()
        activeItem.set("marketplaceAddress", request.object.get("address"))
        activeItem.set("nftContractAddress", request.object.get("nftContractAddress"))
        activeItem.set("price", request.object.get("price"))
        activeItem.set("tokensId", request.object.get("tokensId"))
        activeItem.set("seller", request.object.get("seller"))

        logger.info(
            `Adding address ${request.object.get("address")} TokenId ${request.object.get("tokensId")}`
        )
        logger.info("saving....")
        await activeItem.save()
    }
})

// If item canceled then remove it from ActiveItem list

Moralis.Cloud.afterSave("itemCanceled", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object: ${request.object}`)
    if (confirmed) {
        //Create object of ActiveItem
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)

        //fire queries
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftContractAddress", request.object.get("NftContractAddress"))
        query.equalTo("tokensId", request.object.get("tokenId"))
        logger.info(`Marketplace | Query ${query} `)

        //Find first item in the list
        const canceledItem = await query.first()
        logger.info(`Marketplace | CanceledItem ${JSON.stringify(canceledItem)} `)

        //Delete item from ActiveList
        if (canceledItem) {
            logger.info(
                `Deleting ${request.object.get("tokenId")} at Address ${request.object.get(
                    "NftContractAddress"
                )}`
            )
            await canceledItem.destroy()
        } else {
            logger.info(`No item found with address ${request.object.get("address")}`)
        }
    }
})

// If item sold then remove it from ActiveItem list
Moralis.Cloud.afterSave("itemBought", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()

    if (confirmed) {
        //Create object of ActiveItem
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)

        //fire queries
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftContractAddress", request.object.get("nftContract"))
        query.equalTo("tokensId", request.object.get("tokenId"))
        logger.info(`Marketplace | Query ${query} `)

        //Find first item in the list
        const itemBought = await query.first()
        logger.info(`Marketplace | CanceledItem ${JSON.stringify(itemBought)} `)

        //Delete item from ActiveList
        if (itemBought) {
            logger.info(
                `Deleting ${request.object.get("tokenId")} at Address ${request.object.get("nftContract")}`
            )
            await itemBought.destroy()
        } else {
            logger.info(`No item found with address ${request.object.get("address")}`)
        }
    }
})
