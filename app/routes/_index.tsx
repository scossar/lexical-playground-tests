import type { MetaFunction } from "@remix-run/node";
import { ClientOnly } from "~/components/ClientOnly";
import Composer from "~/components/Composer";

export const meta: MetaFunction = () => {
  return [
    { title: "Lexical Playground" },
    {
      name: "description",
      content: "Recreating (parts of) the Lexical playground",
    },
  ];
};

export default function Index() {
  return (
    <div className="mx-auto max-w-screen-sm">
      <h1 className="text-3xl">Lexical playground</h1>
      <ClientOnly
        fallback={
          <div className="max-w-full p-2 border rounded-sm min-h-16 border-slate-500"></div>
        }
      >
        {() => <Composer />}
      </ClientOnly>
    </div>
  );
}
