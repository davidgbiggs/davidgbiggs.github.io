import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { Link, navigate, graphql, useStaticQuery } from 'gatsby'

import firebase from 'firebase'
import Img from 'gatsby-image'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { heights, dimensions, colors } from '../styles/variables'
import { FirebaseContext } from '../../FirebaseProvider'

const StyledHeader = styled.header`
  position: relative;
  z-index: 19000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.95);
`

const HeaderInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  justify-content: space-between;
  width: 100%;
`

const DropdownButton = styled.button`
  color: ${colors.text};
`

const HomepageLink = styled(Link)`
  color: ${colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin-left: 0.2em;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`

const LeftContainer = styled.div`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  display: flex;
`

const LogoutButton = styled.button`
  &:focus {
    outline: unset;
  }
`

function logout() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      navigate('/')
    })
    .catch(function(error) {
      // An error happened.
    })
}

interface NavActionProps {
  isLoggedIn: 'unset' | 'yes' | 'no' | undefined
}

const TrusteeLogo = () => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "trustee-logo.png" }) {
        childImageSharp {
          # Specify the image processing specifications right in the query.
          # Makes it trivial to update as your page's design changes.
          fixed(height: 30, width: 26) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `)

  return (
    <>
      <Img fixed={data.file.childImageSharp.fixed} />
    </>
  )
}

const NavAction: React.FC<NavActionProps> = ({ isLoggedIn }) => {
  if (isLoggedIn === 'unset' || !isLoggedIn) {
    return <Skeleton height={34} width={116} />
  }
  if (isLoggedIn === 'yes') {
    return (
      // <div className="btn-group">
      //   <DropdownButton
      //     type="button"
      //     className="btn btn-link dropdown-toggle"
      //     data-toggle="dropdown"
      //     aria-haspopup="true"
      //     aria-expanded="false"
      //   >
      //     Account
      //   </DropdownButton>
      //   <div className="dropdown-menu dropdown-menu-right">
      //     <Link to="/account/">
      //       <span className="dropdown-item">Manage Account</span>
      //     </Link>
      //     <div className="dropdown-divider" />
      //     <button type="button" className="dropdown-item" onClick={logout}>
      //       Logout
      //     </button>
      //   </div>
      // </div>
      <div className="btn-group">
        <button type="button" onClick={() => navigate('/account/')} className="btn btn-primary">
          Account
        </button>
        <button
          type="button"
          className="btn btn-primary dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="sr-only" />
        </button>
        <div className="dropdown-menu dropdown-menu-right">
          <LogoutButton type="button" className="dropdown-item" onClick={logout}>
            Logout
          </LogoutButton>
        </div>
      </div>
    )
  }
  if (isLoggedIn === 'no') {
    return (
      <div>
        <Link to="/login/">Login</Link>
        <span>&nbsp;or&nbsp;</span>
        <Link to="/sign-up/">Sign Up</Link>
      </div>
    )
  }
  return null
}

interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const firebaseContext = useContext(FirebaseContext)

  return (
    <StyledHeader>
      <HeaderInner>
        <LeftContainer>
          <TrusteeLogo />
          <HomepageLink to="/">{title}</HomepageLink>
        </LeftContainer>
        <NavAction isLoggedIn={firebaseContext.isLoggedIn} />
      </HeaderInner>
    </StyledHeader>
  )
}

export default Header
