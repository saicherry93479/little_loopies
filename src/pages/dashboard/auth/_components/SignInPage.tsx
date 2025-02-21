import DynamicForm from "@/components/dashbaord/GloabalForm/DynamicForm";
import { signInConfig } from "./SigninFormConfig";

export default function SignInViewPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <DynamicForm config={signInConfig}></DynamicForm>

          <a
            href="/dashboard/auth/forgotpassword"
            className="px-8 text-center text-sm  underline  cursor-pointer text-muted-foreground"
          >
            Forgot Password
          </a>
        </div>
      </div>
    </div>
  );
}
