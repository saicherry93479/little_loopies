import { useState } from "react";
import PageContainer from "@/components/dashbaord/PageContainer";
import { DataTable } from "@/components/dashbaord/GlobalTable/data-table";
import { Heading } from "@/components/dashbaord/Heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns, filterFields, datePickers } from "./columns";

export default function CouponsScreen({ coupons = [], writeAccess = false }) {
  const [data, setData] = useState(coupons);

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading 
            title="Coupons" 
            description="Manage discount coupons for your kids clothing store" 
          />
          {writeAccess && (
            <Button>
              <a
                href="/dashboard/coupons/new"
                className="text-xs md:text-sm flex items-center"
              >
                <Plus className="mr-2 h-4 w-4 text-white" /> Add New Coupon
              </a>
            </Button>
          )}
        </div>
        
        <DataTable
          columns={columns}
          data={data}
          filterFields={filterFields}
          datePickers={datePickers}
          hiddenColumns={writeAccess ? [] : ['actions']}
        />
      </div>
    </PageContainer>
  );
}