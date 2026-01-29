
#import "og_book.typ": og-book-template

#let data-path = sys.inputs.data
#let data = json(data-path)

// Handle optional cover image path
#let cover = if "coverBookPath" in data {
  data.coverBookPath
} else {
  none
}

#og-book-template(
  title: data.title,
  description: data.description,
  author: data.author,
  cover-image: cover,
)
