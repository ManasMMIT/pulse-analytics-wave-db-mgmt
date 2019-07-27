import React from 'react'
import PropTypes from 'prop-types'

import { Mutation } from 'react-apollo';
import PanelItem from './PanelItem'

class Panel extends React.Component {
  // componentDidMount = () => {
  //   this.props.mutationDoc()
  // }

  render() {
    const { data, mutationDoc } = this.props

    return (
      <Mutation mutation={mutationDoc}>
        {(handleSelect, { data: selectedEntityData, called }) => {
          if (!called) handleSelect()

          return (
            <div>
              {
                data.map(entity => {
                  let style = {
                    cursor: "pointer",
                    backgroundColor: "none",
                    padding: 24,
                    color: "#838c96",
                    borderLeft: "4px solid transparent",
                  }

                  if (selectedEntityData) {
                    const isSelected = entity.id === selectedEntityData.selectedClient.id

                    style = {
                      cursor: isSelected ? 'default' : 'pointer',
                      backgroundColor: isSelected ? '#1c4161' : null,
                      padding: 24,
                      color: isSelected ? '#ebf6fb' : '#7a97b1',
                      borderLeft: isSelected ? '4px solid #0f66d0' : '4px solid transparent',
                    }
                  }

                  return (
                    <PanelItem
                      key={entity.id}
                      item={entity}
                      text={entity.description}
                      style={style}
                      handleSelect={handleSelect}
                    />
                  );
                })
              }
            </div>
          )
        }}
      </Mutation>
    )
  }
}

Panel.propTypes = {
  mutationDoc: PropTypes.object,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
}

export default Panel
