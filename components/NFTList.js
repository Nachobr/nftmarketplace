import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getTotalSupply, getOwnerOf, getTokenURI, getTokenPrice } from '../lib/contract';


const NFTList = ({ contract, refreshKey, ipfs, provider }) => {
    const [nfts, setNfts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchNFTs = async () => {
        if (!contract) return;
        const totalSupply = await getTotalSupply()
        const fetchedNFTs = [];

        for (let i = 1; i <= totalSupply; i++) {
            try {
                const owner = await getOwnerOf(i);
                const tokenURI = await getTokenURI(i);
                const ipfsPath = tokenURI;
                const price = await getTokenPrice(i);
                console.log('Token price:', price);

                try {
                    console.log('tokenURI:', tokenURI, 'ipfsPath:', ipfsPath);
                    const response = await fetch(`https://ipfs.io/ipfs/${ipfsPath.replace('ipfs://', '')}`);
                    console.log('Fetching metadata from URL:', response.url);
                    const metadata = await response.json();

                    fetchedNFTs.push({
                        id: i,
                        owner,
                        tokenURI: ipfsPath,
                        price: ethers.utils.formatEther(price),
                        name: metadata.name,
                        description: metadata.description,
                        image: metadata.image,
                    });

                } catch (error) {
                    console.warn('Error fetching metadata for tokenURI:', ipfsPath);
                    console.warn(error);
                }
            } catch (error) {
                console.warn(`Error fetching data for token with ID ${i}`, error);
            }
        }
        console.log("fetchedNFTs:", fetchedNFTs);
        setNfts(fetchedNFTs);
    };

    useEffect(() => {
        fetchNFTs();
    }, [contract, refreshKey, ipfs]);

    // Add an event listener to the contract to listen for the TokenMinted event
    useEffect(() => {
        const handleMinted = async (tokenId, creator, price, event) => {
            console.log(`New NFT minted: creator=${creator}, tokenId=${tokenId}, price=${price}`);
            console.log('Event object:', event); // Log the event object to inspect its properties

            if (event && event.transactionHash) {
                await provider.waitForTransaction(event.transactionHash);
                console.log('Fetching updated NFT list...');
                fetchNFTs(); // Call fetchNFTs here
            } else {
                console.error('Event object is missing the transactionHash property:', event);
            }
        };

        contract.on('TokenMinted', handleMinted);

        // Cleanup the event listener when the component unmounts
        return () => {
            contract.off('TokenMinted', handleMinted);
        };
    }, [contract]);

    useEffect(() => {
        console.log("NFTs state updated:", nfts);
    }, [nfts]);

    const totalPages = Math.ceil(nfts.length / 5);

    const renderNFTs = () => {
        const startIndex = (currentPage - 1) * 5;
        const endIndex = startIndex + 5;
        const currentNFTs = nfts.slice(startIndex, endIndex);

        return currentNFTs.map((nft) => (
            <div key={nft.id} style={{ border: '1px solid', padding: '1rem', margin: '1rem' }}>
                <h3>NFT ID: {nft.id}</h3>
                <h4>Name: {nft.name}</h4>
                <p>Description: {nft.description}</p>
                <img src={`https://ipfs.io/ipfs/${nft.image.replace('ipfs://', '')}`} alt={nft.name} style={{ maxWidth: '200px' }} />

                <p>Owner: {nft.owner}</p>
                <p>Token URI: {nft.tokenURI}</p>
                <p>Price: {nft.price} ETH</p>
            </div>
        ));
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <h2>NFTs</h2>
            {renderNFTs()}
            <div>
                <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};
export default NFTList;