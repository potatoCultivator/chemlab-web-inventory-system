import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons'; // Import the add icon from Ant Design

const CustomButton = ({ variant, color, onClick, children, type }) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      startIcon={type === 'add' ? <PlusOutlined /> : null}
    >
      {children}
    </Button>
  );
};

CustomButton.propTypes = {
  variant: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
};

CustomButton.defaultProps = {
  variant: 'contained',
  color: 'primary',
  onClick: () => {},
  type: 'default',
};

export default CustomButton;