import React, { useContext, useState } from 'react';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import EditISContext from './EditISContext';
import axios from 'axios';
import AddIconModal from '../AddIconModal';
import UploadImage from '../UploadImage';
import { useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const EditIS = (props) => {
  const editingISContext = useContext(EditISContext);

  const [photo, setPhoto] = useState(editingISContext.editingIS.newItem.is_photo);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [imageURL, setImageURL] = useState('');

  const updateIS = (e) => {
    e.stopPropagation();
    editingISContext.editingIS.editing = !editingISContext.editingIS.editing
    let object = {...editingISContext.editingIS.newItem}
    console.log('object initial: ', object);
    object.start_day_and_time = `${object.start_day} ${object.start_time}:00`;
    delete object.start_day;
    delete object.start_time;
    object.end_day_and_time = `${object.end_day} ${object.end_time}:00`;
    delete object.end_day;
    delete object.end_time;
    object.title = object.is_title;
    delete object.is_title;
    delete object.at_title;
    delete object.at_title;
    object.photo_url = photo;
    delete object.is_photo;
    //delete object.photo;
    delete object.end_day_and_time;
    delete object.start_day_and_time;
    const numHours = object.numMins > 60 ? object.numMins / 60: '00';
    let numMins = object.numMins % 60;
    if(numMins < 10)
      numMins = '0' + numMins
      object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    object.is_id = object.is_unique_id;
    object.at_id = props.actionID.at_unique_id;
    delete object.is_unique_id;
    object.is_sequence = 0;
    object.is_in_progress = "False";
    object.icon_type='';
    // object.photo = image;
    console.log('object = ', object);
    delete object.photo;
    let formData = new FormData();
    // delete object.at_id;
    Object.entries(object).forEach(entry => {
      if (typeof entry[1] == 'string'){
          formData.append(entry[0], entry[1]);
      }
      else if (entry[1] instanceof Object) {
          entry[1] = JSON.stringify(entry[1])
          formData.append(entry[0], entry[1]);
      }
      else{
          formData.append(entry[0], entry[1]);
      }
    });
    console.log('object: ', object);
    console.log('image: ', image);
    console.log('photo: ', photo);
    formData.append('photo', image);
    console.log('===================formData: for IS=======================');
    // console.log('formData: ', formData.entries());
    for(var pair of formData.entries()) {
      console.log('formData: ', pair);
    }
    console.log('obj.is_id: ', object.is_id)
    if (object.is_id != undefined){
      const updateDB = async () => {
        console.log('editis-props = ', props);
        await axios
        .post(BASE_URL + 'updateIS', formData)
        .then((response) => {
          console.log('successful post: ', response);
          const gr_array_index = editingISContext.editingIS.gr_array.findIndex((elt) => elt.id === editingISContext.editingIS.id)
          const new_gr_array = [...editingISContext.editingIS.gr_array];
          new_gr_array[gr_array_index] = object;
          editingISContext.setEditingIS({
            ...editingISContext.editingIS,
            gr_array: new_gr_array,
            editing: false
          })
        })
        .catch((err) => {
          if(err.response) {
            console.log(err.response);
          }
          console.log('unsuccessful post: ', err)
        });
  
        await axios
        .get(BASE_URL + "instructionsSteps/" + props.routineID.at_id)
        .then((response) =>{
          console.log('here-test 3');
         const temp = []
            for(var i=0; i <response.data.result.length; i++){
                  temp.push(response.data.result[i]);
              }
              props.setGetStepsEndPoint(temp);
          })
          .catch((error) => {
              console.log(error);
          });
      };
    
      updateDB();
    }else{
      console.log("add IS")
      const addToDB = async () => {
        await axios
        .post(BASE_URL + 'addIS', formData)
        .then((response) => {
          console.log(response);
          const gr_array_index = editingISContext.editingIS.gr_array.findIndex((elt) => elt.id === editingISContext.editingIS.id)
          const new_gr_array = [...editingISContext.editingIS.gr_array];
          new_gr_array[gr_array_index] = object;
          editingISContext.setEditingIS({
            ...editingISContext.editingIS,
            gr_array: new_gr_array,
            editing: false
          })
        })
        .catch((err) => {
          if(err.response) {
            console.log(err.response);
          }
          console.log(err)
        });

        console.log('props.routineID = ', props.routineID);
        await axios
        .get(BASE_URL + "instructionsSteps/" + props.routineID.at_unique_id)
        .then((response) =>{
          console.log('here-test 4');
          const temp = []
            for(var i=0; i <response.data.result.length; i++){
              temp.push(response.data.result[i]);
            }
            props.setGetStepsEndPoint(temp);
          })
          .catch((error) => {
            console.log(error);
          });
      };
      addToDB();
    }
  }

  useEffect(() => console.log('showUploadImage: ', showUploadImage), [showUploadImage])

  const uploadImageModal = () => {
    return (
      <Modal
        show={showUploadImage}
        onHide={() => {
          setShowUploadImage(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>Upload Image</div>
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files[0]) {
                const image1 = e.target.files[0];
                setImage(image1);
              }
            }}
          />
          <Button
            variant="dark"
            onClick={() => {
              if (image === null) {
                alert('Please select an image to upload');
                return;
              }
              const salt = Math.floor(Math.random() * 9999999999);
              let image_name = image.name;
              image_name = image_name + salt.toString();
              setImageName(image_name);
              setImageURL(URL.createObjectURL(image));
              console.log('URL: ', URL.createObjectURL(image));
              editingISContext.setEditingIS({
                ...editingISContext.editingIS,
                newItem: {
                  ...editingISContext.editingIS.newItem,
                  photo: image,
                  photo_url: ''
                }
              });
            }}
          >
            Upload
          </Button>
          <img
            src={imageURL || 'http://via.placeholder.com/400x300'}
            alt="Uploaded images"
            height="300"
            width="400"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowUploadImage(false);
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setPhoto(imageURL);
              setShowUploadImage(false);
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div
      style={{
        marginLeft: '5rem',
        marginRight: '3rem',
        width: '50%',
        backgroundColor: '#67ABFC',
        color: '#ffffff'
      }}
    >
      {uploadImageModal()}
      <Container
      style={{padding:'2rem'}}
      >
        <Row>
          <Col md={4}>
            <div style={{display:'flex'}}>
                <div>
                <div style={{marginTop:'1rem',borderRadius:'15px', border:'0px', fontSize:'18px', height:'2rem', width:'2rem', backgroundColor:'#ffffff', color:'#000000', fontWeight:'bold', paddingLeft:'0.5rem'}}> 1 </div>
                </div>
                <div style={{marginLeft:'2rem'}}>
              <div style={{fontWeight:'bold'}}>Step Name </div>
              <input 
                style={{borderRadius:'10px', border:'0px', fontSize:'12px', height:'2rem', width:'15rem'}}
                placeholder="Name Step here"
                value={editingISContext.editingIS.newItem.is_title}
                onChange={(e) => {
                  editingISContext.setEditingIS({
                    ...editingISContext.editingIS,
                    newItem: {
                      ...editingISContext.editingIS.newItem,
                      is_title: e.target.value
                    }
                  })
                }}
              />
            </div>
            </div>
          </Col>

        </Row>
          
            <div style={{fontWeight:'bold', marginTop:'2rem'}} >Change Icon</div>
            <div style={{textAlign:'left', marginTop:'1rem'}}>
            <Row>
            <Col style={{fontSize:'14px', textDecoration:'underline'}}>
            <div
              style={{ marginLeft:'1rem', marginBottom:'8px'}}
              onClick = {() => setShowUploadImage(!showUploadImage)}
            >
              Add icon to library
            </div>
              <AddIconModal
              photoUrl = {photo}
              setPhotoUrl = {setPhoto}
            //  BASE_URL={props.BASE_URL}
            //  parentFunction={setPhotoURLFunction}
            />
              {/* <div>Use icon from library</div> */}
              {/* <div>User's library</div> */}
              <UploadImage
            //  BASE_URL={props.BASE_URL}
            //  parentFunction={setPhotoURLFunction}
            photoUrl = {photo}
            setPhotoUrl = {setPhoto}
              currentUserId={ props.CurrentId}
            />
              </Col>
              <Col style={{width: '66%'}}>
                <img alt='icon'src={photo}      height="100"
            width="100"/>
              </Col>
            </Row>
            </div>
          
            <div style={{ display:'flex', width: '100%'}}>
            <div>
            <div  style={{fontWeight:'bold', display:'flex'}}>This Takes Me</div>
              <input
                style={{borderRadius:'10px', border:'0px', fontSize:'12px', height:'2rem', width:'10rem'}}
                type='number'
                value={editingISContext.editingIS.newItem.numMins}
                onChange={(e) => {
                  if (e.target.value < 0)
                    return;
                  editingISContext.setEditingIS({
                    ...editingISContext.editingIS,
                    newItem: {
                      ...editingISContext.editingIS.newItem,
                      numMins: e.target.value
                    }
                  })
                }}
              />
            </div>
            <div style={{marginTop:'1.5rem', marginLeft:'1rem',}}> Minutes </div>
            </div>
            
            <div style={{display:'flex', marginTop:'1rem'}}>
            <div style={{fontSize:'12px',}}> Available to User </div>
            {editingISContext.editingIS.newItem.is_available ==
                  'True' ? (
                    <input
                      type="checkbox"
                      style={{ width: '20px', height: '20px' }}
                      defaultChecked="true"
                      onChange={(e) => {
                        editingISContext.setEditingIS({
                          ...editingISContext.editingIS,
                          newItem: {
                            ...editingISContext.editingIS.newItem,
                            is_available: e.target.checked,
                          },
                        });
                      }}
                    />
                  ) : (
                    <input
                      type="checkbox"
                      style={{ width: '20px', height: '20px' }}
                      onChange={(e) => {
                        editingISContext.setEditingIS({
                          ...editingISContext.editingIS,
                          newItem: {
                            ...editingISContext.editingIS.newItem,
                            is_available: e.target.checked,
                          },
                        });
                      }}
                    />
                  )}
            </div>
          
        
        <Row>
          <Col md={12}>
            <div
              style={{
                textAlign: 'center',
                marginTop:'3rem'
              }}
            >
              <button
                style={{
                  width: '100px',
                  padding: '0',
                  margin: '0 20px',
                  backgroundColor: 'inherit',
                  border: '3px white solid',
                  color: '#ffffff',
                  textAlign: 'center',
                }}

                onClick={()=>{
                  editingISContext.setEditingIS({
                    ...editingISContext.editingIS,
                    editing: false
                  })
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  width: '100px',
                  padding: '0',
                  margin: '0 20px',
                  backgroundColor: 'inherit',
                  border: '3px white solid',
                  color: '#ffffff',
                  textAlign: 'center',
                }}
                onClick={updateIS}
              >
                Save
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default EditIS;
