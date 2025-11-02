import React, { useState } from "react";
import { ethers } from "ethers";
import { useWalletClient } from "wagmi";
import { CONTRACTS, BILLING_ABI } from "../../../../../frontend/src/config/contracts";

// Función corregida para convertir wallet client a signer
function walletClientToSigner(walletClient: any) {
    const { account, chain, transport } = walletClient;
    
    // Crear provider usando ethers v6
    const provider = new ethers.BrowserProvider(transport, {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    });
    
    // Obtener signer
    return provider.getSigner(account.address);
}

interface Props { }

export const CreateBillModal: React.FC<Props> = () => {
    const { data: walletClient } = useWalletClient();
    const [userAddress, setUserAddress] = useState("");
    const [consumption, setConsumption] = useState<number>(0);
    const [dueDate, setDueDate] = useState("");
    const [ipfsHash, setIpfsHash] = useState("");
    const [metadata, setMetadata] = useState("");

    const handleCreateBill = async () => {
        if (!walletClient) return alert("Conecta tu wallet primero");
        
        try {
            // Convertir walletClient a signer
            const signer = await walletClientToSigner(walletClient);
            
            const billingContract = new ethers.Contract(
                CONTRACTS.scrollSepolia.billing,
                BILLING_ABI,
                signer
            );

            // Convertir fecha a timestamp UNIX
            const dueDateTimestamp = Math.floor(new Date(dueDate).getTime() / 1000);
            
            // Llamar a la función del contrato
            const tx = await billingContract.createBill(
                userAddress,
                consumption,
                dueDateTimestamp,
                ipfsHash || "", // Si está vacío, enviar string vacío
                metadata || ""   // Si está vacío, enviar string vacío
            );
            
            await tx.wait();
            alert("Factura creada correctamente!");
            
            // Limpiar formulario
            setUserAddress("");
            setConsumption(0);
            setDueDate("");
            setIpfsHash("");
            setMetadata("");
            
        } catch (err) {
            console.error("Error detallado:", err);
            alert("Error al crear factura: " + (err as Error).message);
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-white">
            <h3 className="text-lg font-bold mb-4">Crear Factura</h3>
            
            <div className="space-y-3">
                <input 
                    className="w-full p-2 border rounded"
                    placeholder="Dirección usuario (0x...)" 
                    value={userAddress} 
                    onChange={e => setUserAddress(e.target.value)} 
                />
                <input 
                    className="w-full p-2 border rounded"
                    type="number" 
                    placeholder="Consumo (litros)" 
                    value={consumption} 
                    onChange={e => setConsumption(Number(e.target.value))} 
                />
                <input 
                    className="w-full p-2 border rounded"
                    type="date" 
                    value={dueDate} 
                    onChange={e => setDueDate(e.target.value)} 
                />
                <input 
                    className="w-full p-2 border rounded"
                    placeholder="IPFS Hash (opcional)" 
                    value={ipfsHash} 
                    onChange={e => setIpfsHash(e.target.value)} 
                />
                <input 
                    className="w-full p-2 border rounded"
                    placeholder="Metadata JSON (opcional)" 
                    value={metadata} 
                    onChange={e => setMetadata(e.target.value)} 
                />
                <button 
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    onClick={handleCreateBill}
                >
                    Crear Factura
                </button>
            </div>
        </div>
    );
};