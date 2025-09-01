# Next.js SIWE Authentication with Drupal

A Next.js application with SIWE (Sign-In with Ethereum) authentication integrated with a Drupal backend.

## Features

- SIWE authentication flow with Ethereum wallet integration
- JWT token-based authentication with Drupal backend
- User account creation and management in Drupal
- CORS support for cross-origin requests
- Article creation and viewing functionality

## How to use

1. Install dependencies: `npm install`
2. Configure environment variables in `.env.local`:
   - `NEXT_PUBLIC_DRUPAL_BASE_URL` - The base URL of your Drupal site
   - `DRUPAL_CLIENT_ID` - The client ID for Drupal authentication
   - `DRUPAL_CLIENT_SECRET` - The client secret for Drupal authentication
3. Start the development server: `npm run dev`

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_DRUPAL_BASE_URL` - The base URL of your Drupal site (e.g., https://drupal.ddev.site)
- `DRUPAL_CLIENT_ID` - The client ID for Drupal authentication
- `DRUPAL_CLIENT_SECRET` - The client secret for Drupal authentication

## SIWE Authentication Flow

1. User clicks "Sign in with Ethereum" button
2. The application requests access to the user's Ethereum wallet
3. A nonce is retrieved from the Drupal backend
4. A SIWE message is created and signed by the user's wallet
5. The signed message is sent to the Drupal backend for verification
6. If verification is successful, JWT tokens are returned
7. The JWT tokens are stored in local storage for subsequent requests

## Components

- `SiweLogin` - A React component that handles the SIWE authentication flow
- `WagmiProvider` - Provides Ethereum wallet integration (if using wagmi)

## Dependencies

- `siwe` - For creating and parsing SIWE messages
- `ethers` - For Ethereum wallet integration
- `next-drupal` - For communicating with the Drupal backend
- `date-fns` - For formatting dates

## Troubleshooting

### CORS Issues

If you encounter CORS issues, make sure the Drupal backend is configured to allow requests from your Next.js application's origin. The siwe_server module includes CORS configuration that can be modified in the Drupal admin interface.

### Ethereum Address Format

The application automatically converts Ethereum addresses to EIP-55 checksum format to ensure compatibility with the Drupal backend.

### JWT Token Expiration

The application handles JWT token expiration by providing a refresh token that can be used to obtain a new access token.

## Article Creation

The application includes functionality for creating and viewing articles:

- `/` - View a list of all articles (front page)
- `/articles/create` - Create a new article (requires authentication)
- `/[article-slug]` - View a single article (e.g., /my-article-title)
- `/articles/[id]` - View a single article by ID (redirects to slug URL)

## Documentation

See https://next-drupal.org for more information about Next.js for Drupal.
