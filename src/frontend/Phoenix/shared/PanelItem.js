import React from 'react'
import PropTypes from 'prop-types'

import DeleteButton from './DeleteButton'
import EditButton from './EditButton'

// import { SELECT_CLIENT } from '../../api/mutations'
// import { Mutation } from 'react-apollo';
// import { GET_SELECTED_CLIENT } from '../../api/queries';

const defaultStyle = {
  display: 'flex',
  justifyContent: 'space-between',
}

const PanelItem = ({
  item,
  text,
  style,
  editForm,
  handleSelect,
  // handlers: {
  //   editHandler,
  //   deleteHandler,
  //   onClick,
  // },
  // isSelected,
}) => {
  return (
    <div
      style={{ ...defaultStyle, ...style }}
      // style={{ ...defaultStyle, ...finalStyle }}
      onClick={() => handleSelect({ variables: { id: item.id } })}
    >
      <span>{text}</span>

      {/* <span>
        {editHandler && (
          <EditButton>
            {editForm}
          </EditButton>
        )}

        <span>
          {deleteHandler && (
            <DeleteButton
              itemId={item.id}
              deleteHandler={deleteHandler}
            />
          )}
        </span>
      </span> */}
    </div>
  )

  // return (
  //   <Mutation
  //     mutation={SELECT_CLIENT}
  //     // update={(cache, { data: { selectedClient } }) => {
  //     //   debugger
  //     //   cache.writeQuery({
  //     //     query: GET_SELECTED_CLIENT,
  //     //     data: { selectedClient },
  //     //   });
  //     // }}
  //   >
  //     {(selectClient, { data }) => {
  //       let finalStyle = style
  //       if (data) {
  //         debugger
  //         const isSelected = item.id === data.selectedClient.id

  //         finalStyle = {
  //           cursor: isSelected ? 'default' : 'pointer',
  //           backgroundColor: isSelected ? '#1c4161' : null,
  //           padding: 24,
  //           color: isSelected ? '#ebf6fb' : '#7a97b1',
  //           borderLeft: isSelected ? '4px solid #0f66d0' : '4px solid transparent',
  //         }
  //       }


  //       return (
  //         <div
  //           style={style}
  //           // style={{ ...defaultStyle, ...finalStyle }}
  //           onClick={() => selectClient({ variables: { id: item.id }})}
  //         >
  //           <span>{text}</span>

  //           <span>
  //             {editHandler && (
  //               <EditButton>
  //                 {editForm}
  //               </EditButton>
  //             )}

  //             <span>
  //               {deleteHandler && (
  //                 <DeleteButton
  //                   itemId={item.id}
  //                   deleteHandler={deleteHandler}
  //                 />
  //               )}
  //             </span>
  //           </span>
  //         </div>
  //       )
  //     }}
  //   </Mutation>
  // );
}

PanelItem.propTypes = {
  onClick: PropTypes.func,
  item: PropTypes.object,
  text: PropTypes.string,
  style: PropTypes.object,
  // handlers: PropTypes.object,
  editForm: PropTypes.node,
}

// PanelItem.defaultProps = {
//   style: {
//     cursor: "pointer",
//     backgroundColor: "none",
//     padding: 24,
//     color: "#838c96",
//     borderLeft: "4px solid transparent",
//   }
// }

export default PanelItem
