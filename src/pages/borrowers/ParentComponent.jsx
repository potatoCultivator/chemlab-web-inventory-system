import React, { useState } from 'react';
import EditStatus from './EditStatus';

function ParentComponent() {
  const [status, setStatus] = useState({ goodQuantity: '', damagedQuantity: '' });

  const handleSave = (data) => {
    setStatus(data);
    console.log('Saved data:', data);
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <p>Good Quantity: {status.goodQuantity}</p>
      <p>Damaged Quantity: {status.damagedQuantity}</p>
      <EditStatus onSave={handleSave} goodQuantity={status.goodQuantity}/>
    </div>
  );
}

export default ParentComponent;