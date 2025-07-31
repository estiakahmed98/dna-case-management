"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SampleForm } from "@/components/SampleForm";
import { Search, Filter, Database, Calendar, User, MapPin } from "lucide-react";

interface Sample {
  sample_id: number;
  case_id: number;
  sample_type: string;
  sample_source: string;
  collection_date: string;
  received_date: string;
  lab_register_number: string;
  barcode: string;
  packaging_info: string;
  expiry_date: string | null;
  officer_id: number;
  storage_location_id: number;
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

export default function SamplesPage() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const response = await axios.get("/api/samples/temp");
      setSamples(response.data);
    } catch (err) {
      setError("Failed to fetch samples");
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
      Other: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[type as keyof typeof colors] || colors.Other;
  };

  const getSourceColor = (source: string) => {
    const colors = {
      Suspect: "bg-orange-100 text-orange-800 border-orange-200",
      Victim: "bg-rose-100 text-rose-800 border-rose-200",
      "Crime Scene": "bg-red-100 text-red-800 border-red-200",
      Reference: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
    return (
      colors[source as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-600">
            Loading samples...
          </p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full mx-auto p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Database className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">
                DNA Samples Management
              </h1>
              <p className="text-slate-600 mt-1">
                Comprehensive forensic sample tracking and management system
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Samples</p>
                  <p className="text-2xl font-bold">{samples.length}</p>
                </div>
                <Database className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Active Cases</p>
                  <p className="text-2xl font-bold">
                    {new Set(samples.map((s) => s.case_id)).size}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Officers</p>
                  <p className="text-2xl font-bold">
                    {new Set(samples.map((s) => s.officer_id)).size}
                  </p>
                </div>
                <User className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">Locations</p>
                  <p className="text-2xl font-bold">
                    {new Set(samples.map((s) => s.storage_location_id)).size}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-amber-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <SampleForm onSampleAdded={fetchSamples} />

        {/* Samples Table */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-600" />
                DNA Samples Database ({samples.length})
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
                      Sample ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Case Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Sample Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Source
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 border-b border-slate-300">
                      Collection Date
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
                  {samples.map((sample, index) => (
                    <tr
                      key={sample.sample_id}
                      className={`hover:bg-blue-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          #{sample.sample_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                        {sample.case.case_number}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge
                          className={`${getSampleTypeColor(
                            sample.sample_type
                          )} border font-medium`}
                        >
                          {sample.sample_type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Badge
                          className={`${getSourceColor(
                            sample.sample_source
                          )} border font-medium`}
                        >
                          {sample.sample_source}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {new Date(sample.collection_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-mono bg-slate-50 rounded">
                        {sample.lab_register_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-mono bg-blue-50 rounded">
                        {sample.barcode}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                        {sample.officer.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {sample.location.location_name}
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
