import { ComponentChildren } from "preact";
import { useId } from "../../sdk/useId.ts";
import { useScript } from "@deco/deco/hooks";
interface Props {
  open?: boolean;
  children?: ComponentChildren;
  id?: string;
}
const script = (id: string) => {
  const handler = (e: KeyboardEvent) => {
    if (e.key !== "Escape" && e.keyCode !== 27) {
      return;
    }
    const input = document.getElementById(id) as HTMLInputElement | null;
    if (!input) {
      return;
    }
    input.checked = false;
  };
  addEventListener("keydown", handler);
};
function Modal({ children, open, id = useId() }: Props) {
  return (
    <>
      <input id={id} checked={open} type="checkbox" class="modal-toggle" />
      <div class="modal">
        <div className="relative">
          <label for={id} class="close absolute right-4 top-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 0-1.414"
                fill="#0D0D0D"
              />
            </svg>
          </label>
          {children}
        </div>
        <label class="modal-backdrop h-full w-full absolute" for={id}>
          Close
        </label>
      </div>
      <script
        type="module"
        // deno-lint-ignore react-no-danger
        dangerouslySetInnerHTML={{ __html: useScript(script, id) }}
      />
    </>
  );
}
export default Modal;
