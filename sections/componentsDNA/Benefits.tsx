import { ImageWidget } from "apps/admin/widgets.ts";
import { useId } from "../../sdk/useId.ts";
import Slider from "../../components/ui/Slider.tsx";

interface Benefit {
  text: string;
  icon?: ImageWidget;
}
interface Props {
  benefits: Benefit[];
}

export default function Benefits({ benefits }: Props) {
  const id = useId();
  return (
    <section id={id}>
      <Slider class="carousel carousel-center w-full max-w-full text-sm/4 pt-7 pb-9">
        {benefits.map((benefit, index) => (
          <Slider.Item index={index} class="carousel-item w-full md:w-1/3">
            <div class="flex items-center w-screen justify-center gap-2">
              {benefit.icon && (
                <img
                  src={benefit.icon}
                  loading={"lazy"}
                  alt={benefit.text}
                  class="w-full max-w-[20px]"
                />
              )}
              <span class="text-center font-light">
                {benefit.text}
              </span>
            </div>
          </Slider.Item>
        ))}
      </Slider>
    </section>
  );
}
