import {
  AlertCircle,
  Package,
  Star,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import { StatsCard } from "./stats-card";
import { useMemo } from "react";
import { ProductsListResponse, UsersListResponse } from "@/types";

interface StatsGridProps {
  productsData: ProductsListResponse;
  usersData: UsersListResponse;
}

function StatsGrid({ productsData, usersData }: StatsGridProps) {
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

  return (
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
  );
}

export default StatsGrid;
