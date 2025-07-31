import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/toast";
import {
  User,
  Mail,
  Lock,
  Shield,
  UserPlus,
  CheckCircle,
  Settings,
} from "lucide-react";

interface UserFormProps {
  onUserAdded: () => void;
}

export function UserForm({ onUserAdded }: UserFormProps) {
  const { showToast, ToastProvider } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "1", // Default to Admin role
    two_factor_enabled: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/users", {
        ...formData,
        role_id: parseInt(formData.role_id),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        role_id: "1",
        two_factor_enabled: false,
      });

      showToast("User created successfully! Welcome to the team.", "success");
      onUserAdded();
    } catch (error) {
      console.error("Error adding user:", error);
      showToast("Failed to create user. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastProvider />
      <div className="mb-8">
        <Card className="bg-gradient-to-br from-white to-green-50 border-2 border-green-100">
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-t-lg">
            <CardTitle className="flex items-center text-white text-xl">
              <UserPlus className="mr-3 h-6 w-6" />
              Add New User
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <User className="h-4 w-4 mr-2 text-green-600" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    className="focus:border-green-500 focus:ring-green-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="h-4 w-4 mr-2 text-blue-600" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email address"
                    className="focus:border-blue-500 focus:ring-blue-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="h-4 w-4 mr-2 text-purple-600" />
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter secure password"
                    className="focus:border-purple-500 focus:ring-purple-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Shield className="h-4 w-4 mr-2 text-orange-600" />
                    User Role
                  </label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-800 bg-white hover:border-gray-300"
                  >
                    <option value="1">Admin</option>
                    <option value="2">Scientific Officer</option>
                    <option value="3">Archive Officer</option>
                    <option value="4">Viewer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <Settings className="h-5 w-5 text-indigo-600 mr-3" />
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="two_factor_enabled"
                    checked={formData.two_factor_enabled}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 mr-3"
                  />
                  <span className="text-gray-700 font-medium">
                    Enable Two-Factor Authentication
                  </span>
                </label>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                  size="lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding User...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Add User
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
