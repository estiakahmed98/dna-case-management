"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SampleForm } from "@/components/SampleForm";

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
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const response = await axios.get('/api/samples/temp');
      setSamples(response.data);
    } catch (err) {
      setError('Failed to fetch samples');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading samples...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">DNA Samples Management</h1>
      
      <SampleForm onSampleAdded={fetchSamples} />
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>DNA Samples ({samples.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Sample ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Case Number</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Sample Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Source</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Collection Date</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Lab Register</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Barcode</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Officer</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Storage Location</th>
                  </tr>
                </thead>
                <tbody>
                  {samples.map((sample) => (
                    <tr key={sample.sample_id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{sample.sample_id}</td>
                      <td className="border border-gray-300 px-4 py-2">{sample.case.case_number}</td>
                      <td className="border border-gray-300 px-4 py-2">{sample.sample_type}</td>
                      <td className="border border-gray-300 px-4 py-2">{sample.sample_source}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(sample.collection_date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{sample.lab_register_number}</td>
                      <td className="border border-gray-300 px-4 py-2">{sample.barcode}</td>
                      <td className="border border-gray-300 px-4 py-2">{sample.officer.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{sample.location.location_name}</td>
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
