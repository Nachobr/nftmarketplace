import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import NFTList from '../components/NFTList';
import MintNFTForm from '../components/MintNFTForm';
import { ethers } from 'ethers';
import NFTMarketplace from '../artifacts/src/contracts/nftcontract.sol/NFTMarketplace.json';
import ipfsClient from '../lib/ipfsClient';

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
    }
  }, []);

  useEffect(() => {
    if (provider) {
      const newSigner = provider.getSigner();
      setSigner(newSigner);
    }
  }, [provider]);

  useEffect(() => {
    if (signer) {
      const contractAddress = '0x95827e636d1cFd1d73067412e9A8174d4cEc54B2';
      const newContract = new ethers.Contract(contractAddress, NFTMarketplace.abi, signer);
      setContract(newContract);
    }
  }, [signer]);

  const handleMint = () => {
    setIsMinting(true);
    setRefreshKey(refreshKey + 1);
  };

  const handleMintComplete = () => {
    setIsMinting(false);
    setIsInitialLoad(false);
  };


  return (
    <div className={styles.container}>
      <Head>
        <title>YubiaiNFT test sandbox</title>
      </Head>

      <main>
        <h1 className={styles.title}>YubiaiNFT test sandbox</h1>
        {contract && (
          <>
            <MintNFTForm
              contract={contract}
              ipfs={ipfsClient}
              onMint={handleMint}
              onMintComplete={handleMintComplete}
            />
            {(!isMinting || isInitialLoad) && (
              <NFTList contract={contract} ipfs={ipfsClient} refreshKey={refreshKey} provider={provider} />
            )}
          </>
        )}
      </main>



      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div >
  )
}
