import { drupal } from "@/lib/drupal"
import { format } from "date-fns"
import Image from "next/image"

export default async function ArticlePage({
  params,
}: {
  params: { id: string }
}) {
  // Fetch the article by ID
  const article = await drupal.getResource("node--article", params.id, {
    params: {
      include: "field_image,uid",
    },
  })

  if (!article) {
    return <div>Article not found</div>
  }

  return (
    <article className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

      <div className="mb-6 text-sm text-gray-600">
        <span>By {article.uid?.display_name || "Anonymous"}</span>
        <span className="mx-2">•</span>
        <time dateTime={article.created}>
          {format(new Date(article.created), "MMMM d, yyyy")}
        </time>
      </div>

      {article.field_image && (
        <div className="mb-6">
          <Image
            src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${article.field_image.uri.url}`}
            alt={article.field_image.meta?.alt || ""}
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.body?.processed || "" }}
      />
    </article>
  )
}
