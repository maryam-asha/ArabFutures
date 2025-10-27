// import { getTranslations } from "next-intl/server";
// import { ZodErrorMap, ZodIssueCode, z } from "zod";

// // This is our custom error map. It overrides Zod's default messages.
// const customErrorMap: ZodErrorMap = (issue, ctx) => {
//   // We'll create a structured object with a key and params for translation.
//   const i18nData: { key: string; params?: Record<string, any> } = { key: "" };

//   // Map Zod's issue codes to our translation keys
//   switch (issue.code) {
//     case ZodIssueCode.invalid_type:
//       if (issue.expected === "string") i18nData.key = "zod.errors.required";
//       break;
//     case ZodIssueCode.too_small:
//       if (issue.type === "string") {
//         i18nData.key = "zod.errors.too_small_string";
//         i18nData.params = { minimum: issue.minimum };
//       }
//       break;
//     case ZodIssueCode.invalid_string:
//       if (issue.validation === "email") i18nData.key = "zod.errors.invalid_email";
//       if (issue.validation === "url") i18nData.key = "zod.errors.invalid_url";
//       break;
//     // Add more cases for other validation rules as needed (e.g., too_big, invalid_number)
//   }

//   // If we have a custom message from the schema, we prioritize it.
//   // This allows for field-specific overrides.
//   if (issue.message) {
//     return { message: issue.message };
//   }

//   // If we found a mapping, stringify the i18n data.
//   // This JSON string will be the "message" Zod stores in its error object.
//   if (i18nData.key) {
//     return { message: JSON.stringify(i18nData) };
//   }

//   // Fallback to Zod's default error message if we haven't handled the case.
//   return { message: ctx.defaultError };
// };

// // This is the helper you will use to wrap your schemas.
// export const i18nZodSchema = <T extends z.ZodTypeAny>(schema: T) => {
//   z.setErrorMap(customErrorMap);
//   return schema;
// };

// /**
//  * A server-side helper to translate a Zod error object (from treeifyError)
//  * before sending it to the client.
//  */
// export async function translateError(error: any) {
//   const t = await getTranslations(); // Gets the translations for the current request's locale

//   const translateNode = (node: any) => {
//     // If we find the "_errors" array, translate its messages
//     if (node._errors && Array.isArray(node._errors)) {
//       node._errors = node._errors.map((msg: string) => {
//         try {
//           const { key, params } = JSON.parse(msg);
//           // Use next-intl's `t` function to translate the key with its params
//           return t(key, params);
//         } catch (e) {
//           // If it's not a JSON string, it might be a regular message, so return it as is.
//           return msg;
//         }
//       });
//     }

//     // Recurse through the rest of the properties of the error object
//     for (const key in node) {
//       if (key !== "_errors" && typeof node[key] === "object" && node[key] !== null) {
//         translateNode(node[key]);
//       }
//     }
//   };

//   translateNode(error);
//   return error;
// }
