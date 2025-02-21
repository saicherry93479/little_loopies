import DynamicForm from "@/components/dashbaord/GloabalForm/DynamicForm";
import { forgotConfig } from "./config";

const ForgotPasswordScreen = () => {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <DynamicForm config={forgotConfig}></DynamicForm>
          <p className="px-8 text-center text-sm    cursor-pointer text-muted-foreground">
            Please Enter email of your account
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
