import React, { Component } from "react";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";


export default class CopyIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCopyModal: false,
        };
    }

    showIcon = () => {
        console.log(this.props.showModal)
        return (
          <div >
            <FontAwesomeIcon
              title="Copy Item"

              style={{ color: "#ffffff" }}
              onClick={(e) => {
                console.log("On click")
              //  e.stopPropagation();
                console.log("On click1")
                this.setState({ showCopyModal: true });
                console.log("On click3")
                e.target.style.color = "#000000"
                this.props.openCopyModal();
                console.log("On click4")
                console.log("Hi")
              }}
              icon={faCopy}
              size="small"
            />
          </div>
        );
      };


    render() {
        return (
          <div
            onClick={(e) => {
              e.target.style.color = "#000000"
              e.stopPropagation();
            }}
          >
            {(this.props.showModal)} 
            { this.showIcon()}
          </div>
        );
      }

}