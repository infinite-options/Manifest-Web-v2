// import "bootstrap/dist/css/bootstrap.min.css";
import React from 'react';
import classes from './Ambasadormodal.module.css';
import Card from 'react-bootstrap/Card';
import cross from '../../icon/cross.svg';
import Draggable from 'react-draggable';

const LoginAmbasador = (props) => {

  return (
    <>
        <Draggable>
         <Card className={classes.modal} style={{border:'1px solid #E1E7E7', borderRadius: '10px' ,marginBottom:'20px',height:'580px',width:'400px'}}>
        <div>
          <img
            src={cross}
            alt = {''}
            onClick={props.close}
            style={{
              float: 'right',
              height: '30px',
              width: '30px',
              color: 'black',
              marginTop: '10px',
              marginRight: '10px',
            }}
          ></img>
        </div>
        <div>
          <h2 style={{ fontWeight: 'bold',marginRight:'auto',marginLeft:'auto',marginBottom:'0px',marginTop:'70px' ,fontSize:'22px'}}>Love Serving Fresh?</h2>
        </div>
        <div>
          <h2 style={{ fontWeight: 'bold',marginRight:'auto',marginLeft:'auto',marginBottom:'25px' ,fontSize:'24px',color:'#136D74',textDecoration:'underline'}}>Become an Ambassador</h2>
        </div>
        <div style={{ width: '300px',marginRight:'auto',marginLeft:'auto' ,marginBottom:'20px',fontSize:'20px'}}>
       <p style={{marginBottom:'35px'}}>Give 20, Get 20</p>
       <p>Refer a friend and both you and your friend get $10 off on your next two orders.</p>  
        </div>
        
        
        <div>
        <button
            onClick={props.showLogin}
            style={{
              width: '300px',
              marginTop:'20px',
            //   marginBottom: '20px',
              height: '60px',
              borderRadius: '15px',
              backgroundColor: '#FF8500',
              color: 'white',
              border:' 1px solid #E1E7E7',
              fontSize:'20px',
              fontWeight:'bolder'
            }}
          >
            Login
          </button>
          <p style={{fontSize:'20px',fontWeight:'bold'}}>OR</p>
          <button
            onClick={props.showSignup}
            style={{
              width: '300px',
              marginTop:'0px',
            //   marginBottom: '20px',
              height: '60px',
              borderRadius: '15px',
              backgroundColor: '#FF8500',
              color: 'white',
              border:' 1px solid #E1E7E7',
              fontSize:'20px',
              fontWeight:'bolder',
              
            }}
          >
            Sign Up
          </button>
        </div>
      </Card>
      </Draggable>
      
          
        
       
       
       
      
       
       
       </>
  );
};

export default LoginAmbasador;
