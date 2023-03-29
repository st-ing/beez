import {
  CDataTable
} from "@coreui/react";
import React from "react";
import {Spinner} from "react-bootstrap";
import styled from "styled-components";
const RegularTable = styled.div`
.table > tbody {
  text-align: left !important;
}
.table-responsive{
  height: 100%;
}
.table > tbody > tr {
  background: #f9f9fc;
  border: 3px solid #fff !important;
}
.table > tbody > tr > td {
  padding-left: 8px;
}
.table > thead > tr {
  background: #f0f0f8 !important;
  border: 3px solid #fff !important;
}
.table > thead > .table-sm {
  background: #f0f0f8 !important;
  border-bottom: 6px solid #fff !important;
}
.table > tbody > tr > td:first-child,
.table > tbody > tr > th:first-child {
  border-radius: 10px 0 0 10px !important;
}
.table > tbody > tr > td:last-child,
.table > tbody > tr > th:last-child {
 border-radius: 0 10px 10px 0 !important;
}
`;
const DetailedTable = styled.div`
height: 100%;
background: #f8f8fb;
padding: 1rem;
border-radius: 6px;
.table-responsive{
  height: 100%;
}
.table > tbody {
text-align: left !important;
}
.table > thead {
text-align: left !important;
}
.table > tbody > tr {
  background: #fff !important;
  border: 3px solid #f8f8fb !important;
}
.table > thead > tr {
  background: #f8f8fb !important;
  border: 3px solid #f8f8fb !important;
}
.table > thead > .table-sm {
  background: #f8f8fb !important;
}
.table > tbody > tr > td:first-child,
.table > tbody > tr > th:first-child {
  border-radius: 10px 0 0 10px !important;
}
.table > tbody > tr > td:last-child,
.table > tbody > tr > th:last-child {
 border-radius: 0 10px 10px 0 !important;
}
`;

const BeezDataTable = ({items, fields, scopedSlots,fetched,className}) => {
  return (
    <>
      {fetched?
        (
          <RegularTable>
            <CDataTable
              className={className}
              items={items}
              fields={fields}
              hover
              sorter
              columnFilter
              striped
              size='sm'
              bordered
              scopedSlots={scopedSlots}
            />
          </RegularTable>
        ):
        (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="warning" />
          </div>
        )
      }
    </>
  );
}
export default BeezDataTable;

export const DetailedDataTable = ({items, fields, scopedSlots,fetched,className}) => {
  return (
    <>
      {fetched?
        (
          <DetailedTable>
            <CDataTable
              style={{height:'100px'}}
              className={className}
              items={items}
              fields={fields}
              hover
              sorter
              columnFilter
              striped
              size='sm'
              bordered
              scopedSlots={scopedSlots}
            />
          </DetailedTable>
        ):
        (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="warning" />
          </div>
        )
      }
    </>
  );
}
