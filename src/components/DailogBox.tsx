import { useState } from "react";
import { EditedData, updateData } from "./dataSlice";
import { useDispatch, useSelector } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Button } from "@material-ui/core";

const DialogBox = ({ onClose, filteredData }: { onClose: any, filteredData: any }) => {
    const dispatch = useDispatch();
    const [stockData, setStockData] = useState([...filteredData]);
    const [editedStockData, setEditedStockData] = useState<any>([]);
    //extract data from redux
    const data = useSelector((state: any) => state.dataslice.data);

    //function for updating stock values  
    const handleStockChange = (e: any, index: any) => {
        const { name, value } = e.target;
        setEditedStockData((prevState: any) => {
            const updatedData = [...prevState];
            updatedData[index] = { ...updatedData[index], [name]: value };
            return updatedData;
        });
    };

    const handleSaveClick = () => {
        //for updating the filtered data
        const updatedFilteredData = filteredData.map((row: any, index: any) => {
            const updatedRow = [...row];
            updatedRow[8] = editedStockData[index]?.LocA_Stock || row[8];
            updatedRow[10] = editedStockData[index]?.LocB_Stock || row[10];
            return updatedRow;
        });
        dispatch(EditedData(updatedFilteredData));

        //for deleting particular entry from main csv data
        const deletedValue = filteredData[0][0];
        const deletedIndex = data.findIndex((row: any) => row[0] === deletedValue);

        const updatedData = [...data];
        if (deletedIndex !== -1) {
            updatedData.splice(deletedIndex, 1);
        }
        dispatch(updateData(updatedData));

        onClose();      //Closing dailog box
    };

    const handleDeleteRow = (index: number) => {
        const updatedStockData = [...stockData];    //deleting from dailog box
        updatedStockData.splice(index, 1);
        setStockData(updatedStockData);
    };

    return (
        <div className="dialog-container">
            <div className="dialog-box">
                <table id="data-table">
                    <thead>
                        <tr>
                            <th>Part</th>
                            <th>Alt_Part</th>
                            <th>Model</th>
                            <th>LocA_Stock</th>
                            <th>LocB_Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockData.map((row: any, index: any) => (
                            <tr key={index}>
                                <td>{row[0]}</td>
                                <td>{row[1]}</td>
                                <td>{row[4]}</td>
                                <td>
                                    <input
                                        type="number"
                                        name="LocA_Stock"
                                        value={editedStockData[index]?.LocA_Stock || ''}
                                        placeholder={row[8]}
                                        onChange={(e) => handleStockChange(e, index)}
                                        min={0}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        name="LocB_Stock"
                                        value={editedStockData[index]?.LocB_Stock || ''}
                                        placeholder={row[10]}
                                        onChange={(e) => handleStockChange(e, index)}
                                        min={0}
                                    />
                                </td>
                                <td>
                                    <Button variant="contained" color="primary" onClick={() => handleDeleteRow(index)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <br />
                <Button variant="contained" onClick={onClose} style={{
                    backgroundColor: "red",
                    color: "white"
                }}>Close<CloseIcon /></Button>&nbsp;&nbsp;
                <Button variant="contained" onClick={handleSaveClick} style={{
                    backgroundColor: "green",
                    color: "white"
                }}>Save<SaveIcon /></Button>
            </div>
        </div>
    );
};

export default DialogBox;
