import Link from "next/link"
import { drupal } from "@/lib/drupal"
import { format } from "date-fns"

export default async function ArticlesPage() {
  // Fetch articles
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
        <Link 
          href="/articles/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <div className="grid gap-8">
          {articles.map((article) => (
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
                <span>By {article.uid?.displayName || 'Anonymous'}</span>
                <span className="mx-2">•</span>
                <time dateTime={article.created}>
                  {format(new Date(article.created), 'MMMM d, yyyy')}
                </time>
              </div>

              {article.field_image && (
                <div className="mb-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${article.field_image.uri.url}`}
                    alt={article.field_image.meta.alt || ''}
                    className="w-full h-64 object-cover rounded-lg"
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
    </div>
  )
}