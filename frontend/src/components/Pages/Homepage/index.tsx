import { Web3Button } from "@web3modal/react";
import Link from "next/link";
import { useAccount, useNetwork } from "wagmi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ethers,  } from "ethers";
import { shortenSmartContractAddress } from "../../../helper";

type NFT = {
    name: string;
    description: string;
    image: string;
}

const contractAddresses = ["0x0E8FB39547A270C4979d37345Af5eAf784F1384c"];

const erc721EnumerableABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
    'function tokenURI(uint256 tokenId) view returns (string)',
];

type NFTItemProps = {
    name: string;
    description: string;
    image: string;
}

const NFTItem = (props: NFTItemProps) => {
    const { image, name, description } = props;
    return (
        <div className="w-full flex gap-[20px] items-center bg-white p-[12px] rounded-xl hover:scale-105 cursor-pointer transition ease-in-out delay-150">
            <Image src={image} alt="NFT" width={60} height={60} />
            <div>
                <p className="font-semibold">{name}</p>
                <p className="font-semibold text-[14px]">{description}</p>
            </div>
        </div>
    );
}

const HomePage = () => {
    const { chain } = useNetwork();
    const { isConnected, address: userAddress } = useAccount()
    const [userNFTMetadatas, setUserNFTMetadatas] = useState<NFT[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUserNFTMetadatas = async () => {
            if (typeof (window as any).ethereum !== "undefined") {
                try {
                    const provider = new ethers.BrowserProvider((window as any).ethereum);

                    const metadataPromises = contractAddresses.map(async (address) => {
                        const contract = new ethers.Contract(
                            address,
                            erc721EnumerableABI,
                            provider
                        );
                        const balance = await contract.balanceOf(userAddress);
                        const tokenMetadatas = [];

                        for (let i = 0; i < balance; i++) {
                            const tokenId = await contract.tokenOfOwnerByIndex(
                                userAddress,
                                i
                            );
                            const tokenURI = await contract.tokenURI(tokenId);
                            const response = await fetch(`${tokenURI}.json`);
                            const metadata = await response.json();
                            tokenMetadatas.push(metadata);
                        }

                        return tokenMetadatas;
                    });

                    const userNFTMetadatasArray = await Promise.all(metadataPromises);
                    setUserNFTMetadatas(userNFTMetadatasArray.flat());
                } catch (error) {
                    console.error("Error fetching user NFT metadatas:", error);
                }
            }
        };

        if (isConnected) {
            getUserNFTMetadatas();
            setLoading(true);
        } else {
            setUserNFTMetadatas([]);
            setLoading(false);
        }
    }, [isConnected]);

    useEffect(() => {
        if (userNFTMetadatas?.length > 0) {
            setLoading(false);
        }
    }, [userNFTMetadatas])

    return (
      <div className="flex min-h-screen w-full flex-col items-start gap-[24px] p-[20px] md:p-[80px]">
        <Web3Button />
        <p className="font-semibold">Network: {chain?.name}</p>
        <p className="font-semibold">
            Network Explorer: {""}
            <Link
                className="text-blue-500"
                href={chain?.blockExplorers?.default?.url ?? "#"}
                target="_blank"
            >
                {chain?.blockExplorers?.default?.url}
            </Link>
        </p>
        <p className="font-semibold">
            Smart contract:{" "}
            <Link
                className="text-blue-500"
                href={
                `${chain?.blockExplorers?.default?.url}/address/0x0E8FB39547A270C4979d37345Af5eAf784F1384c` ??
                "#"
                }
                target="_blank"
            >
                {shortenSmartContractAddress("0x0E8FB39547A270C4979d37345Af5eAf784F1384c")}
            </Link>
        </p>
        <p className="font-semibold">MY NFTs</p>
        <div className="w-full flex flex-col gap-[20px]">
            {loading && <div>Loading...</div>}
            {userNFTMetadatas?.map((item: NFT, index: number) => (
                <NFTItem
                    key={index}
                    name={item.name}
                    description={item.description}
                    image={item.image}
                />
            ))}
            {userNFTMetadatas?.length === 0 && (
                <div>No NFTs found</div>
            )}
        </div>
      </div>
    );
};

export default HomePage;
