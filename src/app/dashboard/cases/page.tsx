"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  FileText,
  Calendar,
  MapPin,
  Shield,
  BarChart3,
  Search,
  Filter,
  RefreshCw,
  Database,
  Columns4,
} from "lucide-react";

import { CaseForm } from "@/components/CaseForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get("/api/cases");
      setCases(response.data);
    } catch (err) {
      setError("Failed to fetch cases");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCaseTypeColor = (caseType: string) => {
    const colors = {
      Rape: "bg-red-100 text-red-800 border-red-200",
      Murder: "bg-purple-100 text-purple-800 border-purple-200",
      Assault: "bg-orange-100 text-orange-800 border-orange-200",
      "Missing Person": "bg-yellow-100 text-yellow-800 border-yellow-200",
      Fraud: "bg-blue-100 text-blue-800 border-blue-200",
      Other: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[caseType as keyof typeof colors] || colors["Other"];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading cases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-lg font-medium text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="w-full p-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Columns4 className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                Case Management System
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and track criminal cases efficiently
              </p>
            </div>
          </div>
        </div>

         {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Cases
                  </p>
                  <p className="text-3xl font-bold">{cases.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Total Reports
                  </p>
                  <p className="text-3xl font-bold">
                    {cases.reduce((sum, c) => sum + c.reports.length, 0)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Total Samples
                  </p>
                  <p className="text-3xl font-bold">
                    {cases.reduce((sum, c) => sum + c.samples.length, 0)}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Active Cases
                  </p>
                  <p className="text-3xl font-bold">{cases.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <CaseForm onCaseAdded={fetchCases} />

       

        {/* Cases Table */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
            <CardTitle className="flex items-center text-xl text-gray-800">
              <FileText className="mr-3 h-6 w-6 text-blue-600" />
              Case Records ({cases.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Case ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Police Case Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Case Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Case Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Police Station
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Reports
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Samples
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cases.map((caseItem, index) => (
                    <tr
                      key={caseItem.case_id}
                      className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          #{caseItem.case_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {caseItem.police_case_number}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(caseItem.case_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCaseTypeColor(
                            caseItem.case_type
                          )}`}
                        >
                          {caseItem.case_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {caseItem.station.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {caseItem.reports.length} reports
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {caseItem.samples.length} samples
                        </span>
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
