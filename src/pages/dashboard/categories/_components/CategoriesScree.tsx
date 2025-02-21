import PageContainer from "@/components/dashbaord/PageContainer";
import { DataTable } from "@/components/dashbaord/GlobalTable/data-table";
import { Heading } from "@/components/dashbaord/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns, datePickers, filterFields } from "./columns";
import type { Category } from "@/lib/db/schema";

interface Props {
  categoriesData: Category[];
  writeAccess: boolean;
}

const CategoriesScree = ({
  categoriesData = [],
  writeAccess = false,
}: Props) => {
  console.log("categoriesData ", categoriesData);
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title={"Categories"}
            description="these are useful for adding tags to products"
          ></Heading>
          {writeAccess && (
            <Button>
              <a
                href="/dashboard/categories/new"
                className="text-xs md:text-sm flex items-center  "
              >
                <Plus className="mr-2 h-4 w-4 text-white" /> Add New
              </a>
            </Button>
          )}
        </div>
        <DataTable
          columns={columns}
          filterFields={filterFields}
          data={categoriesData}
          datePickers={datePickers}
          hiddenColumns={writeAccess?[]:['actions']}
        />
      </div>
    </PageContainer>
  );
};

export default CategoriesScree;
