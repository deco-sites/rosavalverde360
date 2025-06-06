import { Picture, Source } from "apps/website/components/Picture.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import Slider from "../../components/ui/Slider.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { useId } from "../../sdk/useId.ts";

/**
 * @titleBy alt
 */
export interface Banner {
  /** @description desktop otimized image */
  desktop: ImageWidget;

  /** @description mobile otimized image */
  mobile: ImageWidget;

  /** @description Image's alt text */
  alt: string;
}

export interface Props {
  title: string;
  /** @format rich-text */
  description: string;
  action?: {
    link?: string;
    label?: string;
  };
  images?: Banner[];

  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function BannerItem({ image }: { image: Banner }) {
  const {
    alt,
    mobile,
    desktop,
  } = image;

  return (
    <div class="relative block overflow-y-hidden w-full">
      <Picture>
        <Source
          media="(max-width: 767px)"
          src={mobile}
          width={336}
          height={168}
        />
        <Source
          media="(min-width: 768px)"
          src={desktop}
          width={1440}
          height={600}
        />
        <img
          class="object-cover w-full h-full"
          loading={"lazy"}
          src={desktop}
          alt={alt}
        />
      </Picture>
    </div>
  );
}

export default function LojasCarousel(
  { title, description, action, images = [], interval }: Props,
) {
  const id = useId();
  return (
    <section class="container px-5 mb-8 md:flex md:flex-row items-stretch">
      <div id={id} class="relative md:mb-0 mb-4">
        <div class="col-span-full row-span-full relative h-full">
          <div
            style="background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 66%);"
            class="absolute top-0 left-0 w-full h-full gradient-lojas z-10"
          >
          </div>
          <Slider class="carousel carousel-center w-full h-full">
            {images.map((image, index) => (
              <Slider.Item index={index} class="carousel-item w-full">
                <BannerItem image={image} />
              </Slider.Item>
            ))}
          </Slider>
          <a
            class="md:hidden underline tracking-wide text-black text-xs text-center left-0 bottom-[10%] w-full text-white absolute z-20"
            href={action?.link}
          >
            {action?.label}
          </a>
        </div>

        <div class="flex items-center justify-center z-10 absolute top-0 bottom-0 left-0">
          <Slider.PrevButton
            class="btn btn-neutral border-0 btn-outline btn-circle no-animation btn-sm"
            disabled={false}
          >
            <Icon id="chevron-right" class="rotate-180 text-white" />
          </Slider.PrevButton>
        </div>

        <div class="flex items-center justify-center z-10 absolute top-0 bottom-0 right-0">
          <Slider.NextButton
            class="btn btn-neutral border-0 btn-outline btn-circle no-animation btn-sm"
            disabled={false}
          >
            <Icon id="chevron-right" class="text-white" />
          </Slider.NextButton>
        </div>

        <Slider.JS rootId={id} interval={interval && interval * 1e3} infinite />
      </div>

      <div class="content hidden md:flex flex-col md:justify-around bg-white py-10 px-12">
        <h3 class="mb-3 text-[#101010] tracking-wider font-light text-sm text-left">
          {title}
        </h3>

        <span
          class="text-sm font-light leading-normal tracking-wider text-[#4f4f4f] mb-10"
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

        <a
          class="underline text-xs hidden md:block text-left w-full text-[#101010] font-light leading-normal tracking-wide"
          href={action?.link}
        >
          {action?.label}
        </a>
      </div>
    </section>
  );
}
