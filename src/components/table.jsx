import "./styles/Table.css"; // Import the combined CSS file

const Table = ({ data, columns, currentPage, pageSize }) => {
  return (
    <div className="custom-table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.accessor === "serialNo"
                    ? currentPage * pageSize + rowIndex + 1 // Calculate serial number based on page
                    : column.render
                    ? column.render(row)
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
