import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlash, faList } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default class ShowATList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iconShow: true,
      hasAction: true,
    };
  }
 
  async componentDidMount() {
    let items = [...this.props.Array];

    await this.hasActions();

    // console.log("this si the for the person",items[this.props.Index] )
    // console.log("this is what it is supposed to be",items[this.props.Index]['is_sublist_available']);
    // this.setState({
    //   iconShow: items[this.props.Index]["is_sublist_available"],
    // });
  }

  hasActions = async () => {
    let url =  this.props.BASE_URL + "actionsTasks/";

    const id = this.props.Array[this.props.Index].id;

    axios
      .get(url + id)
      .then((response) => {
        if (response.data.result && response.data.result.length > 0) {
          this.setState({ hasAction: true });
        } else {
          this.setState({ hasAction: false });
        }
      })
      .catch((error) => {
        console.log("Error Occurred " + error);
      });
  };


  editFirBaseFalse = (e) => {
    // console.log("this should be false");
    this.setState({ iconShow: false }, () => {
      let items = [...this.props.Array];
      items[this.props.Index]["is_sublist_available"] = false;
      // this.props.Path.update({ "goals&routines": items }).then((doc) => {});
    });
  };

  editFirBaseTrue = (e) => {
    this.setState({ iconShow: true }, () => {
      let items = [...this.props.Array];
      items[this.props.Index]["is_sublist_available"] = true;
      // this.props.Path.update({ "goals&routines": items }).then((doc) => {});
    });
  };

  renderSubListAvailableIcon = () => {
    return (
      <div>
        <FontAwesomeIcon
          icon={faList}
          title="SubList Available"
          style={{ color: "#D6A34C", marginLeft: "20px" }}
          // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShow: false}); this.editFirBaseFalse()}}
          onClick={(e) => {
            e.stopPropagation();
            this.editFirBaseFalse();
          }}
          //onClick={this.ListFalse}
          size="lg"
        />
      </div>
    );
  };

  renderSubListUnavailableIcon = () => {
    return (
      <div
      // onClick={(e)=>{ e.stopPropagation(); this.setState({iconShowATModal: false})}}>
      >
        <span className="fa-layers fa-fw" style={{ marginLeft: "20px" }}>
          <FontAwesomeIcon
            style={{ color: "#000000" }}
            icon={faList}
            title="SubList Unavailable"
            onClick={(e) => {
              e.stopPropagation();
              this.editFirBaseTrue();
            }}
            size="lg"
          />
          <FontAwesomeIcon
            style={{ color: "#000000" }}
            icon={faSlash}
            title="SubList Unavilable"
            onClick={(e) => {
              e.stopPropagation();
              this.editFirBaseTrue();
            }}
            size="lg"
          />
        </span>
      </div>
    );
  };

  render() {
    // this.hasActions()
    return (
      <div>
        {/* {console.log("this state is ", this.state.iconShow)} */}
        {this.state.iconShow &&
          this.state.hasAction &&
          this.renderSubListAvailableIcon()}
        {!this.state.iconShow &&
          this.state.hasAction &&
          this.renderSubListUnavailableIcon()}
      </div>
    );
  }
}
