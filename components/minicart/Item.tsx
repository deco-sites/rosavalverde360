import { AnalyticsItem } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import Icon from "../ui/Icon.tsx";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import { useScript } from "@deco/deco/hooks";
export type Item = AnalyticsItem & {
  listPrice: number;
  image: string;
};
export interface Props {
  item: Item;
  index: number;
  locale: string;
  currency: string;
}
const QUANTITY_MAX_VALUE = 100;
const removeItemHandler = () => {
  const itemID = (event?.currentTarget as HTMLButtonElement | null)
    ?.closest("fieldset")
    ?.getAttribute("data-item-id");
  if (typeof itemID === "string") {
    window.STOREFRONT.CART.setQuantity(itemID, 0);
  }
};
function CartItem({ item, index, locale, currency }: Props) {
  const { image, listPrice, price = Infinity, quantity } = item;
  const isGift = price < 0.01;
  // deno-lint-ignore no-explicit-any
  const name = (item as any).item_name;

  const words = name?.split(" ");

  return (
    <fieldset
      // deno-lint-ignore no-explicit-any
      data-item-id={(item as any).item_id}
      class="grid grid-rows-1 gap-4"
      style={{ gridTemplateColumns: "auto 1fr" }}
    >
      <Image
        alt={name}
        src={image.replace("-55-55", "-500-500")}
        style={{ aspectRatio: "100 / 100", maxWidth: "100px" }}
        width={500}
        height={500}
        class="object-contain"
      />

      {/* Info */}
      <div class="flex flex-col gap-2">
        {/* Name and Remove button */}
        <div class="flex justify-between text-sm font-light items-center">
          <legend>
            {words && words?.length > 1 && (
              <>
                <b class="text-black">{words[0]}</b> {words?.slice(1).join(" ")}
              </>
            )}
            {!words && (
              <>
                {name}
              </>
            )}
          </legend>
        </div>

        {/* Price Block */}
        <div class="flex items-center gap-2">
          {listPrice && price && listPrice > price && (
            <span class="line-through font-light text-gray-400">
              {formatPrice(listPrice)}
            </span>
          )}
          <span class="font-light text-base-400">
            {formatPrice(price)}
          </span>
          <span class="text-sm text-secondary">
            {isGift ? "Grátis" : formatPrice(price, currency, locale)}
          </span>
        </div>

        {/* Quantity Selector */}
        <div class={clx(isGift && "hidden", "flex items-center gap-4")}>
          <button
            class={clx(
              isGift && "hidden",
              "btn underline hover:bg-transparent font-light btn-ghost btn-square no-animation",
            )}
            hx-on:click={useScript(removeItemHandler)}
          >
            remover
          </button>
          <QuantitySelector
            min={0}
            max={QUANTITY_MAX_VALUE}
            value={quantity}
            name={`item::${index}`}
          />
        </div>
      </div>
    </fieldset>
  );
}
export default CartItem;
