"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SampleFormProps {
  onSampleAdded: () => void;
}

export function SampleForm({ onSampleAdded }: SampleFormProps) {
  const [formData, setFormData] = useState({
    case_id: '',
    sample_type: '',
    sample_source: '',
    collection_date: '',
    received_date: '',
    lab_register_number: '',
    scientific_officer_id: '2', // Default to the Scientific Officer from seed
    storage_location_id: '4', // Default to sample storage location
    barcode: '',
    packaging_info: '',
    expiry_date: ''
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
      // Generate barcode if not provided
      const barcode = formData.barcode || `SMP-${Date.now()}`;
      
      await axios.post('/api/samples/temp', {
        ...formData,
        case_id: parseInt(formData.case_id),
        scientific_officer_id: parseInt(formData.scientific_officer_id),
        storage_location_id: parseInt(formData.storage_location_id),
        barcode
      });
      
      // Reset form
      setFormData({
        case_id: '',
        sample_type: '',
        sample_source: '',
        collection_date: '',
        received_date: '',
        lab_register_number: '',
        scientific_officer_id: '2',
        storage_location_id: '4',
        barcode: '',
        packaging_info: '',
        expiry_date: ''
      });
      
      onSampleAdded();
      alert('Sample added successfully!');
    } catch (error) {
      console.error('Error adding sample:', error);
      alert('Error adding sample. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New DNA Sample</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Case ID</label>
            <Input
              type="number"
              name="case_id"
              value={formData.case_id}
              onChange={handleChange}
              required
              placeholder="Enter case ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sample Type</label>
            <select
              name="sample_type"
              value={formData.sample_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select sample type</option>
              <option value="Blood">Blood</option>
              <option value="Semen">Semen</option>
              <option value="Saliva">Saliva</option>
              <option value="Hair">Hair</option>
              <option value="Tissue">Tissue</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sample Source</label>
            <select
              name="sample_source"
              value={formData.sample_source}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select source</option>
              <option value="Suspect">Suspect</option>
              <option value="Victim">Victim</option>
              <option value="Crime Scene">Crime Scene</option>
              <option value="Reference">Reference</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Collection Date</label>
            <Input
              type="date"
              name="collection_date"
              value={formData.collection_date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Received Date</label>
            <Input
              type="date"
              name="received_date"
              value={formData.received_date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Lab Register Number</label>
            <Input
              type="text"
              name="lab_register_number"
              value={formData.lab_register_number}
              onChange={handleChange}
              placeholder="e.g., SR-001"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Barcode</label>
            <Input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              placeholder="Auto-generated if empty"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Packaging Info</label>
            <Input
              type="text"
              name="packaging_info"
              value={formData.packaging_info}
              onChange={handleChange}
              placeholder="e.g., Sealed Bag"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Expiry Date</label>
            <Input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-span-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Adding Sample...' : 'Add Sample'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
