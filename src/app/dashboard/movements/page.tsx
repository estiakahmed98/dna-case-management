"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovementForm } from "@/components/MovementForm";

interface Movement {
  movement_id: number;
  action_type: string;
  reason: string | null;
  date: string;
  expected_return_date: string | null;
  returned_date: string | null;
  user: {
    name: string;
    email: string;
  };
}

interface SampleMovement extends Movement {
  sample: {
    sample_id: number;
    barcode: string;
    case: {
      police_case_number: string;
    };
  };
  disposal_method: string | null;
  disposal_authority: string | null;
}

interface ReportMovement extends Movement {
  report: {
    report_id: number;
    barcode: string;
    case: {
      police_case_number: string;
    };
  };
}

export default function MovementsPage() {
  const [sampleMovements, setSampleMovements] = useState<SampleMovement[]>([]);
  const [reportMovements, setReportMovements] = useState<ReportMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'samples' | 'reports'>('samples');

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const [sampleResponse, reportResponse] = await Promise.all([
        axios.get('/api/sample-movements'),
        axios.get('/api/report-movements')
      ]);
      setSampleMovements(sampleResponse.data);
      setReportMovements(reportResponse.data);
    } catch (err) {
      setError('Failed to fetch movements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading movements...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Movement Tracking</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-4 py-2 rounded ${
              activeTab === 'samples' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Sample Movements
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded ${
              activeTab === 'reports' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Report Movements
          </button>
        </div>
        
        <MovementForm type={activeTab === 'samples' ? 'sample' : 'report'} onMovementAdded={fetchMovements} />
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'samples' ? 'Sample' : 'Report'} Movements (
              {activeTab === 'samples' ? sampleMovements.length : reportMovements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Case Number</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Performed By</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Reason</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Expected Return</th>
                    {activeTab === 'samples' && (
                      <th className="border border-gray-300 px-4 py-2 text-left">Disposal Info</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === 'samples' ? sampleMovements : reportMovements).map((movement) => (
                    <tr key={movement.movement_id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(movement.date).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {activeTab === 'samples' 
                          ? `Sample ${(movement as SampleMovement).sample.sample_id} (${(movement as SampleMovement).sample.barcode})`
                          : `Report ${(movement as ReportMovement).report.report_id} (${(movement as ReportMovement).report.barcode})`
                        }
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {activeTab === 'samples'
                          ? (movement as SampleMovement).sample.case.police_case_number
                          : (movement as ReportMovement).report.case.police_case_number
                        }
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          movement.action_type === 'CHECK_OUT' ? 'bg-yellow-100 text-yellow-800' :
                          movement.action_type === 'CHECK_IN' ? 'bg-green-100 text-green-800' :
                          movement.action_type === 'DISPOSAL' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {movement.action_type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{movement.user.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{movement.reason || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {movement.expected_return_date 
                          ? new Date(movement.expected_return_date).toLocaleDateString()
                          : '-'
                        }
                      </td>
                      {activeTab === 'samples' && (
                        <td className="border border-gray-300 px-4 py-2">
                          {(movement as SampleMovement).disposal_method 
                            ? `${(movement as SampleMovement).disposal_method} by ${(movement as SampleMovement).disposal_authority}`
                            : '-'
                          }
                        </td>
                      )}
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
