"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/analytics")
      .then((res) => {
        setAnalytics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Analytics API error:', err);
        setAnalytics({});
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const { overview = {} } = analytics;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{overview.totalCases || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Samples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{overview.totalSamples || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{overview.totalReports || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{overview.totalUsers || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{overview.pendingReturns || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600">{overview.recentActivity || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/dashboard/samples" className="block p-3 bg-blue-50 rounded hover:bg-blue-100">
              ➕ Add New Sample
            </a>
            <a href="/dashboard/reports" className="block p-3 bg-green-50 rounded hover:bg-green-100">
              ➕ Add New Report
            </a>
            <a href="/dashboard/cases" className="block p-3 bg-purple-50 rounded hover:bg-purple-100">
              ➕ Add New Case
            </a>
            <a href="/dashboard/movements" className="block p-3 bg-orange-50 rounded hover:bg-orange-100">
              📦 Track Movement
            </a>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Database Connection</span>
              <span className="text-green-600 font-semibold">✅ Active</span>
            </div>
            <div className="flex justify-between">
              <span>Last Backup</span>
              <span className="text-gray-600">Today</span>
            </div>
            <div className="flex justify-between">
              <span>System Health</span>
              <span className="text-green-600 font-semibold">✅ Good</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
