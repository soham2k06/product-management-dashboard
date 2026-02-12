import { Product } from "@/types";
import { useMemo } from "react";
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
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

const chartConfig = {
  rating: {
    label: "Rating",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface RatingChartProps {
  products: Product[];
}

function RatingChart({ products }: RatingChartProps) {
  const topRatedProducts = useMemo(() => {
    if (!products) return [];

    return products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
      .map((p) => ({
        name: p.title.substring(0, 20),
        rating: p.rating,
      }));
  }, [products]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Rated Products</CardTitle>
        <CardDescription>Highest-rated products in catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={topRatedProducts}
            layout="vertical"
            margin={{
              right: 40,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="rating" type="number" hide domain={[0, 5]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="rating"
              layout="vertical"
              fill="var(--color-rating)"
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="rating"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default RatingChart;
