"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CaseFormProps {
  onCaseAdded: () => void;
}

export function CaseForm({ onCaseAdded }: CaseFormProps) {
  const [formData, setFormData] = useState({
    police_case_number: '',
    case_date: '',
    station_id: '1',
    case_type: 'Rape'
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
      await axios.post('/api/cases', {
        ...formData,
        station_id: parseInt(formData.station_id),
        case_date: new Date(formData.case_date)
      });
      
      // Reset form
      setFormData({
        police_case_number: '',
        case_date: '',
        station_id: '1',
        case_type: 'Rape'
      });
      
      onCaseAdded();
      alert('Case added successfully!');
    } catch (error) {
      console.error('Error adding case:', error);
      alert('Error adding case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Case</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Police Case Number</label>
            <Input
              type="text"
              name="police_case_number"
              value={formData.police_case_number}
              onChange={handleChange}
              required
              placeholder="e.g., FIR-2025-001"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Case Date</label>
            <Input
              type="date"
              name="case_date"
              value={formData.case_date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Police Station</label>
            <select
              name="station_id"
              value={formData.station_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Central Police Station</option>
              <option value="2">North Division</option>
              <option value="3">South Division</option>
              <option value="4">East Division</option>
              <option value="5">West Division</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Case Type</label>
            <select
              name="case_type"
              value={formData.case_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Rape">Rape</option>
              <option value="Murder">Murder</option>
              <option value="Assault">Assault</option>
              <option value="Missing Person">Missing Person</option>
              <option value="Fraud">Fraud</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="col-span-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Adding Case...' : 'Add Case'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
