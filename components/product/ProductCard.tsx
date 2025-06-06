import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { relative } from "../../sdk/url.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { useVariantPossibilities } from "../../sdk/useVariantPossiblities.ts";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import { Ring } from "./ProductVariantSelector.tsx";
import { useId } from "../../sdk/useId.ts";
import AddToCartButton from "./AddToCartButton.tsx";
import { CUSTOM_COLORS } from "../../components/constants/customColors.ts";

interface Props {
  product: Product;
  preload?: boolean;
  itemListName?: string;
  index?: number;
  class?: string;
}

const WIDTH = 228;
const HEIGHT = 300;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

function normalizeColor(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function ProductCard({
  product,
  preload,
  itemListName,
  index,
  class: _class,
}: Props) {
  const id = useId();

  const { url, image: images, offers, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const title = isVariantOf?.name ?? product.name;
  const [front, back] = images ?? [];

  const {
    listPrice,
    price,
    seller = "1",
    availability,
  } = useOffer(offers);
  const inStock = availability === "https://schema.org/InStock";
  const possibilities = useVariantPossibilities(hasVariant, product);
  const firstSkuVariations = Object.entries(possibilities)?.[0];
  const variants = Object.entries(firstSkuVariations?.[1] ?? {});
  const relativeUrl = relative(url);
  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const item = mapProductToAnalyticsItem({ product, price, listPrice, index });

  const words = title?.split(" ");

  const event = useSendEvent({
    on: "click",
    event: {
      name: "select_item" as const,
      params: {
        item_list_name: itemListName,
        items: [item],
      },
    },
  });

  const firstVariantName = firstSkuVariations?.[0]?.toLowerCase();
  const shoeSizeVariant = "shoe size";

  // --- VARIAÇÕES DE COR (SEM DUPLICADAS, IGNORANDO SUFIXOS NUMÉRICOS) ---
  const allColors: string[] = product.isVariantOf?.additionalProperty
    ?.filter((p) => p.name?.toLowerCase() === "cor" && !!p.value)
    .map((p) => p.value!) || [];

  const colorBases = new Set<string>();
  const colors: string[] = [];

  allColors.forEach((color) => {
    // Remove números do final, ex: "transparente0" -> "transparente"
    const base = color.replace(/\d+$/, "").trim().toLowerCase();
    if (!colorBases.has(base)) {
      colorBases.add(base);
      colors.push(color);
    }
  });
  // -----------------------------------------

  return (
    <div
      {...event}
      class={clx("card rounded-none card-compact group text-sm", _class)}
    >
      <figure
        class={clx(
          "m-auto relative min-h-[210px] md:min-h-[300px] w-full max-w-full",
          "rounded-none border border-transparent",
          "group-hover:border-primary",
        )}
        style={{ aspectRatio: ASPECT_RATIO }}
      >
        {/* Product Images */}
        <a
          href={relativeUrl}
          aria-label="view product"
          class={clx(
            "absolute top-0 left-0",
            "grid grid-cols-1 grid-rows-1",
            "w-full h-full",
            !inStock && "opacity-70",
          )}
        >
          <img
            src={front.url!.replace("-456-600", "")}
            alt={front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover",
              "rounded-none w-full h-full",
              "col-span-full row-span-full",
            )}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          <img
            src={back?.url?.replace("-456-600", "") ??
              front.url!.replace("-456-600", "")}
            alt={back?.alternateName ?? front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            style={{ aspectRatio: ASPECT_RATIO }}
            class={clx(
              "object-cover",
              "rounded-none w-full h-full",
              "col-span-full row-span-full",
              "transition-opacity opacity-0 lg:group-hover:opacity-100",
            )}
            loading="lazy"
            decoding="async"
          />
        </a>

        {/* Wishlist button */}
        <div class="absolute top-0 left-0 w-full flex items-center justify-between">
          {/* Discounts */}
          <span
            class={clx(
              "hidden text-sm/4 font-normal text-black bg-primary bg-opacity-15 text-center rounded-badge px-2 py-1",
              (percent < 1 || !inStock) && "opacity-0",
            )}
          >
            {percent} % off
          </span>
        </div>
      </figure>

      <div class="pt-3.5">
        <div className="flex relative items-center">
          <a
            href={relativeUrl}
            class="font-light max-w-[80%] text-sm leading-normal lowercase text-[#1e1e1e]"
          >
            {words && words?.length > 1 && (
              <>
                <b class="text-black">{words[0]}</b> {words?.slice(1).join(" ")}
              </>
            )}
            {!words && (
              <>
                {title}
              </>
            )}
          </a>
          <div class="flex items-center absolute top-0 right-0 max-h-5 justify-end gap-2">
            {inStock
              ? (
                <AddToCartButton
                  product={product}
                  seller={seller}
                  item={item}
                  class={clx(
                    "btn",
                    "btn-outline justify-start border-none !text-sm !font-medium px-0 no-animation w-full",
                    "hover:!bg-transparent",
                    "disabled:!bg-transparent disabled:!opacity-50",
                    "btn-primary hover:!text-primary disabled:!text-primary",
                  )}
                />
              )
              : (
                <a
                  href={relativeUrl}
                  class={clx(
                    "btn",
                    "btn-outline justify-start border-none !text-sm !font-medium px-0 no-animation",
                    "hover:!bg-transparent",
                    "disabled:!bg-transparent disabled:!opacity-75",
                    "btn-error hover:!text-error disabled:!text-error",
                  )}
                >
                  X
                </a>
              )}

            <WishlistButton
              _class="!text-[#101010]"
              item={item}
              variant="icon"
            />
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          {listPrice && price && listPrice > price && (
            <span class="line-through font-light text-gray-400">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
          )}
          <span class="font-light text-base-400">
            {formatPrice(price, offers?.priceCurrency)}
          </span>
        </div>

        {/* VARIAÇÕES DE COR ABAIXO DO PREÇO */}
        {colors.length > 0
          ? (
            <div class="flex gap-1 mt-1">
              {colors.map((color, idx) => {
                const normalized = normalizeColor(color);
                const cor = CUSTOM_COLORS[normalized];
                if (!cor) return null;
                return (
                  <span
                    key={normalized + idx}
                    title={cor.name}
                    style={{
                      background: cor.hex,
                      border: "solid 1px #a79393",
                      marginLeft: " 0.3em",
                      display: "inline-block",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                    }}
                  />
                );
              })}
            </div>
          )
          : <span class="text-xs text-red-500 mt-1">Sem variações de cor</span>}
        {/* FIM VARIAÇÕES DE COR */}
      </div>

      {/* SKU Selector */}
      {variants.length > 1 && firstVariantName !== shoeSizeVariant && (
        <ul class="flex items-center justify-start gap-2 pt-4 pb-1 pl-1 overflow-x-auto">
          {variants.map(([value, link]) => [value, relative(link)] as const)
            .map(([value, link]) => (
              <li>
                <a href={link} class="cursor-pointer">
                  <input
                    class="hidden peer"
                    type="radio"
                    name={`${id}-${firstSkuVariations?.[0]}`}
                    checked={link === relativeUrl}
                  />
                  <Ring value={value} checked={link === relativeUrl} />
                </a>
              </li>
            ))}
        </ul>
      )}

      <div class="flex-grow" />
    </div>
  );
}

export default ProductCard;
