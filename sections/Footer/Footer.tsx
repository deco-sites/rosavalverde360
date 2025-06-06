import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import FloatingWhatsApp from "./FloatingWhatsApp.tsx";

// import SectionComponent from "../../components/ui/Section.tsx";
import { useDevice } from "@deco/deco/hooks";
import { Sections } from "apps/website/pages/Page.tsx";
import { asset } from "$fresh/runtime.ts";

/** @titleBy title */
interface Item {
  title: string;
  href: string;
}

/** @titleBy title */
interface Link extends Item {
  children: Item[];
}

/** @titleBy alt */
interface Social {
  alt?: string;
  href?: string;
  image: ImageWidget;
}

export interface Props {
  links?: Link[];
  social?: Social[];
  paymentMethods?: Social[];
  sections: Sections;
}

const Mobile = ({ links = [], social = [], paymentMethods = [] }: Props) => {
  return (
    <footer class="px-5 sm:px-0 mt-5 sm:mt-10">
      <div class="container flex flex-col text-center items-center justify-center gap-8 sm:gap-10 pb-10">
        <hr class="w-full border-[#F0E1E1]" />
        <ul class="grid uppercase grid-flow-row sm:grid-flow-col gap-6 ">
          {links.map(({ title, href, children }) => (
            <li class="flex flex-col gap-4">
              <a
                class="text-sm font-light tracking-wide text-left text-[#101010]"
                href={href}
              >
                {title}
              </a>
              <ul class="flex flex-col gap-2 items-start">
                {children.map(({ title, href }) => (
                  <li>
                    <a
                      class="text-[10px] font-light tracking-wide text-center text-[#797979]"
                      href={href}
                    >
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div class="pt-6 flex flex-col sm:flex-row gap-12 justify-between items-start sm:items-center">
          <ul class="flex gap-4 items-center m-auto">
            {social.map(({ image, href, alt }) => (
              <li>
                <a href={href}>
                  <Image
                    src={image}
                    alt={alt}
                    loading="lazy"
                    width={37}
                    height={37}
                  />
                </a>
              </li>
            ))}
          </ul>
          <ul class="grid grid-cols-5 gap-2">
            {paymentMethods.map(({ image, alt }) => (
              <li class="flex justify-center items-center">
                <Image
                  src={image}
                  alt={alt}
                  width={66}
                  height={41}
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>

        <div class="grid grid-flow-row sm:grid-flow-col gap-8">
          <div class="flex flex-nowrap items-center justify-center gap-4">
            <span class="text-xs font-light text-base-400">
              CRIADO POR
            </span>
            <a href="https://dna360.ag" target={"_blank"}>
              <img
                width={106}
                height={22}
                src={asset(`/image/logo-dna-cinza.png`)}
                loading={"lazy"}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Desktop = (
  { links = [], social = [], paymentMethods = [], sections }: Props,
) => {
  return (
    <footer class="px-5 sm:px-0 mt-5 sm:mt-10">
      <div class="container flex flex-col text-center items-center justify-between gap-10 pb-10">
        <hr class="w-full border-[#F0E1E1]" />
        <div class="mobile-grid flex flex-row justify-around gap-8 w-full">
          <ul class="grid grid-cols-3 gap-x-10 gap-y-6 items-center h-full">
            {social.map(({ image, href, alt }) => (
              <li>
                <a href={href}>
                  <Image
                    src={image}
                    alt={alt}
                    loading="lazy"
                    width={25}
                    height={25}
                  />
                </a>
              </li>
            ))}
          </ul>
          <ul class="grid uppercase grid-flow-row sm:grid-flow-col gap-10 ">
            {links.map(({ title, href, children }) => (
              <li class="flex flex-col gap-4">
                <a
                  class="text-sm font-light tracking-wide text-left text-[#101010]"
                  href={href}
                >
                  {title}
                </a>
                <ul class="flex flex-col gap-2 items-start">
                  {children.map(({ title, href }) => (
                    <li>
                      <a
                        class="text-[10px] font-light tracking-wide text-center text-[#797979]"
                        href={href}
                      >
                        {title}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <ul class="flex flex-col gap-10">
            {sections.map(({ Component, props }) => <Component {...props} />)}
          </ul>
        </div>

        <hr class="w-full border-[#F0E1E1]" />
        <div
          class="pt-6 flex flex-col sm:flex-row gap-12 justify-between items-start sm:items-center"
          style="opacity: 0.6;"
        >
          <ul class="grid grid-cols-10 gap-12">
            {paymentMethods.map(({ image, alt }) => (
              <li class="flex justify-center items-center">
                <Image
                  src={image}
                  alt={alt}
                  width={66}
                  height={41}
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
        </div>

        <div class="grid grid-flow-row sm:grid-flow-col gap-8">
          <div class="flex flex-nowrap items-center justify-center gap-4">
            <span class="text-xs font-light text-base-400">
              CRIADO POR
            </span>
            <a href="https://dna360.ag" target={"_blank"}>
              <img
                width={106}
                height={22}
                src={asset(`/image/logo-dna-cinza.png`)}
                loading={"lazy"}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function Footer(
  { links = [], social = [], paymentMethods = [], sections }: Props,
) {
  const device = useDevice();
  return (
    <>
      {device === "desktop"
        ? (
          <Desktop
            links={links}
            social={social}
            paymentMethods={paymentMethods}
            sections={sections}
          />
        )
        : (
          <Mobile
            links={links}
            social={social}
            paymentMethods={paymentMethods}
            sections={sections}
          />
        )}

      {/* Adiciona o WhatsApp flutuante */}
      <FloatingWhatsApp />
    </>
  );
}

// export const LoadingFallback = () => <SectionComponent.Placeholder height="1145px" />;

export default Footer;
