const Input = ({ id, label, onChange, help, value, type = "text" }) => {
  const inputClass = help ? "form-control is-invalid" : "form-control";

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        className={inputClass}
        value={value}
        onChange={onChange}
        id={id}
        type={type}
      />
      {help && <span className="invalid-feedback">{help}</span>}
    </div>
  );
};
export default Input;
