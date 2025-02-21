import PageContainer from "@/components/dashbaord/PageContainer";
import { DataTable } from "@/components/dashbaord/GlobalTable/data-table";
import { Heading } from "@/components/dashbaord/Heading";
import { useState } from "react";
import { columns, getDatePickers, getFilterFields } from "./columns";

export default function InvoicesScreen({
  invoicesAll = [],
  writeAccess = false,
  isStoreUser = false,
}: {
  invoicesAll: any[];
  writeAccess: boolean;
  isStoreUser: boolean;
}) {
  const [invoices, setInvoices] = useState(invoicesAll);

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Heading
            title={isStoreUser ? "Store Invoices" : "All Invoices"}
            description={
              isStoreUser
                ? "View and manage your store invoices"
                : "Manage all customer and store invoices"
            }
          />
        </div>

        <DataTable
          columns={columns(isStoreUser)}
          data={invoices}
          filterFields={getFilterFields(isStoreUser)}
          datePickers={getDatePickers(isStoreUser)}
        />
      </div>
    </PageContainer>
  );
}