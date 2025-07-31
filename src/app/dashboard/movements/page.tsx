"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovementForm } from "@/components/MovementForm";
import { ArrowDownToLine, ArrowUpFromLine, Trash2, Package, FileText, User, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CHECK_OUT': return <ArrowDownToLine className="h-4 w-4" />;
      case 'CHECK_IN': return <ArrowUpFromLine className="h-4 w-4" />;
      case 'DISPOSAL': return <Trash2 className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    const colors = {
      CHECK_OUT: 'bg-amber-100 text-amber-800 border-amber-200',
      CHECK_IN: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      DISPOSAL: 'bg-rose-100 text-rose-800 border-rose-200',
      default: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[action as keyof typeof colors] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-600">Loading movements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Chain of Custody Tracking</h1>
              <p className="text-slate-600 mt-1">Comprehensive record of all sample and report movements</p>
            </div>
          </div>
        </div>

        {/* Tabs and Form */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('samples')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'samples' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white border border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Package className="h-4 w-4" />
              Sample Movements
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'reports' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white border border-slate-300 hover:bg-slate-50'
              }`}
            >
              <FileText className="h-4 w-4" />
              Report Movements
            </button>
          </div>
          
          <MovementForm 
            type={activeTab === 'samples' ? 'sample' : 'report'} 
            onMovementAdded={fetchMovements} 
          />
        </div>

        {/* Movements Table */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {activeTab === 'samples' ? (
                  <Package className="h-6 w-6 text-blue-600" />
                ) : (
                  <FileText className="h-6 w-6 text-blue-600" />
                )}
                {activeTab === 'samples' ? 'Sample' : 'Report'} Movements ({activeTab === 'samples' ? sampleMovements.length : reportMovements.length})
              </CardTitle>
              <button 
                onClick={fetchMovements}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Refresh
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Item</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Case Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Action</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Performed By</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Reason</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Expected Return</th>
                    {activeTab === 'samples' && (
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Disposal Info</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(activeTab === 'samples' ? sampleMovements : reportMovements).map((movement, index) => (
                    <tr key={movement.movement_id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-500" />
                          {new Date(movement.date).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                        {activeTab === 'samples' 
                          ? `Sample #${(movement as SampleMovement).sample.sample_id}`
                          : `Report #${(movement as ReportMovement).report.report_id}`
                        }
                        <div className="text-xs text-slate-500 font-mono mt-1">
                          {activeTab === 'samples' 
                            ? (movement as SampleMovement).sample.barcode
                            : (movement as ReportMovement).report.barcode
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-mono">
                        {activeTab === 'samples'
                          ? (movement as SampleMovement).sample.case.police_case_number
                          : (movement as ReportMovement).report.case.police_case_number
                        }
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge className={`${getActionColor(movement.action_type)} border font-medium flex items-center gap-1`}>
                          {getActionIcon(movement.action_type)}
                          {movement.action_type.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{movement.user.name}</p>
                            <p className="text-xs text-slate-500">{movement.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {movement.reason || (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {movement.expected_return_date ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-500" />
                            {new Date(movement.expected_return_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>
                      {activeTab === 'samples' && (
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {(movement as SampleMovement).disposal_method ? (
                            <div className="flex flex-col">
                              <span className="font-medium">{(movement as SampleMovement).disposal_method}</span>
                              <span className="text-xs text-slate-500">by {(movement as SampleMovement).disposal_authority}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">N/A</span>
                          )}
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
  );
}