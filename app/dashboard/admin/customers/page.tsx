///home/hp/JERE/AutoNest/app/dashboard/admin/customers/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { userApi } from "@/app/lib/api-client";
import {
  Users,
  Search,
  Eye,
  Shield,
  UserX,
  RefreshCw,
  Filter,
  Calendar,
  Mail,
  Phone,
  Loader2
} from "lucide-react";
interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const response = await userApi.getAll();
      if (response.success && response.users) {
        setCustomers(response.users);
        toast.success(`📊 Loaded ${response.users.length} users`);
      } else {
        toast.error("Failed to load customers");
        setCustomers([]);
      }
    } catch (err) {
      console.error("Error loading customers:", err);
      toast.error("Failed to load customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to promote this user to admin?")) return;

    try {
      const response = await userApi.promoteToAdmin(userId);
      if (response.success) {
        toast.success("✅ User promoted to admin successfully");
        loadCustomers(); // Reload the list
      } else {
        toast.error(response.error || "Failed to promote user");
      }
    } catch (err) {
      console.error("Error promoting user:", err);
      toast.error("Failed to promote user");
    }
  };

  const handleDemoteToCustomer = async (userId: string) => {
    if (!confirm("Are you sure you want to demote this admin to customer?"))
      return;

    try {
      const response = await userApi.demoteToCustomer(userId);
      if (response.success) {
        toast.success("✅ User demoted to customer successfully");
        loadCustomers(); // Reload the list
      } else {
        toast.error(response.error || "Failed to demote user");
      }
    } catch (err) {
      console.error("Error demoting user:", err);
      toast.error("Failed to demote user");
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      searchTerm === "" ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${customer.firstName || ""} ${customer.lastName || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "all" || customer.role === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="ml-4 text-gray-600 font-medium">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
              <Users size={32} />
              Customer Management
            </h1>
            <p className="text-indigo-100 mt-2">
              View and manage all system users
            </p>
          </div>
            <button
            onClick={loadCustomers}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl hover:bg-orange-50 transition font-semibold shadow-lg disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {customers.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Customers</p>
              <p className="text-3xl font-bold text-gray-900">
                {customers.filter((c) => c.role === "customer").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Admins</p>
              <p className="text-3xl font-bold text-gray-900">
                {customers.filter((c) => c.role === "admin").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
              <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
              <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-white/60">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={24} className="text-orange-600" />
            Users List ({filteredCustomers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          {filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-600 font-medium">No users found</p>
              <p className="text-gray-500 text-sm">
                {searchTerm || filterRole !== "all"
                  ? "Try adjusting your search or filter"
                  : "Users will appear here once registered"}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50/50 backdrop-blur-sm">
                <tr>
                  {["Name", "Email", "Phone", "Role", "Joined", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white/60 backdrop-blur-xl">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                          {customer.firstName?.[0]?.toUpperCase() ||
                            customer.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {customer.firstName || customer.lastName
                              ? `${customer.firstName || ""} ${
                                  customer.lastName || ""
                                }`.trim()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        {customer.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        {customer.phone || "N/A"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                        <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.role === "admin"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {customer.role || "customer"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/admin/manage/${customer.id}`)
                          }
                          className="flex items-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-xs"
                        >
                          <Eye size={14} />
                          View
                        </button>

                        {customer.role !== "admin" ? (
                          <button
                            onClick={() => handlePromoteToAdmin(customer.id)}
                            className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
                          >
                            <Shield size={14} />
                            Promote
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDemoteToCustomer(customer.id)}
                            className="flex items-center gap-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-xs"
                          >
                            <UserX size={14} />
                            Demote
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}