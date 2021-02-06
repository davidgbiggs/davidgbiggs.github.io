/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEvent, FormEvent, useState } from 'react'

import firebase from 'firebase'
import { navigate } from 'gatsby'
import styled from '@emotion/styled'
import Page from '../components/Page'
import Container from '../components/Container'
import BoxForm from '../components/BoxForm'
import Button from '../components/Button'
import IndexLayout from '../layouts/index'
import StyleLayout from '../layouts/style-layout'

const LoginForm = styled(BoxForm)`
  margin-top: 50px;
`

const LoginSeparator = styled.div`
  border-top: 1px solid #cbd2d6;
  position: relative;
  margin: 25px 0 10px;
  text-align: center;
`

const TextInSeparator = styled.span`
  background-color: #fff;
  padding: 0 0.5em;
  position: relative;
  color: #6c7378;
  top: -0.8em;
`

// const LinkContainer = styled.div`
//   margin-top: 15px;
//   text-align: center;
// `

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('none')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value)
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigate('/account/')
      })
      .catch(function(error) {
        // Handle Errors here.
        switch (error.code) {
          case 'auth/user-not-found':
            setErrorText(`We couldn't find any records for that user. Did you type your email correctly?`)
            break
          case 'auth/wrong-password':
            setErrorText('There was an error signing in. Please double check your password.')
            break
          default:
            setErrorText('There was an unknown error signing in.')
        }
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <IndexLayout>
      <StyleLayout>
        <Page>
          <Container>
            <LoginForm onSubmit={handleFormSubmit} errorText={errorText}>
              <div className="form-group">
                <label className="mb-2" htmlFor="login-email">
                  Email
                </label>
                <input
                  placeholder="Your Email"
                  disabled={isLoading}
                  type="email"
                  onChange={handleEmailChange}
                  className="form-control mb-3"
                  id="login-email"
                  aria-describedby="emailHelp"
                  value={email}
                />
              </div>
              <div className="form-group">
                <label className="mb-2" htmlFor="login-password">
                  Password
                </label>
                <input
                  placeholder="Password"
                  value={password}
                  disabled={isLoading}
                  type="password"
                  onChange={handlePasswordChange}
                  className="form-control mb-3"
                  id="login-password"
                />
              </div>
              <div className="d-grid gap-1 mt-2">
                <Button type="submit" isLoading={isLoading} block>
                  Submit
                </Button>
              </div>
              <LoginSeparator>
                <TextInSeparator>or</TextInSeparator>
              </LoginSeparator>
              <div className="d-grid gap-1 mt-1">
                <button onClick={() => navigate('/sign-up/')} type="submit" className="btn btn-light btn-block">
                  Sign Up
                </button>
              </div>
            </LoginForm>
          </Container>
        </Page>
      </StyleLayout>
    </IndexLayout>
  )
}

export default LoginPage
