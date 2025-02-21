import DynamicForm from "@/components/dashbaord/GloabalForm/DynamicForm";
import PageContainer from "@/components/dashbaord/PageContainer";
import { storeFormConfig } from "./config";

const NewStore = () => {
  return (
    <PageContainer>
      <DynamicForm config={storeFormConfig} />
    </PageContainer>
  );
};

export default NewStore;
