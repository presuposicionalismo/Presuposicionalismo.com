import { getCollection } from "astro:content";
import { generateOgImage } from "../../../utils/generateOg";

export async function GET({
  params,
  request,
}: {
  params: any;
  request: Request;
}) {
  const slug = params.slug;
  if (!slug) {
    return new Response("Not found", { status: 404 });
  }

  const posts = await getCollection("blog");
  const post = posts.find((p) => p.id === slug);

  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  const { title, description } = post.data;

  try {
    const imageBuffer = await generateOgImage(title, description, "blog");

    return new Response(imageBuffer as any, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error generating image", { status: 500 });
  }
}
