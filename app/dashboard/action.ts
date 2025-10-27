import { createActionParser } from "@lib/action-handler";

async (formData: FormData) => {
  return {
    ids: JSON.parse(formData.get("ids") as string),
    actionType: formData.get("actionType") as any,
  };
};

export const bulkActionParser = createActionParser({
  jsonFields: ["ids"],
});
