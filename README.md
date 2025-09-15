# Collection Blog

A custom-built web application developed as a freelance project for managing and showcasing gallery collections. This platform allows admins to create, organize, and display their collection items with comprehensive categorization, pricing, and detailed descriptions.

## Project Purpose

This application was created to provide a complete solution for collection enthusiasts and gallery owners who need to:
- **Manage Collections**: Upload and organize collection items with detailed metadata
- **Categorize Content**: Create hierarchical categories and subcategories for better organization
- **Set Pricing**: Add pricing information to collection items
- **Rich Descriptions**: Include detailed descriptions and specifications for each item
- **Visual Gallery**: Present items in an attractive, searchable gallery format
- **Admin Control**: Secure admin panel for content management and organization

## What It Does

### For Collection Owners
- Upload high-quality images of collection items
- Organize items into custom categories and subcategories
- Add detailed descriptions, pricing, and specifications
- Search and filter through collections
- Manage the entire collection from a secure admin panel

### For Visitors
- Browse collections in a beautiful, responsive gallery
- Search across items and categories
- View detailed information about each collection item
- Navigate through organized categories and subcategories

## Project Structure

Next.js - Supabase - CloudFlare R2
This is a **monorepo** built with Next.js that contains both frontend and backend functionality:

```
collection-blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin authentication & management panel
│   │   ├── posts/[id]/        # Individual item detail pages
│   │   ├── search/            # Search functionality
│   │   ├── api/               # Backend API routes
│   │   │   ├── upload/        # File upload to Cloudflare R2
│   │   │   └── image-url/     # Image URL management
│   │   └── page.tsx           # Main gallery homepage
│   ├── components/            # Reusable UI components
│   │   ├── CategoryCard.tsx   # Category display cards
│   │   ├── PostPreview.tsx    # Collection item previews
│   │   ├── Navbar.tsx         # Navigation component
│   │   └── SearchModal.tsx    # Search interface
│   ├── lib/                   # Core functionality
│   │   ├── r2.ts             # Cloudflare R2 configuration
│   │   └── r2-operations.ts   # File storage operations
│   ├── services/              # API service layer
│   ├── types/                 # TypeScript definitions
│   └── styles/                # Styling and CSS
```

## Technical Architecture

### Backend (API Routes)
- **File Upload System**: Direct integration with Cloudflare R2 bucket for scalable image storage
- **Image Management**: Handles image uploads, validation, and URL generation
- **Data Operations**: CRUD operations for collections, categories, and items

### Frontend
- **Modern UI/UX**: Responsive design with gradient backgrounds and smooth animations
- **Admin Panel**: Secure authentication system for content management
- **Gallery Display**: Interactive gallery with category filtering and search
- **Mobile Responsive**: Optimized for all device sizes

### Cloud Infrastructure
- **Cloudflare R2**: Reliable and cost-effective file storage solution
- **Supabase**: Authentication and user management, basic DB
- **Next.js API Routes**: Server-side functionality within the same codebase


## Environment Setup

Required environment variables:
- `R2_ACCOUNT_ID` - Cloudflare R2 account ID
- `R2_ACCESS_KEY_ID` - Cloudflare R2 access key
- `R2_SECRET_ACCESS_KEY` - Cloudflare R2 secret key
- `R2_BUCKET_NAME` - Cloudflare R2 bucket name
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Key Features

- **Secure File Uploads**: Direct upload to Cloudflare R2 with validation
- **Category Management**: Hierarchical organization of collection items
- **Search & Filter**: Full-text search across items and categories
- **Admin Authentication**: Secure access to management features
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern Tech Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS

---

*This project was developed as a custom solution for collection management and gallery display
