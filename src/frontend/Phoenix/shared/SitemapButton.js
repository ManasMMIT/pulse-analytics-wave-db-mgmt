import React from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

import Color from 'frontend/utils/color'

const StyledLink = styled(Link)({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  // margin: '0 4px',
  borderRadius: 4,
  top: 4,
  padding: '8px 8px',
  fill: transparentize(0.7, Color.BLACK),
  ':hover': {
    fill: Color.PRIMARY,
    background: transparentize(0.85, Color.PRIMARY),
  },
  active: {
    background: transparentize(0.75, Color.PRIMARY),
  },
})

const SitemapButton = ({ teamId }) => {
  const location = useLocation()
  const { clientId: selectedClientId, userId: selectedUserId } =
    (location.search && queryString.parse(location.search)) || {}

  const getUserIdSearchString = () => {
    const userIdSearchParam = { userId: selectedUserId }

    const userIdSearchString = queryString.stringify(userIdSearchParam)

    return userIdSearchString
  }

  return (
    <StyledLink
      to={`/phoenix/sitemap/${selectedClientId}/${teamId}?${getUserIdSearchString()}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
      >
        <path
          fill="inherit"
          fillRule="evenodd"
          d="M5.95555556,0 L5.95555556,1.95555556 C3.72223398,1.95555556 1.95555556,3.72223398 1.95555556,5.95555556 C1.95555556,7.46759389 2.76984567,8.79565334 4.05882598,9.46338118 L4.22961794,9.54669217 L4.8,9.80811728 L4.8,19.8817778 L5.68088889,21.2026667 L7.11111111,19.7724444 L7.11111111,19.3591111 L5.68888889,18.6487443 L5.68888889,16.2172134 L6.70666667,15.2 L5.28388007,13.7777778 L7.39749559,11.6641623 L8.78028219,13.0469489 L8.04888889,13.7777778 L9.47167548,15.2 L7.64444444,17.0257778 L7.64444444,17.4408889 L9.06666667,18.1512557 L9.06666667,20.5827866 L6.36056437,23.2888889 L4.72115366,23.2888889 L2.84444444,20.4738251 L2.84444444,11.0231111 L2.81339219,11.0055312 C1.1441473,9.99235235 0.080892403,8.2034524 0.00442255483,6.1889661 L-5.40604598e-13,5.95555556 C-5.40604598e-13,2.71270717 2.53097209,0.112738306 5.74499588,0.00356934976 L5.95555556,0 Z M6.71111922,1.61921495 C9.02700976,-0.520823259 12.7199087,-0.467322304 14.9669489,1.77971781 C16.4311255,3.24389443 16.9914119,5.27112765 16.6007745,7.29387101 L16.6007745,7.29387101 L16.5697778,7.43644444 L17.8133333,8.67943563 L17.8133333,10.0968889 L19.8044444,10.0977778 L19.8044444,12.6622222 L20.0853333,12.9431111 L21.5796443,12.4457466 L23.2888889,14.1549912 L23.2888889,17.9516755 L22.1347042,19.1058602 L18.8423882,18.447397 L12.1475556,11.752 L12.075921,11.7715356 C10.1698224,12.2211562 8.18860563,11.7291938 6.71813025,10.3697916 L6.71813025,10.3697916 L6.54416226,10.2025044 C4.24231628,7.90065843 4.24231628,4.08156379 6.54416226,1.77971781 L6.54416226,1.77971781 Z M13.5841623,3.16250441 C12.0460082,1.62435038 9.46510288,1.62435038 7.92694885,3.16250441 C6.38879483,4.70065843 6.38879483,7.28156379 7.92694885,8.81971781 C9.04034824,9.9331172 10.6173961,10.2610182 12.0954743,9.72891009 L12.0954743,9.72891009 L12.6792979,9.51873357 L19.8053333,16.6453333 L21.3333333,16.9511111 L21.3333333,14.9644444 L21.0515556,14.6826667 L19.5581335,15.1809201 L17.8488889,13.4716755 L17.8488889,12.0524444 L15.8577778,12.0533333 L15.8577778,9.48888889 L14.3767761,8.00845158 L14.549905,7.44578273 C15.0372474,5.86191969 14.6945067,4.27284882 13.5841623,3.16250441 Z M9.21487188,4.23807035 C9.7702842,3.68265802 10.6707855,3.68265802 11.2261978,4.23807035 C11.7816102,4.79348267 11.7816102,5.69398397 11.2261978,6.2493963 C10.6707855,6.80480863 9.7702842,6.80480863 9.21487188,6.2493963 C8.65945955,5.69398397 8.65945955,4.79348267 9.21487188,4.23807035 Z"
        />
      </svg>
    </StyledLink>
  )
}

SitemapButton.propTypes = {
  teamId: PropTypes.string.isRequired,
}

export default SitemapButton
