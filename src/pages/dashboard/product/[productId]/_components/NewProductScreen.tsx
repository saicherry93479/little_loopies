import React from 'react';
import PageContainer from "@/components/dashbaord/PageContainer";
import DynamicForm from "@/components/dashbaord/GloabalForm/DynamicForm";
import { formConfig, transformProductDataForForm } from "./config";
import { z } from "zod";

interface ProductPageProps {
  productData?: any;
}

const EnhancedProductPage: React.FC<ProductPageProps> = ({ productData }) => {
  console.log("productData ", productData);
  
  const getFormConfig = () => {
    if (!productData) return formConfig;

    // Add ID field for update mode
    const idField = {
      name: "id",
      type: "input" as const,
      validation: z.string(),
      label: "Product ID",
      placeholder: "Enter product id",
      space: 1,
      editable: false,
    };

    // Transform the product data to match form structure
    const transformedData = transformProductDataForForm(productData);

    return {
      ...formConfig,
      defaultValues: transformedData,
      fields: [idField, ...formConfig.fields],
    };
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {productData ? 'Edit Product' : 'Add New Product'}
          </h1>
          {productData && (
            <div className="text-sm text-gray-500">
              Product ID: {productData.id}
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <DynamicForm config={getFormConfig()} />
        </div>
      </div>
    </PageContainer>
  );
};

export default EnhancedProductPage;