import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import isEqual from 'lodash/isEqual'
import { getConvertedFields, getDisplayedFields, getValidationSchema } from './utils'
import Field from './Field'

const Dynamik = (props) => {
  const fields = React.useMemo(() => {
    return getConvertedFields(props.fields)
  }, [props.fields])
  const formikRef = React.useRef(null)
  const [displayedFields, setDisplayedFields] = React.useState(getDisplayedFields(fields, props.initialValues))
  const onChangeFormik = (formikProps) => {
    formikRef.current = formikProps
    const newFields = getDisplayedFields(fields, formikProps.values)
    if (!isEqual(displayedFields, newFields)) {
      setDisplayedFields(newFields)
    }
  }
  const validationSchema = React.useMemo(() => {
    return getValidationSchema(displayedFields)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...displayedFields])
  return (
    <Formik initialValues={props.initialValues} validationSchema={validationSchema}>
      {(formikProps) => {
        onChangeFormik(formikProps)
        return (
          <Form>
            {displayedFields.map((field) => (
              <Field key={field.name} config={field} componentDict={props.componentDict} />
            ))}
          </Form>
        )
      }}
    </Formik>
  )
}

Dynamik.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      //   type: PropTypes.oneOf(FIELD_TYPES).isRequired,
      //   validationType: PropTypes.oneOf(VALIDATION_TYPES).isRequired,
      //   value: PropTypes.any,
      options: PropTypes.array,
      //   validations: PropTypes.arrayOf(
      //     PropTypes.shape({
      //       type: PropTypes.string.isRequired,
      //       params: PropTypes.array.isRequired,
      //     })
      //   ),
    }),
  ).isRequired,
  componentDict: PropTypes.object,
  initialValues: PropTypes.object,
}

Dynamik.defaultProps = {
  initialValues: {},
  componentDict: {},
}

export default Dynamik
