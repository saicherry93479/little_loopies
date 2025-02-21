import { Copy } from "lucide-react";
import React from "react";
import { useToast } from "@/hooks/use-toast";

const CopyText = ({ text = "" }) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: `Successfully copied: "${text}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      onClick={handleCopy}
      title="Copy to clipboard"
      className="cursor-pointer"
    >
      <Copy className="w-4 h-4" />
    </div>
  );
};

export default CopyText;
