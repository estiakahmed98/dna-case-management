"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Shield, Dna } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setDemoLoading(true);
    localStorage.setItem("token", "demo-token");
    localStorage.setItem(
      "user",
      JSON.stringify({
        user_id: 1,
        name: "Demo User",
        email: "demo@example.com",
        role: { role_name: "Admin" },
      })
    );
    router.push("/dashboard");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated DNA Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating DNA Molecules */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`molecule-${i}`}
            className="absolute opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${
                15 + Math.random() * 10
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <Dna className="w-8 h-8 text-cyan-400" />
          </div>
        ))}

        {/* DNA Double Helix Strands */}
        {[...Array(6)].map((_, i) => (
          <div key={`helix-${i}`} className="absolute inset-0">
            <svg
              className="absolute opacity-10"
              style={{
                left: `${10 + i * 15}%`,
                top: "0%",
                width: "200px",
                height: "100%",
                animation: `helixRotate ${20 + i * 3}s linear infinite`,
                animationDelay: `${i * 2}s`,
              }}
              viewBox="0 0 200 800"
            >
              <path
                d="M50 0 Q150 100 50 200 Q-50 300 50 400 Q150 500 50 600 Q-50 700 50 800"
                stroke="url(#gradient1)"
                strokeWidth="3"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M150 0 Q50 100 150 200 Q250 300 150 400 Q50 500 150 600 Q250 700 150 800"
                stroke="url(#gradient2)"
                strokeWidth="3"
                fill="none"
                opacity="0.6"
              />
              <defs>
                <linearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient
                  id="gradient2"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        ))}

        {/* Particle System */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(45deg, #06b6d4, #3b82f6)`,
              animation: `particle ${20 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
              boxShadow: "0 0 6px rgba(6, 182, 212, 0.6)",
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              animation: "gridMove 30s linear infinite",
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes helixRotate {
          0% {
            transform: translateY(-100%) rotate(0deg);
          }
          100% {
            transform: translateY(100%) rotate(360deg);
          }
        }
        @keyframes particle {
          0% {
            transform: translateY(100vh) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>

      {/* Main Login Card */}
      <Card className="w-full max-w-lg z-10 border-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 transition-all duration-500 hover:shadow-3xl hover:bg-white/98">
        <CardHeader className="space-y-4 px-10 pt-6 pb-4">
          {/* Logo Section */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-lg opacity-30 animate-pulse" />
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-full">
                <Dna className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              DNA Report System
            </CardTitle>
            <CardDescription className="text-slate-600 text-base font-medium">
              DNA analysis and reporting made easy
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-10 pb-10 space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-slate-700"
                htmlFor="email"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="researcher@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-10 border-slate-200 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl bg-slate-50/50 transition-all duration-200 hover:bg-white"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold text-slate-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-10 pr-12 border-slate-200 focus:border-cyan-400 focus:ring-cyan-400/20 rounded-xl bg-slate-50/50 transition-all duration-200 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 animate-in slide-in-from-top-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Login Button */}
          <Button
            className="w-full h-10 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.02] font-semibold"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Authenticating...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Secure Login</span>
              </div>
            )}
          </Button>

          {/* Divider */}
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-semibold">Demo credentials:</p>

            <div className="flex gap-4">
              <p>
                <strong>Email:</strong> admin@example.com
              </p>
              <p>
                <strong>Password:</strong> admin123
              </p>
            </div>
            <div className="flex gap-4">
              <p>
                <strong>Email:</strong> scientificofficer@example.com
              </p>
              <p>
                <strong>Password:</strong> Science123
              </p>
            </div>
            <div className="flex gap-4">
              <p>
                <strong>Email:</strong> archiveofficer@example.com
              </p>
              <p>
                <strong>Password:</strong> archive123
              </p>
            </div>
            <div className="flex gap-4">
              <p>
                <strong>Email:</strong> viewer@example.com
              </p>
              <p>
                <strong>Password:</strong> viewer123
              </p>
            </div>
          </div>

          {/* Demo Button */}
          <Button
            variant="outline"
            className="w-full h-10 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all duration-200 hover:scale-[1.02] font-semibold"
            onClick={handleDemoLogin}
            disabled={demoLoading}
          >
            {demoLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading Demo...</span>
              </div>
            ) : (
              "Try Demo Environment"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
