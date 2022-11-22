import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="header">
            <div className="log">
                <h1>NFT Markeplace</h1>
            </div>

            <div className="pages">
                <Link href="/">
                    <a>NFT Marketplace</a>
                </Link>

                <Link href="sellNft">
                    <a>Sell NFT</a>
                </Link>

                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
