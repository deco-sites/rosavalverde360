import type { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section, {
  type Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useDevice } from "@deco/deco/hooks";
import { type LoadingFallbackProps } from "@deco/deco";
/** @titleBy label */
export interface Item {
  image: ImageWidget;
  href: string;
  label: string;
}
export interface Props extends SectionHeaderProps {
  items: Item[];
}
function Card({ image, href, label }: Item) {
  return (
    <a href={href} class="flex flex-col items-center justify-center gap-4">
      <div class="rounded-full flex justify-center items-center border border-transparent hover:border-primary">
        <Image
          src={image}
          alt={label}
          width={106}
          height={106}
          class="w-full"
          loading="lazy"
        />
      </div>
      <span class="font-light text-sm tracking-widest leading-normal">
        {label}
      </span>
    </a>
  );
}
function CategoryGrid({ title, cta, items }: Props) {
  const device = useDevice();
  return (
    <Section.Container>
      <Section.Header title={title} cta={cta} />

      {device === "desktop"
        ? (
          <div class="grid grid-cols-6 gap-8">
            {items.map((i) => <Card {...i} />)}
          </div>
        )
        : (
          <Slider class="carousel carousel-center sm:carousel-end gap-3 w-full">
            {items.map((i, index) => (
              <Slider.Item
                index={index}
                class={clx(
                  "carousel-item w-1/3",
                  "first:pl-5 first:sm:pl-0",
                  "last:pr-5 last:sm:pr-0",
                )}
              >
                <Card {...i} />
              </Slider.Item>
            ))}
          </Slider>
        )}
    </Section.Container>
  );
}
export const LoadingFallback = (
  { title, cta }: LoadingFallbackProps<Props>,
) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} />
    <Section.Placeholder height="212px" />;
  </Section.Container>
);
export default CategoryGrid;
