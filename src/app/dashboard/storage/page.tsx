"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StorageLocationForm } from "@/components/StorageLocationForm";

interface StorageLocation {
  location_id: number;
  type: string;
  cabinet: string | null;
  rack: string | null;
  shelf: string | null;
  freezer_unit: string | null;
  temperature_zone: string | null;
  reports: any[];
  samples: any[];
}

export default function StorageLocationsPage() {
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('/api/storage-locations');
      setLocations(response.data);
    } catch (err) {
      setError('Failed to fetch storage locations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading storage locations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Storage Location Management</h1>
      
      <StorageLocationForm onLocationAdded={fetchLocations} />
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Storage Locations ({locations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Cabinet</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Rack</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Shelf</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Freezer Unit</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Temperature</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Items Stored</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location) => (
                    <tr key={location.location_id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{location.location_id}</td>
                      <td className="border border-gray-300 px-4 py-2">{location.type}</td>
                      <td className="border border-gray-300 px-4 py-2">{location.cabinet || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{location.rack || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{location.shelf || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{location.freezer_unit || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">{location.temperature_zone || '-'}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {location.reports.length + location.samples.length} items
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
