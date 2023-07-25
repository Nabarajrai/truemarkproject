/* eslint-disable react/prop-types */
const SelectInput = ({ data, ...rest }) => {
  return (
    <div className="select-container">
      <select className="select-input" {...rest}>
        {data.map((data, i) => (
          <option value={data.value} key={i}>
            {data.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
