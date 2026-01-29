
#import "og.typ": og-template

#let data-path = sys.inputs.data
#let data = json(data-path)

#og-template(
  title: data.title,
  description: data.description,
)
