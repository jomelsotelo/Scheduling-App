import React from "react";
import Button from "react-bootstrap/Button";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";

const NavigationControls = ({ onNavigate }) => {
  const handleClick = (action) => {
    console.log(`Clicked: ${action}`);
    onNavigate(action);
  };
  return (
      <>
      <Button variant="light button-bottom transparent-button" onClick={() => onNavigate("PREV")}>
        <ArrowLeft />
      </Button>
      <Button variant="light button-bottom transparent-button" onClick={() => onNavigate("NEXT")}>
        <ArrowRight />
      </Button>
    </>
  );
};

export default NavigationControls;
