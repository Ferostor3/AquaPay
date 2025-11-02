import React from "react";
import { CreateBillModal } from "./CreateBillModal";
import { PriceConfigModal } from "./PriceConfigModal";
import { AllBillsView } from "./AllBillsView";

export const AdminDashboard: React.FC = () => {
    return (
        <div style={{ padding: 20 }}>
            <h1>Admin Dashboard</h1>
            <CreateBillModal />
            <PriceConfigModal />
            <AllBillsView />
        </div>
    );
};
