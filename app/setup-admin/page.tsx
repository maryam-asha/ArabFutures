"use client";

import { Button } from "@components/ui/button";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { useState, useTransition } from "react";

import { createAdminUserAction } from "./actions";

export default function SetupAdminPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | false>(false);

  const handleCreateAdmin = () => {
    startTransition(async () => {
      const result = await createAdminUserAction();
      setMessage(result.message);
      setIsSuccess(result.success);
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Initial Admin Setup</h1>
          <p className="mt-2 text-gray-600">Use this page only once to create the first administrator account.</p>
        </div>

        <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <ShieldAlert className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Security Warning</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  This page provides unrestricted access to create an admin user. After successfully creating the user, you <strong>MUST DELETE</strong> the entire `/app/setup-admin` folder from your project to secure your application.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="mb-4 text-gray-700">Click the button below to create a user with the following credentials:</p>
          <div className="mb-6 space-y-2">
            <p>
              <strong>Username:</strong> <code className="bg-gray-200 px-2 py-1 rounded">admin</code>
            </p>
            <p>
              <strong>Password:</strong> <code className="bg-gray-200 px-2 py-1 rounded">admin123</code>
            </p>
          </div>

          <Button onClick={handleCreateAdmin} disabled={isPending || isSuccess} size="lg" className="w-full">
            {isPending ? "Creating Admin..." : "Create Admin User"}
          </Button>
        </div>

        {message && (
          <div className={`flex items-center gap-3 rounded-lg p-4 text-sm ${isSuccess ? "bg-green-50 text-green-800" : "bg-yellow-50 text-yellow-800"}`}>
            {isSuccess ? <CheckCircle /> : <AlertTriangle />}
            <p>{message}</p>
          </div>
        )}
      </div>
    </main>
  );
}
