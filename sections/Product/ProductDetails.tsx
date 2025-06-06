import { ProductDetailsPage } from "apps/commerce/types.ts";
import ImageGallerySlider from "../../components/product/Gallery.tsx";
import ProductInfo from "../../components/product/ProductInfo.tsx";
import Breadcrumb from "../../components/ui/Breadcrumb.tsx";
import Section from "../../components/ui/Section.tsx";
import type { Product } from "apps/commerce/types.ts";
import { clx } from "../../sdk/clx.ts";
import BuyTogether from "../../components/product/BuyTogether.tsx";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  similars?: Product[] | null;
}

export default function ProductDetails({ page, similars }: Props) {
  const description = page?.product.description ||
    page?.product.isVariantOf?.description;

  const formattedDescription = description?.replace(/\r?\n\r?\n/g, "<br><br>")
    .replace(/\r?\n/g, "<br>");

  /**
   * Rendered when a not found is returned by any of the loaders run on this page
   */
  if (!page) {
    return (
      <div class="w-full flex justify-center items-center py-28">
        <div class="flex flex-col items-center justify-center gap-6">
          <span class="font-medium text-2xl">Page not found</span>
          <a href="/" class="btn no-animation">
            Go back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div class="container flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5 px-5 sm:px-0">
      <Breadcrumb itemListElement={page.breadcrumbList.itemListElement} />

      <div
        class={clx(
          "container grid",
          "grid-cols-1 gap-2 py-0",
          "sm:grid-cols-3 sm:gap-6",
        )}
      >
        <div class="sm:col-span-2">
          <ImageGallerySlider page={page} />
        </div>
        <div class="sm:col-span-1">
          <ProductInfo page={page} />
        </div>
      </div>
      <div class="container">
        {description && (
          <details
            tabIndex={0}
            className="collapse collapse-plus bg-transparent w-full"
            open
          >
            <summary className="collapse-title text-sm font-light uppercase mb-3 border-b-[rgba(152,129,129,50%)] border-b border-solid">
              DETALHES DO PRODUTO
            </summary>
            {formattedDescription && (
              <div
                className="collapse-content font-light text-sm"
                // deno-lint-ignore react-no-danger
                dangerouslySetInnerHTML={{ __html: formattedDescription }}
              />
            )}
          </details>
        )}
      </div>
      <div class="container">
        <BuyTogether
          products={similars}
          principal={page.product}
        />
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
