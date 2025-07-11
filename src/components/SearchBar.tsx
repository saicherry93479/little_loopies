import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "astro:transitions/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Store } from "lucide-react";

interface SearchResult {
  id: string;
  type: 'product' | 'store' | 'category';
  name: string;
  href: string;
  image?: string;
}

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchItems = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchItems();
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-2xl px-4 lg:px-8">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search products, stores..."
              className="w-full h-10 pl-10 pr-4 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={() => setOpen(true)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-full max-w-[calc(100vw-2rem)] sm:max-w-xl p-0 border rounded-md shadow-lg" 
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {isLoading ? (
                <div className="p-4 space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                results.length > 0 && (
                  <div className="py-2">
                    <CommandGroup heading="Products" className="px-2">
                      {results
                        .filter(item => item.type === 'product')
                        .map(item => (
                          <CommandItem key={item.id} className="px-4 py-2">
                            <a 
                              href={item.href}
                              className="flex items-center gap-4 w-full"
                              onClick={(e) => {
                                e.preventDefault();
                                setOpen(false);
                                navigate(item.href);
                              }}
                            >
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                  <Search className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Product</p>
                              </div>
                            </a>
                          </CommandItem>
                        ))}
                    </CommandGroup>

                    <CommandGroup heading="Stores" className="px-2">
                      {results
                        .filter(item => item.type === 'store')
                        .map(item => (
                          <CommandItem key={item.id} className="px-4 py-2">
                            <a 
                              href={item.href}
                              className="flex items-center gap-4 w-full"
                              onClick={(e) => {
                                e.preventDefault();
                                setOpen(false);
                                navigate(item.href);
                              }}
                            >
                              <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                <Store className="w-6 h-6 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Store</p>
                              </div>
                            </a>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </div>
                )
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}