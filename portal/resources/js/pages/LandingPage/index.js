import React from "react";
import { NavigationBar } from "../../components/NavigationBar";
import { Banner } from "../../components/Banner";
import { Concept } from "../../components/Concept";
import { Functionality } from "../../components/Functionality"
import { Technology } from "../../components/Technology"
import { Contact } from "../../components/Contact"
import './landingPage.css';
const LandingPage = () => {
  return (
    <React.Fragment>
      <NavigationBar/>
      <Banner/>
      <Concept/>
      <Functionality/>
      <Technology/>
      <Contact/>
    </React.Fragment>
  )
}
export default LandingPage;
