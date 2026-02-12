import { useQueryParams } from "@/hooks/use-query-params";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

function SearchBar() {
  const { updateQueryParams } = useQueryParams();

  const searchParams = useSearchParams();
  const searchFromUrl = searchParams.get("search") ?? "";

  const [searchQuery, setSearchQuery] = useState(searchFromUrl);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearchFromUrl = searchFromUrl ?? "";

      // If nothing changed from URL, do nothing
      if (currentSearchFromUrl === searchQuery) return;

      updateQueryParams({
        search: searchQuery || null,
        category: searchQuery ? null : null,
        page: searchQuery ? 1 : null,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchFromUrl]);

  useEffect(() => {
    setSearchQuery(searchFromUrl);
  }, [searchFromUrl]);

  return (
    searchFromUrl !== null &&
    searchFromUrl !== undefined && (
      <div className="relative ml-auto max-w-xs md:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    )
  );
}

export default SearchBar;
