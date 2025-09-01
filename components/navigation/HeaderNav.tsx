"use client"

import { Link } from "@/components/navigation/Link"
import { SiweLogin } from "@/components/auth/SiweLogin"
import { useState, useEffect } from "react"

export function HeaderNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const accessToken = localStorage.getItem("access_token")
    setIsAuthenticated(!!accessToken)
  }, [])

  return (
    <header>
      <div className="container flex items-center justify-between py-6 mx-auto">
        <Link href="/" className="text-2xl font-semibold no-underline">
          Next.js for Drupal
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <Link href="/articles/create" className="hover:text-blue-600">
              Create Article
            </Link>
          )}
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
