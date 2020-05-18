import React, { useState } from "react";
import { axiosWithAuth } from "../ultils/axiosWithAuth";
import { Link } from "react-router-dom";
const initialColor = {
  color: "",
  code: { hex: "" },
};

const ColorList = ({ props, colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState({
    color: "",
    code: {
      hex: "",
    },
  });

  const editColor = (color) => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = (e) => {
    e.preventDefault();
    axiosWithAuth().put(`/api/colors/${colorToEdit.id}`, colorToEdit);
    props.history.push("/bubble-page");
  };

  const deleteColor = (color) => {
    axiosWithAuth().delete(`/api/colors/${color.id}`);
    props.history.push("/bubble-page");
  };
  const addColor = (e) => {
    e.preventDefault();
    console.log(newColor);

    axiosWithAuth()
      .post("/api/colors", newColor)
      .then((res) => {
        axiosWithAuth()
          .get("/api/colors")
          .then((res) => {
            updateColors(res.data);
          });
      });
  };
  const handleChange = (e) => {
    setNewColor({ ...newColor, [e.target.name]: e.target.value });
  };

  const handleHexChange = (e) => {
    setNewColor({ ...newColor, code: { hex: e.target.value } });
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map((color) => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={(e) =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={(e) =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value },
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      {/* stretch - build another form here to add a color */}

      <form className="add-row" onSubmit={addColor}>
        <label>
          Enter New Color:
          <input type="text" name="color" onChange={handleChange} />
        </label>
        <label>
          Enter Hex Code:
          <input type="text" name="hex" onChange={handleHexChange} />
        </label>
        <div className="button-row">
          <button type="submit">Add New Color</button>
          <button type="submit">
            <Link to="/">Home</Link>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ColorList;
