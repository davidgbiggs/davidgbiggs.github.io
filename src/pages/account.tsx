/* eslint-disable @typescript-eslint/camelcase */
import React, { ChangeEvent, FormEvent, useState, useContext, useEffect } from 'react'

import firebase from 'firebase'
import { navigate } from 'gatsby'
import { loadStripe } from '@stripe/stripe-js'
import styled from '@emotion/styled'
import moment from 'moment'
import Skeleton from 'react-loading-skeleton'
import { ToastContainer, toast } from 'react-toastify'
import Page from '../components/Page'
import Container from '../components/Container'
import Button from '../components/Button'
import IndexLayout from '../layouts'
import { FirebaseContext, isBrowser } from '../../FirebaseProvider'
import 'react-toastify/dist/ReactToastify.css'

const MembershipBox = styled.div`
  // border: 1px solid gray;
  // border-radius: 5px;
  padding: 15px;
`

const Separator = styled.div`
  border-top: 1px solid #cbd2d6;
  position: relative;
  margin: 10px 0 10px;
  text-align: center;
`

const InfoBox = styled.div`
  // background-color: hsla(195, 100%, 50%, 0.2);
  border: 0px solid hsla(200, 100%, 50%, 1);
  padding: 10px;
  // margin: 10px;
  border-radius: 5px;
  align-text: center;
`

const LegalReviewButton = styled.button`
  margin-top: 10px;
`

// if (window.location.hostname === 'localhost') {
//   isBrowser() && firebase.functions().useEmulator('localhost', 5001)
// }

