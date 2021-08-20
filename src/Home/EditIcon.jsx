import React, { useContext, UseEffect, useState } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";

const EditIcon = () => {
  const [stateValue, setStateValue] = useState({
    showEditModal: false,
  });

  const showIcon = () => {
    console.log("In edit icon");
    return (
      <div style={{ marginLeft: "5px" }}>
        <FontAwesomeIcon
          title="Edit Item"
          onMouseOver={(event) => {
            event.target.style.color = "#48D6D2";
          }}
          onMouseOut={(event) => {
            event.target.style.color = "#000000";
          }}
          style={{ color: "#000000" }}
          onClick={(e) => {
            e.stopPropagation();
            this.setState({ showEditModal: true });
            this.props.openEditModal();
          }}
          icon={faEdit}
          size="small"
        />
      </div>
    );
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {/* {console.log("what is the showModal ", )} */}
      {this.props.showModal && this.props.i === this.props.indexEditing ? (
        <div style={{ marginLeft: "5px" }}></div>
      ) : (
        this.showIcon()
      )}
    </div>
  );
};
export default EditIcon;
