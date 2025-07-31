"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  if (loading) return <div>Loading audit logs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>System Activity Log ({auditTrails.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Timestamp</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Entity Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Entity ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditTrails.map((trail) => (
                    <tr key={trail.audit_id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(trail.timestamp).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {trail.user.name} ({trail.user.email})
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          trail.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                          trail.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                          trail.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {trail.action}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{trail.entity_type}</td>
                      <td className="border border-gray-300 px-4 py-2">{trail.entity_id}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <pre className="text-xs bg-gray-50 p-2 rounded max-w-xs overflow-auto">
                          {JSON.stringify(trail.details, null, 2)}
                        </pre>
                      </td>
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
