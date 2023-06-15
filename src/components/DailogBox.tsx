import { useState } from "react";
import { EditedData} from "./dataSlice";
import { useDispatch } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Button } from "@material-ui/core";

const DialogBox = ({ onClose, filteredData }: { onClose: any, filteredData: any }) => {
    const dispatch = useDispatch();
    const [stockData, setStockData] = useState([...filteredData]);
    const [editedStockData, setEditedStockData] = useState<any>([]);

    const handleStockChange = (e: any, index: any) => {
        const { name, value } = e.target;
        setEditedStockData((prevState: any) => {
            const updatedData = [...prevState];
            updatedData[index] = { ...updatedData[index], [name]: value };
            return updatedData;
        });
    };

    const handleSaveClick = () => {
        const updatedFilteredData = filteredData.map((row: any, index: any) => {
            const updatedRow = [...row];
            updatedRow[8] = editedStockData[index]?.LocA_Stock || row[8];
            updatedRow[10] = editedStockData[index]?.LocB_Stock || row[10];
            return updatedRow;
        });
        dispatch(EditedData(updatedFilteredData));
        onClose();
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
