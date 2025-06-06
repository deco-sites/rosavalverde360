import { clx } from "../../sdk/clx.ts";
import { asset } from "$fresh/runtime.ts";

/**
 * This component renders the filter and selectors for skus.
 * TODO: Figure out a better name for this component.
 */
interface Props {
  variant?: "active" | "disabled" | "default";
  content: string;
}

const colors: Record<string, Record<string, string>> = {
  "azul-clara": { backgroundColor: "#87CEFA" },
  "azul-marinho": { backgroundColor: "#000080" },
  "branca": { backgroundColor: "#FFFFFF" },
  "cinza": { backgroundColor: "#808080" },
  "cinza-escura": { backgroundColor: "#A9A9A9" },
  "laranja": { backgroundColor: "#FFA500" },
  "marrom": { backgroundColor: "#A52A2A" },
  "preta": { backgroundColor: "#161616" },
  "verde-clara": { backgroundColor: "#90EE90" },
  "vermelha": { backgroundColor: "#FF0000" },
};

const variants = {
  active: "ring-base-content",
  disabled: "line-through",
  default: "ring-base-400",
};

function Avatar({ content, variant = "default" }: Props) {
  const imageName = content.toUpperCase().replace(/[- ]/g, "_") + ".jpg";
  const backgroundImageUrl = asset(`/cores/${imageName}`);

  return (
    <div
      data-tip={content.replace("-", " ")}
      class="avatar placeholder tooltip tooltip-bottom"
    >
      <div
        class={clx(
          "h-6 w-6",
          "rounded-full",
          "ring-1 ring-offset-2",
          variants[variant],
        )}
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <span class={`${backgroundImageUrl != "" && "hidden"} uppercase`}>
          {colors[content] ? "" : content}
        </span>
      </div>
    </div>
  );
}

export default Avatar;
