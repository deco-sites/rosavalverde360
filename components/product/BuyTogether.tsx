// import { useState } from "preact/hooks";
import { useId as _useId } from "../../sdk/useId.ts";
import { useOffer as _useOffer } from "../../sdk/useOffer.ts";
import type { Product } from "apps/commerce/types.ts";
import { formatPrice } from "../../sdk/format.ts";
import Image from "apps/website/components/Image.tsx";
import { useScript } from "@deco/deco/hooks";
import { useSignal } from "@preact/signals";

export interface Props {
  products?: Product[] | null;
  // deno-lint-ignore no-explicit-any
  principal: any;
}

export type SkuListType = {
  id: string;
  name: string | undefined;
  image: string | undefined;
  price: number | null;
  seller: string | undefined;
  quantity: number;
};

function addItemsToCart(items: SkuListType[]) {
  window.STOREFRONT.CART.addToCart(items, {
    allowedOutdatedData: [
      "paymentData",
    ],
    orderItems: items,
  });
}

function BuyTogether({
  products,
  principal,
}: Props) {
  if (!products || products.length === 0) {
    return null;
  }

  const productMap: Record<string, SkuListType> = {};

  products.forEach((product: Product) => {
    const productId = product.productID;

    if (productId) {
      productMap[productId] = {
        id: product.productID,
        name: product.isVariantOf?.name,
        price: product?.offers?.offers?.[0]?.price ?? null,
        image: product.image?.[1]?.url,
        seller: product?.offers?.offers?.[0]?.seller,
        quantity: 1,
      };
    }
    if (product.isVariantOf?.hasVariant) {
      product.isVariantOf.hasVariant.forEach((variant) => {
        const variantId = variant.productID;

        if (variantId) {
          productMap[variantId] = {
            id: product.productID,
            name: product.isVariantOf?.name,
            price: variant?.offers?.offers?.[0]?.price ?? null,
            image: variant.image?.[1]?.url,
            seller: variant?.offers?.offers?.[0]?.seller,
            quantity: 1,
          };
        }
      });
    }
  });

  const initialSkuList = Object.values(productMap);

  initialSkuList.unshift({
    id: principal ? principal?.productID : "",
    name: principal?.isVariantOf?.name,
    price: principal?.offers?.offers?.[0].price ?? null,
    image: principal ? principal.image?.[1]?.url : undefined,
    seller: principal?.offers?.offers?.[0]?.seller,
    quantity: 1,
  });
  const productInfoMap: Record<SkuListType> = {
    id: principal ? principal?.productID : "",
    name: principal?.isVariantOf?.name,
    price: principal?.offers?.offers?.[0].price ?? null,
    image: principal ? principal.image?.[1]?.url : undefined,
    seller: principal?.offers?.offers?.[0]?.seller,
    quantity: 1,
  };

  const selectedSkuList = useSignal<SkuListType[]>(
    initialSkuList,
  );

  // const totalPrice = principal?.offers?.offers?.[0].price + products[0]?.offers?.offers?.[0]?.price

  // function toggleProduct(productId: string) {
  //   selectedSkuList.value = ((prevSelected) =>
  //     prevSelected.some((sku) => sku.id === productId)
  //       ? prevSelected.filter((sku) => sku.id !== productId)
  //       : [...prevSelected, initialSkuList.find((sku) => sku.id === productId)!]
  //   );
  // }

  return (
    <div class="w-full py-8 flex flex-col gap-6 lg:py-10 border-t border-t-[#F0E1E1]">
      <div
        class="w-full my-8"
        id="buy-together"
      >
        <div class="flex md:border-0 border border-[#00000021] md:p-0 p-4 flex-col gap-6 md:flex-col items-center">
          {initialSkuList.slice(1).map((sku: SkuListType) => (
            <div
              key={sku.id}
              class="flex flex-col md:flex-row md:justify-evenly gap-4 items-center w-full"
            >
              {/* Card do produto principal */}
              <div class="w-full justify-between items-center max-w-72 p-4 bg-white flex flex-row md:flex-col md:items-start">
                <Image
                  src={principal.image?.[1]?.url || principal.image?.[0]?.url ||
                    ""}
                  alt={principal.isVariantOf?.name}
                  width={300}
                  height={300}
                  class="md:w-64 md:h-64 h-20 w-20 mb-2"
                  loading="lazy"
                />
                <div class="md:line-clamp-3 line-clamp-2 flex flex-col justify-center">
                  <p class="md:line-clamp-3 line-clamp-2 text-sm max-w-40 mb-4 text-[#1E1E1E] leading-normal font-light">
                    {principal.isVariantOf?.name}
                  </p>
                  <p class="text-sm leading-normal font-normal text-[#1E1E1E]">
                    {formatPrice(principal.offers?.offers?.[0].price ?? 0)}
                  </p>
                </div>
              </div>
              {/* Ícone "+" */}
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.715 11.4h-8.92v9h-2.6v-9H.315V9h8.88V0h2.6v9h8.92z"
                  fill="#D68E87"
                />
              </svg>
              <div class="w-full justify-between items-center max-w-72 p-4 bg-white flex flex-row md:flex-col md:items-start">
                {
                  /* <input
                  type="checkbox"
                  checked={selectedSkuList.value.some((selectedSku) => selectedSku.id === sku.id)}
                  onChange={() => toggleProduct(sku.id)}
                  class="mb-4"
                /> */
                }
                <Image
                  src={sku.image ?? ""}
                  alt={sku.name}
                  width={300}
                  height={300}
                  class="md:w-64 md:h-64 h-20 w-20 mb-2"
                  loading="lazy"
                />
                <div class="flex flex-col justify-center">
                  <p class="md:line-clamp-3 line-clamp-2 text-sm max-w-40 mb-4 text-[#1E1E1E] leading-normal font-light">
                    {sku.name}
                  </p>
                  <p class="text-sm leading-normal font-normal text-[#1E1E1E]">
                    {formatPrice(sku.price ?? 0)}
                  </p>
                </div>
              </div>

              <svg
                width="21"
                height="12"
                viewBox="0 0 21 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.704.92v2.4H.304V.92zm0 8.16v2.36H.304V9.08z"
                  fill="#D68E87"
                />
              </svg>

              {/* Exibição do total da combinação */}
              <div class="flex flex-col items-center md:w-[30%] w-full">
                <h3 class="text-base font-normal uppercase leading-normal md:mb-8 mb-4">
                  Compre Junto
                </h3>
                <p class="font-extralight text-sm leading-normal uppercase md:mb-8 mb-4">
                  2 ITENS COMBINADOS POR
                </p>
                <p class="text-lg leading-normal font-medium text-[#1E1E1E] md:mb-6 mb-3">
                  {formatPrice(
                    (principal.offers?.offers?.[0].price ?? 0) +
                      (sku.price ?? 0),
                  )}
                </p>
                {/* <AddToCartBuyTogether skuList={[productInfoMap, sku]} /> */}
                <button
                  type="button"
                  class="flex-grow btn btn-primary no-animation rounded-none font-light bg-[#D68E87] !w-full"
                  hx-on:click={useScript(addItemsToCart, [productInfoMap, sku])}
                >
                  COMPRE JUNTO
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BuyTogether;
