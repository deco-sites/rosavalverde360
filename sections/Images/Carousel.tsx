import type { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Slider from "../../components/ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";

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

  action?: {
    /** @description when user clicks on the image, go to this link */
    href: string;
    /** @description Image text title */
    title: string;
    /** @description Image text subtitle */
    subTitle: string;
    /** @description Button label */
    label: string;
  };
}

export interface Props {
  images?: Banner[];

  /**
   * @description Check this option when this banner is the biggest image on the screen for image optimizations
   */
  preload?: boolean;

  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function BannerItem(
  { image, lcp }: { image: Banner; lcp?: boolean },
) {
  const {
    alt,
    mobile,
    desktop,
    action,
  } = image;
  const params = { promotion_name: image.alt };

  const selectPromotionEvent = useSendEvent({
    on: "click",
    event: { name: "select_promotion", params },
  });

  const viewPromotionEvent = useSendEvent({
    on: "view",
    event: { name: "view_promotion", params },
  });

  return (
    <a
      {...selectPromotionEvent}
      href={action?.href ?? "#"}
      aria-label={action?.label}
      class="relative block overflow-y-hidden w-full"
    >
      {action && (
        <>
          <div
            class={clx(
              "absolute h-full w-full top-0 left-0 z-10",
              "flex flex-col justify-center items-center",
              "px-5 sm:px-0",
              "sm:items-center md:max-w-full",
            )}
          >
            <span class="text-base font-normal text-center text-white">
              {action.title}
            </span>
            <span class="font-thin text-sm text-center text-white pb-24 md:pb-12 max-w-[160px]">
              {action.subTitle}
            </span>
          </div>

          <div
            class={clx(
              "absolute h-full w-full bottom-0 left-0 z-10",
              "flex flex-col justify-end items-center",
              "px-5 sm:px-0",
              "md:items-center md:max-w-full",
            )}
          >
            <button
              class="btn btn-outline border-0 min-w-[180px] text-xs tracking-wider text-white font-thin text-center underline"
              aria-label={action.label}
            >
              {action.label}
            </button>
          </div>
        </>
      )}
      <div class="absolute h-full w-full top-0 left-0 bg-[#1010104D]"></div>
      <Picture preload={lcp} {...viewPromotionEvent}>
        <Source
          media="(max-width: 767px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={mobile}
          width={375}
          height={404}
        />
        <Source
          media="(min-width: 768px)"
          fetchPriority={lcp ? "high" : "auto"}
          src={desktop}
          width={1440}
          height={600}
        />
        <img
          class="object-cover w-full h-full min-h-[535px]"
          loading={lcp ? "eager" : "lazy"}
          src={desktop}
          alt={alt}
        />
      </Picture>
    </a>
  );
}

function Carousel({ images = [], preload, interval }: Props) {
  const id = useId();

  return (
    <div
      id={id}
      class={clx(
        "grid",
        "grid-rows-[1fr_32px_1fr_64px]",
        "grid-cols-[32px_1fr_32px] min-h-[404px]",
        "sm:grid-cols-[112px_1fr_112px] sm:min-h-min",
        "w-screen max-w-full",
      )}
    >
      <div class="col-span-full row-span-full">
        <Slider class="carousel carousel-center w-full gap-6 h-full">
          {images.map((image, index) => (
            <Slider.Item index={index} class="carousel-item w-full">
              <BannerItem image={image} lcp={index === 0 && preload} />
            </Slider.Item>
          ))}
        </Slider>
      </div>

      <div class="flex items-center justify-center z-10 col-start-1 row-start-2">
        <Slider.PrevButton
          class="btn btn-neutral border-0 btn-outline btn-circle no-animation btn-sm"
          disabled={false}
        >
          <Icon id="chevron-right" class="rotate-180 text-white" />
        </Slider.PrevButton>
      </div>

      <div class="flex items-center justify-center z-10 col-start-3 row-start-2">
        <Slider.NextButton
          class="btn btn-neutral border-0 btn-outline btn-circle no-animation btn-sm"
          disabled={false}
        >
          <Icon id="chevron-right" class="text-white" />
        </Slider.NextButton>
      </div>

      {
        /* <ul
        class={clx(
          "col-span-full row-start-4 z-10",
          "carousel justify-center gap-3",
        )}
      >
        {images.map((_, index) => (
          <li class="carousel-item">
            <Slider.Dot
              index={index}
              class={clx(
                "bg-black opacity-20 h-3 w-3 no-animation rounded-full",
                "disabled:w-8 disabled:bg-base-100 disabled:opacity-100 transition-[width]",
              )}
            >
            </Slider.Dot>
          </li>
        ))}
      </ul> */
      }

      <Slider.JS rootId={id} interval={interval && interval * 1e3} infinite />
    </div>
  );
}

export default Carousel;