function AccountPage() {
  const firebaseContext = useContext(FirebaseContext)
  const { uid, subscription } = firebaseContext
  const [isLoading, setIsLoading] = useState(false)
  const [loadingReview, setLoadingReview] = useState(false)
  const [db, setDb] = useState(null)

  useEffect(() => {
    if (isBrowser()) {
      setDb(firebase.firestore())
    }
  })

  useEffect(() => {
    setIsLoading(false)
  }, [subscription])

  if (uid === null) {
    navigate('../login')
  }

  const notify = (success: boolean, message: string) => {
    if (success) {
      toast.success(message)
    } else {
      toast.error(message)
    }
  }

  const toggleCanceledRef = isBrowser() && firebase.functions().httpsCallable('toggleCanceled')
  async function toggleCanceled(subscriptionId: string, cancel_at_period_end: boolean) {
    setIsLoading(true)
    try {
      await toggleCanceledRef({ subscriptionId, cancel_at_period_end })
      notify(true, 'Success! Your subscription has been modified.')
    } catch (error) {
      console.error(error)
      notify(false, 'There was an error modifying your subscription.')
    } finally {
      // window.location.reload()
      // setTimeout(() => {
      //   // window.location.reload()
      //   // setIsLoading(false)
      // }, 3000)
    }
  }

  const buyLegalReviewRef = isBrowser() && firebase.functions().httpsCallable('buyLegalReview')
  async function buyLegalReview() {
    setLoadingReview(true)
    try {
      await buyLegalReviewRef({})
      notify(true, 'Success! You have not yet been charged. Please pay the invoice sent to your email to begin the review process.')
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingReview(false)
    }
  }

  async function sendToCheckout() {
    setIsLoading(true)

    const docRef = await db
      .collection('users')
      .doc(uid)
      .collection('checkout_sessions')
      .add({
        price: 'price_1HbcmfDsZ6um2x2w2Wmeidhd',
        success_url: window.location.origin,
        cancel_url: window.location.origin
      })
    // Wait for the CheckoutSession to get attached by the extension
    docRef.onSnapshot(async snap => {
      const error = snap.data()?.error
      const sessionId = snap.data()?.sessionId
      if (error) {
        // Show an error to your customer and
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occured: ${error.message}`)
        setIsLoading(false)
      }
      if (sessionId) {
        // We have a session, let's redirect to Checkout
        // Init Stripe
        const stripe = await loadStripe(
          'pk_test_51HaSmoDsZ6um2x2wqMwFyDsQv5VIrgZeSBn8qvDvgVLG1Uzz6uK78KfBQDxcvx6z7MN3CDvm1RphRNktRifIEgQE00lcVlgV71'
        )
        stripe!.redirectToCheckout({ sessionId })
      }
    })
  }

  interface SubBoxProps {
    currentSubscription: TrusteeSubscription | 'unset'
    // endingDate?: Date | undefined | string
  }

  function SubscriptionBox({ currentSubscription }: SubBoxProps) {
    if (!currentSubscription) {
      return (
        <MembershipBox>
          <div>
            <div className="font-weight-bold">
              <span>Standard Subscription: $13.99/mo.</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span>No subscription to show</span>
              <Button isLoading={isLoading} type="button" onClick={sendToCheckout}>
                Subscribe Now
              </Button>
            </div>
          </div>
        </MembershipBox>
      )
    }
    if (currentSubscription === 'unset') {
      // if (bool) {
      return (
        <MembershipBox>
          <div>
            <div className="font-weight-bold">
              <span>
                <Skeleton width={250} />
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span>
                <Skeleton width={100} />
              </span>
              <Skeleton width={90} height={34} />
            </div>
          </div>
        </MembershipBox>
      )
    }
    if (currentSubscription.status === 'active') {
      const { stripeLink } = currentSubscription
      const pos = stripeLink.search('sub_')
      const subscriptionId = stripeLink.slice(pos, stripeLink.length)
      console.log('subscription Id: ', subscriptionId)
      if (currentSubscription.cancel_at_period_end) {
        return (
          <MembershipBox>
            <div>
              <div className="font-weight-bold">
                <span>Standard Subscription: $13.99/mo. (set to expire)</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Subscription ending on: {moment(currentSubscription.current_period_end?.toDate()).format('MMM Do, YYYY')}</span>
                <Button
                  isLoading={isLoading}
                  type="button"
                  onClick={() => toggleCanceled(subscriptionId, subscription.cancel_at_period_end)}
                >
                  Resume
                </Button>
              </div>
            </div>
          </MembershipBox>
        )
      }
      return (
        <MembershipBox>
          <div>
            <div className="font-weight-bold">
              <span>Standard Subscription: $13.99/mo.</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span>Next billing date: {moment(currentSubscription.current_period_end?.toDate()).format('MMM Do, YYYY')}</span>
              <Button isLoading={isLoading} type="button" onClick={() => toggleCanceled(subscriptionId, subscription.cancel_at_period_end)}>
                Cancel
              </Button>
            </div>
          </div>
        </MembershipBox>
      )
    }
    if (currentSubscription.status === 'canceled') {
      return (
        <MembershipBox>
          <div>
            <div className="font-weight-bold">
              <span>Standard Subscription: $13.99/mo. (canceled)</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span>Canceled On: {moment(currentSubscription.canceled_at?.toDate()).format('MMM Do, YYYY')}</span>
              <button type="button" onClick={sendToCheckout} className="btn btn-link">
                Renew
              </button>
            </div>
          </div>
        </MembershipBox>
      )
    }
    return <span>there was an error</span>
  }

  return (
    <IndexLayout>
      <Page>
        <Container>
          <h6>Membership</h6>
          <Separator />
          <SubscriptionBox currentSubscription={subscription} />
        </Container>
        <Container>
          <h6>Legal Review</h6>
          <Separator />
          <InfoBox className="d-flex flex-column">
            <span>
              We also offer legal review services. A lawyer will review your records for inconsistencies and red flags, so you can have
              confidence and peace of mind. An invoice will be sent to you and you will be contacted by one of our attorneys upon payment.
            </span>
            <LegalReviewButton
              type="button"
              data-toggle="tooltip"
              data-placement="top"
              title="Tooltip on top"
              onClick={buyLegalReview}
              className={`btn btn-primary align-self-end ${loadingReview ? ' disabled' : ''}`}
              id="checkout-button"
            >
              {loadingReview ? 'Processing...' : 'Send me payment details'}
            </LegalReviewButton>
          </InfoBox>
        </Container>
      </Page>
      {/* <ToastDiv id="legal-review-toast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <ToastHeader className="toast-header">
          <div>
            <GreenBox />
            <ToastTitle>Legal Review</ToastTitle>
          </div>
          <button type="button" onClick={dismissToast} className="close btn" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </ToastHeader>
        <div className="toast-body">
          Success! You have not yet been charged. Please pay the invoice sent to your email to begin the review process.
        </div>
      </ToastDiv> */}
      {/* <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div className="toast-header">
          <strong className="me-auto text-success">Legal Review</strong>
          <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" />
        </div>
        <div className="toast-body">
          Success! You have not yet been charged. Please pay the invoice sent to your email to begin the review process.
        </div>
      </div> */}
      <ToastContainer autoClose={10000} position="bottom-right" />
    </IndexLayout>
  )
}

export default AccountPage
