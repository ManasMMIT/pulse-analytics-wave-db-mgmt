import { transparentize } from 'polished'

import { Colors, Spacing } from 'frontend/utils/pulseStyles'

export const customTableSelectStyles = {
  menu: (provided) => ({
    ...provided,
    zIndex: 3,
  }),
  control: (provided) => ({
    ...provided,
    borderRadius: 4,
    border: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
    minHeight: 20,
  }),
  multiValueContainer: (provided) => ({
    padding: 0,
  }),
  multiValue: (provided) => ({
    ...provided,
    background: transparentize(0.9, Colors.BLACK),
    borderRadius: 4,
    lineHeight: '12px',
    display: 'flex',
    marginRight: Spacing.SMALL,
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontSize: 10,
    color: Colors.BLACK,
    marginLeft: Spacing.TINY,
    padding: Spacing.TINY,
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: transparentize(0.7, Colors.BLACK),
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 10,
    lineHeight: 1,
    color: transparentize(0.7, Colors.BLACK),
    padding: '0 !important',
  }),
  input: (provided) => ({
    fontSize: 10,
    lineHeight: 1,
  }),
  menuList: (provided) => ({
    ...provided,
    fontSize: 12,
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: 12,
    color: Colors.BLACK,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    padding: '4px 0',
    margin: '0 !important',
    display: 'none',
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: '0 !important',
  }),
}
