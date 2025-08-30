"use client"

import Link from "next/link"
import { format } from "date-fns"
import { useState, useEffect } from "react"
import Image from "next/image"
import type { JsonApiResource } from "next-drupal"

interface ArticlesListProps {
  initialArticles: JsonApiResource[]
}

export function ArticlesList({ initialArticles }: ArticlesListProps) {
  const [articles, setArticles] = useState<JsonApiResource[]>(initialArticles)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("access_token")
    setIsAuthenticated(!!accessToken)

    // Re-fetch articles to ensure we have the latest data
    // This is a simplified example - in a real app you might want to use SWR or React Query
    // for data fetching and caching
  }, [])

  return (
    <>
      {isAuthenticated && (
        <Link
          href="/articles/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors mb-8 inline-block"
        >
          Create Article
        </Link>
      )}

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="grid gap-8">
          {articles.map((article: JsonApiResource) => (
            <article key={article.id} className="border-b pb-8">
              <h2 className="text-2xl font-bold mb-2">
                <Link
                  href={article.path.alias || `/articles/${article.id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {article.title}
                </Link>
              </h2>

              <div className="mb-4 text-sm text-gray-600">
                <span>By {article.uid?.display_name || "Anonymous"}</span>
                <span className="mx-2">•</span>
                <time dateTime={article.created}>
                  {format(new Date(article.created), "MMMM d, yyyy")}
                </time>
              </div>

              {article.field_image && (
                <div className="mb-4 relative w-full h-64">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${article.field_image.uri.url}`}
                    alt={article.field_image.meta?.alt || ""}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

              {article.body?.summary && (
                <div
                  className="prose mb-4"
                  dangerouslySetInnerHTML={{ __html: article.body.summary }}
                />
              )}

              <Link
                href={article.path.alias || `/articles/${article.id}`}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
