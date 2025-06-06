import Icon from "../../components/ui/Icon.tsx";
import type { SiteNavigationElement } from "apps/commerce/types.ts";

export interface Props {
  navItems?: SiteNavigationElement[];
}

function MenuItem({ item }: { item: SiteNavigationElement }) {
  return (
    <div class="collapse collapse-plus">
      <input type="checkbox" />
      {item.name && (
        // deno-lint-ignore react-no-danger
        <div
          class="collapse-title"
          dangerouslySetInnerHTML={{ __html: item.name }}
        />
      )}
      <div class="collapse-content">
        <ul>
          <li>
            <a class="underline text-sm" href={item.url}>Ver todos</a>
          </li>
          {item.children?.map((node) => (
            <li>
              <MenuItem item={node} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Menu({ navItems = [] }: Props) {
  return (
    <div
      class="flex flex-col h-full overflow-y-auto"
      style={{ minWidth: "100vw" }}
    >
      <ul class="px-4 flex-grow flex flex-col divide-y divide-base-200 overflow-y-auto">
        {navItems.map((item) => (
          <li>
            <MenuItem item={item} />
          </li>
        ))}
      </ul>

      <ul class="flex flex-col py-2 bg-base-200">
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="/wishlist"
          >
            {/* <Icon id="favorite" /> */}
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
            {/* <span class="text-sm">Lista de desejos</span> */}
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="home_pin" />
            <span class="text-sm">Nossas lojas</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="call" />
            <span class="text-sm">Fale conosco</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center gap-4 px-4 py-2"
            href="https://www.deco.cx"
          >
            <Icon id="account_circle" />
            <span class="text-sm">Minha conta</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
