import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, Calendar, MapPin, Shield, Plus, CheckCircle } from "lucide-react";

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
  const [showSuccess, setShowSuccess] = useState(false);

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
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onCaseAdded();
    } catch (error) {
      console.error('Error adding case:', error);
      alert('Error adding case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8">
      <Card className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-t-lg">
          <CardTitle className="flex items-center text-white text-xl">
            <Plus className="mr-3 h-6 w-6" />
            Add New Case
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {showSuccess && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <span className="text-green-800 font-medium">Case added successfully!</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  Police Case Number
                </label>
                <Input
                  type="text"
                  name="police_case_number"
                  value={formData.police_case_number}
                  onChange={handleChange}
                  required
                  placeholder="e.g., FIR-2025-001"
                  className="focus:border-blue-500 focus:ring-blue-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                  Case Date
                </label>
                <Input
                  type="date"
                  name="case_date"
                  value={formData.case_date}
                  onChange={handleChange}
                  required
                  className="focus:border-purple-500 focus:ring-purple-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  Police Station
                </label>
                <select
                  name="station_id"
                  value={formData.station_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-gray-800 bg-white hover:border-gray-300"
                >
                  <option value="1">Central Police Station</option>
                  <option value="2">North Division</option>
                  <option value="3">South Division</option>
                  <option value="4">East Division</option>
                  <option value="5">West Division</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Shield className="h-4 w-4 mr-2 text-red-600" />
                  Case Type
                </label>
                <select
                  name="case_type"
                  value={formData.case_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 text-gray-800 bg-white hover:border-gray-300"
                >
                  <option value="Rape">Rape</option>
                  <option value="Murder">Murder</option>
                  <option value="Assault">Assault</option>
                  <option value="Missing Person">Missing Person</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full py-4 text-lg font-semibold"
                size="lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding Case...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Case
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}