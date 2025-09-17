import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ContractTable } from "@/components/contracts/ContractTable";

export default function Contracts() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/contracts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch contracts");
        }

        const data = await response.json();
        setContracts(Array.isArray(data) ? data : data.contracts || []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const tk = localStorage.getItem("token");
    if (!tk) {
      window.location.href = "/login";
      return;
    }

    fetchContracts();
  }, []);

  return (
    <DashboardLayout>
      {error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : (
        <ContractTable contracts={contracts} loading={loading} />
      )}
    </DashboardLayout>
  );
}
