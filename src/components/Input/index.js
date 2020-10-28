import React from 'react'
import PropTypes from 'prop-types'

const Input = (props) => {
  const { value, onChange, placeholder, disabled, maxLength } = props
  return (
    <input
      type="text"
      className="dynamik-input"
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
    />
  )
}

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
}

Input.defaultProps = {
  value: '',
  onChange: () => {},
  placeholder: '',
  disabled: false,
  maxLength: undefined,
}

export default Input
