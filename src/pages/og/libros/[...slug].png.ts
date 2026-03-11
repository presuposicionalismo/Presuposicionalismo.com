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

  const books = await getCollection("libros");
  const book = books.find((b) => b.id === slug);

  if (!book) {
    return new Response("Book not found", { status: 404 });
  }

  const { title, description, author, coverBook } = book.data;
  try {
    const imageBuffer = await generateOgImage(title, description, "book", {
      author,
      coverBook,
    });

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
