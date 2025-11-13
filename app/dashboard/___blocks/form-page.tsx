"use client";

import { SubmitButton } from "@app/dashboard/___blocks/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { cn } from "@lib/utils";
import React, { createContext, useContext } from "react";

interface FormPageContextType {
  isEditMode: boolean;
}

const FormPageContext = createContext<FormPageContextType | null>(null);

const useFormPage = () => {
  const context = useContext(FormPageContext);
  if (!context) {
    throw new Error("useFormPage must be used within a <FormPage> component.");
  }
  return context;
};

interface FormPageProps extends React.HTMLAttributes<HTMLDivElement> {
  isEditMode: boolean;
}

function FormPage({ isEditMode, className, ...props }: FormPageProps) {
  return (
    <FormPageContext.Provider value={{ isEditMode }}>
      <Card className={cn("w-full", className)} {...props} />
    </FormPageContext.Provider>
  );
}

export function FormPageHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <CardHeader {...props} />;
}
export function FormPageTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <CardTitle {...props} />;
}
export function FormPageDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <CardDescription {...props} />;
}
export function FormPageContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <CardContent {...props} />;
}
export function FormPageActions(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="flex justify-between items-center mt-8 pt-6 border-t" {...props} />;
}
export function FormPageSubmitButton({ createText = "Create", updateText = "Save Changes", pendingText = "Saving..." }) {
  const { isEditMode } = useFormPage();
  return <SubmitButton isEditMode={isEditMode} createText={createText} updateText={updateText} pendingText={pendingText} />;
}

export default FormPage;
