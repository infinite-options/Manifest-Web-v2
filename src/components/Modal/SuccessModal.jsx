import React, { useContext } from 'react';
import classes from './ErrorModal.module.css';
import Card from 'react-bootstrap/Card';
import cross from '../../icon/cross.svg';
import { AuthContext } from '../../auth/AuthContext';

const SuccessModal = (props) => {
  const auth = useContext(AuthContext);

  return (
    <>
      <Card
        className={classes.modalSuccess}
        style={{
          borderRadius: '10px',
          marginBottom: '20px',
          height: '571px',
          width: '400px',
        }}
      >
        <div>
          <img
            src={cross}
            onClick={props.modalClear}
            alt = {''}
            style={{
              float: 'right',
              height: '25px',
              width: '25px',
              color: 'black',
              marginTop: '3px',
              marginRight: '3px',
            }}
          ></img>
        </div>
        <div>
          <h2
            style={{
              fontWeight: 'bold',
              fontSize: '40px',
              marginBottom: '50px',
              marginTop: '80px',
            }}
          >
            {props.title}
          </h2>
        </div>
        <div
          style={{
            width: '300px',
            marginLeft: 'auto',
            marginRight: 'auto',
            fontSize: '20px',
            marginBottom: '50px',
          }}
        >
          Looks like we deliver to your address. Click the button below to see
          the variety of fresh organic fruits and vegetables we offer.
        </div>
        <div>
          <button
            onClick={props.onConfirm}
            style={{
              width: '300px',
              marginTop: '20px',
              marginBottom: '25px',
              height: '60px',
              borderRadius: '15px',
              backgroundColor: '#FF8500',
              color: 'white',
              border: ' 1px solid #E1E7E7',
              fontSize: '20px',
            }}
          >
            Explore Local Produce
          </button>
        </div>
        <div hidden={auth.isAuth}>
          <button
          
            onClick={props.onSign}
            style={{
              width: '300px',
              marginBottom: '20px',
              height: '60px',
              borderRadius: '15px',
              backgroundColor: '#FF8500',
              border: ' 1px solid #E1E7E7',
              color: 'white',
              fontSize: '20px',
            }}
          >
            Sign Up
          </button>
          {/* <div hidden={!auth.isAuth}>
          <button
          
            onClick={props.onSign}
            style={{
              width: '300px',
              marginBottom: '20px',
              height: '60px',
              borderRadius: '15px',
              backgroundColor: '#FF8500',
              border: ' 1px solid #E1E7E7',
              color: 'white',
              fontSize: '20px',
            }}
          >
            Login
          </button>
          </div> */}
        </div>

        
      </Card>
    </>
  );
};

export default SuccessModal;
