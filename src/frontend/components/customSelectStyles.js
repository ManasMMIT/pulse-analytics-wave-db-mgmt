import { transparentize } from 'polished'

import { Colors, Spacing } from '../utils/pulseStyles'

export const customSelectStyles = {
  menu: (provided) => ({
    ...provided,
    zIndex: 3,
  }),
  control: (provided,) => ({
    ...provided,
    borderRadius: 4,
    border: `1px solid ${transparentize(0.9, Colors.BLACK)}`,
  }),
  multiValue: (provided) => ({
    ...provided,
    background: transparentize(0.9, Colors.BLACK),
    borderRadius: 4,
    lineHeight: '12px',
    display: 'flex',
    marginRight: Spacing.SMALL
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontSize: 12,
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
    fontSize: 12,
    color: transparentize(0.7, Colors.BLACK),
  }),
  menuList: (provided) => ({
    ...provided,
    fontSize: 12,
  }),
  input: (provided) => ({
    ...provided,
    fontSize: 12,
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: 12,
  }),
}
