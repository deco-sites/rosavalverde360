import type { BreadcrumbList } from "apps/commerce/types.ts";
import { relative } from "../../sdk/url.ts";

interface Props {
  itemListElement: BreadcrumbList["itemListElement"];
}

function Breadcrumb({ itemListElement = [] }: Props) {
  const items = [{ name: "Home", item: "/" }, ...itemListElement];

  return (
    <div class="breadcrumbs py-0 text-xs font-light text-base-400">
      <ul>
        {items
          .filter(({ name, item }) => name && item)
          .map(({ name, item }, index) => (
            <li>
              <a
                class={`${index > 0 ? "!font-normal" : ""}`}
                href={relative(item)}
              >
                {name}
              </a>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Breadcrumb;
