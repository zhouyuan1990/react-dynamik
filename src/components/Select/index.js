import React from 'react'
import PropTypes from 'prop-types'

const Select = ({ name, onChange, options, value, placeholder, valueKey, textKey }) => {
  return (
    <select name={name} className="dynamik-select" onChange={onChange} value={value}>
      {placeholder && (
        <option key="dynamik-placeholder" value="">
          {placeholder}
        </option>
      )}
      {options.map((item) => (
        <option key={item.key || item[valueKey]} value={item[valueKey]}>
          {item[textKey]}
        </option>
      ))}
    </select>
  )
}

Select.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  valueKey: PropTypes.string,
  textKey: PropTypes.string,
}

Select.defaultProps = {
  placeholder: 'Please select',
  valueKey: 'value',
  textKey: 'label',
}

export default Select
