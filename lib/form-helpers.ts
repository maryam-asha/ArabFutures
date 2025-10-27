import { type FieldPath, type FieldValues, type UseFormSetError } from "react-hook-form";

/**
 * A universal, recursive helper to parse server-side validation errors
 * and apply them to a react-hook-form instance.
 *
 * This function is designed to handle a specific, structured error object from the server:
 * {
 *   errors: ["Message for this field"],
 *   properties: {
 *     nestedField: {
 *       errors: ["Message for nested field"],
 *       properties: { ... }
 *     }
 *   }
 * }
 *
 * @param errors - The structured error object from the server.
 * @param setError - The `setError` function from react-hook-form's `useForm` hook.
 * @param path - The base path for nested fields (used internally for recursion).
 */
export function setServerErrors<T extends FieldValues>(errors: any, setError: UseFormSetError<T>, path: string = "") {
  // Set the error for the current field if it has any messages
  if (errors?.errors && errors.errors.length > 0) {
    // We must ensure 'path' is a valid key of the form values
    setError(path as FieldPath<T>, {
      type: "server",
      message: errors.errors[0], // Display the first error message
    });
  }

  // Recurse into the nested properties
  if (errors?.properties) {
    for (const key in errors.properties) {
      const newPath = path ? `${path}.${key}` : key;
      setServerErrors(errors.properties[key], setError, newPath);
    }
  }
}
