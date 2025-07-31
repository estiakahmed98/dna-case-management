"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, FileText, User, MapPin, Barcode, Archive } from "lucide-react";

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
    storage_location_id: '2', // Default to report storage location
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
    <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Plus className="h-6 w-6" />
          </div>
          Add New Forensic Report
        </CardTitle>
        <p className="text-purple-100">Register a new forensic analysis report in the system</p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Case Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <div className="bg-blue-100 p-1 rounded">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              Case Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Case ID</label>
                <Input
                  type="number"
                  name="case_id"
                  value={formData.case_id}
                  onChange={handleChange}
                  required
                  placeholder="Enter case ID"
                  className="border-slate-300 focus:border-purple-500 focus:ring-purple-500 bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Lab Register Number</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    name="lab_register_number"
                    value={formData.lab_register_number}
                    onChange={handleChange}
                    placeholder="e.g., LR-001"
                    className="pl-10 border-slate-300 focus:border-purple-500 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sample Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <div className="bg-purple-100 p-1 rounded">
                <Archive className="h-4 w-4 text-purple-600" />
              </div>
              Sample & Report Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Sample Type</label>
                <select
                  name="sample_type"
                  value={formData.sample_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-slate-700 transition-colors"
                >
                  <option value="">Select sample type</option>
                  <option value="Blood">🩸 Blood</option>
                  <option value="Semen">🧬 Semen</option>
                  <option value="Saliva">💧 Saliva</option>
                  <option value="Hair">🧵 Hair</option>
                  <option value="Tissue">🦴 Tissue</option>
                  <option value="Mixed">🔬 Mixed</option>
                  <option value="Other">❓ Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Barcode</label>
                <div className="relative">
                  <Barcode className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    placeholder="Auto-generated if empty"
                    className="pl-10 border-slate-300 focus:border-purple-500 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <div className="bg-amber-100 p-1 rounded">
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Report Received Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    name="report_received_date"
                    value={formData.report_received_date}
                    onChange={handleChange}
                    required
                    className="pl-10 border-slate-300 focus:border-purple-500 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Report Delivery Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    name="report_delivery_date"
                    value={formData.report_delivery_date}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="pl-10 border-slate-300 focus:border-purple-500 focus:ring-purple-500 bg-white"
                  />
                </div>
                <p className="text-xs text-slate-500">Leave empty if not yet delivered</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Archive Entry Date</label>
                <div className="relative">
                  <Archive className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    name="archive_entry_date"
                    value={formData.archive_entry_date}
                    onChange={handleChange}
                    required
                    className="pl-10 border-slate-300 focus:border-purple-500 focus:ring-purple-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding Report...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add Forensic Report
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}