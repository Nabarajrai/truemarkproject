/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
const TabularReport = ({ data, total, dynamicColumns }) => {
  return (
    <div className="tabulor-container">
      {data.length === 0 ? (
        <h2>Data not found!</h2>
      ) : (
        <table>
          <thead>
            <tr>
              <th>
                <div>Name</div>
              </th>
              <th>
                <div>Hourly Rate</div>
              </th>
              <th>
                <div>Projects</div>
              </th>
              {dynamicColumns.map((dynamicColumn, index) => {
                return (
                  <th key={index}>
                    <div>{dynamicColumn.label}</div>
                  </th>
                );
              })}
              <th>
                <div>Projects Hours</div>
              </th>
              <th>
                <div>Total Hours</div>
              </th>
              <th>
                <div>Project Cost</div>
              </th>
              <th>
                <div>Total Cost</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.hourlyRate}</td>
                  <td>{item.project}</td>
                  {dynamicColumns.map((dynamicColumn, index) => {
                    return <td key={index}>{item[`filter${index}`]}</td>;
                  })}
                  <td>{item.projectHours}</td>
                  <td>{item.totalHours}</td>
                  <td>{item.projectCost}</td>
                  <td>{item.totalCost}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {total.map((totalItem, index) => {
              return (
                <tr key={index}>
                  <td>{index === 0 ? "Total" : ""}</td>
                  <td></td>
                  <td>{totalItem.project}</td>
                  {dynamicColumns.map((dynamicColumn, index) => {
                    return (
                      <td key={index}>{totalItem[`filter_total${index}`]}</td>
                    );
                  })}
                  <td>{totalItem.projectHours}</td>
                  <td>{totalItem.totalHours}</td>
                  <td>{totalItem.projectCost}</td>
                  <td>{totalItem.totalCost}</td>
                </tr>
              );
            })}
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default TabularReport;
