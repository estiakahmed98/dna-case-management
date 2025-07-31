"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportFormProps {
  onReportAdded: () => void;
}

export function ReportForm({ onReportAdded }: ReportFormProps) {
  const [formData, setFormData] = useState({
    case_id: '',
    report_received_date: '',
    report_delivery_date: '',
    sample_type: '',
    lab_register_number: '',
    scientific_officer_id: '2', // Default to the Scientific Officer from seed
    storage_location_id: '3', // Default to report storage location
    barcode: '',
    archive_entry_date: ''
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
      const barcode = formData.barcode || `RPT-${Date.now()}`;
      
      await axios.post('/api/reports/temp', {
        ...formData,
        case_id: parseInt(formData.case_id),
        scientific_officer_id: parseInt(formData.scientific_officer_id),
        storage_location_id: parseInt(formData.storage_location_id),
        barcode,
        report_delivery_date: formData.report_delivery_date || null
      });
      
      // Reset form
      setFormData({
        case_id: '',
        report_received_date: '',
        report_delivery_date: '',
        sample_type: '',
        lab_register_number: '',
        scientific_officer_id: '2',
        storage_location_id: '3',
        barcode: '',
        archive_entry_date: ''
      });
      
      onReportAdded();
      alert('Report added successfully!');
    } catch (error) {
      console.error('Error adding report:', error);
      alert('Error adding report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Report</CardTitle>
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
            <label className="block text-sm font-medium mb-1">Report Received Date</label>
            <Input
              type="date"
              name="report_received_date"
              value={formData.report_received_date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Report Delivery Date</label>
            <Input
              type="date"
              name="report_delivery_date"
              value={formData.report_delivery_date}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Sample Type</label>
            <select
              name="sample_type"
              value={formData.sample_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select sample type</option>
              <option value="Blood">Blood</option>
              <option value="Semen">Semen</option>
              <option value="Saliva">Saliva</option>
              <option value="Hair">Hair</option>
              <option value="Tissue">Tissue</option>
              <option value="Mixed">Mixed</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Lab Register Number</label>
            <Input
              type="text"
              name="lab_register_number"
              value={formData.lab_register_number}
              onChange={handleChange}
              placeholder="e.g., LR-001"
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
          
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Archive Entry Date</label>
            <Input
              type="date"
              name="archive_entry_date"
              value={formData.archive_entry_date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="col-span-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Adding Report...' : 'Add Report'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
