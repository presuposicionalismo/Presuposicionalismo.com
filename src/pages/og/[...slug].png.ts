import { getCollection } from "astro:content";
import { generateOgImage } from "../../utils/generateOg";

export async function getStaticPaths() {
    const posts = await getCollection("blog");
    return posts.map((post) => ({
        params: { slug: post.slug },
        props: post,
    }));
}

export async function GET({ params: _params, props }: { params: any; props: any }) {
    const { title, description } = props.data;

    try {
        const imageBuffer = await generateOgImage(title, description);

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
