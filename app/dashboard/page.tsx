"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Package,
  Users,
  AlertCircle,
  TrendingUp,
  Star,
  Tag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useProducts } from "@/hooks/use-products";
import { useUsers } from "@/hooks/use-users";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function DashboardPage() {
  const { data: productsData, isLoading: productsLoading } = useProducts(
    1,
    100,
  );
  const { data: usersData, isLoading: usersLoading } = useUsers(1, 100);

  const stats = useMemo(() => {
    if (!productsData || !usersData) return null;

    const products = productsData.products || [];
    const totalProducts = productsData.total || 0;
    const totalUsers = usersData.total || 0;
    const lowStockItems = products.filter((p) => p.stock < 10).length;
    const averagePrice =
      products.length > 0
        ? (
            products.reduce((sum, p) => sum + p.price, 0) / products.length
          ).toFixed(2)
        : 0;
    const averageRating =
      products.length > 0
        ? (
            products.reduce((sum, p) => sum + p.rating, 0) / products.length
          ).toFixed(1)
        : 0;
    const categoriesCount = new Set(products.map((p) => p.category)).size;

    return {
      totalProducts,
      totalUsers,
      lowStockItems,
      averagePrice,
      averageRating,
      categoriesCount,
    };
  }, [productsData, usersData]);

  const categoryData = useMemo(() => {
    if (!productsData?.products) return [];

    const categoryCounts: Record<string, number> = {};
    productsData.products.forEach((product) => {
      categoryCounts[product.category] =
        (categoryCounts[product.category] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([category, count]) => ({
      name: category,
      value: count,
    }));
  }, [productsData]);

  const priceRangeData = useMemo(() => {
    if (!productsData?.products) return [];

    const ranges = {
      "0-500": 0,
      "500-1000": 0,
      "1000-2000": 0,
      "2000+": 0,
    };

    productsData.products.forEach((product) => {
      if (product.price < 500) ranges["0-500"]++;
      else if (product.price < 1000) ranges["500-1000"]++;
      else if (product.price < 2000) ranges["1000-2000"]++;
      else ranges["2000+"]++;
    });

    return Object.entries(ranges).map(([range, count]) => ({
      name: `₹${range}`,
      count,
    }));
  }, [productsData]);

  const topRatedProducts = useMemo(() => {
    if (!productsData?.products) return [];

    return productsData.products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
      .map((p) => ({
        name: p.title.substring(0, 20),
        rating: p.rating,
      }));
  }, [productsData]);

  const isLoading = productsLoading || usersLoading;

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            description="Products in catalog"
            icon={<Package className="h-4 w-4" />}
          />
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            description="Registered users"
            icon={<Users className="h-4 w-4" />}
          />
          <StatsCard
            title="Low Stock Items"
            value={stats?.lowStockItems || 0}
            description="Products with stock < 10"
            icon={<AlertCircle className="h-4 w-4" />}
          />
          <StatsCard
            title="Average Price"
            value={`₹${stats?.averagePrice || 0}`}
            description="Across all products"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatsCard
            title="Average Rating"
            value={stats?.averageRating || 0}
            description="Overall product rating"
            icon={<Star className="h-4 w-4" />}
          />
          <StatsCard
            title="Categories"
            value={stats?.categoriesCount || 0}
            description="Product categories"
            icon={<Tag className="h-4 w-4" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Products by Category</CardTitle>
              <CardDescription>Distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} (${value})`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Price Range Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Price Range Distribution</CardTitle>
              <CardDescription>Products grouped by price</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priceRangeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Rated Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Rated Products</CardTitle>
            <CardDescription>Highest-rated products in catalog</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topRatedProducts}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 300, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="name" type="category" width={300} />
                  <Tooltip />
                  <Bar dataKey="rating" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
