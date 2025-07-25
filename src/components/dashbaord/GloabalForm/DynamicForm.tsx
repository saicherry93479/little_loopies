import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SearchableSelect } from "./SearchableSelect";
import type { FieldConfig, FormConfig } from "@/types";
import { FileUploader } from "./FileUploader";
import { SearchableMultiSelect } from "./SearchableMultiSelect";
import { getColumnClass, getGridClass, validateFiles } from "./utils";
import { useToast } from "@/hooks/use-toast";

interface FileState {
  file: File | null;
  preview: string;
  name?: string;
  size?: number;
  isExisting?: boolean;
}

const DynamicForm = ({
  config: {
    title,
    fields,
    columns = 2,
    onSubmit,
    onFileUpload,
    defaultValues = null,
    onsuccess = "",
  },
}: {
  config: FormConfig;
}) => {
  const { toast } = useToast();
  const [fileStates, setFileStates] = useState<Record<string, FileState[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicGroups, setDynamicGroups] = useState<Record<string, number[]>>(
    {}
  );

  // Track unique identifiers for dynamic groups
  const [dynamicGroupIdentifiers, setDynamicGroupIdentifiers] = useState<Record<string, string[]>>({});

  React.useEffect(() => {
    const initialGroups: Record<string, number[]> = {};
    const initialIdentifiers: Record<string, string[]> = {};
    
    fields.forEach((field) => {
      if (field.type === "dynamicGroup") {
        const defaultGroupLength = defaultValues?.[field.name]?.length || 1;
        initialGroups[field.name] = Array.from(
          { length: defaultGroupLength },
          (_, i) => i
        );
        
        // Generate unique identifiers for each group
        initialIdentifiers[field.name] = Array.from(
          { length: defaultGroupLength },
          () => Math.random().toString(36).substring(2, 9)
        );
      }
    });
    setDynamicGroups(initialGroups);
    setDynamicGroupIdentifiers(initialIdentifiers);
  }, [fields, defaultValues]);

  useEffect(() => {
    if (defaultValues) {
      console.log("defaultValues ", defaultValues);
      const initialFileStates: Record<string, FileState[]> = {};
      fields.forEach((field) => {
        if (field.type === "file" && defaultValues[field.name]) {
          initialFileStates[field.name] = (
            defaultValues[field.name] as string[]
          ).map((url) => ({
            file: null,
            preview: url,
            isExisting: true,
          }));
        }
      });
      setFileStates(initialFileStates);
    }
  }, [defaultValues, fields]);

  const handleFileChange = (fieldName: string, newFiles: FileState[]) => {
    // Extract the base field name and any parent group identifiers
    const parts = fieldName.split('.');
    const baseFieldName = parts[parts.length - 1];
    const parentPath = parts.slice(0, -1).join('.');
    
    setFileStates((prev) => {
      // Use the full field path as the key to ensure uniqueness
      const existingFiles = prev[fieldName] || [];
      
      const newFileStates = newFiles.map((fileState) => ({
        file: fileState.file,
        preview: URL.createObjectURL(fileState?.file),
        isExisting: false,
        fieldId: fieldName // Use the full field path as the identifier
      }));

      return {
        ...prev,
        [fieldName]: [...existingFiles, ...newFileStates],
      };
    });
  };

  const removeFile = (fieldName: string, index: number) => {
    setFileStates((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));
  };

  const createSchema = () => {
    const schemaObject: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.type === "dynamicGroup") {
        const groupSchema: Record<string, any> = {};
        const groupIndices = dynamicGroups[field.name] || [0];
        
        // Add validation for the dynamic group itself
        schemaObject[field.name] = field.validation || z.any();
        
        field.dynamicFields?.forEach((subField) => {
          groupIndices.forEach((index) => {
            groupSchema[`${subField.name}_${index}`] = subField.validation;
          });
        });
        schemaObject[field.name] = z.object(groupSchema);
      } else if (field.name.includes(".")) {
        // For nested fields like "storeAddress.street"
        const [parentKey, childKey] = field.name.split(".");

        // Ensure the parent schema exists as an object
        if (!schemaObject[parentKey]) {
          schemaObject[parentKey] = z.object({}).passthrough();
        }

        // Append child validation
        schemaObject[parentKey] = schemaObject[parentKey].extend({
          [childKey]: field.validation,
        });
      } else {
        schemaObject[field.name] = field.validation;
        schemaObject[field.name] =
          field.inputType === "number"
            ? field.validation.pipe(z.coerce.number())
            : field.validation;
      }
    });

    return z.object(schemaObject);
  };

  const formSchema = createSchema();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      ...(defaultValues &&
        Object.fromEntries(
          fields
            .filter((field) => field.type === "dynamicGroup")
            .map((field) => {
              const groupValues = defaultValues[field.name] || [];
              const transformedGroup = {};

              groupValues.forEach((item: any, index: number) => {
                field.dynamicFields?.forEach((subField) => {
                  transformedGroup[`${subField.name}_${index}`] =
                    item[subField.name];
                });
              });

              return [field.name, transformedGroup];
            })
        )),
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("dynamic form ", values);
      
      // Validate that each color variant has at least one size
      if (values.colorVariants) {
        const colorVariants = values.colorVariants;
        const indices = dynamicGroups['colorVariants'] || [0];
        
        for (let i = 0; i < indices.length; i++) {
          const hasSizes = indices.some(index => 
            colorVariants[`sizes_${index}`] && 
            Array.isArray(colorVariants[`sizes_${index}`]) && 
            colorVariants[`sizes_${index}`].length > 0
          );
          
          if (!hasSizes) {
            toast({
              title: "Validation Error",
              description: `Each color variant must have at least one size`,
              variant: "destructive",
            });
            return;
          }
        }
      }
      
      setIsSubmitting(true);
      const fileFields = fields.filter((f) => f.type === "file");
      console.log("files are ", fileFields);
      const uploadPromises = fileFields.map(async (field) => {
        // Get files for this specific field
        const fieldName = field.name;
        
        // For regular file fields
        if (!fieldName.includes('.')) {
          const fieldFiles = fileStates[fieldName] || [];
          // Only upload new files
          const filesToUpload = fieldFiles
            .filter((fileState) => !fileState.isExisting && fileState.file)
            .map((fileState) => fileState.file!);
            
          let uploadedUrls: string[] = [];
          if (filesToUpload.length > 0) {
            uploadedUrls = (await onFileUpload?.(filesToUpload)) || [];
            if (uploadedUrls.length === 0) {
              toast({
                title: "Unable to do action",
                variant: "destructive",
                description: "Please try after sometime/try to contact company",
              });
              return { [fieldName]: [] };
            }
          }
          
          // Combine existing URLs with new uploaded URLs
          const allUrls = fieldFiles
            .map((fileState) =>
              !fileState.isExisting ? uploadedUrls.shift() : fileState.preview
            )
            .filter(Boolean) as string[];
            
          return { [fieldName]: allUrls };
        }
        
        // For dynamic group file fields, we need to handle them differently
        // We'll collect all the file states that match the pattern for this field
        const dynamicFieldFiles: Record<string, FileState[]> = {};
        Object.entries(fileStates).forEach(([key, files]) => {
          if (key.startsWith(`${fieldName}_`)) {
            dynamicFieldFiles[key] = files;
          }
        });
        
        // Process each dynamic field separately
        const dynamicFieldPromises = Object.entries(dynamicFieldFiles).map(async ([key, files]) => {
          const filesToUpload = files
            .filter((fileState) => !fileState.isExisting && fileState.file)
            .map((fileState) => fileState.file!);
            
          if (filesToUpload.length === 0) {
            return { [key]: files.map(f => f.preview).filter(Boolean) };
          }
          
          const uploadedUrls = (await onFileUpload?.(filesToUpload)) || [];
          if (uploadedUrls.length === 0 && filesToUpload.length > 0) {
            toast({
              title: "Unable to upload files",
              variant: "destructive",
              description: "Please try after sometime",
            });
            return { [key]: [] };
          }
          
          const allUrls = files
            .map((fileState) =>
              !fileState.isExisting ? uploadedUrls.shift() : fileState.preview
            )
            .filter(Boolean) as string[];
            
          return { [key]: allUrls };
        });
        
        const results = await Promise.all(dynamicFieldPromises);
        const combinedResults = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        
        // Now we need to organize these by their group index
        const groupedUrls: Record<number, string[]> = {};
        Object.entries(combinedResults).forEach(([key, urls]) => {
          // Extract the index from the key (e.g., "colorVariants.images_0_abc123" -> 0)
          const match = key.match(/_(\d+)_/);
          if (match && match[1]) {
            const index = parseInt(match[1], 10);
            groupedUrls[index] = urls as string[];
          }
        });
        
        return { [`${fieldName}UrlsByIndex`]: groupedUrls };
      });
      
      const uploadResults = await Promise.all(uploadPromises);
      const fileUrls = uploadResults.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      
      // Transform dynamic group values into a more usable format
      const transformedValues = { ...values };
      fields.forEach((field) => {
        if (field.type === "dynamicGroup" && field.dynamicFields) {
          const groupData: any[] = [];
          const indices = dynamicGroups[field.name] || [0];
          
          indices.forEach((index) => {
            const groupItem: any = {};
            field.dynamicFields?.forEach((subField) => {
              // Handle nested dynamic groups
              if (subField.type === "dynamicGroup" && subField.dynamicFields) {
                const nestedIndices = dynamicGroups[`${field.name}.${subField.name}`] || [0];
                const nestedItems: any[] = [];
                
                nestedIndices.forEach((nestedIndex) => {
                  const nestedItem: any = {};
                  subField.dynamicFields?.forEach((nestedField) => {
                    const key = `${subField.name}_${nestedIndex}_${index}`;
                    nestedItem[nestedField.name] = transformedValues[field.name]?.[key];
                  });
                  nestedItems.push(nestedItem);
                });
                
                groupItem[subField.name] = nestedItems;
              } else if (subField.type === "file") {
                // For file fields in dynamic groups, use the uploaded URLs
                const urlsByIndex = fileUrls[`${field.name}.${subField.name}UrlsByIndex`] || {};
                groupItem[subField.name] = urlsByIndex[index] || [];
              } else {
                // Regular field
                groupItem[subField.name] = 
                  transformedValues[field.name]?.[`${subField.name}_${index}`];
              }
            });
            groupData.push(groupItem);
          });
          transformedValues[field.name] = groupData;
        }
      });
      
      // Add regular file fields
      const regularFileUrls = Object.entries(fileUrls)
        .filter(([key]) => !key.includes('UrlsByIndex'))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
      const finalValues = { ...transformedValues, ...regularFileUrls };
      console.log("Final values to submit:", finalValues);
      
      const resp = await onSubmit(
        finalValues,
        defaultValues ? true : false
      );
      if (resp.data.success) {
        toast({
          title: "success",
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
        if (onsuccess) {
          window.location.href = onsuccess;
        }
      } else {
        toast({
          title: "Unable to do action",
          variant: "destructive",
          description: resp.data.message,
        });
      }

      if (resp.data.success) {
        const initialGroups: Record<string, number[]> = {};
        fields.forEach((field) => {
          if (field.type === "dynamicGroup") {
            initialGroups[field.name] = [0];
          }
        });
        setDynamicGroups(initialGroups);
        // window.location.href = "/dashboard/categories";
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDynamicGroup = (fieldName: string) => {
    setDynamicGroups((prev) => {
      const currentIndices = prev[fieldName] || [0];
      const newIndex = Math.max(...currentIndices) + 1;
      return {
        ...prev,
        [fieldName]: [...currentIndices, newIndex],
      };
    });
    
    // Add a new unique identifier for this group
    setDynamicGroupIdentifiers((prev) => {
      const currentIdentifiers = prev[fieldName] || [];
      return {
        ...prev,
        [fieldName]: [...currentIdentifiers, Math.random().toString(36).substring(2, 9)]
      };
    });
  };

  const removeDynamicGroup = (fieldName: string, indexToRemove: number) => {
    setDynamicGroups((prev) => {
      const currentIndices = prev[fieldName] || [0];
      if (currentIndices.length <= 1) return prev; // Maintain minimum of 1 group

      const newIndices = currentIndices.filter(
        (index) => index !== indexToRemove
      );
      return {
        ...prev,
        [fieldName]: newIndices,
      };
    });
    
    // Remove the corresponding identifier
    setDynamicGroupIdentifiers((prev) => {
      const currentIdentifiers = prev[fieldName] || [];
      if (currentIdentifiers.length <= 1) return prev;
      
      return {
        ...prev,
        [fieldName]: currentIdentifiers.filter((_, i) => i !== indexToRemove)
      };
    });

    // Clear form values for removed group
    const fieldsToClear: string[] = [];
    fields
      .find((f) => f.name === fieldName)
      ?.dynamicFields?.forEach((subField) => {
        fieldsToClear.push(`${fieldName}.${subField.name}_${indexToRemove}`);
      });

    fieldsToClear.forEach((fieldName) => {
      form.unregister(fieldName);
    });
  };

  const renderDynamicGroup = (field: FieldConfig) => {
    const indices = dynamicGroups[field.name] || [0];
    const identifiers = dynamicGroupIdentifiers[field.name] || indices.map(() => Math.random().toString(36).substring(2, 9));
    const defaultGroupValues = defaultValues?.[field.name] || [];

    return (
      <div className={`grid ${getGridClass(columns)} gap-6`}>
        {indices.map((index, arrayIndex) => {
          const defaultValue = defaultGroupValues[index] || {};
          const groupIdentifier = identifiers[arrayIndex] || Math.random().toString(36).substring(2, 9);
          
          return (
            <div
              key={`${field.name}_${index}`}
              className={`${getColumnClass(field.space)}   rounded-lg relative`}
            >
              <div className="flex gap-4 flex-wrap">
                {field.dynamicFields?.map((subField) => (
                  subField.type === "file" ? (
                    <FormField
                      key={`${subField.name}_${index}`}
                      control={form.control}
                      name={`${field.name}.${subField.name}_${index}`}
                      render={({ field: formField }) => (
                        <FormItem
                          className={`flex-1 min-w-[200px] ${getColumnClass(subField.space)}`}
                        >
                          <FormLabel>{subField.label}</FormLabel>
                          <FormControl>
                            <FileUploader
                              field={{
                                ...subField,
                                name: `${field.name}.${subField.name}_${index}_${groupIdentifier}`
                              }}
                              onFileChange={handleFileChange}
                              onFileRemove={removeFile}
                              files={fileStates[`${field.name}.${subField.name}_${index}_${groupIdentifier}`] || []}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                  <FormField
                    key={`${subField.name}_${index}`}
                    control={form.control}
                    name={`${field.name}.${subField.name}_${index}`}
                    // defaultValue={defaultValue[subField.name]}
                    render={({ field: formField }) => (
                      <FormItem
                        className={`flex-1 min-w-[200px] ${getColumnClass(subField.space)}`}
                      >
                        <FormLabel>{subField.label}</FormLabel>
                        <FormControl>
                          {renderFormControl(subField, formField)}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  )
                ))}
              </div>
              <div className="absolute bottom-0 right-0 flex gap-2">
                {indices.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="bg-red-500"
                    onClick={() => removeDynamicGroup(field.name, index)}
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                )}
                {index === Math.max(...indices) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="bg-zinc-800 text-white"
                    onClick={() => addDynamicGroup(field.name)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderFormControl = (field: FieldConfig, formField: any) => {
    const isEditable = field.editable !== false;
    const commonProps = {
      ...formField,
      disabled: !isEditable,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "dynamicGroup":
        return renderDynamicGroup(field);
      case "input":
        return (
          <Input
            {...commonProps}
            type={field.inputType || "text"}
            onChange={(e) => {
              const value =
                field.inputType === "number"
                  ? e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                  : e.target.value;
              formField.onChange(value);
            }}
          />
        );
      case "textarea":
        return (
          <Textarea
            {...commonProps}
            className={`resize-none ${!isEditable ? "opacity-75" : ""}`}
          />
        );
      case "multiselect":
        return (
          <SearchableMultiSelect
            field={field}
            value={formField.value}
            onChange={formField.onChange}
            options={field.options || []}
          />
        );

      case "file":
        return (
          <FileUploader
            field={field}
            onFileChange={handleFileChange}
            onFileRemove={removeFile}
            files={fileStates[field.name] || []}
          />
        );

      case "select":
        return field.isSearchable ? (
          <SearchableSelect
            field={field}
            value={formField.value}
            onChange={isEditable ? formField.onChange : undefined}
            options={field.options || []}
            placeholder={field.placeholder}
            disabled={!isEditable}
          />
        ) : (
          <Select
            onValueChange={isEditable ? formField.onChange : undefined}
            value={formField.value}
            disabled={!isEditable}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.label} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };
  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className={`grid gap-6 ${getGridClass(columns)}`}>
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={`col-span-1 ${getColumnClass(field.space)}`}
                >
                  {field.type === "dynamicGroup" ? (
                    <div className="space-y-2">
                      <h3 className="font-medium">{field.label}</h3>
                      {renderDynamicGroup(field)}
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name={field.name}
                      render={({ field: formField }) => (
                        <FormItem>
                          <FormLabel>{field.label}</FormLabel>
                          <FormControl>
                            {renderFormControl(field, formField)}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DynamicForm;
