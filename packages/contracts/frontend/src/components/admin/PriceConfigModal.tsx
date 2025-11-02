import React, { useState } from "react";
import { useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { CONTRACTS, BILLING_ABI } from "../../../../../frontend/src/config/contracts";

// Función para convertir wallet client a signer de ethers
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

export const PriceConfigModal: React.FC = () => {
    const { data: walletClient } = useWalletClient();
    const [price, setPrice] = useState<number>(0);

    const handleUpdatePrice = async () => {
        if (!walletClient) return alert("Conecta tu wallet primero");

        // Convertir wallet client a signer
        const signer = walletClientToSigner(walletClient);
        const billingContract = new ethers.Contract(CONTRACTS.scrollSepolia.billing, BILLING_ABI, signer);

        try {
            const tx = await billingContract.setPricePerLiter(price);
            await tx.wait();
            alert("Precio actualizado correctamente!");
        } catch (err) {
            console.error(err);
            alert("Error al actualizar precio");
        }
    };

    return (
        <div>
            <h3>Actualizar Precio por Litro</h3>
            <input
                type="number"
                placeholder="Precio"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
            />
            <button onClick={handleUpdatePrice}>Actualizar Precio</button>
        </div>
    );
};