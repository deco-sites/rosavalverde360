import type { HTMLWidget } from "apps/admin/widgets.ts";
import { type SectionProps } from "@deco/deco";
/**
 * @titleBy matcher
 */
export interface Banner {
  /** @description RegExp to enable this banner on the current URL. Use /feminino/* to display this banner on feminino category  */
  matcher: string;
  /** @description text to be rendered on top of the image */
  content?: HTMLWidget;
}
const DEFAULT_PROPS = {
  banners: [
    {
      matcher: "/*",
      content: "As",
    },
  ],
};
function BannerText(props: SectionProps<ReturnType<typeof loader>>) {
  const { banner } = props;
  if (!banner) {
    return null;
  }
  const { content } = banner;
  return (
    <div class="grid grid-cols-1 grid-rows-1">
      {content && (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          class="container leading-normal tracking-wide text-[#4F4F4F] text-xs flex flex-col items-center justify-center sm:items-start col-start-1 col-span-1 row-start-1 row-span-1 w-full"
        >
        </div>
      )}
    </div>
  );
}
export interface Props {
  banners?: Banner[];
}
export const loader = (props: Props, req: Request) => {
  const { banners } = { ...DEFAULT_PROPS, ...props };
  const banner = banners.find(({ matcher }) =>
    new URLPattern({ pathname: matcher }).test(req.url)
  );
  return { banner };
};
export default BannerText;
