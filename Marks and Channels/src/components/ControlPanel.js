import React from 'react';
import Select from 'react-select';

const ControlPanel = ({
  quantitativeOptions,
  nominalOptions,
  ordinalOptions,
  selectedX,
  selectedY,
  selectedColor,
  selectedOpacity,
  selectedSize,
  handleXChange,
  handleYChange,
  handleColorChange,
  handleOpacityChange,
  handleSizeChange
}) => {
  const quantitativeSelectOptions = quantitativeOptions.map(opt => ({ value: opt, label: opt }));
  const nominalSelectOptions = nominalOptions.map(opt => ({ value: opt, label: opt }));
  const ordinalSelectOptions = ordinalOptions.map(opt => ({ value: opt, label: opt }));
  const noneOption = [{ value: 'none', label: 'None' }];

  const selectStyle = {
    control: (base) => ({
      ...base,
      minWidth: '200px', // Adjust this value to increase the width of the dropdown
    }),
    menuPortal: base => ({
      ...base,
      zIndex: 9999 
    })
  };

  return (
    <div className="control-panel" style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
      <div className="select-group" style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px' }}>X:</label>
        <Select
          value={selectedX}
          onChange={handleXChange}
          options={quantitativeSelectOptions}
          styles={selectStyle}
          menuPortalTarget={document.body}
          placeholder="Select X Attribute"
        />
      </div>

      <div className="select-group" style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px' }}>Y:</label>
        <Select
          value={selectedY}
          onChange={handleYChange}
          options={quantitativeSelectOptions}
          styles={selectStyle}
          menuPortalTarget={document.body}
          placeholder="Select Y Attribute"
        />
      </div>

      <div className="select-group" style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px' }}>Color:</label>
        <Select
          value={selectedColor}
          onChange={handleColorChange}
          options={[...noneOption, ...nominalSelectOptions, ...ordinalSelectOptions]}
          styles={selectStyle}
          menuPortalTarget={document.body}
          placeholder="Select Color Attribute"
        />
      </div>

      <div className="select-group" style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px' }}>Opacity:</label>
        <Select
          value={selectedOpacity}
          onChange={handleOpacityChange}
          options={[...noneOption, ...quantitativeSelectOptions]}
          styles={selectStyle}
          menuPortalTarget={document.body}
          placeholder="Select Opacity Attribute"
        />
      </div>

      <div className="select-group" style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '10px' }}>Size:</label>
        <Select
          value={selectedSize}
          onChange={handleSizeChange}
          options={[...noneOption, ...quantitativeSelectOptions]}
          styles={selectStyle}
          menuPortalTarget={document.body}
          placeholder="Select Size Attribute"
        />
      </div>
    </div>
  );
};

export default ControlPanel;
