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
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductsListResponse, UsersListResponse } from "@/types";
import StatsGrid from "./stats-grid";
import CategoryChart from "./category-chart";
import PricerangeChart from "./pricerange-chart";
import RatingChart from "./rating-chart";

interface DashboardComponentProps {
  productsData: ProductsListResponse;
  usersData: UsersListResponse;
}

export default function DashboardComponent({
  productsData,
  usersData,
}: DashboardComponentProps) {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <StatsGrid productsData={productsData} usersData={usersData} />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Price Range Distribution */}
        <PricerangeChart products={productsData.products ?? []} />

        {/* Category Distribution */}
        <CategoryChart products={productsData.products ?? []} />
      </div>

      {/* Top Rated Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RatingChart products={productsData.products ?? []} />
      </div>
    </div>
  );
}
