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
  if (errors?.errors && errors.errors.length > 0) {
    setError(path as FieldPath<T>, {
      type: "server",
      message: errors.errors[0],
    });
  }

  if (errors?.properties) {
    for (const key in errors.properties) {
      const newPath = path ? `${path}.${key}` : key;
      setServerErrors(errors.properties[key], setError, newPath);
    }
  }
}
