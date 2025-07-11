import PageContainer from "@/components/dashbaord/PageContainer";
import DynamicForm from "@/components/dashbaord/GloabalForm/DynamicForm";
import { formConfig } from "./config";
import { z } from "zod";

const SamplePage = ({ productData }: any) => {
  console.log("productData ", productData);
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

    // console.log(
    //   productData.wholesalePriceTiers.map((item, i) => ({
    //     [`quantity_${i}`]: item.quantity,
    //     [`price_${i}`]: item.pricePerUnit,
    //   }))
    // );
    return {
      ...formConfig,
      defaultValues: {
        ...{
          name: productData.name,
          id: productData.id,
          description: productData.description,
          productQuantity: productData.productQuantity,
          brand: productData.brand || "",
          gender: productData.gender || "",
          images: productData.images,
          isWholesaleEnabled: productData.isWholesaleEnabled,

          userPrice: productData.userPrice,
          weight: productData.productWeight,
          userDiscountPercentage: productData.userDiscountPercentage,
          activeForUsers: productData.activeForUsers,
          pricing: productData.wholesalePriceTiers.map((item, i) => ({
            quantity: item.quantity,
            price: item.pricePerUnit,
          })),
        },
        ...(productData.categories.length > 0
          ? { categories: productData.categories[0].categoryId }
          : {}),
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

export default SamplePage;