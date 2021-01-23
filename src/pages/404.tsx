import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  height: 100vh;
`;

const Notfound = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 520px;
  width: 100%;
  line-height: 1.4;
  text-align: center;
`;

const NotfoundTop = styled.div`
  position: relative;
  height: 240px;
`;

const NotfoundTopTitle = styled.h3`
  font-family: 'Cabin', sans-serif;
  position: relative;
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  color: #262626;
  margin: 0px;
  letter-spacing: 3px;
  padding-left: 6px;
`;

const NotfoundTop404 = styled.h1`
  font-family: 'Montserrat', sans-serif;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 252px;
  font-weight: 900;
  margin: 0px;
  color: #262626;
  text-transform: uppercase;
  letter-spacing: -40px;
  margin-left: -20px;
`;

const NotfoundTop404Num = styled.span`
  text-shadow: -8px 0px 0px #fff;
`;

const NotfoundDesc = styled.h2`
  font-family: 'Cabin', sans-serif;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  color: #000;
  margin-top: 0px;
  margin-bottom: 25px;
`;

export const NotFound: React.FC = () => (
  <Wrapper className="h-screen flex-col items-center justify-center">
    <Helmet>
      <title>Not Found | CEN Portal</title>
    </Helmet>

    <Notfound>
      <NotfoundTop>
        <NotfoundTopTitle>Oops! Page not found</NotfoundTopTitle>
        <NotfoundTop404>
          <NotfoundTop404Num>4</NotfoundTop404Num>
          <NotfoundTop404Num>0</NotfoundTop404Num>
          <NotfoundTop404Num>4</NotfoundTop404Num>
        </NotfoundTop404>
      </NotfoundTop>
      <NotfoundDesc>
        we are sorry, but the page you requested was not found
      </NotfoundDesc>
      <Link to="/">{`Go back home`}</Link>
    </Notfound>
  </Wrapper>
);
