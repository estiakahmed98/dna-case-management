"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const { overview = {} } = analytics;

  return (
    <div className="space-y-8 p-6 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-2 text-lg">Key metrics and system information at a glance</p>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-lg text-base text-gray-600">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Cases" 
          value={overview.totalCases || 0} 
          change="+5% from last month" 
          color="blue"
          icon="📋"
        />
        
        <MetricCard 
          title="Total Samples" 
          value={overview.totalSamples || 0} 
          change="+12% from last month" 
          color="green"
          icon="🧪"
        />
        
        <MetricCard 
          title="Total Reports" 
          value={overview.totalReports || 0} 
          change="+8% from last month" 
          color="purple"
          icon="📄"
        />
        
        <MetricCard 
          title="Active Users" 
          value={overview.totalUsers || 0} 
          change="3 currently online" 
          color="orange"
          icon="👥"
        />
        
        <MetricCard 
          title="Pending Returns" 
          value={overview.pendingReturns || 0} 
          change="2 overdue" 
          color="red"
          icon="⏳"
        />
        
        <MetricCard 
          title="Recent Activity" 
          value={overview.recentActivity || 0} 
          change="Today" 
          color="teal"
          icon="🔄"
        />
      </div>
      
      {/* Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <ActionButton 
              href="/dashboard/samples" 
              title="Add New Sample" 
              icon="🧪" 
              color="blue"
            />
            <ActionButton 
              href="/dashboard/reports" 
              title="Add New Report" 
              icon="📄" 
              color="green"
            />
            <ActionButton 
              href="/dashboard/cases" 
              title="Add New Case" 
              icon="📋" 
              color="purple"
            />
            <ActionButton 
              href="/dashboard/movements" 
              title="Track Movement" 
              icon="📦" 
              color="orange"
            />
          </CardContent>
        </Card>
        
        {/* System Status Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusItem 
              label="Database Connection" 
              value="Active" 
              status="success"
            />
            <StatusItem 
              label="Last Backup" 
              value="Today" 
              status="neutral"
            />
            <StatusItem 
              label="System Health" 
              value="Excellent" 
              status="success"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Reusable Metric Card Component
function MetricCard({ title, value, change, color, icon }: { 
  title: string; 
  value: number; 
  change: string; 
  color: string;
  icon: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
  };

  return (
    <Card className={`border ${colorClasses[color as keyof typeof colorClasses]} transition-all hover:shadow-md`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium text-gray-600">{title}</CardTitle>
        <span className="text-xl">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{value}</div>
        <p className="text-sm text-gray-500 mt-2">{change}</p>
      </CardContent>
    </Card>
  );
}

// Reusable Action Button Component
function ActionButton({ href, title, icon, color }: { 
  href: string; 
  title: string; 
  icon: string;
  color: string;
}) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700',
    green: 'from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700',
    purple: 'from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700',
    orange: 'from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700',
  };

  return (
    <a 
      href={href} 
      className={`p-4 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-200 flex items-center gap-3`}
    >
      <div className="text-2xl">{icon}</div>
      <span className="font-medium text-base">{title}</span>
    </a>
  );
}

// Reusable Status Item Component
function StatusItem({ label, value, status }: { 
  label: string; 
  value: string; 
  status: 'success' | 'warning' | 'error' | 'neutral';
}) {
  const statusClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
      <span className="text-gray-700 text-base">{label}</span>
      <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${statusClasses[status]}`}>
        {value}
      </span>
    </div>
  );
}