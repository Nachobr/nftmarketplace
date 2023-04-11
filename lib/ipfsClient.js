import { create } from 'ipfs-http-client';

const ipfsClient = create({
  host: 'ipfs.infura.io', // Or the host of the IPFS service you're using
  port: '5001',
  protocol: 'https',
  headers: {
    Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}:${process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET}`)}`,
  },
});

export default ipfsClient;
