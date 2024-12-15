import type { Route } from "./+types/home";
import { Converter } from "../coverter";

export function meta(metaArgs: Route.MetaArgs) {
  return [
    { title: "Markitdown UI" },
    { name: "description", content: "Covert anything to Markdown" },
  ];
}

export default function Home() {
  return <Converter />;
}
