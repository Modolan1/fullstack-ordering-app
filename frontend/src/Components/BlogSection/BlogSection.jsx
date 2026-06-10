import React from 'react'
import { Link } from 'react-router-dom'
import './BlogSection.css'
import { blogPosts } from '../../data/blogPosts'

const BlogSection = () => {
  const featuredPost = blogPosts[0]

  return (
    <section className='blog-section' id='latest-blog'>
      <div className='blog-header'>
        <h2>Latest Blog</h2>
        <Link className='blog-read-more-btn' to={`/blog/${featuredPost.slug}`}>
          Read More
        </Link>
      </div>

      <div className='blog-grid'>
        {blogPosts.map((post) => (
          <article className='blog-card' key={post.slug}>
            <Link to={`/blog/${post.slug}`} className='blog-card-image-link'>
              <img src={post.image} alt={post.title} />
            </Link>
            <div className='blog-card-body'>
              <h3>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p>{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BlogSection
