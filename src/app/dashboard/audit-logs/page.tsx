"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, User, FileEdit, Plus, Trash2, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuditTrail {
  audit_id: number;
  entity_type: string;
  entity_id: number;
  action: string;
  timestamp: string;
  details: any;
  user: {
    name: string;
    email: string;
  };
}

export default function AuditLogsPage() {
  const [auditTrails, setAuditTrails] = useState<AuditTrail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuditTrails();
  }, []);

  const fetchAuditTrails = async () => {
    try {
      const response = await axios.get('/api/audit-trails');
      setAuditTrails(response.data);
    } catch (err) {
      setError('Failed to fetch audit trails');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <Plus className="h-4 w-4" />;
      case 'UPDATE': return <FileEdit className="h-4 w-4" />;
      case 'DELETE': return <Trash2 className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    const colors = {
      CREATE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      UPDATE: 'bg-blue-100 text-blue-800 border-blue-200',
      DELETE: 'bg-rose-100 text-rose-800 border-rose-200',
      default: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[action as keyof typeof colors] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-600">Loading audit logs...</p>
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
    <div className="w-full mx-auto p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <History className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Audit Trail System</h1>
              <p className="text-slate-600 mt-1">Comprehensive record of all system activities and changes</p>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <History className="h-6 w-6 text-blue-600" />
                System Activity Log ({auditTrails.length})
              </CardTitle>
              <div className="flex gap-2">
                <button 
                  onClick={fetchAuditTrails}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-green-800 rounded-lg hover:bg-green-800 hover:text-white transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Timestamp</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Action</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Entity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {auditTrails.map((trail, index) => (
                    <tr key={trail.audit_id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {new Date(trail.timestamp).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{trail.user.name}</p>
                            <p className="text-xs text-slate-500">{trail.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge className={`${getActionColor(trail.action)} border font-medium hover:text-gray-800 hover:bg-blue-50/50 hover:border-gray-800 flex items-center gap-1`}>
                          {getActionIcon(trail.action)}
                          {trail.action}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        <div className="flex flex-col">
                          <span className="font-medium">{trail.entity_type}</span>
                          <span className="text-xs text-slate-500">ID: {trail.entity_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="bg-slate-50 p-2 rounded-lg max-w-xs overflow-auto max-h-32">
                          <pre className="text-xs text-slate-700">
                            {JSON.stringify(trail.details, null, 2)}
                          </pre>
                        </div>
                      </td>
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