import { ProductListingPage } from "apps/commerce/types.ts";
import { useScript } from "@deco/deco/hooks";
const SORT_QUERY_PARAM = "sort";
const PAGE_QUERY_PARAM = "page";
export type Props = Pick<ProductListingPage, "sortOptions"> & {
  url: string;
};
const getUrl = (href: string, value: string) => {
  const url = new URL(href);
  url.searchParams.delete(PAGE_QUERY_PARAM);
  url.searchParams.set(SORT_QUERY_PARAM, value);
  return url.href;
};
const labels: Record<string, string> = {
  "relevance:desc": "Relevância",
  "price:desc": "Maior Preço",
  "price:asc": "Menor Preço",
  "orders:desc": "Mais vendidos",
  "name:desc": "Nome - de Z a A",
  "name:asc": "Nome - de A a Z",
  "release:desc": "Lançamento",
  "discount:desc": "Maior desconto",
};
function Sort({ sortOptions, url }: Props) {
  const current = getUrl(
    url,
    new URL(url).searchParams.get(SORT_QUERY_PARAM) ?? "",
  );
  const options = sortOptions?.map(({ value, label }) => ({
    value: getUrl(url, value),
    label,
  }));
  return (
    <>
      <label for="sort" class="sr-only">
        Sort by
      </label>
      <select
        name="sort"
        class="select w-full max-w-sm rounded-none pr-1 md:pr-2"
        hx-on:change={useScript(() => {
          const select = event!.currentTarget as HTMLSelectElement;
          window.location.href = select.value;
        })}
      >
        {options.map(({ value, label }) => (
          <option
            label={labels[label] ?? label}
            value={value}
            selected={value === current}
          >
            {label}
          </option>
        ))}
      </select>
      <span class="absolute inset-y-0 right-0 flex items-center text-indigo-600 bg-white w-8">
        <svg
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.96079 0.637255L3.96079 11M3.96079 11L1 8.03922M3.96079 11L6.92157 8.03922"
            stroke="#AEAEAE"
            stroke-width="0.740196"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </>
  );
}
export default Sort;
