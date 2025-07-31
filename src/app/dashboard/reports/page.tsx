"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportForm } from "@/components/ReportForm";
import {
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  MapPin,
  Clock,
} from "lucide-react";

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
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/reports/temp");
      setReports(response.data);
    } catch (err) {
      setError("Failed to fetch reports");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSampleTypeColor = (type: string) => {
    const colors = {
      Blood: "bg-red-100 text-red-800 border-red-200",
      Semen: "bg-purple-100 text-purple-800 border-purple-200",
      Saliva: "bg-blue-100 text-blue-800 border-blue-200",
      Hair: "bg-amber-100 text-amber-800 border-amber-200",
      Tissue: "bg-green-100 text-green-800 border-green-200",
      Mixed: "bg-indigo-100 text-indigo-800 border-indigo-200",
      Other: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[type as keyof typeof colors] || colors.Other;
  };

  const getDeliveryStatus = (deliveryDate: string | null) => {
    if (deliveryDate) {
      return {
        status: "Delivered",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        date: new Date(deliveryDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };
    }
    return {
      status: "Pending",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      date: "Not delivered",
    };
  };

  const deliveredReports = reports.filter((r) => r.report_delivery_date).length;
  const pendingReports = reports.length - deliveredReports;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-600">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="w-full mx-auto p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-600 p-3 rounded-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">
                Reports Management
              </h1>
              <p className="text-slate-600 mt-1">
                Comprehensive forensic report tracking and archive system
              </p>
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Reports</p>
                  <p className="text-2xl font-bold">{reports.length}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Delivered</p>
                  <p className="text-2xl font-bold">{deliveredReports}</p>
                </div>
                <Calendar className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Pending</p>
                  <p className="text-2xl font-bold">{pendingReports}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Active Cases</p>
                  <p className="text-2xl font-bold">
                    {new Set(reports.map((r) => r.case_id)).size}
                  </p>
                </div>
                <User className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <ReportForm onReportAdded={fetchReports} />

        {/* Reports Table */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-600" />
                Forensic Reports Database ({reports.length})
              </CardTitle>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <Search className="h-4 w-4" />
                  Search
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  <Filter className="h-4 w-4" />
                  Filter
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Report ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Case Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Sample Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Received Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Delivery Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Lab Register
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Barcode
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Officer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Storage Location
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reports.map((report, index) => {
                    const deliveryInfo = getDeliveryStatus(
                      report.report_delivery_date
                    );
                    return (
                      <tr
                        key={report.report_id}
                        className={`hover:bg-purple-50/50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            #{report.report_id}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                          {report.case.case_number}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Badge
                            className={`${getSampleTypeColor(
                              report.sample_type
                            )} border font-medium`}
                          >
                            {report.sample_type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {new Date(
                            report.report_received_date
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="space-y-1">
                            <Badge
                              className={`${deliveryInfo.color} border font-medium`}
                            >
                              {deliveryInfo.status}
                            </Badge>
                            <div className="text-xs text-slate-500">
                              {deliveryInfo.date}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 font-mono bg-slate-50 rounded">
                          {report.lab_register_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 font-mono bg-purple-50 rounded">
                          {report.barcode}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                          {report.officer.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">
                          {report.location.location_name}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
