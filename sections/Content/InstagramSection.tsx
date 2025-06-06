import { ImageWidget } from "apps/admin/widgets.ts";

export interface InstagramPost {
  src: ImageWidget;
  link: string;
  label?: string;
}

interface Props {
  /** @format rich-text */
  title: string;
  posts: InstagramPost[];
}

export default function InstagramSection({ title, posts }: Props) {
  return (
    <section class="container">
      <h3
        dangerouslySetInnerHTML={{ __html: title }}
        class="[&>p>strong]:text-sm mb-3 px-5 text-sm font-light tracking-wide text-center uppercase"
      />
      <div class="grid grid-cols-3 md:grid-cols-5">
        {posts && posts.length > 0 &&
          posts.map((post, index) => (
            <a
              class={`w-full ${index > 2 ? "md:block hidden" : ""}`}
              href={post.link}
            >
              <img
                class="w-full"
                src={post.src}
                alt={post.label}
                loading={"lazy"}
              />
            </a>
          ))}
      </div>
    </section>
  );
}
