import DashboardComponent from "@/components/dashboard/dashboard-component";
import { productService } from "@/services/product.service";
import { userService } from "@/services/user.service";

async function DashboardPage() {
  const [users, products] = await Promise.all([
    userService.getUsers({
      limit: 9999,
      select: "id",
    }),
    productService.getProducts({
      limit: 9999,
      select: "id,title,rating,price,reviews,stock,category",
    }),
  ]);

  return <DashboardComponent usersData={users} productsData={products} />;
}

export default DashboardPage;
