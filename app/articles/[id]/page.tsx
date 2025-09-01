import { drupal } from "@/lib/drupal"
import { notFound } from "next/navigation"
import { Article } from "@/components/drupal/Article"
import type { DrupalNode } from "next-drupal"

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // Fetch the article by ID
  const article = await drupal.getResource<DrupalNode>("node--article", id, {
    params: {
      include: "field_image,uid",
    },
  })

  if (!article) {
    return notFound()
  }

  return <Article node={article} />
}
