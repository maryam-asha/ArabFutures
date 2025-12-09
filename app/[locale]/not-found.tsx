import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import { NotFoundComponent } from "../___blocks/not-found-component";

// This Server Component provides the translations to the Client Component
export default async function NotFoundPage() {
  const messages = await getMessages();

  return (
    <div className="container mx-auto grow flex items-center justify-center">
      <NextIntlClientProvider messages={messages}>
        <NotFoundComponent homePath="/" />
      </NextIntlClientProvider>
    </div>
  );
}
