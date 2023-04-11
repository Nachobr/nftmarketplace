import { useState } from 'react';
import { ethers } from "ethers";


const MintNFTForm = ({ contract, ipfs, onMint }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  //const [price, setPrice] = useState('');
  const [parsedPrice, setParsedPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !file) {
      alert('Please fill in all fields and upload a file');
      return;
    }

    // Upload the media file to IPFS
    const mediaFile = await ipfs.add(file);
    const mediaUrl = `ipfs://${mediaFile.path}`;

    // Create metadata JSON
    const metadata = {
      name,
      description,
      image: mediaUrl,
    };

    // Upload metadata JSON to IPFS
    const metadataFile = await ipfs.add(JSON.stringify(metadata));
    const metadataUrl = `ipfs://${metadataFile.path}`;

    // Mint NFT with metadata tokenURI
    const parsedPriceWei = ethers.utils.parseEther(parseFloat(parsedPrice).toFixed(4));
    const tokenId = await contract.mintNFT(metadataUrl, parsedPriceWei);

    alert(`NFT minted with token ID: ${tokenId}`);

    if (onMint) onMint();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Mint NFT</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <br />
      <label>
        Price (ETH):
        <input
          type="number"
          step="0.01"
          min="0"
          value={parsedPrice}
          onChange={(e) => setParsedPrice(e.target.value)}
        />
      </label>
      <br />
      <label>
        File:
        <input type="file" onChange={handleFileChange} />
      </label>
      <br />
      <button type="submit">Mint NFT</button>
    </form>
  );
};

export default MintNFTForm;
