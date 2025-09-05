"use client"

import { useState } from "react"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { FormFieldRenderer } from "./form-field-renderer"

export interface FormFieldConfig {
  name: string
  label: string
  type: "text" | "email" | "password" | "number" | "textarea" | "select" | "checkbox" | "radio" | "date"
  placeholder?: string
  required?: boolean
  zodSchema?: z.ZodTypeAny
  options?: { label: string; value: string | number }[]
  defaultValue?: any
  disabled?: boolean
  className?: string
  description?: string
}

export interface FormGroupConfig {
  title: string
  description?: string
  fields: FormFieldConfig[]
  className?: string
}

export interface AdminityDrawerConfig {
  title: string
  description?: string
  groups?: FormGroupConfig[]
  fields?: FormFieldConfig[]
  submitText?: string
  cancelText?: string
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full"
  side?: "left" | "right" | "bottom"
  zodSchema?: z.ZodTypeAny
  onSubmit: (data: any) => Promise<void> | void
  onCancel?: () => void
  loading?: boolean
  defaultValues?: Record<string, any>
  className?: string
}

export interface AdminityDrawerProps {
  config: AdminityDrawerConfig
  trigger?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: Record<string, any>
  mode?: "create" | "edit"
}

export function AdminityDrawer({ config, trigger, open, onOpenChange, data, mode = "create" }: AdminityDrawerProps) {
  // Generate Zod schema from field configurations if not provided
  const generateZodSchema = () => {
    if (config.zodSchema) {
      return config.zodSchema
    }

    const allFields = config.groups ? config.groups.flatMap((group) => group.fields) : config.fields || []

    const schemaObject: Record<string, z.ZodTypeAny> = {}

    allFields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny

      if (field.zodSchema) {
        fieldSchema = field.zodSchema
      } else {
        switch (field.type) {
          case "email":
            fieldSchema = z.string().email("Please enter a valid email address")
            break
          case "number":
            fieldSchema = z.number({
              invalid_type_error: "Please enter a valid number",
            })
            break
          case "date":
            fieldSchema = z.string().min(1, "Please select a date")
            break
          case "checkbox":
            fieldSchema = z.boolean()
            break
          case "select":
          case "radio":
            if (field.options && field.options.length > 0) {
              const validValues = field.options.map((opt) => opt.value.toString())
              fieldSchema = z.enum(validValues as [string, ...string[]], {
                errorMap: () => ({ message: "Please select a valid option" }),
              })
            } else {
              fieldSchema = z.string()
            }
            break
          default:
            fieldSchema = z.string()
        }

        if (field.required && field.type !== "checkbox") {
          if (fieldSchema instanceof z.ZodString) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`)
          } else if (fieldSchema instanceof z.ZodNumber) {
            fieldSchema = fieldSchema.min(0.01, `${field.label} is required`)
          }
        }

        if (!field.required) {
          fieldSchema = fieldSchema.optional()
        }
      }

      schemaObject[field.name] = fieldSchema
    })

    return z.object(schemaObject)
  }

  const zodSchema = generateZodSchema()
  const allFields = config.groups ? config.groups.flatMap((group) => group.fields) : config.fields || []

  // Get default values from multiple sources
  const getDefaultValues = () => {
    const fieldDefaults = allFields.reduce(
      (acc, field) => {
        // Handle nested field names (like permissions.FINANCE.accessScope)
        if (field.name.includes(".")) {
          const keys = field.name.split(".")
          let current = acc

          // Create nested structure
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              current[keys[i]] = {}
            }
            current = current[keys[i]]
          }

          // Set the final value
          current[keys[keys.length - 1]] = field.defaultValue || (field.type === "checkbox" ? false : "")
        } else {
          acc[field.name] = field.defaultValue || (field.type === "checkbox" ? false : "")
        }
        return acc
      },
      {} as Record<string, any>,
    )

    return {
      ...fieldDefaults,
      ...config.defaultValues,
      ...(mode === "edit" ? data : {}), // Only use data for edit mode
    }
  }

  // Use react-hook-form for form state management
  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues: getDefaultValues(),
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form when external data changes or mode changes
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues())
    }
  }, [open, data, mode])

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      setIsSubmitting(true)
      const validatedData = zodSchema.parse(formData)
      await config.onSubmit(validatedData)
      onOpenChange(false)
      form.reset()
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            form.setError(err.path[0] as string, {
              type: "manual",
              message: err.message,
            })
          }
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  })

  const handleCancel = () => {
    config.onCancel?.()
    onOpenChange(false)
    form.reset(getDefaultValues())
  }

  const getDrawerWidth = () => {
    switch (config.width) {
      case "sm":
        return "max-w-sm"
      case "md":
        return "max-w-md"
      case "lg":
        return "max-w-lg"
      case "xl":
        return "max-w-xl"
      case "2xl":
        return "max-w-2xl"
      case "3xl":
        return "max-w-3xl"
      case "4xl":
        return "max-w-4xl"
      case "full":
        return "max-w-full"
      default:
        return "max-w-2xl"
    }
  }

  const renderGroup = (group: FormGroupConfig, index: number) => (
    <div key={group.title} className="space-y-3">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900 mb-1">{group.title}</h3>
        {group.description && <p className="text-sm text-gray-500">{group.description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {group.fields.map((field) => {
          const isFullWidth =
            field.type === "textarea" ||
            field.name.toLowerCase().includes("address") ||
            field.name.toLowerCase().includes("description") ||
            field.className?.includes("w-full") ||
            field.className?.includes("col-span-2")

          return (
            <div key={field.name} className={cn(isFullWidth ? "md:col-span-2" : "col-span-1", field.className)}>
              <FormFieldRenderer field={field} control={form.control} errors={form.formState.errors} />
            </div>
          )
        })}
      </div>
    </div>
  )

  // Use loading from config or internal loading state
  const isLoading = config.loading || isSubmitting

  const formContent = (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {config.groups ? (
            config.groups.map((group, index) => renderGroup(group, index))
          ) : (
            <div className="grid gap-3">
              {config.fields?.map((field) => (
                <FormFieldRenderer
                  key={field.name}
                  field={field}
                  control={form.control}
                  errors={form.formState.errors}
                />
              ))}
            </div>
          )}
        </div>
        <div className="border-t p-3 mt-2 bg-white">
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Submitting..." : config.submitText || "Submit"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              {config.cancelText || "Cancel"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )

  const drawerContent = (
    <>
      {config.side === "left" || config.side === "right" ? (
        <Sheet open={open} onOpenChange={onOpenChange}>
          {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
          <SheetContent side={config.side} className={cn("w-full sm:max-w-2xl flex flex-col", config.className)}>
            <SheetHeader className="pb-3 px-4 border-b">
              <SheetTitle className="text-lg">{mode === "edit" ? `Edit ${config.title}` : config.title}</SheetTitle>
              {config.description && <SheetDescription className="text-sm">{config.description}</SheetDescription>}
            </SheetHeader>
            <div className="flex-1 overflow-hidden">{formContent}</div>
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
          <DrawerContent className={cn(getDrawerWidth(), "mx-auto flex flex-col max-h-[90vh]", config.className)}>
            <DrawerHeader className="pb-3 px-4 border-b">
              <DrawerTitle className="text-lg">{mode === "edit" ? `Edit ${config.title}` : config.title}</DrawerTitle>
              {config.description && <DrawerDescription className="text-sm">{config.description}</DrawerDescription>}
            </DrawerHeader>
            <div className="flex-1 overflow-hidden">{formContent}</div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )

  return drawerContent
}
