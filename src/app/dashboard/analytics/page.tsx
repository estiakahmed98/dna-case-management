"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertCircle, Archive, BarChart2, CaseSensitive, Clock, FileText, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">No Data Available</h3>
          <p>Analytics data could not be loaded</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <BarChart2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800">Forensic Analytics Dashboard</h1>
              <p className="text-slate-600 mt-1">Comprehensive insights and performance metrics</p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">Total Cases</CardTitle>
                <CaseSensitive className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{analytics.overview.totalCases}</div>
              <p className="text-xs text-slate-500 mt-1">All registered cases</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">Total Samples</CardTitle>
                <Archive className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{analytics.overview.totalSamples}</div>
              <p className="text-xs text-slate-500 mt-1">DNA samples processed</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">Total Reports</CardTitle>
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{analytics.overview.totalReports}</div>
              <p className="text-xs text-slate-500 mt-1">Generated reports</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">Active Users</CardTitle>
                <Users className="h-5 w-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{analytics.overview.totalUsers}</div>
              <p className="text-xs text-slate-500 mt-1">System users</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">Pending Returns</CardTitle>
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{analytics.overview.pendingReturns}</div>
              <p className="text-xs text-slate-500 mt-1">Awaiting completion</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-500">Recent Activity</CardTitle>
                <Clock className="h-5 w-5 text-teal-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-teal-600">{analytics.overview.recentActivity}</div>
              <p className="text-xs text-slate-500 mt-1">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Case Types Distribution */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CaseSensitive className="h-5 w-5 text-blue-500" />
                Case Types Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.caseTypes.map((caseType, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{caseType.type}</span>
                      <span className="text-sm font-semibold text-slate-700">{caseType.count}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full" 
                        style={{ 
                          width: `${(caseType.count / Math.max(...analytics.caseTypes.map(ct => ct.count))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Storage Utilization */}
          <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-green-500" />
                Storage Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.storageUtilization.slice(0, 5).map((storage, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{storage.location}</span>
                      <span className="text-sm font-semibold text-slate-700">{storage.total}</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-700 h-2 rounded-full" 
                          style={{ 
                            width: `${(storage.samples / storage.total) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full" 
                          style={{ 
                            width: `${(storage.reports / storage.total) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{storage.samples} Samples</span>
                      <span>{storage.reports} Reports</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Activity */}
        <Card className="shadow-sm border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500" />
              User Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Samples</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Reports</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Activities</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {analytics.userActivity
                    .sort((a, b) => (b.samples + b.reports + b.activities) - (a.samples + a.reports + a.activities))
                    .map((user, index) => {
                      const totalScore = user.samples + user.reports + user.activities;
                      return (
                        <tr key={index} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                          <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                          <td className="px-6 py-4 text-slate-700">{user.samples}</td>
                          <td className="px-6 py-4 text-slate-700">{user.reports}</td>
                          <td className="px-6 py-4 text-slate-700">{user.activities}</td>
                          <td className="px-6 py-4">
                            <Badge className={`${
                              totalScore > 20 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                              totalScore > 10 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              'bg-rose-100 text-rose-800 border-rose-200'
                            } border font-medium`}>
                              {totalScore}
                            </Badge>
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