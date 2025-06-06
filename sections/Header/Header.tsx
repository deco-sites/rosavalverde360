import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Alert from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import Menu from "../../components/header/Menu.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import Searchbar, {
  type SearchbarProps,
} from "../../components/search/Searchbar/Form.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
// import Icon from "../../components/ui/Icon.tsx";
import Modal from "../../components/ui/Modal.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT_MOBILE,
  SEARCHBAR_DRAWER_ID,
  SEARCHBAR_POPUP_ID,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import { useDevice } from "@deco/deco/hooks";
import { type LoadingFallbackProps } from "@deco/deco";
export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}
export interface SectionProps {
  alerts?: HTMLWidget[];
  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: SiteNavigationElement[] | null;
  /**
   * @title Searchbar
   * @description Searchbar configuration
   */
  searchbar: SearchbarProps;
  /** @title Logo */
  logo: Logo;
  /**
   * @description Usefull for lazy loading hidden elements, like hamburguer menus etc
   * @hide true */
  loading?: "eager" | "lazy";
}
type Props = Omit<SectionProps, "alert">;

const Desktop = ({ navItems, logo, searchbar, loading }: Props) => (
  <>
    <Modal id={SEARCHBAR_POPUP_ID}>
      <div
        class="absolute top-0 bg-base-100 container"
        style={{ marginTop: HEADER_HEIGHT_MOBILE }}
      >
        {loading === "lazy"
          ? (
            <div class="flex justify-center items-center">
              <span class="loading loading-spinner" />
            </div>
          )
          : <Searchbar {...searchbar} />}
      </div>
    </Modal>

    <div class="flex flex-col gap-3 pt-5 container">
      <div class="grid grid-cols-3 place-items-center">
        <Searchbar {...searchbar} />
        {
          /* <label
          for={SEARCHBAR_POPUP_ID}
          class="input input-bordered flex items-center gap-2 w-full"
          aria-label="search icon button"
        >
          <Icon id="search" />
          <span class="text-base-400 truncate">
            Search products, brands...
          </span>
        </label> */
        }

        <div class="place-self-center">
          <a href="/" aria-label="Store logo">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 100}
              height={logo.height || 23}
            />
          </a>
        </div>

        <div class="flex gap-4 place-self-end items-center">
          <a href={"/wishlist"}>
            <svg
              width="23"
              height="19"
              viewBox="0 0 23 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.679.557c-2.002 0-3.755.822-4.848 2.211C10.74 1.378 8.986.557 6.984.557A6.17 6.17 0 0 0 2.735 2.24 5.62 5.62 0 0 0 .973 6.297c0 6.48 10.062 11.726 10.49 11.942a.8.8 0 0 0 .736 0c.428-.216 10.49-5.462 10.49-11.942a5.62 5.62 0 0 0-1.762-4.057A6.17 6.17 0 0 0 16.68.557ZM11.83 16.74c-1.77-.985-9.307-5.473-9.307-10.443a4.17 4.17 0 0 1 1.308-3.01 4.58 4.58 0 0 1 3.152-1.25c1.885 0 3.468.96 4.13 2.5a.75.75 0 0 0 .285.334.8.8 0 0 0 .864 0 .75.75 0 0 0 .286-.333c.66-1.544 2.244-2.5 4.13-2.5a4.58 4.58 0 0 1 3.152 1.249 4.17 4.17 0 0 1 1.307 3.01c0 4.963-7.539 9.457-9.307 10.443Z"
                fill="#101010"
                stroke="#fff"
                stroke-width=".607"
              />
            </svg>
          </a>
          <Bag />
        </div>
      </div>

      <div class="flex justify-between items-center">
        <ul class="flex justify-between items-center w-full">
          {navItems?.slice(0, 14).map((item) => <NavItem item={item} />)}
        </ul>
        {
          /* <div>
          ship to
        </div> */
        }
      </div>
    </div>
  </>
);
const Mobile = ({ logo, searchbar, navItems, loading }: Props) => (
  <>
    <Drawer
      id={SEARCHBAR_DRAWER_ID}
      aside={
        <Drawer.Aside title="Search" drawer={SEARCHBAR_DRAWER_ID}>
          <div class="w-screen overflow-y-auto">
            {loading === "lazy"
              ? (
                <div class="h-full w-full flex items-center justify-center">
                  <span class="loading loading-spinner" />
                </div>
              )
              : <Searchbar {...searchbar} />}
          </div>
        </Drawer.Aside>
      }
    />
    <Drawer
      id={SIDEMENU_DRAWER_ID}
      aside={
        <Drawer.Aside title="Menu" drawer={SIDEMENU_DRAWER_ID}>
          {loading === "lazy"
            ? (
              <div
                id={SIDEMENU_CONTAINER_ID}
                class="h-full flex items-center justify-center"
                style={{ minWidth: "100vw" }}
              >
                <span class="loading loading-spinner" />
              </div>
            )
            : <Menu navItems={navItems ?? []} />}
        </Drawer.Aside>
      }
    />

    <div
      class="grid place-items-center w-screen px-5 gap-4"
      style={{
        height: NAVBAR_HEIGHT_MOBILE,
        gridTemplateColumns:
          "min-content min-content auto min-content min-content",
      }}
    >
      <label
        for={SIDEMENU_DRAWER_ID}
        class="btn btn-square btn-sm btn-ghost max-w-[20px]"
        aria-label="open menu"
      >
        <svg
          width="17"
          height="15"
          viewBox="0 0 17 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#101010"
            d="M0 .982h16.84v.759H0zm0 12.91h16.84v.759H0zm0-6.835h16.84v.759H0z"
          />
        </svg>
        {/* <Icon id="menu"/> */}
      </label>

      <label
        for={SEARCHBAR_DRAWER_ID}
        class="btn btn-square btn-sm btn-ghost max-w-[20px]"
        aria-label="search icon button"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m11.307 10.433-.212.268.243.241 3.47 3.438-.547.543-3.47-3.438-.244-.242-.27.21a6.25 6.25 0 0 1-3.846 1.322c-3.434 0-6.21-2.75-6.21-6.151 0-3.402 2.776-6.151 6.21-6.151s6.21 2.75 6.21 6.15a6.1 6.1 0 0 1-1.334 3.81M.997 6.623c0 2.972 2.435 5.383 5.434 5.383s5.434-2.411 5.434-5.382S9.43 1.242 6.43 1.242.997 3.653.997 6.624"
            fill="#101010"
          />
        </svg>
        {/* <Icon id="search"/> */}
      </label>

      {logo && (
        <a
          href="/"
          class="flex-grow inline-flex items-center justify-center max-w-[140px]"
          style={{ minHeight: NAVBAR_HEIGHT_MOBILE }}
          aria-label="Store logo"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width || 100}
            height={logo.height || 13}
          />
        </a>
      )}

      <label
        class="btn btn-square btn-sm btn-ghost max-w-[20px]"
        aria-label="wishlist-redirect icon button"
      >
        <a href="/wishlist">
          <svg
            width="19"
            height="16"
            viewBox="0 0 19 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.488 1c-1.651 0-3.096.678-3.997 1.823C8.591 1.678 7.146 1 5.495 1a5.08 5.08 0 0 0-3.502 1.387A4.63 4.63 0 0 0 .54 5.732c0 5.342 8.295 9.667 8.648 9.845a.66.66 0 0 0 .606 0c.354-.178 8.649-4.503 8.649-9.845a4.63 4.63 0 0 0-1.453-3.345A5.08 5.08 0 0 0 13.488 1ZM9.49 14.34c-1.459-.81-7.67-4.51-7.67-8.607A3.44 3.44 0 0 1 2.897 3.25a3.77 3.77 0 0 1 2.598-1.03c1.555 0 2.86.79 3.405 2.06.048.113.13.209.235.276a.66.66 0 0 0 .712 0 .6.6 0 0 0 .236-.275c.545-1.272 1.85-2.06 3.405-2.06a3.77 3.77 0 0 1 2.598 1.029 3.44 3.44 0 0 1 1.078 2.48c0 4.092-6.215 7.797-7.673 8.61Z"
              fill="#101010"
              stroke="#fff"
              stroke-width=".5"
            />
          </svg>
          {/* <Icon id="search"/> */}
        </a>
      </label>
      <Bag />
    </div>
  </>
);

function Header({
  alerts = [],
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  ...props
}: Props) {
  const device = useDevice();
  return (
    <header
      style={{
        height: device === "desktop"
          ? HEADER_HEIGHT_DESKTOP
          : HEADER_HEIGHT_MOBILE,
      }}
    >
      <div class="bg-white w-full max-w-full z-40">
        {alerts.length > 0 && <Alert alerts={alerts} />}
        {device === "desktop"
          ? <Desktop logo={logo} {...props} />
          : <Mobile logo={logo} {...props} />}
      </div>
    </header>
  );
}
export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  // deno-lint-ignore no-explicit-any
  <Header {...props as any} loading="lazy" />
);
export default Header;
