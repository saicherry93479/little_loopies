import PageContainer from "@/components/dashbaord/PageContainer";

import { DataTable } from "@/components/dashbaord/GlobalTable/data-table";
import { Heading } from "@/components/dashbaord/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { columns, getDatePickers, getFilterFields } from "./columns";

export default function ProductsScreen({
  productsAll = [],
  writeAccess = false,
  isStoreUser = false,
}: {
  productsAll: any[];
  writeAccess: boolean;
  isStoreUser: boolean;
}) {
  const [products, setProducts] = useState(productsAll);

  const removeProduct = async (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading 
            title= {isStoreUser?"Store Inventory" :"Inventory"}
            description={isStoreUser ? "Manage your store's inventory" : "Manage all  products"} 
          />
          {writeAccess && !isStoreUser && (
            <Button>
              <a
                href="/dashboard/product/new"
                className="text-xs md:text-sm flex items-center"
              >
                <Plus className="mr-2 h-4 w-4 text-white" /> Add New
              </a>
            </Button>
          )}
        </div>
        
        {isStoreUser && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              To order more stock, please visit the Buy Products section.
            </p>
          </div>
        )}

        <DataTable
          columns={columns(removeProduct, isStoreUser)}
          data={products}
          filterFields={getFilterFields(isStoreUser)}
          datePickers={getDatePickers(isStoreUser)}
        />
      </div>
    </PageContainer>
  );
}