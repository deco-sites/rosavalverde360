/**
 * We use a custom route at /s?q= to perform the search. This component
 * redirects the user to /s?q={term} when the user either clicks on the
 * button or submits the form. Make sure this page exists in deco.cx/admin
 * of yout site. If not, create a new page on this route and add the appropriate
 * loader.
 *
 * Note that this is the most performatic way to perform a search, since
 * no JavaScript is shipped to the browser!
 */
import { Suggestion } from "apps/commerce/types.ts";
import {
  SEARCHBAR_INPUT_FORM_ID,
  SEARCHBAR_POPUP_ID,
} from "../../../constants.ts";
import { useId } from "../../../sdk/useId.ts";
import { useComponent } from "../../../sections/Component.tsx";
// import Icon from "../../ui/Icon.tsx";
import { Props as SuggestionProps } from "./Suggestions.tsx";
import { useScript } from "@deco/deco/hooks";
import { asResolved, type Resolved } from "@deco/deco";
// When user clicks on the search button, navigate it to
export const ACTION = "/s";
// Querystring param used when navigating the user
export const NAME = "q";
export interface SearchbarProps {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;
  /** @description Loader to run when suggesting new elements */
  loader: Resolved<Suggestion | null>;
}
const script = (formId: string, name: string, popupId: string) => {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const input = form?.elements.namedItem(name) as HTMLInputElement | null;
  form?.addEventListener("submit", () => {
    const search_term = input?.value;
    if (search_term) {
      window.DECO.events.dispatch({
        name: "search",
        params: { search_term },
      });
    }
  });
  // Keyboard event listeners
  addEventListener("keydown", (e: KeyboardEvent) => {
    const isK = e.key === "k" || e.key === "K" || e.keyCode === 75;
    // Open Searchbar on meta+k
    if (e.metaKey === true && isK) {
      const input = document.getElementById(popupId) as HTMLInputElement | null;
      if (input) {
        input.checked = true;
        document.getElementById(formId)?.focus();
      }
    }
  });
};
const Suggestions = import.meta.resolve("./Suggestions.tsx");
export default function Searchbar(
  { placeholder = "PESQUISAR", loader }: SearchbarProps,
) {
  const slot = useId();
  return (
    <div class="w-full" // style={{ gridTemplateRows: "min-content auto" }}
    >
      <form
        id={SEARCHBAR_INPUT_FORM_ID}
        action={ACTION}
        class="join rounded-none border-b border-b-[#00000033] md:w-auto w-full"
      >
        <button
          type="submit"
          class="btn rounded-none hover:border-none border-none bg-transparent shadow-none join-item hover:bg-transparent no-animation"
          aria-label="Search"
          for={SEARCHBAR_INPUT_FORM_ID}
          tabIndex={-1}
        >
          <span class="loading loading-spinner loading-xs hidden [.htmx-request_&]:inline" />
          {/* <Icon id="search" class="inline [.htmx-request_&]:hidden" /> */}
          <svg
            class="inline [.htmx-request_&]:hidden"
            width="18"
            height="19"
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m13.448 13-.258.324.295.293 4.21 4.17-.664.658-4.21-4.17-.295-.293-.329.256a7.58 7.58 0 0 1-4.664 1.602C3.367 15.84 0 12.505 0 8.38S3.367.917 7.533.917c4.165 0 7.533 3.335 7.533 7.462a7.42 7.42 0 0 1-1.619 4.62M.941 8.378c0 3.603 2.953 6.529 6.59 6.529 3.639 0 6.592-2.926 6.592-6.53S11.17 1.85 7.533 1.85.942 4.775.942 8.38"
              fill="#101010"
            />
          </svg>
        </button>
        <input
          autoFocus
          tabIndex={0}
          class="input focus:outline-none outline-none border-none join-item flex-grow"
          name={NAME}
          placeholder={placeholder}
          autocomplete="off"
          // hx-target={`#${slot}`}
          // hx-post={loader && useComponent<SuggestionProps>(Suggestions, {
          //   loader: asResolved(loader),
          // })}
          hx-trigger={`input changed delay:300ms, ${NAME}`}
          hx-indicator={`#${SEARCHBAR_INPUT_FORM_ID}`}
          hx-swap="innerHTML"
        />
        {
          /* <label
          type="button"
          class="join-item btn btn-ghost btn-square hidden sm:inline-flex no-animation"
          for={SEARCHBAR_POPUP_ID}
          aria-label="Toggle searchbar"
        >
          <Icon id="close" />
        </label> */
        }
      </form>

      {/* Suggestions slot */}
      <div id={slot} />

      {/* Send search events as the user types */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            script,
            SEARCHBAR_INPUT_FORM_ID,
            NAME,
            SEARCHBAR_POPUP_ID,
          ),
        }}
      />
    </div>
  );
}
