"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Trash2, 
  RefreshCw, 
  Gavel, 
  FlaskConical,
  User,
  Calendar,
  FileText,
  Package
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface MovementFormProps {
  type: 'sample' | 'report';
  onMovementAdded: () => void;
}

export function MovementForm({ type, onMovementAdded }: MovementFormProps) {
  const [formData, setFormData] = useState({
    item_id: '',
    action_type: 'CHECK_OUT',
    performed_by: '1',
    reason: '',
    expected_return_date: '',
    disposal_method: '',
    disposal_authority: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = type === 'sample' ? '/api/sample-movements' : '/api/report-movements';
      const data = {
        [`${type}_id`]: parseInt(formData.item_id),
        action_type: formData.action_type,
        performed_by: parseInt(formData.performed_by),
        reason: formData.reason || null,
        expected_return_date: formData.expected_return_date ? new Date(formData.expected_return_date) : null,
        ...(type === 'sample' && {
          disposal_method: formData.disposal_method || null,
          disposal_authority: formData.disposal_authority || null
        })
      };

      await axios.post(endpoint, data);
      
      // Reset form
      setFormData({
        item_id: '',
        action_type: 'CHECK_OUT',
        performed_by: '1',
        reason: '',
        expected_return_date: '',
        disposal_method: '',
        disposal_authority: ''
      });
      
      onMovementAdded();
    } catch (error) {
      console.error(`Error recording ${type} movement:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CHECK_OUT': return <ArrowDownToLine className="h-4 w-4" />;
      case 'CHECK_IN': return <ArrowUpFromLine className="h-4 w-4" />;
      case 'DISPOSAL': return <Trash2 className="h-4 w-4" />;
      case 'TRANSFER': return <RefreshCw className="h-4 w-4" />;
      case 'COURT_PRESENTATION': return <Gavel className="h-4 w-4" />;
      case 'ANALYSIS': return <FlaskConical className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Card className="mb-6 shadow-sm border-0 bg-white/80 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
        <CardTitle className="flex items-center gap-2">
          {type === 'sample' ? (
            <Package className="h-6 w-6 text-blue-600" />
          ) : (
            <FileText className="h-6 w-6 text-blue-600" />
          )}
          Record {type.charAt(0).toUpperCase() + type.slice(1)} Movement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Item ID */}
          <div className="space-y-2">
            <Label htmlFor="item_id">
              {type === 'sample' ? 'Sample ID' : 'Report ID'}
            </Label>
            <Input
              id="item_id"
              type="number"
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              required
              placeholder={`Enter ${type} ID`}
              className="focus-visible:ring-blue-500"
            />
          </div>
          
          {/* Action Type */}
          <div className="space-y-2">
            <Label>Action Type</Label>
            <Select
              name="action_type"
              value={formData.action_type}
              onValueChange={(value) => handleSelectChange('action_type', value)}
            >
              <SelectTrigger className="focus-visible:ring-blue-500">
                <div className="flex items-center gap-2">
                  {getActionIcon(formData.action_type)}
                  <SelectValue placeholder="Select action" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CHECK_OUT">
                  <div className="flex items-center gap-2">
                    <ArrowDownToLine className="h-4 w-4" />
                    Check Out
                  </div>
                </SelectItem>
                <SelectItem value="CHECK_IN">
                  <div className="flex items-center gap-2">
                    <ArrowUpFromLine className="h-4 w-4" />
                    Check In
                  </div>
                </SelectItem>
                <SelectItem value="TRANSFER">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Transfer
                  </div>
                </SelectItem>
                <SelectItem value="DISPOSAL">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Disposal
                  </div>
                </SelectItem>
                <SelectItem value="ANALYSIS">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" />
                    Analysis
                  </div>
                </SelectItem>
                <SelectItem value="COURT_PRESENTATION">
                  <div className="flex items-center gap-2">
                    <Gavel className="h-4 w-4" />
                    Court Presentation
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Performed By */}
          <div className="space-y-2">
            <Label htmlFor="performed_by">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Performed By (User ID)
              </div>
            </Label>
            <Input
              id="performed_by"
              type="number"
              name="performed_by"
              value={formData.performed_by}
              onChange={handleChange}
              required
              placeholder="Enter user ID"
              className="focus-visible:ring-blue-500"
            />
          </div>
          
          {/* Expected Return Date */}
          <div className="space-y-2">
            <Label htmlFor="expected_return_date">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Expected Return Date
              </div>
            </Label>
            <Input
              id="expected_return_date"
              type="date"
              name="expected_return_date"
              value={formData.expected_return_date}
              onChange={handleChange}
              placeholder="Optional"
              className="focus-visible:ring-blue-500"
            />
          </div>
          
          {/* Reason */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              placeholder="Enter reason for movement"
              className="focus-visible:ring-blue-500"
            />
          </div>
          
          {/* Sample-specific fields */}
          {type === 'sample' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="disposal_method">Disposal Method</Label>
                <Input
                  id="disposal_method"
                  type="text"
                  name="disposal_method"
                  value={formData.disposal_method}
                  onChange={handleChange}
                  placeholder="e.g., Incineration, Autoclave"
                  className="focus-visible:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="disposal_authority">Disposal Authority</Label>
                <Input
                  id="disposal_authority"
                  type="text"
                  name="disposal_authority"
                  value={formData.disposal_authority}
                  onChange={handleChange}
                  placeholder="e.g., Waste Management Company"
                  className="focus-visible:ring-blue-500"
                />
              </div>
            </>
          )}
          
          {/* Submit Button */}
          <div className="md:col-span-2">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Recording Movement...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Record Movement
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}