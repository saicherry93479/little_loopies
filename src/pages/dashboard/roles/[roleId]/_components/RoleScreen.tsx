import PageContainer from "@/components/dashbaord/PageContainer";
import DynamicForm from "@/components/dashbaord/GloabalForm/DynamicForm";
import { formConfig } from "./config";
import { z } from "zod";

const RoleScreen = ({ roleData }: any) => {
  console.log(roleData);
  const getFormConfig = () => {
    if (!roleData) return formConfig;

    const idField = {
      name: "id",
      type: "input" as const,
      validation: z.string(),
      label: "Product ID",
      placeholder: "Enter product id",
      space: 1,
      editable: false,
    };

    return {
      ...formConfig,
      defaultValues: {
        name: roleData.name,
        id: roleData.id,
        description: roleData.description,
        status: roleData.status,
        permissions: roleData.rolePermissions.map((item) =>item.permission.id ),
      },
      fields: [idField, ...formConfig.fields],
    };
  };

  return (
    <PageContainer>
      <DynamicForm config={getFormConfig()} />
    </PageContainer>
  );
};

export default RoleScreen;
