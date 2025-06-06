import { AppContext } from "../../apps/site.ts";
import Icon from "../../components/ui/Icon.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { useComponent } from "../Component.tsx";
import { type SectionProps } from "@deco/deco";
interface NoticeProps {
  title?: string;
  description?: string;
}
export interface Props {
  empty?: NoticeProps;
  success?: NoticeProps;
  failed?: NoticeProps;
  /** @description Signup label */
  label?: string;
  /** @description Input placeholder */
  placeholder?: string;
  /** @hide true */
  status?: "success" | "failed";
  classe?: string;
}
export async function action(props: Props, req: Request, ctx: AppContext) {
  const platform = usePlatform();
  const form = await req.formData();
  const email = `${form.get("email") ?? ""}`;
  if (platform === "vtex") {
    // deno-lint-ignore no-explicit-any
    await (ctx as any).invoke("vtex/actions/newsletter/subscribe.ts", {
      email,
    });
    return { ...props, status: "success" };
  }
  return { ...props, status: "failed" };
}
export function loader(props: Props) {
  return { ...props, status: undefined };
}
function Notice({ title, description }: {
  title?: string;
  description?: string;
}) {
  return (
    <div class="flex flex-col justify-center items-center sm:items-start gap-2">
      <span class="text-xs tracking-wide font-light text-center md:uppercase">
        {title}
      </span>
      <span class="text-xs tracking-wide font-light text-center md:px-0 px-5 md:uppercase">
        {description}
      </span>
    </div>
  );
}
function Newsletter({
  empty = {
    title: "Get top deals, latest trends, and more.",
    description:
      "Receive our news and promotions in advance. Enjoy and get 10% off your first purchase. For more information click here.",
  },
  success = {
    title: "Thank you for subscribing!",
    description:
      "You’re now signed up to receive the latest news, trends, and exclusive promotions directly to your inbox. Stay tuned!",
  },
  failed = {
    title: "Oops. Something went wrong!",
    description:
      "Something went wrong. Please try again. If the problem persists, please contact us.",
  },
  label = "Sign up",
  placeholder = "Enter your email address",
  status,
  classe,
}: SectionProps<typeof loader, typeof action>) {
  if (status === "success" || status === "failed") {
    return (
      <Section.Container>
        <div class="p-5 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-10">
          <Icon
            size={80}
            class={clx(status === "success" ? "text-success" : "text-error")}
            id={status === "success" ? "check-circle" : "error"}
          />
          <Notice {...status === "success" ? success : failed} />
        </div>
      </Section.Container>
    );
  }
  return (
    <Section.Container class={`sm:!py-0 ${classe}`}>
      <div class="px-5 py-5 md:py-0 grid grid-flow-row grid-cols-1 md:grid-cols-1 gap-6 sm:gap-6 place-items-center">
        <Notice {...empty} />

        <form
          hx-target="closest section"
          hx-swap="outerHTML"
          hx-post={useComponent(import.meta.url)}
          class="flex flex-row sm:flex-row gap-0 w-full relative"
        >
          <input
            name="email"
            class="input border-black placeholder:text-black text-black placeholder:text-sm placeholder:font-light placeholder:leading-normal placeholder:tracking-wide input-bordered flex-grow bg-transparent rounded-none text-center"
            type="text"
            placeholder={placeholder}
          />

          <button
            class="btn rounded-none border text-white border-black font-normal bg-black hover:bg-transparent"
            type="submit"
          >
            <span class="[.htmx-request_&]:hidden inline">
              {label}
            </span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
          </button>
        </form>
      </div>
    </Section.Container>
  );
}
export const LoadingFallback = () => <Section.Placeholder height="412px" />;
export default Newsletter;
