import { drupal } from "@/lib/drupal"
import { ArticlesList } from "./ArticlesList"

export default async function ArticlesPage() {
  // Fetch articles on the server
  const articles = await drupal.getResourceCollection("node--article", {
    params: {
      "filter[status]": 1,
      "fields[node--article]": "title,path,field_image,uid,created,body",
      include: "field_image,uid",
      sort: "-created",
    },
  })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
      </div>
      <ArticlesList initialArticles={articles} />
    </div>
  )
}
