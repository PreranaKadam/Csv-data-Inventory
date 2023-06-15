import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import { filterData, updateData } from './dataSlice';
import DialogBox from './DailogBox';
import FilterIcon from '@mui/icons-material/FilterAltSharp';
import FilterOffIcon from '@mui/icons-material/FilterAltOffSharp';
import { Button } from '@material-ui/core';
import ExportIcon from '@mui/icons-material/FileUpload';
import ImportIcon from '@mui/icons-material/GetApp'

const InventoryTable = () => {
  const dispatch = useDispatch();

  const [file, setFile] = useState<any>(null);
  const [csvData, setCSVData] = useState<any>('');
  const [userInput, setUserInput] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [filteredDataPresent, setFilteredDataPresent] = useState(false);

  //extract data from redux
  const data = useSelector((state: any) => state.dataslice.data);
  const filteredDataSet = useSelector((state: any) => state.dataslice.filteredData);
  const editedData = useSelector((state: any) => state.dataslice.updatedValueData);

  const parseCSV = (csv: any) => {
    const lines = csv.split('\n');
    const parsedData = [];
    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(',');
      parsedData.push(data);
    }
    // console.log(parsedData, "parsedData")
    dispatch(updateData(parsedData));
  };

  const displayData = (data: any) => {
    if (!Array.isArray(data))    // To check if data is not an array
      return null; 

    return data?.map((rowData: any, index: any) => (
      <tr key={index}>
        {rowData?.map((cellData: any, cellIndex: any) => (
          <td key={cellIndex}>{cellData}</td>
        ))}
      </tr>
    ));
  };

  const importCSV = () => {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      let csv = e.target.result;
      setCSVData(csv);
      parseCSV(csv);
    };
    reader.readAsText(file, 'UTF-8');
  };


  const handleInputChange = (e: any) => {
    setUserInput(e.target.value);
  };

  const handleFilterClick = () => {
    if (userInput) {
      dispatch(filterData(userInput)); 
      setFilterActive(!filterActive);
      setFilteredDataPresent(false);
    } else {
      alert("No data available to filter");
    }
  };

  const handleRemoveFilterClick = () => {
    setFilterActive(false);
    setFilteredDataPresent(true); // flag to indicate filtered data is not present
    const filteredValue = filteredDataSet[0] && filteredDataSet[0][0];
    const foundIndex = data?.findIndex((dataRow: any) => dataRow[0] === filteredValue);
    if (foundIndex !== -1 && editedData && editedData[0]) {
      const newData = [...data]; 
      newData[foundIndex] = editedData[0];
      dispatch(updateData(newData));
    }
  };

  const exportCSV = () => {
    if (data.length > 0) {
      // const csvContent = data;
      const headers = getHeadersFromCSVData(csvData); // get headers from csvdata
      const csvContent = convertToCSV(headers, data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });  
      saveAs(blob, 'data.csv');   
    } else {
      alert('No CSV data available to export');
    }
  };
  const getHeadersFromCSVData = (csvData: any) => {
    const lines = csvData.split('\n');
    const headers = lines[0].split('\r')[0].split(','); 
    return headers;
  };


  const convertToCSV = (headers: any, data: any) => {
    const headerRow = headers.join(',');
    const rows = data.map((row: any) => Object.values(row).join(','));
    return [headerRow, ...rows].join('\n'); // Combine header and data rows
  };

  const handleUpdateInventory = () => {
    if (csvData) {
      setIsDialogOpen(true);
    } else {
      alert('No CSV data available to update');
    }
  }

  return (
    <>
      <h1>CSV Data Table</h1>
      <br />
      <div className='main-div'>
        <input type="file" className="input-file" accept=".csv" onChange={(e: any) => setFile(e.target.files[0])} />
        <Button variant="contained" onClick={importCSV} startIcon={<ImportIcon />} color="secondary">Import</Button>&nbsp;&nbsp;
        <Button variant="contained" onClick={exportCSV} startIcon={<ExportIcon />} color="primary">Export CSV</Button>
        <br />
        <br />

        <label htmlFor="userInput"><b>User Input : </b></label>
        <input type="text" value={userInput} onChange={handleInputChange} />&nbsp;&nbsp;&nbsp;
    
        {filterActive ? <Button variant="contained" onClick={handleRemoveFilterClick}><FilterOffIcon />Remove Filter</Button> :
          <Button variant="contained" onClick={handleFilterClick} color="primary"><FilterIcon />Filter</Button>}&nbsp;&nbsp;
        <Button variant="contained" onClick={handleUpdateInventory} color="primary">Update Inventory</Button>
      </div>
      <br />
      <br />
      {filteredDataPresent === false ?
        (data.length > 0 &&
          <table id="data-table">
            <thead>
              <tr>
                <th>Part</th>
                <th>Alt_Part</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Engine</th>
                <th>Car</th>
                <th>LocA</th>
                <th>LocA_Stock</th>
                <th>LocB</th>
                <th>LocB_Stock</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Value</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>{displayData(filteredDataSet.length > 0 ? ((editedData.length > 0) ? editedData : filteredDataSet) : data)}</tbody>
          </table>
        ) :
        <table id="data-table">
          <thead>
            <tr>
              <th>Part</th>
              <th>Alt_Part</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Engine</th>
              <th>Car</th>
              <th>LocA</th>
              <th>LocA_Stock</th>
              <th>LocB</th>
              <th>LocB_Stock</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>Value</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>{displayData(data)}</tbody>
        </table>
      }

      
      {isDialogOpen && (
        <DialogBox onClose={() => setIsDialogOpen(false)} filteredData={filteredDataSet} />
      )}
    </>

  );
};

export default InventoryTable;
