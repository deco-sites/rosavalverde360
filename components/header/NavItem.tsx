import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";

function NavItem({ item }: { item: SiteNavigationElement }) {
  const { url, name, children } = item;
  const image = item?.image?.[0];

  return (
    <li
      class="group flex items-center pr-5"
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
    >
      {name && (
        <a
          href={url}
          class="[&>b]:font-bold group-hover:underline tracking-wide decoration-[#D68E87] underline-offset-[10px] text-xs text-[#514438] font-light"
          dangerouslySetInnerHTML={{ __html: name }}
        />
      )}

      {children && children.length > 0 &&
        (
          <div
            class="fixed hidden hover:flex bg-white group-hover:flex z-40 items-start justify-center gap-6 w-screen"
            style={{
              top: "0px",
              left: "0px",
              marginTop: HEADER_HEIGHT_DESKTOP,
            }}
          >
            <div className="container pt-4 pb-4 max-w-6xl flex items-start justify-between">
              <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                {children.map((node) => (
                  <li class="p-2 pl-0">
                    <a
                      class="hover:text-[#D68E87] tracking-wide underline-offset-[10px] text-xs text-[#514438] font-light"
                      href={node.url}
                    >
                      <span>{node.name}</span>
                    </a>
                    {node.children && node.children?.length > 0
                      ? (
                        <ul class="flex flex-col gap-1 mt-4">
                          {node.children?.map((leaf) => (
                            <li>
                              <a
                                class="hover:text-[#D68E87] tracking-wide"
                                href={leaf.url}
                              >
                                <span class="text-xs">{leaf.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      )
                      : <></>}
                  </li>
                ))}
              </ul>

              {image?.url && (
                <Image
                  class="p-0"
                  src={image.url}
                  alt={image.alternateName}
                  width={335}
                  height={234}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        )}
    </li>
  );
}

export default NavItem;
