import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'gatsby'

import styled from '@emotion/styled'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import Page from '../components/Page'
import Container from '../components/Container'
import IndexLayout from '../layouts'
import HeroComponent from '../components/HeroComponent'
import { FirebaseContext, isBrowser } from '../../FirebaseProvider'
import { colors } from '../styles/variables'

const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const Header = styled.h1`
  font-size: 550%;
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 0;
`

const SubHeader = styled.h5`
  margin-top: 0.1em;
  margin-bottom: 2em;
  font-size: 135%;
`

const CTAButton = styled.div`
  font-size: 150%;
`

const CallButton = ({ isLoggedIn }: any) => {
  if (isLoggedIn === 'unset' || !isLoggedIn) {
    return <Skeleton width={224} height={54} />
  }
  if (isLoggedIn === 'yes') {
    return (
      <Link to="/account/">
        <CTAButton className="btn btn-outline-primary btn-lg">View your account</CTAButton>
      </Link>
    )
  }
  if (isLoggedIn === 'no') {
    return (
      <Link to="/login/">
        <CTAButton className="btn btn-outline-primary btn-lg">Sign in to your account</CTAButton>
      </Link>
    )
  }
  return null
}

const IndexPage = () => {
  const firebaseContext = useContext(FirebaseContext)
  const { isLoggedIn } = firebaseContext

  return (
    <IndexLayout>
      <Page>
        <MainSection>
          <Header>Hi there.</Header>
          <SubHeader>Trustee Helper removes the headache from legal guardianship. No aspirin required.</SubHeader>
          <CallButton isLoggedIn={isLoggedIn} />
          <HeroComponent />
        </MainSection>
      </Page>
      {/* <HeroComponent /> */}
    </IndexLayout>
  )
}

export default IndexPage
