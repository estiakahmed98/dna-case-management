"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, FlaskConical, User, MapPin, Barcode, Package } from "lucide-react";

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
    storage_location_id: '2', // Default to sample storage location
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
    <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <div className="bg-white/20 rounded-lg">
            <Plus className="h-6 w-6" />
          </div>
          Add New DNA Sample
        </CardTitle>
        <p className="text-emerald-100">Enter sample details to register a new forensic specimen</p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Case Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <div className="bg-blue-100 p-1 rounded">
                <FlaskConical className="h-4 w-4 text-blue-600" />
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
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Lab Register Number</label>
                <div className="relative">
                  <FlaskConical className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    name="lab_register_number"
                    value={formData.lab_register_number}
                    onChange={handleChange}
                    placeholder="e.g., SR-001"
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sample Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <div className="bg-purple-100 p-1 rounded">
                <Package className="h-4 w-4 text-purple-600" />
              </div>
              Sample Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Sample Type</label>
                <select
                  name="sample_type"
                  value={formData.sample_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700 transition-colors"
                >
                  <option value="">Select sample type</option>
                  <option value="Blood">🩸 Blood</option>
                  <option value="Semen">🧬 Semen</option>
                  <option value="Saliva">💧 Saliva</option>
                  <option value="Hair">🧵 Hair</option>
                  <option value="Tissue">🦴 Tissue</option>
                  <option value="Other">❓ Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Sample Source</label>
                <select
                  name="sample_source"
                  value={formData.sample_source}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-700 transition-colors"
                >
                  <option value="">Select source</option>
                  <option value="Suspect">👤 Suspect</option>
                  <option value="Victim">🚑 Victim</option>
                  <option value="Crime Scene">🔍 Crime Scene</option>
                  <option value="Reference">📋 Reference</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Packaging Info</label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    name="packaging_info"
                    value={formData.packaging_info}
                    onChange={handleChange}
                    placeholder="e.g., Sealed Bag"
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>
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
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <div className="bg-amber-100 p-1 rounded">
                <Calendar className="h-4 w-4 text-amber-600" />
              </div>
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Collection Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    name="collection_date"
                    value={formData.collection_date}
                    onChange={handleChange}
                    required
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Received Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    name="received_date"
                    value={formData.received_date}
                    onChange={handleChange}
                    required
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Expiry Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleChange}
                    className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
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
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding Sample...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add DNA Sample
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}