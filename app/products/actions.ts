"use server";

import { productService } from "@/services/product.service";

export async function prefetchProduct(id: number) {
  await productService.getProduct(id);
}
