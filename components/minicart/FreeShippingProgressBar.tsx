import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";

interface Props {
  total: number;
  target: number;
  locale: string;
  currency: string;
}

function FreeShippingProgressBar({ target, total, currency, locale }: Props) {
  const id = useId();
  const remaining = target - total;
  const percent = Math.floor((total / target) * 100);

  return (
    <div class="flex flex-col w-full gap-2 bg-[#EDD7CB] p-3">
      <div class="flex justify-center items-center gap-2 font-light text-sm text-center">
        {/* <Icon id="local_shipping" size={24} /> */}
        {remaining > 0
          ? (
            <label for={id} class="uppercase">
              FALTAM{" "}
              <strong class="font-bold">
                {formatPrice(remaining, currency, locale)}
                {" "}
              </strong>
              PARA VOCÊ GANHAR <strong class="font-bold">FRETE GRÁTIS</strong>
              <br />
              INCLUA MAIS PRODUTOS E APROVEITE
            </label>
          )
          : <label for={id}>VOCÊ GANHOU FRETE GRÁTIS</label>}
      </div>
      <progress
        hidden
        id={id}
        class="hidden progress progress-primary w-full"
        value={percent}
        max={100}
      />
    </div>
  );
}

export default FreeShippingProgressBar;
