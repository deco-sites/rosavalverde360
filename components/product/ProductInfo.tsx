import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import ShippingSimulationForm from "../shipping/Form.tsx";
import WishlistButton from "../wishlist/WishlistButton.tsx";
import AddToCartButton from "./AddToCartButton.tsx";
import OutOfStock from "./OutOfStock.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import Modal from "../ui/Modal.tsx";
import Image from "apps/website/components/Image.tsx";
import { asset } from "$fresh/runtime.ts";
// import { asset } from "$fresh/runtime.ts";

export interface Props {
  page: ProductDetailsPage | null;
}

function ProductInfo({ page }: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const { productID, offers, isVariantOf } = product;
  const description = product.description || isVariantOf?.description;
  const title = isVariantOf?.name ?? product.name;
  const words = title?.split(" ");

  const guideId = `${id}-guide`;

  const {
    price = 0,
    listPrice,
    seller = "1",
    availability,
    installments,
  } = useOffer(offers);

  const percent = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  const viewItemEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item",
      params: {
        item_list_id: "product",
        item_list_name: "Product",
        items: [item],
      },
    },
  });

  //Checks if the variant name is "title"/"default title" and if so, the SKU Selector div doesn't render
  const hasValidVariants = isVariantOf?.hasVariant?.some(
    (variant) =>
      variant?.name?.toLowerCase() !== "title" &&
      variant?.name?.toLowerCase() !== "default title",
  ) ?? false;

  return (
    <div {...viewItemEvent} class="flex flex-col" id={id}>
      {/* Price tag */}
      <span
        class={clx(
          "text-sm/4 font-normal text-black bg-primary bg-opacity-15 text-center rounded-badge px-2 py-1",
          percent < 1 && "opacity-0",
          "w-fit",
        )}
      >
        {percent} % off
      </span>
      <span class="text-xs font-light text-[#969696] leading-normal">
        {productID}
      </span>
      {/* Product Name */}
      <span
        class={clx(
          "font-light text-base uppercase text-[#1e1e1e] leading-4",
          "pt-4",
        )}
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
      </span>

      <span class="text-[#1E1E1E] cursor-pointer underline mt-4 leading-normal text-xs font-light">
        <label for={guideId}>
          TABELA DE MEDIDAS
        </label>
      </span>

      {/* Sku Selector */}
      {hasValidVariants && (
        <div className="mt-4 sm:mt-8">
          <ProductSelector product={product} />
        </div>
      )}

      {/* Prices */}
      <div class="flex gap-3 pt-1">
        {listPrice && price && listPrice > price && (
          <span class="line-through text-sm font-medium text-gray-400">
            {formatPrice(listPrice, offers?.priceCurrency)}
          </span>
        )}
        <span class="font-light text-lg leading-normal tracking-tight">
          {formatPrice(price, offers?.priceCurrency)}
        </span>
      </div>
      <div class="flex gap-3 pt-0.5">
        <span class="text-xs text-[#404040] leading-normal tracking-wider font-light">
          {installments}
        </span>
      </div>

      {/* Shipping Simulation */}
      <div class="mt-8">
        <ShippingSimulationForm
          items={[{ id: Number(product.sku), quantity: 1, seller: seller }]}
        />
      </div>

      {/* Add to Cart and Favorites button */}
      <div class="mt-4 sm:mt-6 flex flex-row gap-2">
        {availability === "https://schema.org/InStock"
          ? (
            <>
              <AddToCartButton
                item={item}
                seller={seller}
                product={product}
                class="btn btn-primary no-animation rounded-none font-light bg-[#D68E87] !w-full"
                disabled={false}
                icon="true"
              />
              <WishlistButton
                _class="!text-white rounded-none max-w-12 bg-[#EFE2E2] border-none"
                item={item}
              />
            </>
          )
          : <OutOfStock productID={productID} />}
      </div>

      {/* Description card */}
      {
        /* <div class="mt-4 sm:mt-6">
        <span class="text-sm">
          {description && (
            <details>
              <summary class="cursor-pointer">Description</summary>
              <div
                class="ml-2 mt-2"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </details>
          )}
        </span>
      </div> */
      }

      <Modal id={guideId}>
        <div class="bg-base-100">
          {product.category?.includes("COLARES") && (
            <img
              class="max-w-full md:max-w-2xl"
              src="/image/tabela_colar.png"
            />
          )}
          {product.category?.includes("ANÉIS") && (
            <img class="max-w-full md:max-w-2xl" src="/image/tabela_anel.png" />
          )}
          {product.category?.includes("BRINCOS") && (
            <img
              class="max-w-full md:max-w-2xl"
              src="/image/tabela_brincos.png"
            />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ProductInfo;
