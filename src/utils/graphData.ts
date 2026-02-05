import { getCollection } from 'astro:content';

export interface GraphNode {
    id: string;
    group: 'post' | 'tag';
    title: string;
    slug?: string;
    val: number; // Size/Importance
}

export interface GraphLink {
    source: string;
    target: string;
    value: number; // Strength
}

export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export async function getGraphData(): Promise<GraphData> {
    const posts = await getCollection('blog', ({ data }) => {
        return data.draft !== true;
    });

    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const tagSet = new Set<string>();

    posts.forEach((post) => {
        // Post Node
        nodes.push({
            id: post.id,
            group: 'post',
            title: post.data.title,
            val: 20 // Base size for posts
        });

        // Tag Nodes & Links
        if (post.data.tags) {
            post.data.tags.forEach((tag) => {
                const tagId = `tag-${tag}`;
                tagSet.add(tag);

                links.push({
                    source: post.id,
                    target: tagId,
                    value: 1
                });
            });
        }
    });

    // Create Tag Nodes
    tagSet.forEach((tag) => {
        // Calculate size based on how many connections it has (degree)
        // For now constant size, but could be dynamic
        nodes.push({
            id: `tag-${tag}`,
            group: 'tag',
            title: '#' + tag,
            val: 10
        });
    });

    return { nodes, links };
}
