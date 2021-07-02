import React, { Component } from "react";
// import { Col } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
export default class deleteAT extends Component {
  constructor(props) {
    super(props);
    // console.log("in deleteAT", this.props);
  }

  componentDidMount() {
    // console.log('DeleteAT did mount');
  }

  /**
   * Does a check to make sure the element is within bounds and then calls then right function to
   * delete the stupid AT
   */
  submitRequest = () => {
    if (this.props.deleteIndex < 0) {
      console.log("deleteAT index error");
      return;
    }
    this.tempdeleteArrPortion();
  };
  
  tempdeleteArrPortion = () => {
  
    let url = this.props.BASE_URL +  "deleteAT";

    let items = [...this.props.Array];
    let i = this.props.deleteIndex;
    const newArr = items.slice(0, i).concat(items.slice(i + 1, items.length));
    
    let body = {
      at_id: items[i]["id"]
    }
    
    axios.post(url, body)
       .then(() => {
         console.log("Deleted Action/Task to Database")
         this.props.refresh(newArr);
         this.props.refreshGR();

       })
       .catch((err) => {
         console.log("Error deleting Action/Task", err);
       });
  };

  
  /**
   *
   * deleteArrPortion :
   * this function will go into the array of that action&task and delete that specific element, after which
   * it will update the array in firestore and refresh the page once that is completed
   */
  deleteArrPortion = () => {
    // console.log("request was made to delete this  element " + this.props.deleteIndex);
    let items = [...this.props.Array];
    // console.log("delete with: ");
    // console.log(items);
    let i = this.props.deleteIndex;
    const newArr = items.slice(0, i).concat(items.slice(i + 1, items.length));
    // console.log("delete 2 with: ");
    // console.log(newArr);
    this.props.Item.fbPath.update({ "actions&tasks": newArr }).then((doc) => {
      // console.log('updateEntireArray Finished')
      // console.log(doc);
      if (this.props != null) {
        console.log(
          "this si the path deleting ",
          this.props.Item.fbPath.path.split("/")[3]
        );
        this.props.updateNewWentThroughATDelete(
          this.props.Item.fbPath.path.split("/")[3]
        );
        // console.log("refreshing FireBasev2 from delete ISItem");
        this.props.refresh(newArr);
      } else {
        console.log("delete failure");
      }
    });
  };

  confirmation = () => {
    const r = window.confirm("Confirm Delete");
    if (r === true) {
      // console.log("Delete Confirm")
      this.submitRequest();
      return;
    }
    // console.log("Delete Not Confirm")
  };

  render() {
    return (
      <div >
        <FontAwesomeIcon
       
          style={{color: "#ffffff" }}
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
