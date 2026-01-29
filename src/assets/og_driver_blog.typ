
#import "og_blog.typ": og-blog-template

#let data-path = sys.inputs.data
#let data = json(data-path)

#og-blog-template(
  title: data.title,
  description: data.description,
)
