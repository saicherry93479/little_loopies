import PageContainer from "@/components/dashbaord/PageContainer";
import { columns, datePickers, filterFields } from "./columns";
import { DataTable } from "@/components/dashbaord/GlobalTable/data-table";
import { Heading } from "@/components/dashbaord/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserRolesScreen({ users = [], writeAccess = false }) {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading title={"Users"} description="Manage roles "></Heading>
          {writeAccess && (
            <Button>
              <a
                href="/dashboard/users/new"
                className="text-xs md:text-sm flex items-center  "
              >
                <Plus className="mr-2 h-4 w-4 text-white" /> Add New
              </a>
            </Button>
          )}
        </div>
        <DataTable
          datePickers={datePickers}
          columns={columns}
          filterFields={filterFields}
          data={users}
          hiddenColumns={writeAccess?[]:['actions']}
        />
      </div>
    </PageContainer>
  );
}
