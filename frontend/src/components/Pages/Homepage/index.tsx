import { Web3Button } from "@web3modal/react";
import Link from "next/link";
import { useAccount, useNetwork } from "wagmi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ethers,  } from "ethers";
import { shortenSmartContractAddress } from "../../../helper";
import SmcDialog from "@components/common/SmcDialog";

type NFT = {
    name: string;
    description: string;
    image: string;
    attributes: any[];
}

const contractAddresses = ["0xC52e1f6fC9128cD5B34Cf81f6f342C23E23C8a35"];

const erc721EnumerableABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
    'function tokenURI(uint256 tokenId) view returns (string)',
];

type NFTItemProps = {
    name: string;
    description: string;
    image: string;
    attributes: any[];
}

const NFTItem = (props: NFTItemProps) => {
    const { image, name, description, attributes } = props;
    return (
        <div className="w-full flex flex-col md:flex-row gap-[20px] bg-white p-[12px] rounded-xl hover:scale-105 cursor-pointer transition ease-in-out delay-150">
            <div className="relative w-full sm:w-[400px] h-[300px]">
                <Image src={image} alt="NFT" fill className="rounded-xl" />
            </div>
            <div className="w-full flex flex-col h-full">
                <p className="font-semibold">{name}</p>
                <p className="font-semibold text-[14px]">{description}</p>
                <div className="w-full border-b-[1px] border-b-black mt-[12px]"></div>
                {attributes?.map((attribute, index) => (
                    <p key={index} className="font-semibold text-[14px]">
                        {attribute.trait_type}: {attribute.value}
                    </p>
                ))}
            </div>
        </div>
    );
}

const HomePage = () => {
    const { chain } = useNetwork();
    const { isConnected, address: userAddress } = useAccount()
    const [userNFTMetadatas, setUserNFTMetadatas] = useState<NFT[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [smcAddresses, setSmcAddresses] = useState<string[]>([]);

    const onAddNewAddress = (address: string) => {
        setSmcAddresses([...smcAddresses, address]);
    }

    useEffect(() => {
        const getUserNFTMetadatas = async () => {
            if (typeof (window as any).ethereum !== "undefined") {
                try {
                    const provider = new ethers.BrowserProvider((window as any).ethereum);

                    const metadataPromises = smcAddresses.map(async (address) => {
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
                            const response = await fetch(`${tokenURI}`);
                            const metadata = await response.json();
                            tokenMetadatas.push(metadata);
                        }

                        return tokenMetadatas;
                    });

                    const userNFTMetadatasArray = await Promise.all(metadataPromises);
                    console.log('userNFTMetadatasArray: ', userNFTMetadatasArray);
                    setUserNFTMetadatas(userNFTMetadatasArray.flat());
                } catch (error) {
                    console.error("Error fetching user NFT metadatas:", error);
                }
            }
        };

        if (isConnected && smcAddresses.length > 0) {
            getUserNFTMetadatas();
            setLoading(true);
        } else {
            setUserNFTMetadatas([]);
            setLoading(false);
        }
    }, [isConnected, smcAddresses]);

    useEffect(() => {
        if (userNFTMetadatas?.length > 0) {
            setLoading(false);
        }
    }, [userNFTMetadatas])

    useEffect(() => {
        setSmcAddresses([]);
    }, [chain?.id])

    return (
      <div className="flex min-h-screen w-full flex-col items-start gap-[24px] p-[20px] md:p-[80px]">
        <Web3Button />
        <SmcDialog onAddNewSMC={onAddNewAddress} />
        <p className="font-semibold">Network: {chain?.name}</p>
        <p className="font-semibold">
            Network Explorer: {""}
            <Link
                className="text-blue-500"
                href={`${chain?.id == 7331 ? "https://dnc.danang.gov.vn" : chain?.blockExplorers?.default?.url}` ?? "#"}
                target="_blank"
            >
                {chain?.id == 7331 ? "https://dnc.danang.gov.vn" : chain?.blockExplorers?.default?.url}
            </Link>
        </p>
        <p className="font-semibold flex flex-col">
            Smart contract:{" "}
            {smcAddresses.map((address, index) => (
                <Link
                    key={index}
                    className="text-blue-500"
                    href={
                    `${chain?.id == 7331 ? "https://dnc.danang.gov.vn" : chain?.blockExplorers?.default?.url}/address/${address}` ??
                    "#"
                    }
                    target="_blank"
                >
                    {shortenSmartContractAddress(address)}
                </Link>
            ))}
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
                    attributes={item.attributes}
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
