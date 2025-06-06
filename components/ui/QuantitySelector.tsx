import { type JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
const onClick = (delta: number) => {
  // doidera!
  event!.stopPropagation();
  const button = event!.currentTarget as HTMLButtonElement;
  const input = button.parentElement
    ?.querySelector<HTMLInputElement>('input[type="number"]')!;
  const min = Number(input.min) || -Infinity;
  const max = Number(input.max) || Infinity;
  input.value = `${Math.min(Math.max(input.valueAsNumber + delta, min), max)}`;
  input.dispatchEvent(new Event("change", { bubbles: true }));
};
function QuantitySelector(
  { id = useId(), disabled, ...props }: JSX.IntrinsicElements["input"],
) {
  return (
    <div class="join border-none bg-white justify-center rounded-sm w-full max-w-[100px]">
      <button
        type="button"
        class="btn hover:bg-transparent w-5 font-light text-base btn-square btn-ghost no-animation"
        hx-on:click={useScript(onClick, -1)}
        disabled={disabled}
      >
        -
      </button>
      <div
        data-tip={`Quantity must be between ${props.min} and ${props.max}`}
        class={clx(
          "join-item px-2",
          "flex justify-center items-center",
          "has-[:invalid]:tooltip has-[:invalid]:tooltip-error has-[:invalid]:tooltip-open has-[:invalid]:tooltip-bottom",
        )}
      >
        <input
          id={id}
          class={clx(
            "input max-w-6 p-0 text-center rounded-none [appearance:textfield]",
            "invalid:input-error",
          )}
          disabled={disabled}
          inputMode="numeric"
          type="number"
          {...props}
        />
      </div>
      <button
        type="button"
        class="btn w-5 hover:bg-transparent font-light text-base rounded-none bg-white btn-square btn-ghost no-animation"
        hx-on:click={useScript(onClick, 1)}
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
}
export default QuantitySelector;
