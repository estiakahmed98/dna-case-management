"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MovementFormProps {
  type: 'sample' | 'report';
  onMovementAdded: () => void;
}

export function MovementForm({ type, onMovementAdded }: MovementFormProps) {
  const [formData, setFormData] = useState({
    item_id: '',
    action_type: 'CHECK_OUT',
    performed_by: '1', // Default user
    reason: '',
    expected_return_date: '',
    disposal_method: '',
    disposal_authority: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
      alert(`${type} movement recorded successfully!`);
    } catch (error) {
      console.error(`Error recording ${type} movement:`, error);
      alert(`Error recording ${type} movement. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Record {type.charAt(0).toUpperCase() + type.slice(1)} Movement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{type.charAt(0).toUpperCase() + type.slice(1)} ID</label>
            <Input
              type="number"
              name="item_id"
              value={formData.item_id}
              onChange={handleChange}
              required
              placeholder={`Enter ${type} ID`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Action Type</label>
            <select
              name="action_type"
              value={formData.action_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CHECK_OUT">Check Out</option>
              <option value="CHECK_IN">Check In</option>
              <option value="TRANSFER">Transfer</option>
              <option value="DISPOSAL">Disposal</option>
              <option value="ANALYSIS">Analysis</option>
              <option value="COURT_PRESENTATION">Court Presentation</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Performed By (User ID)</label>
            <Input
              type="number"
              name="performed_by"
              value={formData.performed_by}
              onChange={handleChange}
              required
              placeholder="Enter user ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Expected Return Date</label>
            <Input
              type="date"
              name="expected_return_date"
              value={formData.expected_return_date}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter reason for movement"
            />
          </div>
          
          {type === 'sample' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Disposal Method</label>
                <Input
                  type="text"
                  name="disposal_method"
                  value={formData.disposal_method}
                  onChange={handleChange}
                  placeholder="e.g., Incineration, Autoclave"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Disposal Authority</label>
                <Input
                  type="text"
                  name="disposal_authority"
                  value={formData.disposal_authority}
                  onChange={handleChange}
                  placeholder="e.g., Waste Management Company"
                />
              </div>
            </>
          )}
          
          <div className="col-span-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Recording Movement...' : 'Record Movement'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
