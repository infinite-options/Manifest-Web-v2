import React, { Component } from "react";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { Form, Row, Col } from "react-bootstrap";


export default class EditIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditModal: true,
        };
    }

    showIcon = () => {
      console.log("In edit icon")
        return (
          <div>
            <FontAwesomeIcon
              title="Edit Item"
              onMouseOver={(event) => {
                event.target.style.color = "#48D6D2";
              }}
              onMouseOut={(event) => {
                event.target.style.color = "#000000";
              }}
              style={{ color: "#ffffff" }}
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


    render() {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
              {/* {console.log("what is the showModal ", )} */}
            {(this.props.showModal && this.props.i === this.props.indexEditing  )? <div></div> : this.showIcon()}
          </div>
        );
      }

}