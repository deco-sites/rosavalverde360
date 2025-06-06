import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import { useScript } from "@deco/deco/hooks";
export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
  icon?: string;
}
const onClick = () => {
  event?.stopPropagation();
  const button = event?.currentTarget as HTMLButtonElement | null;
  const container = button!.closest<HTMLDivElement>("div[data-cart-item]")!;
  const { item, platformProps } = JSON.parse(
    decodeURIComponent(container.getAttribute("data-cart-item")!),
  );
  window.STOREFRONT.CART.addToCart([item], platformProps);
  console.log("platform", platformProps);
};
const onChange = () => {
  const input = event!.currentTarget as HTMLInputElement;
  const productID = input!
    .closest("div[data-cart-item]")!
    .getAttribute("data-item-id")!;
  const quantity = Number(input.value);
  if (!input.validity.valid) {
    return;
  }
  window.STOREFRONT.CART.setQuantity(productID, quantity);
};
// Copy cart form values into AddToCartButton
const onLoad = (id: string) => {
  window.STOREFRONT.CART.subscribe((sdk) => {
    const container = document.getElementById(id);
    const checkbox = container?.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    const input = container?.querySelector<HTMLInputElement>(
      'input[type="number"]',
    );
    const itemID = container?.getAttribute("data-item-id")!;
    const quantity = sdk.getQuantity(itemID) || 0;
    if (!input || !checkbox) {
      return;
    }
    input.value = quantity.toString();
    checkbox.checked = quantity > 0;
    // enable interactivity
    container?.querySelectorAll<HTMLButtonElement>("button").forEach((node) =>
      node.disabled = false
    );
    container?.querySelectorAll<HTMLButtonElement>("input").forEach((node) =>
      node.disabled = false
    );
  });
};
const useAddToCart = ({ product, seller }: Props) => {
  const platform = usePlatform();
  const { additionalProperty = [], isVariantOf, productID } = product;
  const productGroupID = isVariantOf?.productGroupID;
  if (platform === "vtex") {
    return {
      allowedOutdatedData: ["paymentData"],
      orderItems: [{ quantity: 1, seller: seller, id: productID }],
    };
  }
  if (platform === "shopify") {
    return { lines: { merchandiseId: productID } };
  }
  if (platform === "vnda") {
    return {
      quantity: 1,
      itemId: productID,
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }
  if (platform === "wake") {
    return {
      productVariantId: Number(productID),
      quantity: 1,
    };
  }
  if (platform === "nuvemshop") {
    return {
      quantity: 1,
      itemId: Number(productGroupID),
      add_to_cart_enhanced: "1",
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }
  if (platform === "linx") {
    return {
      ProductID: productGroupID,
      SkuID: productID,
      Quantity: 1,
    };
  }
  return null;
};
function AddToCartButton(props: Props) {
  const { product, item, class: _class } = props;
  const platformProps = useAddToCart(props);
  const id = useId();
  return (
    <div
      id={id}
      class="flex w-full"
      data-item-id={product.productID}
      data-cart-item={encodeURIComponent(
        JSON.stringify({ item, platformProps }),
      )}
    >
      <input type="checkbox" class="hidden peer" />

      <button
        disabled
        class={clx("flex-grow", _class?.toString())}
        hx-on:click={useScript(onClick)}
      >
        {props.icon == "" || !props.icon
          ? (
            <svg
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.528 13.79a.587.587 0 0 0 .577-.597.587.587 0 0 0-.577-.597.587.587 0 0 0-.576.597c0 .33.258.597.576.597m6.34 0a.584.584 0 0 0 .576-.594.59.59 0 0 0-.576-.6.587.587 0 0 0-.576.597c0 .33.258.597.576.597M1 1h2.275L4.8 8.916c.052.272.194.516.402.69s.469.267.736.261h5.529a1.1 1.1 0 0 0 .735-.26c.208-.175.35-.42.402-.691l.91-4.96h-9.67"
                stroke="#101010"
                stroke-width=".5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          )
          : (
            "COMPRAR AGORA"
          )}
      </button>

      {/* Quantity Input */}
      <div class="flex-grow hidden peer-checked:hidden">
        <QuantitySelector
          disabled
          min={0}
          max={100}
          hx-on:change={useScript(onChange)}
        />
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}
export default AddToCartButton;
