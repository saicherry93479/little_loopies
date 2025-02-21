import PageContainer from "@/components/dashbaord/PageContainer";
import { columns, datePickers, filterFields } from "./columns";
import { DataTable } from "@/components/dashbaord/GlobalTable/data-table";
import { Heading } from "@/components/dashbaord/Heading";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PermissionScreen({
  permissionsAll = [],
  writeAccess = false,
}) {
  const [permissions, setPermissions] = useState(permissionsAll);
  
  const removePermission = async (id) => {
    setPermissions(permissions.filter((permisson) => permisson.id !== id));
  };
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title={"Permissions"}
            description="Manage permissions "
          ></Heading>
          {writeAccess && (
            <Button>
              <a
                href="/dashboard/permissions/new"
                className="text-xs md:text-sm flex items-center  "
              >
                <Plus className="mr-2 h-4 w-4 text-white" /> Add New
              </a>
            </Button>
          )}
        </div>
        <DataTable
          datePickers={datePickers}
          columns={columns(removePermission,writeAccess)}
          filterFields={filterFields}
          data={permissions}
          hiddenColumns={writeAccess?[]:['actions']}
        />
      </div>
    </PageContainer>
  );
}
