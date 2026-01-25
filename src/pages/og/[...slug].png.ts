import { getCollection } from "astro:content";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_TITLE } from "../../consts";
import { THEME } from "../../consts/open-props";

export async function getStaticPaths() {
    const posts = await getCollection("blog");
    return posts.map((post) => ({
        params: { slug: post.slug },
        props: post,
    }));
}

export async function GET({ params: _params, props }: { params: any; props: any }) {
    const { title, description } = props.data;

    // Load fonts
    const fontRegular = await readFile(join(process.cwd(), "public/fonts/Urbanist-Regular.ttf"));
    const fontBold = await readFile(join(process.cwd(), "public/fonts/Urbanist-Bold.ttf"));

    const svg = await satori(
        {
            type: "div",
            props: {
                style: {
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    backgroundColor: THEME.bg,
                    backgroundImage: `radial-gradient(circle at 25px 25px, ${THEME.surface} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${THEME.surface} 2%, transparent 0%)`,
                    backgroundSize: "100px 100px",
                    color: THEME.text,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px",
                    fontFamily: "Urbanist",
                },
                children: [
                    // Main Card
                    {
                        type: "div",
                        props: {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                height: "90%",
                                backgroundColor: THEME.surface,
                                border: `2px solid ${THEME.accent}`,
                                borderRadius: "24px",
                                padding: "40px",
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                                justifyContent: "space-between",
                            },
                            children: [
                                // Logo and Site Title Header
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "16px",
                                        },
                                        children: [
                                            {
                                                type: "svg",
                                                props: {
                                                    width: "48",
                                                    height: "48",
                                                    viewBox: "0 0 24 24",
                                                    fill: THEME.accent,
                                                    children: [
                                                        {
                                                            type: "path",
                                                            props: { d: "M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" }
                                                        }
                                                    ],
                                                },
                                            },
                                            {
                                                type: "span",
                                                props: {
                                                    style: {
                                                        fontSize: "24px",
                                                        fontWeight: 700,
                                                        color: THEME.accent,
                                                        letterSpacing: "0.05em",
                                                        textTransform: "uppercase",
                                                    },
                                                    children: SITE_TITLE,
                                                },
                                            },
                                        ],
                                    },
                                },
                                // Content
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "24px",
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
                                                        color: THEME.text,
                                                    },
                                                    children: title,
                                                },
                                            },
                                            {
                                                type: "p",
                                                props: {
                                                    style: {
                                                        fontSize: "32px",
                                                        color: "#9ca3af", // localized gray
                                                        lineHeight: 1.4,
                                                        margin: 0,
                                                        display: "-webkit-box",
                                                        lineClamp: 3,
                                                        overflow: "hidden",
                                                    },
                                                    children: description,
                                                },
                                            },
                                        ],
                                    },
                                },
                                // Footer / URL
                                {
                                    type: "div",
                                    props: {
                                        style: {
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            alignItems: "center",
                                        },
                                        children: [
                                            {
                                                type: "span",
                                                props: {
                                                    style: {
                                                        fontSize: "20px",
                                                        color: THEME.accent,
                                                        fontWeight: 500,
                                                    },
                                                    children: "presuposicionalismo.com",
                                                },
                                            },
                                        ],
                                    },
                                },
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
                    name: "Urbanist",
                    data: fontBold,
                    weight: 700,
                    style: "normal",
                },
                {
                    name: "Urbanist",
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
