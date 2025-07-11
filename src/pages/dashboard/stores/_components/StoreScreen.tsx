import { Heading } from "@/components/dashbaord/Heading";
import PageContainer from "@/components/dashbaord/PageContainer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { columns } from "./columns";
import { DataTable } from "@/components/dashbaord/GlobalTable/data-table";

const StoreScreen = ({ storesAll = [], writeAccess = false }) => {
  const [data, setData] = React.useState(storesAll);
  const [selectedStore, setSelectedStore] = React.useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const handleStatusUpdate = (storeId: string, newStatus: string) => {
    const updatedData = data.map((store) =>
      store.id === storeId ? { ...store, status: newStatus } : store
    );
    setData(updatedData);
  };

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading title={"Stores"} description="Manage stores "></Heading>
          {writeAccess && (
            <Button>
              <a
                href="/dashboard/stores/new"
                className="text-xs md:text-sm flex items-center  "
              >
                <Plus className="mr-2 h-4 w-4 text-white" /> Add New Store
              </a>
            </Button>
          )}
        </div>
        <DataTable
          columns={columns(handleStatusUpdate)}
          data={data}
          filterFields={[]}
          hiddenColumns={writeAccess ? [] : ["actions"]}
        />
      </div>
    </PageContainer>
  );
};

export default StoreScreen;
