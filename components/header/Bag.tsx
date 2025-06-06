import { MINICART_DRAWER_ID } from "../../constants.ts";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
const onLoad = (id: string) =>
  window.STOREFRONT.CART.subscribe((sdk) => {
    const counter = document.getElementById(id);
    const count = sdk.getCart()?.items.length ?? 0;
    if (!counter) {
      return;
    }
    // Set minicart items count on header
    if (count === 0) {
      counter.classList.add("hidden");
    } else {
      counter.classList.remove("hidden");
    }
    counter.innerText = count > 9 ? "9+" : count.toString();
  });
function Bag() {
  const id = useId();
  return (
    <>
      <label class="indicator" for={MINICART_DRAWER_ID} aria-label="open cart">
        <span
          id={id}
          class="hidden indicator-item badge badge-primary badge-sm font-thin bg-black border-black right-[5px] p-0 w-[15px] font-bold top-[10px]"
        />

        <span class="btn btn-square btn-sm btn-ghost no-animation">
          {/* <Icon id="shopping_bag"/> */}
          <svg
            width="19"
            height="20"
            viewBox="0 0 19 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.457 19c.439 0 .795-.368.795-.823s-.356-.822-.795-.822-.794.368-.794.822c0 .455.355.823.794.823m8.739 0a.805.805 0 0 0 .794-.818c0-.454-.355-.827-.794-.827s-.795.368-.795.822a.81.81 0 0 0 .795.823M1.215 1.37h3.137l2.101 10.912c.072.375.268.712.555.951.287.24.645.368 1.013.36h7.622c.368.008.726-.12 1.013-.36s.483-.576.555-.952l1.255-6.836H5.136"
              stroke="#101010"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </label>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </>
  );
}
export default Bag;
