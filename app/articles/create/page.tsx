'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { drupal } from '@/lib/drupal';

export default function CreateArticlePage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create the article using the Drupal client
      const article = await drupal.createResource('node--article', {
        data: {
          attributes: {
            title: title,
            body: {
              value: body,
              format: 'basic_html',
            },
          },
          type: 'node--article',
        },
      });

      // Redirect to the newly created article
      router.push(`/articles/${article.id}`);
    } catch (err) {
      console.error('Error creating article:', err);
      setError(err.message || 'Failed to create article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            Body
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
}