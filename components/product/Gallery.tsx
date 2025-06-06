import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import ProductImageZoom from "./ProductImageZoom.tsx";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

const WIDTH = 1000;
const HEIGHT = 1000;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

/**
 * @title Product Image Slider
 * @description Creates a three columned grid on destkop, one for the dots preview, one for the image slider and the other for product info
 * On mobile, there's one single column with 3 rows. Note that the orders are different from desktop to mobile, that's why
 * we rearrange each cell with col-start- directives
 */
export default function GallerySlider(props: Props) {
  const id = useId();
  const zoomId = `${id}-zoom`;

  if (!props.page) {
    throw new Error("Missing Product Details Page Info");
  }

  const { page: { product: { name, isVariantOf, image: pImages } } } = props;

  // Filter images when image's alt text matches product name
  // More info at: https://community.shopify.com/c/shopify-discussions/i-can-not-add-multiple-pictures-for-my-variants/m-p/2416533
  const groupImages = isVariantOf?.image ?? pImages ?? [];
  const filtered = groupImages.filter((img) =>
    name?.includes(img.alternateName || "")
  );
  const images = filtered.length > 0 ? filtered : groupImages;

  return (
    <>
      <div
        id={id}
        class="grid grid-flow-row sm:grid-rows-1 sm:grid-flow-col grid-cols-1 sm:grid-cols-[min-content_1fr]"
      >
        {/* Image Slider */}
        <div class="col-start-1 col-span-1 sm:col-start-2">
          <div class="relative h-min flex-grow">
            <Slider class="carousel carousel-center w-full">
              {images.map((img, index) => (
                <Slider.Item
                  index={index}
                  class={`carousel-item ${
                    images.length <= 1 ? "w-full" : "md:w-1/2 w-full"
                  }`}
                >
                  <Image
                    class="w-full"
                    sizes="(max-width: 640px) 100vw, 40vw"
                    style={{ aspectRatio: ASPECT_RATIO }}
                    src={img.url!}
                    alt={img.alternateName}
                    width={WIDTH}
                    height={HEIGHT}
                    // Preload LCP image for better web vitals
                    preload={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </Slider.Item>
              ))}
            </Slider>

            <Slider.PrevButton
              class="no-animation absolute left-2 top-1/2 btn btn-circle btn-outline disabled:invisible"
              disabled
            >
              <Icon id="chevron-right" class="rotate-180" />
            </Slider.PrevButton>

            <Slider.NextButton
              class="no-animation absolute right-2 top-1/2 btn btn-circle btn-outline disabled:invisible"
              disabled={images.length < 2}
            >
              <Icon id="chevron-right" />
            </Slider.NextButton>

            <div class="absolute top-2 right-2 bg-white rounded-none max-h-10 cursor-pointer">
              <label class="hidden sm:inline-flex" for={zoomId}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path fill="#fff" d="M0 0h40v40H0z" />
                  <path
                    d="M11 29v-6h2v2.6l3.1-3.1 1.4 1.4-3.1 3.1H17v2zm12.9-11.5-1.4-1.4 3.1-3.1H23v-2h6v6h-2v-2.6zM29 29h-6v-2h2.6l-3.1-3.1 1.4-1.4 3.1 3.1V23h2zM17.5 16.1l-1.4 1.4-3.1-3.1V17h-2v-6h6v2h-2.6z"
                    fill="#1E1E1E"
                  />
                </svg>
                {/* <Icon id="pan_zoom" /> */}
              </label>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div class="col-start-2 col-span-2 hidden md:block">
          <ul
            class={clx(
              "carousel carousel-center",
              "w-full justify-center",
              "gap-4",
              "max-w-full",
              "overflow-x-auto",
              "sm:overflow-y-auto",
            )}
            // style={{ maxHeight: "600px" }}
          >
            {images.map((img, index) => (
              <li class="carousel-item w-5 h-2">
                <Slider.Dot index={index}>
                  <div class="h-[3px] rounded-sm w-[30px] bg-[#D9D9D9] group-disabled:bg-[#1E1E1E]">
                  </div>
                  {
                    /* <Image
                    style={{ aspectRatio: "1 / 1" }}
                    class="group-disabled:border-base-400 border rounded object-cover w-full h-full"
                    width={64}
                    height={64}
                    src={img.url!}
                    alt={img.alternateName}
                  /> */
                  }
                </Slider.Dot>
              </li>
            ))}
          </ul>
        </div>

        <Slider.JS rootId={id} />
      </div>
      <ProductImageZoom
        id={zoomId}
        images={images}
        width={700}
        height={Math.trunc(700 * HEIGHT / WIDTH)}
      />
    </>
  );
}
