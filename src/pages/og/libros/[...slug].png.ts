import { getCollection } from "astro:content";
import { generateOgImage } from "../../../utils/generateOg";

export async function getStaticPaths() {
    const books = await getCollection("libros");
    return books.map((book) => ({
        params: { slug: book.slug },
        props: book,
    }));
}

export async function GET({ params: _params, props }: { params: any; props: any }) {
    const { title, description } = props.data;

    try {
        const { author, coverBook } = props.data;
        const imageBuffer = await generateOgImage(title, description, "book", { author, coverBook });

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
