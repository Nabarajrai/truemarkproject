/* eslint-disable react/prop-types */

const CustomInput = ({ inputType, ...rest }) => {
  return (
    <div className="input-container">
      <div className="input-section">
        <input className="custom-input" type={inputType} {...rest} />
      </div>
    </div>
  );
};

export default CustomInput;
