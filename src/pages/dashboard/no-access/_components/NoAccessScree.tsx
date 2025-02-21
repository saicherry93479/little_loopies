import { Button } from "@/components/ui/button";
import React from "react";

const NoAccessScree = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <div className="flex flex-col gap-8 items-center px-4">
        <p className="text-[18px] text-center ">
          You Don't Have Access to the Page , that your are trying to access.
        </p>
        <Button className="w-fit">Contact Company</Button>
      </div>
    </div>
  );
};

export default NoAccessScree;
