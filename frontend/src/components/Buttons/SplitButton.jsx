import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

function SplitButton() {
  return (
    <Dropdown as={ButtonGroup}>
      <Button variant="success">Select</Button>

      <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">1 month</Dropdown.Item>
        <Dropdown.Item href="#/action-2">2 months</Dropdown.Item>
        <Dropdown.Item href="#/action-3">3 months</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SplitButton;