import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";

export interface Props {
  /** @description Section title */
  title?: string;
  align?: "justify-center" | "justify-left";

  /** @description See all link */
  cta?: string;
}

function Header({ title, cta, align }: Props) {
  if (!title) {
    return null;
  }

  return (
    <div
      class={`${align} flex items-center gap-2px-5 sm:px-0`}
    >
      <span class="font-medium text-xl tracking-[0.6px]">{title}</span>
      {cta && (
        <a class="text-sm font-medium text-primary" href={cta}>
          See all
        </a>
      )}
    </div>
  );
}

interface Tab {
  title: string;
}

function Tabbed(
  { children }: {
    children: JSX.Element;
  },
) {
  return (
    <>
      {children}
    </>
  );
}

function Container({ class: _class, ...props }: JSX.IntrinsicElements["div"]) {
  return (
    <div
      {...props}
      class={clx(
        "container flex flex-col gap-4 sm:gap-6 w-full py-5 sm:py-10",
        _class?.toString(),
      )}
    />
  );
}

function Placeholder(
  { height, class: _class }: { height: string; class?: string },
) {
  return (
    <div
      style={{
        height,
        containIntrinsicSize: height,
        contentVisibility: "auto",
      }}
      class={clx("flex justify-center items-center", _class)}
    >
      <span class="loading loading-spinner" />
    </div>
  );
}

function Section() {}

Section.Container = Container;
Section.Header = Header;
Section.Tabbed = Tabbed;
Section.Placeholder = Placeholder;

export default Section;
