import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SortConfig, SortKey } from "../product-table";

interface TableHeaderProps {
  density: "comfortable" | "compact";
  allSelected: boolean;
  toggleSelectAll: () => void;
  sortConfig: SortConfig | null;
  handleSort: (key: SortKey) => void;
}

function ProductTableHeader({
  allSelected,
  density,
  sortConfig,
  handleSort,
  toggleSelectAll,
}: TableHeaderProps) {
  return (
    <TableHeader>
      <TableRow
        className={cn({
          "[&>th]:px-4": density === "comfortable",
          "[&>th]:px-1": density === "compact",
        })}
      >
        <TableHead className="w-12 text-center">
          <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} />
        </TableHead>
        <TableHead>Image</TableHead>
        <TableHead
          onClick={() => handleSort("title")}
          className="cursor-pointer"
        >
          Title{" "}
          {sortConfig?.key === "title"
            ? sortConfig.direction === "asc"
              ? "↑"
              : "↓"
            : ""}
        </TableHead>
        <TableHead>Brand</TableHead>
        <TableHead>Category</TableHead>
        <TableHead
          className="text-right cursor-pointer"
          onClick={() => handleSort("price")}
        >
          Price{" "}
          {sortConfig?.key === "price"
            ? sortConfig.direction === "asc"
              ? "↑"
              : "↓"
            : ""}
        </TableHead>
        <TableHead
          className="text-center cursor-pointer"
          onClick={() => handleSort("stock")}
        >
          Stock{" "}
          {sortConfig?.key === "stock"
            ? sortConfig.direction === "asc"
              ? "↑"
              : "↓"
            : ""}
        </TableHead>
        <TableHead
          className="text-center cursor-pointer"
          onClick={() => handleSort("rating")}
        >
          Rating{" "}
          {sortConfig?.key === "rating"
            ? sortConfig.direction === "asc"
              ? "↑"
              : "↓"
            : ""}
        </TableHead>
        <TableHead className="text-center">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}

export default ProductTableHeader;
