import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_TITLE } from "../../consts";

export async function getStaticPaths() {
    const posts = await getCollection("blog");
    return posts.map((post) => ({
        params: { slug: post.slug },
        props: post,
    }));
}

export async function GET({ params: _params, props }: { params: any; props: any }) {
    const { title, description, pubDate } = props.data;

    // Format date
    const formattedDate = new Date(pubDate).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Load fonts
    // Using Atkinson Bold for titles and Regular for text
    const fontDir = join(process.cwd(), "public", "fonts");
    const fontBold = await readFile(join(fontDir, "atkinson-bold.woff"));
    const fontRegular = await readFile(join(fontDir, "atkinson-regular.woff"));

    // Define Colors
    const bg = "#f8fafc"; // surface-1 equivalentish
    const text = "#1e293b"; // text-1
    const brand = "#4f46e5"; // indigo-6

    const svg = await satori(
        {
            type: "div",
            props: {
                style: {
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    backgroundColor: bg,
                    backgroundImage: `radial-gradient(circle at 25px 25px, ${brand} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${brand} 2%, transparent 0%)`,
                    backgroundSize: "100px 100px",
                    color: text,
                    flexDirection: "column",
                    padding: "80px",
                },
                children: [
                    // Content Container
                    {
                        type: "div",
                        props: {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "100%",
                                width: "100%",
                                backgroundColor: "#ffffff",
                                border: "4px solid " + brand,
                                borderRadius: "24px",
                                padding: "60px",
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                            },
                            children: [
                                // Top section: Site Title & Date
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                            fontSize: "24px",
                                            color: "#64748b",
                                        },
                                        children: [
                                            {
                                                type: "span",
                                                props: {
                                                    style: { fontWeight: 700, color: brand, textTransform: "uppercase", letterSpacing: "2px" },
                                                    children: SITE_TITLE
                                                }
                                            },
                                            {
                                                type: "span",
                                                props: { children: formattedDate }
                                            }
                                        ],
                                    },
                                },
                                // Middle section: Title
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "20px",
                                        },
                                        children: [
                                            {
                                                type: "h1",
                                                props: {
                                                    style: {
                                                        fontSize: "64px",
                                                        fontWeight: 700,
                                                        lineHeight: 1.1,
                                                        margin: 0,
                                                        // Use ellipsis if too long? Satori handles wrapping
                                                    },
                                                    children: title,
                                                },
                                            },
                                            {
                                                type: "p",
                                                props: {
                                                    style: {
                                                        fontSize: "32px",
                                                        color: "#475569",
                                                        lineHeight: 1.4,
                                                        margin: 0,
                                                        overflow: "hidden",
                                                        display: "-webkit-box",
                                                        lineClamp: 2, // Satori logic
                                                    },
                                                    children: description,
                                                },
                                            },
                                        ],
                                    },
                                },
                                // Bottom section: URL
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            fontSize: "24px",
                                            color: brand,
                                        },
                                        children: "presuposicionalismo.com"
                                    }
                                }
                            ],
                        },
                    },
                ],
            },
        },
        {
            width: 1200,
            height: 630,
            fonts: [
                {
                    name: "Atkinson",
                    data: fontBold,
                    weight: 700,
                    style: "normal",
                },
                {
                    name: "Atkinson",
                    data: fontRegular,
                    weight: 400,
                    style: "normal",
                },
            ],
        }
    );

    const resvg = new Resvg(svg);

    return new Response(resvg.render().asPng() as any, {
        headers: {
            "Content-Type": "image/png",
        },
    });
}
