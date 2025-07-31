"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportForm } from "@/components/ReportForm";

interface Report {
  report_id: number;
  case_id: number;
  report_received_date: string;
  report_delivery_date: string | null;
  sample_type: string;
  lab_register_number: string;
  scientific_officer_id: number;
  storage_location_id: number;
  barcode: string;
  archive_entry_date: string;
  case: {
    case_number: string;
    station: {
      station_name: string;
    };
  };
  officer: {
    name: string;
  };
  location: {
    location_name: string;
  };
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/reports/temp');
      setReports(response.data);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reports Management</h1>
      
      <ReportForm onReportAdded={fetchReports} />
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Reports ({reports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Report ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Case Number</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Sample Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Received Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Delivery Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Lab Register</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Barcode</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Officer</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Storage Location</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.report_id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{report.report_id}</td>
                      <td className="border border-gray-300 px-4 py-2">{report.case.case_number}</td>
                      <td className="border border-gray-300 px-4 py-2">{report.sample_type}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(report.report_received_date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {report.report_delivery_date 
                          ? new Date(report.report_delivery_date).toLocaleDateString() 
                          : 'Not delivered'
                        }
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{report.lab_register_number}</td>
                      <td className="border border-gray-300 px-4 py-2">{report.barcode}</td>
                      <td className="border border-gray-300 px-4 py-2">{report.officer.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{report.location.location_name}</td>
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
