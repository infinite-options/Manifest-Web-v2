import React, { useContext, useState, useEffect } from 'react';
import DisplayProduce from './ProduceProductSelection/displayProduct';
import CheckoutPage from '../CheckoutPage/CheckoutStorePage';
import StoreFilter from '../FilterProductSelection';
import Footer from '../Footer/Footer';
import {
  Box,
  Badge,
  Grid,

  Hidden,
  IconButton,
  Drawer,
} from '@material-ui/core';
import ProdSelectContext from './ProdSelectContext';
import storeContext from '../Store/storeContext';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import OrderConfirmation from '../PurchaseComplete/OrderConfirmation';
import AdminLogin from '../LogIn/AdminLogin';
import { AuthContext } from 'auth/AuthContext';
import Signup from '../SignUp/Signup';

const ProductSelectionPage = (props) => {
  const store = useContext(storeContext);
  const auth = useContext(AuthContext);

  const { checkingOut, setCheckingOut } = useContext(storeContext);

  const [loggingIn, setLoggingIn] = React.useState(false);
  const [signingUp, setSigningUp] = React.useState(false);
  const [itemError, setHasError] = useState(false);
  const [itemIsLoading, setIsLoading] = useState(false);

  const [farms, setFarms] = useState(props.farms);
  useEffect(() => {
    setFarms(props.farms);
  }, [props.farms]);

  const [busIsLoad, setBusLoading] = useState(false);
  const [busError, setBusError] = useState(false);
  // this state will notify if one of the farm is clicked or not
  const [farmsClicked, setFarmsClicked] = useState(store.farmsClicked);

  useEffect(() => {
    setFarmsClicked(store.farmsClicked);
  }, [store.farmsClicked]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [!store.isCheckoutLogin, !store.isCheckoutSignUp]);
  // this state will notify if one of the days is clicked or not
  const [categoriesClicked, setCategoriesClicked] = useState(new Set());

  const itemsAmount = store.cartTotal;

  return (
    <Box>
      <ProdSelectContext.Provider
        value={{
          loggingIn,
          setLoggingIn,
          signingUp,
          setSigningUp,
          itemError, setHasError,
          itemIsLoading, setIsLoading,
          farms,
          busIsLoad, setBusLoading,
          busError, setBusError,
          farmsClicked,
          setFarmsClicked,
          categoriesClicked,
          setCategoriesClicked,
        }}
      >
        <Box>
          <Grid container>
            <Grid
              item
              xs={12}
              lg={8}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <StoreFilter />
              <Box hidden={store.orderConfirmation}>
                <DisplayProduce />
              </Box>

              <Box hidden={!store.orderConfirmation}>
                <OrderConfirmation />
              </Box>
            </Grid>

            <Hidden mdDown>
              <Grid item lg={4}>
                <CheckoutPage />
              </Grid>
            </Hidden>
          </Grid>

          <Hidden lgUp>
            <Drawer variant="temporary" anchor="bottom" open={checkingOut}>
              <Box
                mt={2}
                pr={1}
                style={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <IconButton onClick={() => setCheckingOut(false)}>
                  <Badge badgeContent={itemsAmount} color="primary">
                    <ShoppingCartIcon
                      fontSize="large"
                      aria-hidden="false"
                      aria-label="Shopping cart"
                    />
                  </Badge>
                </IconButton>
              </Box>

              <CheckoutPage />
            </Drawer>
          </Hidden>
        </Box>

        <Box
          position="absolute"
          left="60%"
          top="15%"
          hidden={!store.isCheckoutLogin || auth.isAuth}
        >
          <AdminLogin />
        </Box>

        <Box
          position="absolute"
          left="60%"
          top="15%"
          hidden={!store.isCheckoutSignUp || auth.isAuth}
        >
          <Signup />
        </Box>
        <Footer />
      </ProdSelectContext.Provider>
    </Box>
  );
};

export default ProductSelectionPage;
