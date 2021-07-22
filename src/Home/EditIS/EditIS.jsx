import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EditISContext from './EditISContext';
import axios from 'axios';

const EditIS = () => {
  const editingISContext = useContext(EditISContext);

  const updateIS = (e) => {
    e.stopPropagation()
    let object = {...editingISContext.editingIS.newItem}
    object.start_day_and_time = `${object.start_day} ${object.start_time}:00`;
    delete object.start_day;
    delete object.start_time;
    object.end_day_and_time = `${object.end_day} ${object.end_time}:00`;
    delete object.end_day;
    delete object.end_time;
    const numHours = object.numMins / 60;
    let numMins = object.numMins % 60;
    if(numMins < 10)
      numMins = '0' + numMins
    object.expected_completion_time = `${numHours}:${numMins}:00`;
    delete object.numMins;
    object.id = editingISContext.editingIS.id;
    object.user_id = editingISContext.editingIS.user_id;
    object.ta_people_id = '';
    console.log(object);
    let formData = new FormData();
    Object.entries(object).forEach(entry => {
      if (typeof entry[1].name == 'string'){
      
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
   
    axios
    .post('https://3s3sftsr90.execute-api.us-west-1.amazonaws.com/dev/api/v2/updateAT', formData)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      if(err.response) {
        console.log(err.response);
      }
      console.log(err)
    })
  }

  return (
    <div
      style={{
        marginTop: '1rem',
        marginLeft: '5rem',
        marginRight: '3rem',

        backgroundColor: '#67ABFC',
        color: '#ffffff'
      }}
    >
      <Container
        style={{
          padding: '2rem',
        }}
      >
        <Row>
          <Col md={4}>
            <div style={{display:'flex'}}>
                <div>
                <div style={{marginTop:'1rem',borderRadius:'15px', border:'0px', fontSize:'12px', height:'2rem', width:'2rem', backgroundColor:'#ffffff'}}></div>
                </div>
                <div style={{marginLeft:'2rem'}}>
              <div style={{fontWeight:'bold'}}>Step Name </div>
              <input 
                style={{borderRadius:'10px', border:'0px', fontSize:'12px', height:'2rem', width:'15rem'}}
                placeholder="Name Step here"
                value={editingISContext.editingIS.newItem.title}
                onChange={(e) => {
                  editingISContext.setEditingIS({
                    ...editingISContext.editingIS,
                    newItem: {
                      ...editingISContext.editingIS.newItem,
                      title: e.target.value
                    }
                  })
                }}
              />
            </div>
            </div>
          </Col>

        </Row>
        <Row style={{marginTop:'3rem'}}>
          <Col md={5}>
            <div style={{fontWeight:'bold'}} >Change Icon</div>
            <Container>
            <Row>
              <Col style={{fontSize:'10px', textDecoration:'underline'}}>
                <div>Add icon to library</div>
                <div>Use icon from library</div>
                <div>User's library</div>
              </Col>
              <Col>
                <img alt='icon' src='ac'/>
              </Col>
            </Row>
            </Container>
          </Col>
          <Col md={3}>
            <div style={{ display:'flex'}}>
            <div>
            <div  style={{fontWeight:'bold', display:'flex'}}>This Takes Me</div>
              <input
                style={{borderRadius:'10px', border:'0px', fontSize:'12px', height:'2rem', width:'10rem'}}
                type='number'
                value={editingISContext.editingIS.newItem.numMins}
                onChange={(e) => {
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
            <div style={{marginTop:'1.5rem', marginLeft:'1rem'}}> Minutes </div>
            </div>

            <div style={{display:'flex', marginTop:'1rem'}}>
            <div style={{fontSize:'12px'}}> Available to User </div>
            <input
              style={{ marginLeft:'1rem'}}
              type='checkbox'
              checked={editingISContext.editingIS.newItem.is_available}
              onChange={(e) => {
                editingISContext.setEditingIS({
                  ...editingISContext.editingIS,
                  newItem: {
                    ...editingISContext.editingIS.newItem,
                    is_available: e.target.checked
                  }
                })
              }}
            />
            </div>
          </Col>
        </Row>
        
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
