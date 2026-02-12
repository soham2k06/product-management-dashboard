import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Product } from "@/types";
import { useMemo } from "react";

interface PricerangeChart {
  products: Product[];
}

const chartConfig = {
  range: {
    label: "chart-1",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function PricerangeChart({ products }: PricerangeChart) {
  const priceRangeData = useMemo(() => {
    const ranges = {
      "0-500": 0,
      "500-1000": 0,
      "1000-2000": 0,
      "2000+": 0,
    };

    products.forEach((product) => {
      if (product.price < 500) ranges["0-500"]++;
      else if (product.price < 1000) ranges["500-1000"]++;
      else if (product.price < 2000) ranges["1000-2000"]++;
      else ranges["2000+"]++;
    });

    return Object.entries(ranges).map(([range, count]) => ({
      name: `₹${range}`,
      products: count,
    }));
  }, [products]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Range Distribution</CardTitle>
        <CardDescription>Products grouped by price</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={priceRangeData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="products" fill="var(--color-chart-1)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default PricerangeChart;
