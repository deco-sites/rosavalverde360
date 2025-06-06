import type { ProductLeaf, PropertyValue } from "apps/commerce/types.ts";
import { CUSTOM_COLORS } from "../components/constants/customColors.ts";

export type Possibilities = Record<string, Record<string, string | undefined>>;

const hash = ({ name, value }: PropertyValue) => `${name}::${value}`;

const omit = new Set(["category", "cluster", "RefId", "descriptionHtml"]);

// Tamanhos permitidos por categoria
const allowedSizes: Record<string, string[]> = {
  brincos: ["pp", "p", "m", "g"],
  colar: ["curto", "médio", "longo"],
  colares: ["curto", "médio", "longo"],
  conjunto: ["curto", "médio", "longo"],
  conjuntos: ["curto", "médio", "longo"],
};

export const useVariantPossibilities = (
  variants: ProductLeaf[],
  selected: ProductLeaf,
): Possibilities => {
  const possibilities: Possibilities = {};

  const filteredVariants = variants.filter(({ url }) => url?.includes("skuId"));

  const selectedProps = new Map(
    (selected.additionalProperty ?? [])
      .filter(({ name }) => !omit.has(name!))
      .map(({ name, value }) => [name!, value!]),
  );

  // Descobrir qual valor de cor está selecionado
  const selectedCor = selectedProps.get("cor") || selectedProps.get("Cor");

  // Descobrir categoria selecionada
  let selectedCategory: string | undefined = undefined;
  const categoryProp = selected.additionalProperty?.find(
    (p) => p.name?.toLowerCase() === "categoria",
  )?.value || "";

  if (categoryProp) {
    selectedCategory = categoryProp.toLowerCase();
  }

  // Mapear todas as cores possíveis (sempre mostrar todas do CUSTOM_COLORS)
  // Agora salva a cor já normalizada como chave
  const colorMap: Record<
    string,
    { original: string; url: string | undefined }
  > = {};

  for (const variant of filteredVariants) {
    const { url, productID, additionalProperty = [] } = variant;
    const isSelected = productID === selected.productID;

    for (const { name, value } of additionalProperty) {
      if (!name || !value || omit.has(name)) continue;

      if (name.toLowerCase() === "cor") {
        const normalized = value.trim().toLowerCase();
        if (CUSTOM_COLORS[normalized]) {
          // Salva a cor normalizada como chave, mas mantém o valor original para exibição
          colorMap[normalized] = {
            original: value,
            url: isSelected ? url : colorMap[normalized]?.url || url,
          };
        }
      }
    }
  }

  // Garante a ordem e apenas as cores do CUSTOM_COLORS
  possibilities["cor"] = {};
  Object.keys(CUSTOM_COLORS).forEach((colorKey) => {
    if (colorMap[colorKey]) {
      // Usa o valor original para exibir no selector, mas a chave é a original do produto
      possibilities["cor"][colorMap[colorKey].original] =
        colorMap[colorKey].url;
    }
  });

  // Para Tamanho, só adiciona se for da cor selecionada E se estiver nos tamanhos permitidos
  for (const variant of filteredVariants) {
    const { url, productID, additionalProperty = [] } = variant;
    const isSelected = productID === selected.productID;

    let variantCor = additionalProperty.find(
      (p) => p.name?.toLowerCase() === "cor",
    )?.value;

    for (const { name, value } of additionalProperty) {
      if (!name || !value || omit.has(name)) continue;

      if (name.toLowerCase() === "tamanho" && selectedCor) {
        // Só adiciona se estiver nos tamanhos permitidos para a categoria
        let isAllowed = true;
        if (selectedCategory && allowedSizes[selectedCategory]) {
          isAllowed = allowedSizes[selectedCategory].includes(
            value.trim().toLowerCase(),
          );
        }
        if (
          isAllowed &&
          variantCor &&
          variantCor.toLowerCase() === selectedCor.toLowerCase()
        ) {
          if (!possibilities[name]) {
            possibilities[name] = {};
          }
          possibilities[name][value] = isSelected
            ? url
            : possibilities[name][value] || url;
        }
      }
    }
  }

  return possibilities;
};
