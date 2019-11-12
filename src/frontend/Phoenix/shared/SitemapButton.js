import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const buttonStyle = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  position: 'relative',
  top: 4,
  opacity: 0.3,
}

const SitemapButton = ({ teamId }) => (
  <Link style={buttonStyle} to={`/phoenix/sitemap/${teamId}`}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
      <g fill="none" fillRule="evenodd">
        <rect width="6" height="6" fill="#0A2E4D" rx="1.5" />
        <rect width="6" height="6" x="9" y="9" fill="#0A2E4D" rx="1.5" />
        <rect width="6" height="6" x="9" y="18" fill="#0A2E4D" rx="1.5" />
        <rect width="6" height="6" x="18" y="18" fill="#0A2E4D" rx="1.5" />
        <path stroke="#0A2E4D" strokeLinecap="round" strokeWidth="1.4" d="M3 3L3 21M12 12L3 12M21 21L3 21" />
      </g>
    </svg>
  </Link>
)

SitemapButton.propTypes = {
  teamId: PropTypes.string.isRequired,
}

export default SitemapButton
