import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'formik'

const InnerField = ({ config, componentDict, field, form, meta }) => {
  React.useEffect(() => {
    // validate field again if validation rules change
    if ((meta.touched && config.validationType) || (config.validations && config.validations.length > 0)) {
      setTimeout(() => {
        form.validateField(config.name)
      }, 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.validationType, config.validations, config.validationParams])
  const { name, label, type, tips } = config
  const { value } = field
  const { touched, error } = meta
  const { setFieldValue, setFieldTouched } = form
  const { component: Component, selfHandle } = componentDict[type] || {}

  const showError = touched && error && !selfHandle // self handle component will display error itself

  const onChange = (value, shouldTouch = true) => {
    let realValue = value
    if (value.target) {
      const { tagName, type } = value.target
      if (tagName === 'INPUT') {
        if (type === 'checkbox') {
          realValue = value.target.checked
        } else {
          realValue = value.target.value
        }
      } else if (tagName === 'SELECT') {
        realValue = value.target.value
      }
    }
    setFieldValue(name, realValue)
    shouldTouch && setFieldTouched(name, true, false)
  }
  return (
    <div className="dynamik-field">
      {label && <label className="dynamik-field__label">{label}</label>}
      <div className="dynamik-field__content">
        {Component && <Component {...config} value={value} onChange={onChange} />}
        {showError && (
          <div className="dynamik-field__error">{typeof error === 'object' ? JSON.stringify(error) : error}</div>
        )}
      </div>
      {tips && <div className="dynamik-field__tips">{tips}</div>}
    </div>
  )
}

InnerField.propTypes = {
  config: PropTypes.object.isRequired,
  componentDict: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
}

const OuterField = ({ config, componentDict }) => {
  return (
    <Field name={config.name}>
      {({ field, form, meta }) => {
        return <InnerField config={config} componentDict={componentDict} field={field} form={form} meta={meta} />
      }}
    </Field>
  )
}

OuterField.propTypes = {
  config: PropTypes.object.isRequired,
  componentDict: PropTypes.object.isRequired,
}

export default OuterField
