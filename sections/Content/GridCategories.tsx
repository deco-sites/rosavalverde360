import { ImageWidget } from "apps/admin/widgets.ts";
export interface Category {
  image: ImageWidget;
  link: string;
  label?: string;
}
interface Props {
  /** @format rich-text */
  title: string;
  /** @format rich-text */
  subtitle: string;
  categories: Category[];
}

export default function GridCategories({ title, subtitle, categories }: Props) {
  return (
    <section class="container px-5 pt-5">
      <div class={"mb-6"}>
        <h3
          class="font-medium text-xl tracking-[0.6px]"
          style="padding-top: 32px;"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <span
          class="text-sm leading-normal tracking-wider text-[#656565] "
          style="
    color: #505050;
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: 2em;
    letter-spacing: 0.42px;
          "
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      </div>
      <div class="md:flex grid grid-cols-2 justify-center md:gap-8 gap-4">
        {categories && categories.length > 0 &&
          categories.map((category) => (
            <a
              href={category.link}
              class="flex flex-col items-center justify-center w-full md:w-1/4 max-w-[280px]"
            >
              <img
                src={category.image}
                alt={category.label}
                width={280}
                height={348}
                class="mb-3 w-full"
              />
              <span class="uppercase text-sm font-light tracking-wider">
                {category.label}
              </span>
            </a>
          ))}
      </div>
    </section>
  );
}
