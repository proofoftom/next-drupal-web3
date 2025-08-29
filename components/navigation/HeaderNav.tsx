import { Link } from "@/components/navigation/Link"
import { SiweLogin } from "@/components/auth/SiweLogin"

export function HeaderNav() {
  return (
    <header>
      <div className="container flex items-center justify-between py-6 mx-auto">
        <Link href="/" className="text-2xl font-semibold no-underline">
          Next.js for Drupal
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/articles"
            className="hover:text-blue-600"
          >
            Articles
          </Link>
          <Link
            href="https://next-drupal.org/docs"
            target="_blank"
            rel="external"
            className="hover:text-blue-600"
          >
            Read the docs
          </Link>
          <SiweLogin />
        </div>
      </div>
    </header>
  )
}
