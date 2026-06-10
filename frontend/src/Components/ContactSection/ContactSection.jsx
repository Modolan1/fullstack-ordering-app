import React, { useEffect, useState } from 'react'
import './ContactSection.css'

const initialFormData = {
  name: '',
  email: '',
  message: '',
}

const ContactSection = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (!statusMessage) {
      return undefined
    }

    const timeoutId = setTimeout(() => {
      setStatusMessage('')
    }, 3500)

    return () => clearTimeout(timeoutId)
  }, [statusMessage])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setStatusMessage('Thanks for reaching out. We will get back to you shortly.')
    setFormData(initialFormData)
  }

  return (
    <section className='contact-section' id='contact-us'>
      <div className='contact-section-head'>
        <h2>Contact Us</h2>
        <p>Have questions about orders or delivery? Send us a message.</p>
      </div>

      <form className='contact-form' onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='Your Name'
          required
          maxLength={80}
        />

        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Your Email'
          required
          maxLength={120}
        />

        <textarea
          name='message'
          value={formData.message}
          onChange={handleChange}
          placeholder='Write your message'
          required
          rows={5}
          maxLength={600}
        />

        <button type='submit'>Send Message</button>
      </form>

      {statusMessage && <p className='contact-success'>{statusMessage}</p>}
    </section>
  )
}

export default ContactSection
