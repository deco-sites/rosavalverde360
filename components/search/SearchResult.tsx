import type { ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import ProductCard from "../../components/product/ProductCard.tsx";
import Filters from "../../components/search/Filters.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import Drawer from "../ui/Drawer.tsx";
import Sort from "./Sort.tsx";
import { useDevice, useScript, useSection } from "@deco/deco/hooks";
import { type SectionProps } from "@deco/deco";
import { Sections } from "apps/website/pages/Page.tsx";
import FiltersCollapse from "./FiltersCollapse.tsx";
export interface Layout {
  /**
   * @title Pagination
   * @description Format of the pagination
   */
  pagination?: "show-more" | "pagination";
}
export interface Props {
  /** @title Integration */
  page: ProductListingPage | null;
  layout?: Layout;
  /** @description 0 for ?page=0 as your first page */
  startingPage?: 0 | 1;
  /** @hidden */
  partial?: "hideMore" | "hideLess";
  sections?: Sections;
}
function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Not Found!</span>
    </div>
  );
}
const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;
  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);
    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }
    url = final.href;
  }
  return url;
};
function PageResult(props: SectionProps<typeof loader>) {
  const { layout, startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, pageInfo } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url);
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url);
  const partialPrev = useSection({
    href: prevPageUrl,
    props: { partial: "hideMore" },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });
  const infinite = layout?.pagination !== "pagination";

  return (
    <div class="page-result grid grid-flow-row grid-cols-1 place-items-center">
      <div
        class={clx(
          "pb-2 sm:pb-10",
          (!prevPageUrl || partial === "hideLess") && "hidden",
        )}
      >
        <a
          rel="prev"
          class="btn btn-ghost"
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          <span class="inline [.htmx-request_&]:hidden">
            Show Less
          </span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-center",
          "grid-cols-2 gap-2",
          "sm:grid-cols-4 sm:gap-6",
          "w-full",
        )}
      >
        {products?.map((product, index) => (
          <ProductCard
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            class="h-full min-w-[160px] max-w-full md:max-w-full"
          />
        ))}
      </div>

      <div class={clx("pt-2 sm:pt-10 w-full", "")}>
        {infinite
          ? (
            <div class="flex justify-center [&_section]:contents">
              <a
                rel="next"
                class={clx(
                  "btn btn-ghost border rounded-none border-solid border-black font-light text-sm min-w-[220px]",
                  (!nextPageUrl || partial === "hideMore") && "hidden",
                )}
                hx-swap="outerHTML show:parent:top"
                hx-get={partialNext}
              >
                <span class="inline [.htmx-request_&]:hidden">
                  Mostrar mais
                </span>
                <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
              </a>
            </div>
          )
          : (
            <div class={clx("join", infinite && "hidden")}>
              <a
                rel="prev"
                aria-label="previous page link"
                href={prevPageUrl ?? "#"}
                disabled={!prevPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" class="rotate-180" />
              </a>
              <span class="btn btn-ghost join-item">
                Page {zeroIndexedOffsetPage + 1}
              </span>
              <a
                rel="next"
                aria-label="next page link"
                href={nextPageUrl ?? "#"}
                disabled={!nextPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" />
              </a>
            </div>
          )}
      </div>
    </div>
  );
}

const setPageQuerystring = (page: string, id: string) => {
  const element = document.getElementById(id)?.querySelector(
    "[data-product-list]",
  );
  if (!element) {
    return;
  }
  new IntersectionObserver((entries) => {
    const url = new URL(location.href);
    const prevPage = url.searchParams.get("page");
    for (let it = 0; it < entries.length; it++) {
      if (entries[it].isIntersecting) {
        url.searchParams.set("page", page);
      } else if (
        typeof history.state?.prevPage === "string" &&
        history.state?.prevPage !== page
      ) {
        url.searchParams.set("page", history.state.prevPage);
      }
    }
    history.replaceState({ prevPage }, "", url.href);
  }).observe(element);
};

