/**
 * TODO: support other platforms. Currently only for VTEX
 */
import { AppContext } from "apps/vtex/mod.ts";
import type { SimulationOrderForm, SKU, Sla } from "apps/vtex/utils/types.ts";
import { formatPrice } from "../../sdk/format.ts";
import { ComponentProps } from "../../sections/Component.tsx";

export interface Props {
  items: SKU[];
}

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} dias úteis`;
  if (type === "d") return `${time} dias`;
  if (type === "h") return `${time} horas`;
};

export async function action(props: Props, req: Request, ctx: AppContext) {
  const form = await req.formData();

  try {
    const result = await ctx.invoke("vtex/actions/cart/simulation.ts", {
      items: props.items,
      postalCode: `${form.get("postalCode") ?? ""}`,
      country: "BRA",
    }) as SimulationOrderForm | null;

    return { result };
  } catch {
    return { result: null };
  }
}

export default function Results({ result }: ComponentProps<typeof action>) {
  // Extrair todos os métodos disponíveis
  const allMethods: Sla[] = result?.logisticsInfo?.reduce(
    (initial, { slas }) => [...initial, ...slas],
    [] as Sla[],
  ) ?? [];

  const pickupMethods = allMethods.filter((m) =>
    m.deliveryChannel === "pickup-in-point"
  );
  const firstPickup = pickupMethods.length > 0 ? [pickupMethods[0]] : [];

  const nonPickupMethods = allMethods.filter((m) =>
    m.deliveryChannel !== "pickup-in-point"
  );

  const methods = [...firstPickup, ...nonPickupMethods];

  if (!methods.length) {
    return (
      <div class="p-2">
        <span>CEP inválido</span>
      </div>
    );
  }

  return (
    <ul class="flex flex-col gap-4 p-4 border border-base-400 rounded">
      {methods.map((method) => {
        const isPickup = method.deliveryChannel === "pickup-in-point";
        const methodName = isPickup
          ? "Entrega Disponível para Retirada"
          : method.name.replace(/\s*\([^)]*\)/g, "");

        return (
          <li
            key={method.id}
            className="flex text-sm justify-between items-center border-base-200 not-first-child:border-t"
          >
            <span className="text-button text-center">
              {methodName}
            </span>
            <span className="text-button">
              até {formatShippingEstimate(method.shippingEstimate)}
            </span>
            <span className="text-base font-semibold text-right">
              {method.price === 0 ? "Grátis" : (
                formatPrice(method.price / 100, "BRL", "pt-BR")
              )}
            </span>
          </li>
        );
      })}
      <span class="text-xs font-thin">
        Os prazos de entrega começam a contar a partir da confirmação do
        pagamento e podem variar de acordo com a quantidade de produtos na
        sacola.
      </span>
    </ul>
  );
}
