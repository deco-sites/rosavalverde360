import { HTMLWidget } from "apps/admin/widgets.ts";
import { Sections } from "apps/website/pages/Page.tsx";

interface Props {
  title: string;
  content?: HTMLWidget;
  sections?: Sections;
}
export default function InstitucionalContent(
  { title, content, sections }: Props,
) {
  return (
    <section class="container py-7 md:px-0 px-4">
      <h2 class="font-normal text-[28px] leading-normal text-[#1E1E1E] mb-8">
        {title}
      </h2>
      {content && (
        <div
          class="text-[#505050] font-extralight text-sm leading-normal tracking-wider"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
      {sections?.map(({ Component, props }) => <Component {...props} />)}
    </section>
  );
}
