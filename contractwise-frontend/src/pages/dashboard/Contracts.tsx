import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ContractTable } from "@/components/contracts/ContractTable";
import { mockContracts } from "@/data/contracts";

export default function Contracts() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <ContractTable contracts={mockContracts} loading={loading} />
    </DashboardLayout>
  );
}