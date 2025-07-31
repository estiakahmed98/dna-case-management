"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Analytics {
  overview: {
    totalCases: number;
    totalSamples: number;
    totalReports: number;
    totalUsers: number;
    pendingReturns: number;
    recentActivity: number;
  };
  caseTypes: { type: string; count: number }[];
  storageUtilization: { location: string; samples: number; reports: number; total: number }[];
  userActivity: { name: string; samples: number; reports: number; activities: number }[];
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/analytics');
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to fetch analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!analytics) return <div>No data available</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics & Reports</h1>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{analytics.overview.totalCases}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Samples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{analytics.overview.totalSamples}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{analytics.overview.totalReports}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{analytics.overview.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{analytics.overview.pendingReturns}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600">{analytics.overview.recentActivity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Case Types Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Case Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.caseTypes.map((caseType, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{caseType.type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(caseType.count / Math.max(...analytics.caseTypes.map(ct => ct.count))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold">{caseType.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Storage Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.storageUtilization.slice(0, 10).map((storage, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium text-sm">{storage.location}</span>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs">
                      <span className="text-green-600">{storage.samples}S</span> + 
                      <span className="text-blue-600"> {storage.reports}R</span>
                    </div>
                    <span className="text-sm font-semibold">{storage.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Activity */}
      <Card>
        <CardHeader>
          <CardTitle>User Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Samples Handled</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Reports Handled</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Total Activities</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Activity Score</th>
                </tr>
              </thead>
              <tbody>
                {analytics.userActivity
                  .sort((a, b) => (b.samples + b.reports + b.activities) - (a.samples + a.reports + a.activities))
                  .map((user, index) => {
                    const totalScore = user.samples + user.reports + user.activities;
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">{user.name}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{user.samples}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{user.reports}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{user.activities}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <span className={`px-2 py-1 rounded text-sm ${
                            totalScore > 20 ? 'bg-green-100 text-green-800' :
                            totalScore > 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {totalScore}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
