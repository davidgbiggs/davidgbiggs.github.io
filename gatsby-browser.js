/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import 'jquery/dist/jquery.min'
import 'popper.js/dist/popper.min'
import 'bootstrap/dist/js/bootstrap.min'
import 'firebase/auth'
import 'bootstrap/dist/css/bootstrap.min.css'

import FirebaseProvider from './FirebaseProvider'

export const wrapRootElement = FirebaseProvider

// eslint-disable-next-line react/prop-types
// export default ({ element }) => <FirebaseProvider>{element}</FirebaseProvider>
