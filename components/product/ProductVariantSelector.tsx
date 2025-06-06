import type { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import { relative } from "../../sdk/url.ts";
import { useId } from "../../sdk/useId.ts";
import { useVariantPossibilities } from "../../sdk/useVariantPossiblities.ts";
import { useSection } from "@deco/deco/hooks";
import { posix } from "std/path/mod.ts";
import { CUSTOM_COLORS } from "../constants/customColors.ts";

interface Props {
  product: Product;
}

// Função para obter cor do CUSTOM_COLORS
const getCustomColor = (value: string) => {
  const normalized = value.trim().toLowerCase();
  return CUSTOM_COLORS[normalized];
};

const useStyles = (value: string, checked: boolean, isColor: boolean) => {
  const customColor = getCustomColor(value);
  if (isColor && customColor) {
    return clx(
      "border border-base-300 rounded-full",
      "w-12 h-12 block",
      "border border-[#C9CFCF] rounded-full",
      "ring-2 ring-offset-2",
      checked ? "ring-primary" : "ring-transparent",
    );
  }
  return clx(
    "btn btn-ghost border-[#C9CFCF] hover:bg-base-200 hover:border-[#C9CFCF] w-12 h-12",
    "ring-2 ring-offset-2",
    checked ? "ring-primary" : "ring-transparent border-[#C9CFCF]",
  );
};

export const Ring = ({
  value,
  checked = false,
  class: _class,
  isColor = false,
}: {
  value: string;
  checked?: boolean;
  class?: string;
  isColor?: boolean;
}) => {
  const customColor = getCustomColor(value);
  const styles = clx(useStyles(value, checked, isColor), _class);
  const imageName = value.toUpperCase().replace(/[- ]/g, "_") + ".jpg";
  const backgroundImageUrl = `/cores/${imageName}`;

  return (
    <span
      style={isColor && customColor
        ? {
          backgroundColor: customColor.hex,
          backgroundImage: undefined,
          backgroundSize: undefined,
          backgroundPosition: undefined,
        }
        : isColor
        ? {
          backgroundColor: undefined,
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
        : {
          backgroundColor: customColor ? customColor.hex : undefined,
        }}
      class={styles}
    >
      {isColor && customColor ? null : !customColor && !isColor ? value : null}
    </span>
  );
};

function VariantSelector({ product }: Props) {
  const { url, isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant, product);
  const relativeUrl = relative(url);
  const id = useId();
  const filteredNames = Object.keys(possibilities).filter((name) =>
    name.toLowerCase() !== "title" && name.toLowerCase() !== "default title"
  );
  if (filteredNames.length === 0) {
    return null;
  }

  return (
    <ul
      class="flex flex-col gap-4"
      hx-target="closest section"
      hx-swap="outerHTML"
      hx-sync="this:replace"
    >
      <li class="hidden">
        {JSON.stringify(possibilities)}
      </li>
      {filteredNames.map((name) => (
        <li class="flex flex-col gap-2">
          {Object.entries(possibilities[name]).length >= 1 &&
            name != "Banhos" && <span class="text-sm">{name}</span>}
          <ul class="flex flex-row gap-4">
            {Object.entries(possibilities[name]).length >= 1 &&
              name != "Banhos" &&
              Object.entries(possibilities[name])
                .filter(([value]) => value)
                .map(([value, link]) => {
                  const relativeLink = relative(link);
                  const checked = relativeLink === relativeUrl;
                  return (
                    <li>
                      <label
                        class="cursor-pointer grid grid-cols-1 grid-rows-1 place-items-center"
                        hx-get={useSection({ href: relativeLink })}
                      >
                        {/* Checkbox para radio button no frontend */}
                        <input
                          class="hidden peer"
                          type="radio"
                          name={`${id}-${name}`}
                          checked={checked}
                        />
                        <div
                          class={clx(
                            "col-start-1 row-start-1 col-span-1 row-span-1",
                            "[.htmx-request_&]:opacity-0 transition-opacity",
                          )}
                        >
                          <Ring
                            value={value}
                            checked={checked}
                            isColor={name.toLowerCase() === "cor"}
                          />
                        </div>
                        {/* Loading spinner */}
                        <div
                          class={clx(
                            "col-start-1 row-start-1 col-span-1 row-span-1",
                            "opacity-0 [.htmx-request_&]:opacity-100 transition-opacity",
                            "flex justify-center items-center",
                          )}
                        >
                          <span class="loading loading-sm loading-spinner" />
                        </div>
                      </label>
                    </li>
                  );
                })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default VariantSelector;
