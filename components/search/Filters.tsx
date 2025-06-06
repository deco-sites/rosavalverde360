import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { CUSTOM_COLORS } from "../constants/customColors.ts";
import { useEffect } from "preact/hooks";

interface Props {
  filters: ProductListingPage["filters"];
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem(
  { url, selected, label, quantity, style }: FilterToggleValue & {
    style?: any;
  },
) {
  return (
    <a href={url} rel="nofollow" class="flex items-center gap-2" style={style}>
      <div aria-checked={selected} class="checkbox max-w-4 max-h-4" />
      <span class="text-xs leading-normal tracking-wide text-[#4F4F4F]">
        {label}
      </span>
      {quantity > 0 && (
        <span class="text-xs leading-normal tracking-wide text-[#4F4F4F]">
          ({quantity})
        </span>
      )}
    </a>
  );
}

function normalizeColor(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[_-]/g, " ") // Troca _ e - por espaço
    .replace(/\s+/g, " ") // Espaço único
    .trim()
    .toLowerCase();
}

function FilterValues({ key, values }: FilterToggle) {
  const isColorFilter = key.toLowerCase().includes("cor");
  const isSizeFilter = key === "tamanho";
  const flexDirection = isColorFilter ? "flex-row items-center" : "flex-col";

  console.log("Key do filtro:", key);
  console.log("Valores do filtro:", values.map((v) => v.value));

  // Tamanhos permitidos para cada categoria
  const allowedSizes: Record<string, string[]> = {
    brincos: ["pp", "p", "m", "g"],
    colar: ["curto", "médio", "longo"],
    colares: ["curto", "médio", "longo"],
    conjunto: ["curto", "médio", "longo"],
    conjuntos: ["curto", "médio", "longo"],
  };

  // Sempre loga os tamanhos recebidos da API
  if (isSizeFilter) {
    console.log("Tamanhos da API:", values.map((v) => v.value));
  }

  // Loga cores da API se for filtro de cor
  if (isColorFilter) {
    console.log("Cores da API:", values.map((v) => v.value));
  }

  // --- Filtro client-side pós-hydration ---
  useEffect(() => {
    if (!isSizeFilter || typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const path = url.pathname.toLowerCase().replace(/^\/+/, "");
    const firstSegment = path.split("/")[0];
    const allowed = allowedSizes[firstSegment]?.map((v) => v.toLowerCase()) ??
      [];

    // Esconde os tamanhos não permitidos
    document.querySelectorAll("ul.menu a").forEach((a) => {
      const match = a.textContent?.trim().toLowerCase();
      if (match && !allowed.includes(match)) {
        (a as HTMLElement).style.display = "none";
      }
    });

    // Loga a categoria e a URL no client
    console.log("pathname da URL:", url.pathname);
    console.log("Categoria capturada no client:", firstSegment);
    console.log("Permitidos:", allowed);
  }, [isSizeFilter]);
  // --- Fim do filtro client-side ---

  // Renderiza todos os valores normalmente (SSR e client)
  return (
    <ul
      class={clx(
        `md:max-h-[400px] max-h-full dropdown-content gap-4 justify-center shadow-lg menu bg-white rounded-none z-[1] w-96 p-2`,
        flexDirection,
      )}
    >
      {values.map((item) => {
        const { url, selected, value, label, quantity, style } = item;

        // Personalização do filtro de cor
        if (isColorFilter) {
          const normalizedValue = normalizeColor(value);
          const cor = CUSTOM_COLORS[normalizedValue];
          if (!cor) return null;
          return (
            <a
              href={url}
              rel="nofollow"
              class="flex flex-col items-center gap-1 group"
              style={{ minWidth: 60 }}
            >
              <span
                class={clx(
                  "w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center transition-all",
                  selected ? "ring-2 ring-[#4F4F4F]" : "",
                )}
                style={{ background: cor.hex }}
                title={cor.name}
              />
              <span class="text-xs text-[#4F4F4F] text-center">{cor.name}</span>
            </a>
          );
        }

        if (isSizeFilter) {
          return (
            <ValueItem
              {...item}
              label={value}
              style={style}
            />
          );
        }

        if (key === "price") {
          const range = parseRange(item.value);
          return range && (
            <ValueItem
              {...item}
              label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
              style={undefined}
            />
          );
        }

        return <ValueItem {...item} />;
      })}
    </ul>
  );
}

function Filters({ filters }: Props) {
  return (
    <ul class="flex flex-col w-full md:flex-row gap-6 p-4 sm:p-0">
      {filters
        .filter(isToggle)
        .sort((a, b) => {
          if (a.label === "Modelo") return 1;
          if (b.label === "Modelo") return -1;
          return a.label.localeCompare(b.label);
        })
        .map((filter, index) => (
          <li
            key={index}
            className={`${
              filter.label === "Categoria" ||
                filter.label === "Marca" ||
                filter.label === "Departamento"
                ? "hidden"
                : ""
            }`}
          >
            <div class="md:w-auto w-full dropdown">
              <div
                tabIndex={index}
                role="button"
                class="btn shadow-none flex gap-2 items-center border-none rounded-none bg-white m-1 font-light hover:bg-white leading-normal tracking-wide text-[#4F4F4F] text-sm"
              >
                {filter.label}
                <svg
                  width="10"
                  height="5"
                  viewBox="0 0 10 5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="m9.33.134.509.42a.398.398 0 0 1 0 .64l-4.45 3.673a.63.63 0 0 1-.776 0L.161 1.194c-.215-.178-.215-.465 0-.64L.67.133a.635.635 0 0 1 .785.007s1.399 1.372 2.629 2.277c.962.707.881.618 1.832 0L8.545.141A.63.63 0 0 1 9.33.134"
                    fill="#AEAEAE"
                  />
                </svg>
              </div>
              <FilterValues {...filter} />
            </div>
          </li>
        ))}
    </ul>
  );
}

export default Filters;
