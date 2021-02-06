import React from 'react'

interface ButtonProps {
  onClick?: () => void
  isLoading: boolean
  type: 'button' | 'reset' | 'submit'
  block?: boolean
}

const Button: React.FC<ButtonProps> = ({ onClick, children, isLoading, type }) => {
  return (
    // eslint-disable-next-line react/button-has-type
    <button disabled={isLoading} onClick={onClick} type={type} className="btn btn-primary">
      {isLoading ? (
        <>
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span>&nbsp;&nbsp;Loading...</span>
        </>
      ) : (
        `${children}`
      )}
    </button>
  )
}

export default Button
