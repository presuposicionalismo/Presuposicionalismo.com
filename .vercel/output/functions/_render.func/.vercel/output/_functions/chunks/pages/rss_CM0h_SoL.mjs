import rss from '@astrojs/rss';
import { g as getCollection, S as SITE_TITLE, a as SITE_DESCRIPTION } from './index_FR6FIYWQ.mjs';

async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			link: `/blog/${post.slug}/`,
		})),
	});
}

export { GET };
