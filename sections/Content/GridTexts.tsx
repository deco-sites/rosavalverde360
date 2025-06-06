import { HTMLWidget } from "apps/admin/widgets.ts";

interface Text {
  title: string;
  content: HTMLWidget;
}

interface Props {
  texts: Text[];
}

export default function GridTexts({ texts }: Props) {
  return (
    <section class="grid md:grid-cols-3 gap-8 pt-6">
      {texts.map((text) => (
        <div class="flex flex-col text-left justify-start items-start">
          <p class="w-full uppercase text-sm font-light border-b border-[#98818180] pb-2">
            {text.title}
          </p>
          {text.content && (
            // deno-lint-ignore react-no-danger
            <div
              class="mt-4 text-[#505050] text-sm font-extralight"
              dangerouslySetInnerHTML={{ __html: text.content }}
            />
          )}
        </div>
      ))}
    </section>
  );
}
