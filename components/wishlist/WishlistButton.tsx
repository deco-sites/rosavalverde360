import { AnalyticsItem } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Icon from "../ui/Icon.tsx";
import { useScript } from "@deco/deco/hooks";
import { asset } from "$fresh/runtime.ts";
interface Props {
  _class?: string;
  variant?: "full" | "icon";
  item: AnalyticsItem;
}
const onLoad = (id: string, productID: string) =>
  window.STOREFRONT.WISHLIST.subscribe((sdk) => {
    const button = document.getElementById(id) as HTMLButtonElement;
    const inWishlist = sdk.inWishlist(productID);
    button.disabled = false;
    button.classList.remove("htmx-request");
    button.querySelector("svg")?.setAttribute(
      "fill",
      inWishlist ? "black" : "none",
    );
    const span = button.querySelector("span");
    if (span) {
      span.innerHTML = inWishlist ? "Remove from wishlist" : "Add to wishlist";
    }
  });
const onClick = (productID: string, productGroupID: string) => {
  const button = event?.currentTarget as HTMLButtonElement;
  const user = window.STOREFRONT.USER.getUser();
  if (user?.email) {
    button.classList.add("htmx-request");
    window.STOREFRONT.WISHLIST.toggle(productID, productGroupID);
  } else {
    window.alert(`Please login to add the product to your wishlist`);
  }
};
function WishlistButton({ _class, item, variant = "full" }: Props) {
  // deno-lint-ignore no-explicit-any
  const productID = (item as any).item_id;
  const productGroupID = item.item_group_id ?? "";
  const id = useId();
  const addToWishlistEvent = useSendEvent({
    on: "click",
    event: {
      name: "add_to_wishlist",
      params: { items: [item] },
    },
  });
  return (
    <>
      <button
        id={id}
        data-wishlist-button
        disabled
        {...addToWishlistEvent}
        aria-label="Add to wishlist"
        hx-on:click={useScript(onClick, productID, productGroupID)}
        class={clx(
          _class,
          "btn no-animation",
          variant === "icon"
            ? "btn-circle btn-ghost btn-sm"
            : "btn-primary btn-outline gap-2 w-full",
        )}
      >
        <svg
          class="[.htmx-request_&]:hidden"
          width="17"
          height="14"
          viewBox="0 0 17 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.848.42c-1.383 0-2.593.601-3.348 1.618C7.745 1.02 6.535.42 5.152.42a4.13 4.13 0 0 0-2.935 1.23A4.23 4.23 0 0 0 1 4.62c0 4.74 6.95 8.578 7.246 8.736a.53.53 0 0 0 .508 0C9.05 13.197 16 9.36 16 4.62a4.23 4.23 0 0 0-1.217-2.968A4.13 4.13 0 0 0 11.848.42ZM8.5 12.258c-1.223-.72-6.429-4.003-6.429-7.64a3.14 3.14 0 0 1 .904-2.2 3.07 3.07 0 0 1 2.177-.914c1.302 0 2.396.701 2.852 1.828a.54.54 0 0 0 .496.336.53.53 0 0 0 .496-.336c.456-1.129 1.55-1.828 2.852-1.828.817 0 1.6.33 2.177.913a3.14 3.14 0 0 1 .904 2.202c0 3.63-5.208 6.918-6.429 7.64Z"
            fill="currentColor"
            stroke="#FDF0F0"
            stroke-width=".5"
          />
        </svg>
        {/* <Icon id="favorite_new" class="[.htmx-request_&]:hidden" fill="none"/> */}
        {
          /* {variant === "full" && (
          <span class="[.htmx-request_&]:hidden">Add to wishlist</span>
        )} */
        }
        <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
      </button>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id, productID) }}
      />
    </>
  );
}
export default WishlistButton;
