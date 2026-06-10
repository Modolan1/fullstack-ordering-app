import React from 'react'
import { Link, useParams } from 'react-router-dom'
import './BlogDetail.css'
import { blogPosts } from '../../data/blogPosts'

const getEmbedUrl = (url) => {
  if (!url) return ''

  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : ''
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : ''
    }
  } catch {
    return ''
  }

  return ''
}

const BlogDetail = () => {
  const { slug } = useParams()
  const post = blogPosts.find((item) => item.slug === slug)

  if (!post) {
    return (
      <section className='blog-detail blog-not-found'>
        <h2>Blog Post Not Found</h2>
        <p>The requested article does not exist.</p>
        <Link to='/'>Return Home</Link>
      </section>
    )
  }

  const embedUrl = getEmbedUrl(post.youtubeUrl)

  return (
    <section className='blog-detail'>
      <Link className='blog-back-link' to='/'>
        Back to Latest Blog
      </Link>

      <h1>{post.title}</h1>
      <img src={post.image} alt={post.title} className='blog-detail-image' />

      <div className='blog-detail-content'>
        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className='blog-video-block'>
        <h3>YouTube Video</h3>
        {post.youtubeUrl ? (
          <a href={post.youtubeUrl} target='_blank' rel='noreferrer'>
            {post.youtubeUrl}
          </a>
        ) : (
          <p>Add a YouTube URL in blogPosts.js for this article.</p>
        )}

        {embedUrl && (
          <div className='blog-video-embed'>
            <iframe
              src={embedUrl}
              title={`${post.title} video`}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowFullScreen
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default BlogDetail
