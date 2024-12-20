# FrogHub 🐸

A decentralized event ticketing platform built on Linea blockchain that revolutionizes how communities discover, create, and participate in events. FrogHub uses NFTs as event tickets, providing a secure and transparent way to manage event attendance while eliminating common issues like ticket fraud and unauthorized reselling.

## What is FrogHub?

FrogHub bridges the gap between Web3 and event management. By leveraging blockchain technology, it offers:

- **NFT-Based Ticketing**: Each ticket is a unique NFT on the Linea blockchain, ensuring authenticity and ownership
- **Decentralized Event Creation**: Anyone can create and manage events with customizable ticket quantities and pricing
- **Secure Transactions**: Smart contract handles ticket sales with automatic payment distribution to event organizers
- **Event Discovery**: Browse and filter through various events ranging from tech conferences to music festivals

## Technical Overview

FrogHub is built using:

- **Frontend**: Next.js with TailwindCSS and shadcn/ui for a modern, responsive interface
- **Backend**: MongoDB for storing event details and user data
- **Blockchain**:
  - Linea (Ethereum L2) for fast, low-cost transactions
  - Thirdweb SDK for seamless smart contract interactions
  - Custom ERC721 contract for NFT ticket management

Event data is stored both on-chain (ticket quantities, prices) and off-chain (event details, media) for optimal performance and cost-effectiveness. The smart contract handles core ticketing logic including:

- Event creation and management
- Ticket minting and distribution
- Ownership tracking
- Automated payment handling
