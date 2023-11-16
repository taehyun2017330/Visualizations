import React from 'react';
import MaterialTable from 'material-table';

const TableView = ({ data, tableHeight, tableWidth }) => {
  // Style object for the table
  const tableStyle = {
    height: tableHeight,
    width: tableWidth,
  };

  return (
    <MaterialTable
      title=""
      columns={[
        { title: 'Title', field: 'title' },
        { title: 'Genre', field: 'genre' },
        { title: 'Creative Type', field: 'creative_type' },
        { title: 'Release', field: 'release' },
        { title: 'Rating', field: 'rating' }
      ]}
      data={data}
      options={{
        toolbar: false,
        paging: false,
        maxBodyHeight: tableHeight || 350, // Use tableHeight or default to 350 if not provided
        rowStyle: {
          fontSize: 12.5,
        }
      }}
      style={tableStyle} 
    />
  );
};

export default TableView;
