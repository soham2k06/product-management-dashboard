import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useMemo } from "react";
import { Product } from "@/types";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Pie, PieChart } from "recharts";

interface CategoryChartProps {
  products: Product[];
}

function CategoryChart({ products }: CategoryChartProps) {
  const categoryData = useMemo(() => {
    if (!products) return [];

    const categoryCounts: Record<string, number> = {};
    products.forEach((product) => {
      categoryCounts[product.category] =
        (categoryCounts[product.category] || 0) + 1;
    });

    return Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a) // sort descending by count
      .slice(0, 5) // take top 5
      .map(([category, count]) => ({
        name: category,
        value: count,
        fill: `var(--color-${category})`,
      }));
  }, [products]);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    categoryData.forEach((item, index) => {
      config[item.name] = {
        label: item.name.replace("-", " "),
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });
    return config;
  }, [categoryData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products by Category</CardTitle>
        <CardDescription>
          Distribution across categories (only top 5 categories used)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="capitalize min-w-44"
                  hideLabel
                />
              }
            />
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default CategoryChart;
