import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import Avatar from "../../components/ui/Avatar.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";

interface Props {
  filters: ProductListingPage["filters"];
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem(
  { url, selected, label, quantity }: FilterToggleValue,
) {
  return (
    <a href={url} rel="nofollow" class="flex items-center gap-2">
      <input
        type="checkbox"
        checked={selected}
        class="checkbox checkbox-sm"
        readOnly
      />
      <span class="text-xs leading-normal tracking-wide text-[#4F4F4F]">
        {label}
      </span>
      {quantity > 0 && (
        <span class="text-xs leading-normal tracking-wide text-[#4F4F4F]">
          ({quantity})
        </span>
      )}
    </a>
  );
}

function FilterValues({ key, values }: FilterToggle) {
  const avatars = key === "cor";
  const flexDirection = avatars ? "flex-row items-center" : "flex-col";
  return (
    <ul
      class={clx(
        `gap-4 menu bg-white w-full p-2`,
        flexDirection,
      )}
    >
      {values.sort((a, b) => a.label.localeCompare(b.label)).map((item) => {
        const { url, selected, value } = item;

        if (avatars) {
          return (
            <a href={url} rel="nofollow">
              <Avatar
                content={value}
                variant={selected ? "active" : "default"}
              />
            </a>
          );
        }

        if (key === "price") {
          const range = parseRange(item.value);

          return range && (
            <ValueItem
              {...item}
              label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
            />
          );
        }

        return <ValueItem {...item} />;
      })}
    </ul>
  );
}

function FiltersCollapse({ filters }: Props) {
  return (
    <ul class="flex flex-col w-full gap-4">
      {filters
        .filter(isToggle)
        .sort((a, b) => {
          if (a.label === "Modelo") return 1;
          if (b.label === "Modelo") return -1;
          return a.label.localeCompare(b.label);
        })
        .map((filter, index) => (
          <li
            key={index}
            className={`${
              filter.label === "Categoria" ||
                filter.label === "Marca" ||
                filter.label === "Departamento"
                ? "hidden"
                : ""
            }`}
          >
            <div class="collapse collapse-arrow bg-white border border-base-200">
              <input type="checkbox" />
              <div class="collapse-title text-sm font-light text-[#4F4F4F]">
                {filter.label}
              </div>
              <div class="collapse-content">
                <FilterValues {...filter} />
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
}

export default FiltersCollapse;
