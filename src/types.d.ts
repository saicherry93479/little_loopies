import { z } from "zod";

export interface FieldConfig {
  name: string;
  type: "input" | "textarea" | "select" | "multiselect" | "file" | "dynamicGroup";
  validation: z.ZodType<any>;
  label: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  isSearchable?: boolean;
  inputType?: string;
  space?: number;
  editable?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  dynamicFields?: FieldConfig[];
  condition?: (values: any) => boolean;
}

export interface FormConfig {
  title: string;
  fields: FieldConfig[];
  columns?: number;
  onSubmit: (values: any, isUpdate: boolean) => Promise<any>;
  onFileUpload?: (files: File[]) => Promise<string[]>;
  defaultValues?: any;
  onsuccess?: string;
}