import React, { useState, useEffect } from 'react';
import { Deserializer } from 'jsonapi-serializer';
import config from '../config';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.info.dark,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function UbicationTags(props) {
  const { ubicationId } = props;
  const [tags, setTags] = useState([]);
  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    fetch(`${config.API_URL}/tag/show_tags/${ubicationId}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          return [];
        }
        return response.json();
      })
      .then((data) => {
        new Deserializer({ keyForAttribute: 'camelCase' }).deserialize(
          data,
          (_error, tags) => setTags(tags)
        );
      })
      .catch((err) => console.log(err));
  }, [setTags]);
  console.log(tags);

  return (
  <StyledTableCell align="right">
    {tags.map((tag) => (
      <span>    {tag.name}</span>
    ))}
  </StyledTableCell>
  );
}
