"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StorageLocationFormProps {
  onLocationAdded: () => void;
}

export function StorageLocationForm({ onLocationAdded }: StorageLocationFormProps) {
  const [formData, setFormData] = useState({
    type: 'Cabinet',
    cabinet: '',
    rack: '',
    shelf: '',
    freezer_unit: '',
    temperature_zone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('/api/storage-locations', formData);
      
      // Reset form
      setFormData({
        type: 'Cabinet',
        cabinet: '',
        rack: '',
        shelf: '',
        freezer_unit: '',
        temperature_zone: ''
      });
      
      onLocationAdded();
      alert('Storage location added successfully!');
    } catch (error) {
      console.error('Error adding storage location:', error);
      alert('Error adding storage location. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add Storage Location</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Storage Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Cabinet">Cabinet</option>
              <option value="Freezer">Freezer</option>
              <option value="Refrigerator">Refrigerator</option>
              <option value="Room Temperature">Room Temperature</option>
              <option value="Vault">Vault</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Cabinet</label>
            <Input
              type="text"
              name="cabinet"
              value={formData.cabinet}
              onChange={handleChange}
              placeholder="e.g., CAB-01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Rack</label>
            <Input
              type="text"
              name="rack"
              value={formData.rack}
              onChange={handleChange}
              placeholder="e.g., R-01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Shelf</label>
            <Input
              type="text"
              name="shelf"
              value={formData.shelf}
              onChange={handleChange}
              placeholder="e.g., S-01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Freezer Unit</label>
            <Input
              type="text"
              name="freezer_unit"
              value={formData.freezer_unit}
              onChange={handleChange}
              placeholder="e.g., FRZ-01"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Temperature Zone</label>
            <select
              name="temperature_zone"
              value={formData.temperature_zone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select temperature zone</option>
              <option value="-80°C">-80°C (Ultra-low freezer)</option>
              <option value="-20°C">-20°C (Standard freezer)</option>
              <option value="4°C">4°C (Refrigerator)</option>
              <option value="Room Temperature">Room Temperature (20-25°C)</option>
            </select>
          </div>
          
          <div className="col-span-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Adding Location...' : 'Add Storage Location'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
