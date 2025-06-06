import { ImageWidget } from "apps/admin/widgets.ts";

interface Props {
  title: string;
  /** @format rich-text */
  description?: string;
  cta: {
    link: string;
    label?: string;
  };
  image: ImageWidget;
}

export default function CollectionCard(
  { title, description, cta, image }: Props,
) {
  return (
    <section class="container px-5 pt-5 bg-white">
      <div class="flex flex-col md:flex-row md:gap-10 md:items-start">
        <div class="flex flex-col" style="padding: 3em;">
          <h3 class="mb-3 text-[#101010] tracking-wider font-light text-sm text-left">
            {title}
          </h3>
          {description && (
            <span
              class="text-[#505050] [&>p>span]:!text-sm leading-normal tracking-wider mb-5 text-sm font-normal text-left"
              style="
    color: #505050;
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: 2em;
    letter-spacing: 0.42px;
              "
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          <a
            href={cta.link}
            class="mb-8 text-xs md:text-normal tracking-wide text-left font-light underline"
          >
            {cta.label || "clique e conheça a coleção"}
          </a>
        </div>

        <img
          class="w-full md:max-w-[500px]"
          src={image}
          alt={cta.label}
          width={294}
          height={339}
        />
      </div>
    </section>
  );
}