function Result(props: SectionProps<typeof loader>) {
  const container = useId();
  const controls = useId();
  const device = useDevice();
  const { startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;
  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        // TODO: get category name from search or cms setting
        item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
        item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
        items: page.products?.map((product, index) =>
          mapProductToAnalyticsItem({
            ...(useOffer(product.offers)),
            index: offset + index,
            product,
            breadcrumbList: page.breadcrumb,
          })
        ),
      },
    },
  });
  console.log(page.pageInfo);
  const results = (
    <span class="text-sm font-normal">
      {page.pageInfo.records &&
          page.pageInfo.recordPerPage &&
          page.pageInfo.records < page.pageInfo.recordPerPage
        ? page.pageInfo.records
        : page.pageInfo.recordPerPage} de {page.pageInfo.records}
    </span>
  );
  const sortBy = sortOptions.length > 0 && (
    <div class="flex flex-row gap-2 items-center relative border border-[#9999992E] border-solid md:border-none">
      <span class="font-light text-base whitespace-nowrap md:block hidden">
        ORDENAR POR:
      </span>
      <Sort sortOptions={sortOptions} url={url} />
    </div>
  );
  return (
    <>
      <div id={container} {...viewItemListEvent} class="w-full">
        {partial
          ? <PageResult {...props} />
          : (
            <div class="container flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5 px-5 sm:px-0">
              {/* <Breadcrumb itemListElement={breadcrumb?.itemListElement} /> */}

              {device === "mobile" && (
                <Drawer
                  class={"bg-white p-4"}
                  id={controls}
                  aside={
                    <div class="bg-white md:w-full w-4/5 flex flex-col h-full divide-y overflow-y-hidden">
                      <div class="flex justify-between items-center">
                        <h2 class="px-4 py-3">
                          <span class="font-medium text-2xl">FILTRAR</span>
                        </h2>
                        <label class="btn btn-ghost" for={controls}>
                          <Icon id="close" />
                        </label>
                      </div>
                      <div class="flex-grow overflow-auto">
                        <FiltersCollapse filters={filters} />
                      </div>
                    </div>
                  }
                >
                  <div class="flex sm:hidden justify-between items-end gap-2 md:gap-0">
                    <label
                      class="btn bg-transparent rounded-none border border-[#9999992E] border-solid flex gap-2 items-center"
                      for={controls}
                    >
                      <svg
                        width="16"
                        height="15"
                        viewBox="0 0 16 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M.863 2.25h15m-15 5.5h15m-10.5 6.5v-3.5m-4.5 1.5h15m-5-2.5v-3.5m-5.5-2V.75"
                          stroke="#000"
                        />
                      </svg>
                      FILTRAR
                    </label>
                    <div class="flex flex-col">
                      {/* {results} */}
                      {sortBy}
                    </div>
                    <div
                      class="btn rounded-none flex border border-[#9999992E] border-solid"
                      id="select-grid"
                    >
                      <div
                        class="one-grid w-[20px]"
                        hx-on:click={useScript(() => {
                          document.querySelector("[data-product-list]")
                            ?.classList.add("grid-cols-1");
                          document.querySelector("[data-product-list]")
                            ?.classList.remove("grid-cols-2");
                          document.querySelector(".one-selector")?.classList
                            .add("!bg-[#1E1E1E]");
                          document.querySelectorAll(".two-selector")[0]
                            .classList.remove("!bg-[#1E1E1E]");
                          document.querySelectorAll(".two-selector")[1]
                            .classList.remove("!bg-[#1E1E1E]");
                        })}
                      >
                        <div class="w-3 h-[12px] bg-[#D9D9D9] one-selector">
                        </div>
                      </div>
                      <div
                        class="two-grid w-[20px] flex gap-1"
                        hx-on:click={useScript(() => {
                          document.querySelector("[data-product-list]")
                            ?.classList.add("grid-cols-2");
                          document.querySelector("[data-product-list]")
                            ?.classList.remove("grid-cols-1");
                          document.querySelectorAll(".two-selector")[0]
                            .classList.add("!bg-[#1E1E1E]");
                          document.querySelectorAll(".two-selector")[1]
                            .classList.add("!bg-[#1E1E1E]");
                          document.querySelector(".one-selector")?.classList
                            .remove("!bg-[#1E1E1E]");
                        })}
                      >
                        <div class="w-1.5 h-[12px] bg-[#D9D9D9] two-selector">
                        </div>
                        <div class="w-1.5 h-[12px] bg-[#D9D9D9] two-selector">
                        </div>
                      </div>
                    </div>
                  </div>
                </Drawer>
              )}

              <div class="grid grid-switch place-items-center grid-cols-1 sm:grid-cols-1">
                {device === "desktop" && (
                  <aside class="w-full place-self-start flex flex-col gap-3 bg-white p-6 mb-6">
                    <div class="text-sm font-light">
                      {props.sections?.map(({ Component, props }) => (
                        <Component {...props} />
                      ))}
                    </div>
                    <div class="flex flex-row gap-3">
                      <span class="leading-normal tracking-wide text-[#4F4F4F] text-sm font-light flex items-center">
                        FILTRAR POR:
                      </span>
                      <Filters filters={filters} />
                    </div>

                    <hr />

                    {device === "desktop" && (
                      <div class="flex justify-between items-center">
                        <div>
                          {sortBy}
                        </div>
                        {results}
                      </div>
                    )}
                  </aside>
                )}
                <h2 class="mb-6 w-full text-left md:text-[28px] text-xl font-normal">
                  {page.seo?.title}
                </h2>
                <div class="flex flex-col gap-9 w-full">
                  <PageResult {...props} />
                </div>
              </div>
            </div>
          )}
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setPageQuerystring,
            `${pageInfo.currentPage}`,
            container,
          ),
        }}
      />
    </>
  );
}

function SearchResult({ page, ...props }: SectionProps<typeof loader>) {
  if (!page) {
    return <NotFound />;
  }
  return <Result {...props} page={page} />;
}

export const loader = (props: Props, req: Request) => {
  return {
    ...props,
    url: req.url,
  };
};

export default SearchResult;
