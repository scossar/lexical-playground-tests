import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { ClientOnly } from "~/components/ClientOnly";
import Composer from "~/components/zalgEditor/Composer";
import { CustomFetcher } from "~/components/zalgEditor/plugins/SubmitPlugin";

export const meta: MetaFunction = () => {
  return [
    { title: "Lexical Playground" },
    {
      name: "description",
      content: "Recreating (parts of) the Lexical playground",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const markdown = body?.get("markdown");
  const html = body?.get("html");

  console.log(`markdown: ${markdown}, html: ${html}`);
  return null;
}

export default function Index() {
  const fetcher = useFetcher();
  return (
    <div className="mx-auto max-w-screen-sm">
      <h1 className="text-3xl">Lexical playground</h1>
      <ClientOnly
        fallback={
          <div className="max-w-full p-2 border rounded-sm min-h-48 border-slate-500"></div>
        }
      >
        {() => (
          <Composer submitType="html" fetcher={fetcher as CustomFetcher} />
        )}
      </ClientOnly>
    </div>
  );
}
