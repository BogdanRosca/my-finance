import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

function SplitButton({ selectedValue = 'Select', options = [1, 2, 3], onChange }) {
  const handleSelect = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Dropdown as={ButtonGroup}>
      <Button variant="success">{selectedValue}</Button>

      <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

      <Dropdown.Menu>
        {options.map((option) => (
          <Dropdown.Item 
            key={option} 
            onClick={() => handleSelect(option)}
          >
            {option} month{option !== 1 ? 's' : ''}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SplitButton;