'use client'
import PageContainer from "@/components/dashbaord/PageContainer";
import DynamicForm from "@/components/dashbaord/GloabalForm/DynamicForm";
import { formConfig } from "./config";
import { z } from "zod";

const NewUserScreen = ({ productData }: any) => {
  console.log(productData)
  const getFormConfig = () => {
    if (!productData) return formConfig;

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
        name : productData.name,
        id: productData.id,
        description: productData.description,
        images : productData.images,
        isWholesaleEnabled: productData.isWholesaleEnabled,
        category: productData.categories[0].categoryId,
        userPrice : productData.userPrice,
        userDiscountPercentage: productData.userDiscountPercentage,
        activeForUsers : productData.activeForUsers,
        pricing: productData.wholesalePriceTiers.map((item) => ({
          quantity: item.quantity,
          price: item.pricePerUnit,
        })),
      },
      fields: [idField, ...formConfig.fields],
    };
  };

  return (
    <PageContainer>
      <DynamicForm config={formConfig} />
    </PageContainer>
  );
};

export default NewUserScreen;
