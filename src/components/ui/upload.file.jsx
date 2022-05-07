import React from 'react';
import Button from '@mui/material/Button';

export default function UploadFile(props) {
  const identifier = `foto_${props.id}`;
  return (
    <div>
      <Button variant="contained" component="label" color="primary">
        {`Elige tu foto ${props.id}`}
        <input
          type="image"
          id={identifier}
          name={identifier}
          onChange={(event) => {
            props.setFieldValue(`files.${identifier}`, event.currentTarget.files[0]);
          }}
          hidden
        />
      </Button>
    </div>
  );
}
