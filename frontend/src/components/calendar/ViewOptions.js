import React from "react";
import { Dropdown} from "react-bootstrap"

const ViewOptions = ({ onViewChange }) => {
  return (
    <Dropdown>
    <Dropdown.Toggle variant="light button-top" id="dropdown-views">
      View
    </Dropdown.Toggle>
    <Dropdown.Menu>
      <Dropdown.Item onClick={() => onViewChange("month")}>Month</Dropdown.Item>
      <Dropdown.Item onClick={() => onViewChange("week")}>Week</Dropdown.Item>
      <Dropdown.Item onClick={() => onViewChange("day")}>Day</Dropdown.Item>
      <Dropdown.Item onClick={() => onViewChange("agenda")}>Agenda</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
  );
};

export default ViewOptions;
