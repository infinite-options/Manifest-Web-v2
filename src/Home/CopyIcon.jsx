import React, { Component } from "react";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";
import userContext from "../Home/userContext";

const CopyIcon = (props) => {
  const showIcon = () => {
    console.log(props.showModal);
    return (
      <div style={{ marginLeft: "5px" }}>
        <FontAwesomeIcon
          title="Copy Item"
          onMouseOver={(e) => {
            console.log("MouseOver");
            e.target.style.color = "#48D6D2";
          }}
          onMouseOut={(e) => {
            console.log("Mouseout");

            e.target.style.color = "#000000";
          }}
          style={{ color: "#000000" }}
          onClick={(e) => {
            console.log("On click");
            e.stopPropagation();
            console.log("On click1");

            props.setStateValue((prevState) => {
              return {
                ...prevState,
                showCopyModal: true,
              };
            });
            // this.setState({ showCopyModal: true });

            console.log("On click3");

            props.openCopyModal();
            console.log("On click4");
            console.log("Hi");
          }}
          icon={faCopy}
          size="lg"
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
      {props.showModal && props.i === props.indexEditing ? (
        <div></div>
      ) : (
        showIcon()
      )}
    </div>
  );
};
export default CopyIcon;
