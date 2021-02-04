import React, { FormEvent, useState, useEffect } from 'react'

interface Props {
  onSubmit(event: FormEvent<HTMLFormElement>): void
  errorText: string
  className?: string
}

const BoxForm: React.FC<Props> = ({ children, onSubmit, errorText, className }) => {
  const [showError, setShowError] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    onSubmit(event)
  }

  useEffect(() => {
    if (errorText === 'none') {
      setShowError(false)
    } else {
      setShowError(true)
    }
  }, [errorText])

  return (
    <form className={`form ${className}`} onSubmit={handleSubmit}>
      {showError ? (
        <div className="alert alert-danger" role="alert">
          {`${errorText}`}
        </div>
      ) : null}
      {children}
    </form>
  )
}

export default BoxForm
