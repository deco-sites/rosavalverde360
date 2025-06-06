import { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";

interface Loja {
  image: ImageWidget;
  content: HTMLWidget;
}

interface Props {
  lojas: Loja[];
}

export default function GridLojas({ lojas }: Props) {
  return (
    <section class="">
      <div class="grid md:grid-cols-3 gap-8">
        {lojas.map((loja) => (
          <div class="bg-white flex flex-col items-start justify-start">
            <img class="w-full" src={loja.image} />
            {loja.content && (
              <div
                class="[&>p:first-child]:mb-3 p-6 font-light text-sm lowercase leading-normal text-[#101010] tracking-wider"
                dangerouslySetInnerHTML={{ __html: loja.content }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
