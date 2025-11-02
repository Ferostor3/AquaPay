import React, { useState, useEffect } from "react";
import { useWalletClient } from "wagmi"; // Cambiado useSigner por useWalletClient
import { ethers } from "ethers";
import { CONTRACTS, BILLING_ABI } from "../../../../../frontend/src/config/contracts"; // Ruta corregida

// Función para convertir wallet client a signer (igual que en PriceConfigModal)
function walletClientToSigner(walletClient: any) {
    const { account, chain, transport } = walletClient;
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    };
    const provider = new ethers.BrowserProvider(transport, network);
    const signer = new ethers.JsonRpcSigner(provider, account.address);
    return signer;
}

// Tu componente AllBillsView
export const AllBillsView: React.FC = () => {
    const { data: walletClient } = useWalletClient(); // Usando useWalletClient
    const [userBills, setUserBills] = useState([]);

    useEffect(() => {
        if (walletClient) {
            const signer = walletClientToSigner(walletClient);
            fetchUserBills(signer);
        }
    }, [walletClient]);

    const fetchUserBills = async (signer: ethers.Signer) => {
        // Tu lógica para fetchUserBills aquí
        // Usa el signer convertido desde walletClient
    };

    return (
        // Tu JSX aquí
        <div>All Bills View</div>
    );
};