import React from "react";

const Child = React.memo(({ item, onDelete }) => {

  console.log("Rendering:", item.name);

  return (
      <li>
        {item.name}
        <button
          onClick={() => {
            onDelete(item.id);
          }}
        >
          Delete
        </button>
      </li>
  );
});

export default Child;
