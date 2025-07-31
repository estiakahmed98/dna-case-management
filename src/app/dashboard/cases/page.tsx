"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseForm } from "@/components/CaseForm";

interface Case {
  case_id: number;
  police_case_number: string;
  case_date: string;
  case_type: string;
  station: {
    name: string;
  };
  reports: any[];
  samples: any[];
}

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get('/api/cases');
      setCases(response.data);
    } catch (err) {
      setError('Failed to fetch cases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading cases...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Case Management</h1>
      
      <CaseForm onCaseAdded={fetchCases} />
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Cases ({cases.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Case ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Police Case Number</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Case Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Case Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Police Station</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Reports</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Samples</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((caseItem) => (
                    <tr key={caseItem.case_id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{caseItem.case_id}</td>
                      <td className="border border-gray-300 px-4 py-2">{caseItem.police_case_number}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(caseItem.case_date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{caseItem.case_type}</td>
                      <td className="border border-gray-300 px-4 py-2">{caseItem.station.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{caseItem.reports.length}</td>
                      <td className="border border-gray-300 px-4 py-2">{caseItem.samples.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
