import { ethers } from 'ethers';
import NFTMarketplace_ABI from './NFTMarketplace_ABI';

const NFTMarketplace_Address = '0x95827e636d1cFd1d73067412e9A8174d4cEc54B2'; // Your NFT Marketplace contract address

export function getProvider() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider;
}

export async function getContract() {
    const provider = getProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(NFTMarketplace_Address, NFTMarketplace_ABI, signer);
    return contract;
}

export async function mintNFT(tokenURI, price) {
    const contract = await getContract();
    const transaction = await contract.mintNFT(tokenURI, price);
    await transaction.wait();
}

export async function getTokenURI(tokenId) {
    const contract = await getContract();
    const tokenURI = await contract.tokenURI(tokenId);
    return tokenURI;
}

export async function buyToken(tokenId) {
    const contract = await getContract();
    const price = await contract.getTokenPrice(tokenId);
    const transaction = await contract.buyToken(tokenId, { value: price });
    await transaction.wait();
}

export async function getTotalSupply() {
    const contract = await getContract();
    const supply = await contract.totalSupply();
    return supply;
}


export async function getOwnerOf(tokenId) {
    const contract = await getContract();
    const owner = await contract.ownerOf(tokenId);
    return owner;
}

export async function getTokenPrice(tokenId) {
    const contract = await getContract();
    const price = await contract.getTokenPrice(tokenId);
    return price;
}
// Add more functions to interact with your smart contract as needed
