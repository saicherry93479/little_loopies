import PageContainer from "@/components/dashbaord/PageContainer";
import DynamicForm from "@/components/dashbaord/GloabalForm/DynamicForm";
import { formConfig } from "./config";
import { z } from "zod";

const PermissionScreen = ({ permissionData }: any) => {
  console.log(permissionData)
  const getFormConfig = () => {
    if (!permissionData) return formConfig;

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
        name : permissionData.name,
        id: permissionData.id,
        description: permissionData.description,
        
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

export default PermissionScreen;
