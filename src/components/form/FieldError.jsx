export const FieldError = ({ touched, error }) =>
  touched && error ? <p className="text-red-400 text-xs px-2 mb-2">{error}</p> : null;