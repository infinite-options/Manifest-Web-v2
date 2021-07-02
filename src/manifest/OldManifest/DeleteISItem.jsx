import React, { Component } from "react";
// import { Button, Row, Col, Modal, InputGroup, FormControl } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

/**
 *
 * This class is responsible for adding a new elemnt to the
 * firebase database. If it becomes successful then we update
 * the view on the firebasev2
 */
export default class DeleteISItem extends Component {
  constructor(props) {
    super(props);
    console.log("DeleteISItem constructor");
    console.log(this.props);
    // console.log('delete index ' + this.props.deleteIndex)
    // console.log(this.props.ISItem)
    // console.log(this.props.ISArray)
  }

  componentDidMount() {
    // console.log('DeleteISItem did mount');
  }

  submitRequest = () => {
    let url = this.props.BASE_URL +  "deleteIS";
    console.log(url)
    let items = [...this.props.ISArray];
    let i = this.props.deleteIndex;
    const newArr = items.slice(0, i).concat(items.slice(i + 1, items.length));
    const atArr = [...this.props.Array]
    console.log(items)
    let body = {
      is_id: items[i]["id"]
    }
    console.log("IS_ID", body)
    axios.post(url, body)
       .then((response) => {
         console.log(response)
         console.log("Deleted Instruction/Step to Database")
         var res = response.data.result

         for (let i = 0; i < atArr.length; ++i){
            if(res.at_id == atArr[i].id){
              atArr[i].is_sublist_available = res.is_sublist_available.toLowerCase() === "true"
            }
         }
         this.props.refresh(newArr);
         this.props.refreshAT(atArr)

       })
       .catch((err) => {
         console.log("Error deleting Action/Task", err);
       });
  };

  confirmation = () => {
    const r = window.confirm("Confirm Delete");
    if (r === true) {
      // console.log("Delete Confirm")
      this.submitRequest();
      return;
    }
    console.log("Delete Not Confirm");
  };

  render() {
    console.log("Delete IS render")
    return (
      <div>
        <FontAwesomeIcon
     
          style={{ color: "#ffffff"}}
          onClick={(e) => {
            e.stopPropagation();
            e.target.style.color = "#000000"
            this.confirmation();
          }}
          icon={faTrashAlt}
          size="small"
        />
      </div>
    );
  }
}
