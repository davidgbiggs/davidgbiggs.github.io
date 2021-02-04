import React from 'react'

interface ButtonProps {
  onClick?: () => void
  isLoading: boolean
  type: 'button' | 'reset' | 'submit'
  block?: boolean
}

const Button: React.FC<ButtonProps> = ({ onClick, children, isLoading, type, block }) => {
  const blockValue: string = block ? 'btn-block' : ''

  return (
    // eslint-disable-next-line react/button-has-type
    <button disabled={isLoading} onClick={onClick} type={type} className={`btn btn-primary ${blockValue}`}>
      {isLoading ? (
        <>
          <div className="spinner-border spinner-border-sm text-light" role="status">
            <span className="sr-only">Loading...</span>
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
