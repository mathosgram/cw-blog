# Stack - Cowrywise Ambassador Writing Platform

A modern, feature-rich blogging platform built specifically for the Cowrywise Ambassador Writing Group. Built with **Astro**, **MongoDB**, **Clerk Authentication**, and **ImageKit** for a complete content management experience.

## ✨ Features

### 🎨 **Beautiful Design**
- Professional blue color scheme aligned with financial services
- Responsive design that works on all devices
- Clean, modern interface optimized for financial content
- Dark/Light mode support with automatic theme switching

### 🔐 **Secure Authentication**
- **Clerk** integration for robust user authentication
- Role-based access control (Admin, Author, Editor)
- Secure session management
- Social login options

### 📝 **Professional Admin Panel**
- **Rich Text Editor** with Markdown support
- **Media Management** with drag-and-drop uploads
- **Real-time Preview** for content editing
- **Draft System** for work-in-progress posts
- **Analytics Dashboard** tracking content performance
- **Post Scheduling** and publication management

### 🖼️ **Advanced Media Management**
- **ImageKit** integration for optimized image/video uploads
- **Automatic Optimization** and responsive images
- **Video Support** with streaming capabilities
- **Media Library** with search and organization
- **CDN Delivery** for fast loading times

### 📊 **Database-Powered**
- **MongoDB** for scalable data storage
- **Real-time Content** updates
- **Advanced Search** and filtering
- **Performance Analytics** and insights
- **Backup and Recovery** capabilities

### 🚀 **SEO & Performance**
- **Perfect Lighthouse Scores** across all metrics
- **Automatic Sitemap** generation
- **RSS Feed** for content syndication
- **Open Graph** images for social sharing
- **Fast Search** with Pagefind integration

## 🏗️ Built For

- **Cowrywise Ambassadors** creating financial content
- **Financial Writers** sharing insights and strategies  
- **Community Leaders** building financial literacy
- **Content Managers** organizing publication workflows

## 🛠️ Technology Stack

- **Framework**: Astro 5 (Static Site Generation)
- **Authentication**: Clerk
- **Database**: MongoDB
- **Media**: ImageKit
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel
- **Search**: Pagefind

## 🚀 Getting Started

### Prerequisites

1. **Node.js** 18+ and npm
2. **MongoDB** database (Atlas recommended)
3. **Clerk** account for authentication
4. **ImageKit** account for media management

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stack-blog

# Authentication (Clerk)
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Media Management (ImageKit)
IMAGEKIT_PUBLIC_KEY=public_your_public_key_here
IMAGEKIT_PRIVATE_KEY=private_your_private_key_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# Site Configuration
PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd stack
   npm install
   ```

2. **Set Up Database**
   ```bash
   npm run setup:db
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Access Admin Panel**
   - Visit `http://localhost:4321/admin`
   - Sign in with your Clerk account
   - Start creating content!

## 🔧 Deployment

### Vercel Deployment

1. **Connect Repository** to Vercel
2. **Add Environment Variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Environment Variables in Vercel

Add all the environment variables from your `.env` file to your Vercel project settings:

- `MONGODB_URI`
- `PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_URL_ENDPOINT`
- `PUBLIC_SITE_URL`

## 📝 Admin Panel Features

### Content Management
- **Rich Editor** with Markdown support and live preview
- **Media Insertion** directly into posts
- **Draft System** for saving work in progress
- **Publishing Control** with immediate or scheduled publishing
- **Tag Management** for content organization

### Media Library
- **Drag & Drop** file uploads
- **Image Optimization** automatic resizing and compression
- **Video Support** with streaming capabilities
- **Organization Tools** search, filter, and categorize media
- **Usage Tracking** see where media files are used

### Analytics Dashboard
- **Content Metrics** views, engagement, and performance
- **Publishing Stats** total posts, featured content, drafts
- **Media Usage** storage and bandwidth analytics
- **User Activity** author contributions and activity

### User Management
- **Role-Based Access** Admin, Author, Editor permissions
- **Profile Management** author bios and social links
- **Activity Logs** track user actions and changes

## 🎯 Content Guidelines

### Writing Standards
- **Financial Focus**: All content should relate to personal finance, investing, or wealth building
- **Nigerian Context**: Use local examples, currency (₦), and relevant financial institutions
- **Actionable Advice**: Provide practical, implementable financial guidance
- **Accessible Language**: Write for all literacy levels, explain complex terms

### Content Types
- **Investment Guides**: Stock market, mutual funds, real estate
- **Savings Strategies**: Emergency funds, goal-based saving, high-yield accounts
- **Personal Finance**: Budgeting, debt management, financial planning
- **Financial Technology**: Apps, tools, and digital banking solutions

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#1e40af` (Professional, trustworthy)
- **Accent Blue**: `#3b82f6` (Interactive elements)
- **Success Green**: `#10b981` (Positive actions)
- **Warning Orange**: `#f59e0b` (Cautions)
- **Error Red**: `#ef4444` (Errors, deletions)

### Typography
- **Headings**: System font stack for clarity
- **Body**: Optimized for readability across devices
- **Code**: Monospace for technical content

## 📊 Analytics

The platform includes comprehensive analytics to track:

- **Content Performance**: Views, engagement, and sharing metrics
- **User Behavior**: Reading patterns and popular content
- **Publishing Metrics**: Post frequency and author productivity
- **Media Usage**: Most popular images and videos

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 📋 API Documentation

### Posts API
- `GET /api/posts` - Fetch published posts with pagination
- `POST /api/posts` - Create new post (requires authentication)
- `PUT /api/posts` - Update existing post (requires authentication)
- `DELETE /api/posts` - Delete post (requires authentication)

### Media API
- `GET /api/upload` - Fetch media files
- `POST /api/upload` - Upload new media file (requires authentication)
- `DELETE /api/upload` - Delete media file (requires authentication)

### Authentication API
- `GET /api/imagekit-auth` - Get ImageKit authentication parameters

## 🧪 Development

### Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run setup:db     # Initialize database indexes
npm run format       # Format code with Prettier
npm run lint         # Run ESLint
```

### Database Schema

#### Posts Collection
```typescript
interface BlogPost {
  _id: ObjectId;
  title: string;
  description: string;
  content: string;
  author: string;
  authorId: string; // Clerk user ID
  tags: string[];
  featured: boolean;
  published: boolean;
  slug: string;
  coverImage?: string;
  images?: string[];
  videos?: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  views?: number;
}
```

#### Media Collection
```typescript
interface MediaFile {
  _id: ObjectId;
  fileName: string;
  fileId: string; // ImageKit file ID
  url: string;
  thumbnailUrl?: string;
  fileType: 'image' | 'video';
  size: number;
  uploadedBy: string; // Clerk user ID
  uploadedAt: Date;
  postId?: string;
}
```

## 🎯 Mission

**Building Financial Literacy Through Quality Content**

Stack serves as the digital foundation for the Cowrywise Ambassador Writing Group, empowering financial writers to share knowledge that builds wealth and financial independence across Nigeria.

## 📞 Support

For questions, issues, or contributions:

- **Email**: ambassadors@cowrywise.com
- **Community**: [Cowrywise Ambassador Program](https://cowrywise.com/ambassadors)
- **Issues**: Create an issue in this repository

---

**Stack** - *Empowering Financial Literacy, One Story at a Time* 🚀
