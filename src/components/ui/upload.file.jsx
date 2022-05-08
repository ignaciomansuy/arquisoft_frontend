import React from 'react';


export default function UploadFile(props) {  
  const identifier = `foto_${props.id}`;
  return (
    <div>
      <input
        type="file"
        id={identifier}
        name={identifier}
        className="fotos_file"
        onChange={(event) => {
          props.setFieldValue(`${identifier}`, "gud");
        }}
        accept=".jpg,.jpeg,.png,.jfif"
      />
    </div>
  );
}
