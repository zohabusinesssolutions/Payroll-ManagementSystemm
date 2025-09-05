"use client"

import { type Control, Controller, type FieldErrors } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { FormFieldConfig } from "./adminity-drawer"

interface FormFieldRendererProps {
  field: FormFieldConfig
  control: Control<any>
  errors: FieldErrors
}

export function FormFieldRenderer({ field, control, errors }: FormFieldRendererProps) {
  // Handle nested field errors (like permissions.FINANCE.accessScope)
  const getNestedError = (fieldName: string, errors: FieldErrors): any => {
    const keys = fieldName.split(".")
    let current = errors

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key] as any
      } else {
        return null
      }
    }

    return current
  }

  const error = getNestedError(field.name, errors)
  const errorMessage = error?.message as string

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "date":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Input
                {...controllerField}
                type={field.type}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={cn(error && "border-red-500", field.className)}
              />
            )}
          />
        )

      case "number":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Input
                {...controllerField}
                type="number"
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={cn(error && "border-red-500", field.className)}
                value={controllerField.value === 0 ? "0" : controllerField.value || ""}
                onChange={(e) => controllerField.onChange(e.target.value ? Number(e.target.value) : "")}
              />
            )}
          />
        )

      case "textarea":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Textarea
                {...controllerField}
                placeholder={field.placeholder}
                disabled={field.disabled}
                className={cn(error && "border-red-500", field.className)}
              />
            )}
          />
        )

      case "select":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Select onValueChange={controllerField.onChange} value={controllerField.value} disabled={field.disabled}>
                <SelectTrigger className={cn(error && "border-red-500", field.className) + " w-full"}>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option: { label: string; value: string | number }) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )

      case "checkbox":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.name}
                  checked={controllerField.value}
                  onCheckedChange={controllerField.onChange}
                  disabled={field.disabled}
                  className={cn(error && "border-red-500", field.className)}
                />
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.label}
                </Label>
              </div>
            )}
          />
        )

      case "radio":
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <RadioGroup
                onValueChange={controllerField.onChange}
                value={controllerField.value}
                disabled={field.disabled}
                className={cn("flex flex-col space-y-2", field.className)}
              >
                {field.options?.map((option: { label: string; value: string | number }) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option.value.toString()}
                      id={`${field.name}-${option.value}`}
                      className={cn(error && "border-red-500")}
                    />
                    <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        )

      default:
        return null
    }
  }

  if (field.type === "checkbox") {
    return (
      <div className="space-y-1.5">
        {renderField()}
        {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
        {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.name} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
      {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </div>
  )
}
