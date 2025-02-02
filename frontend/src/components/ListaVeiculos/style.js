import styled from 'styled-components';

export const ListaContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

export const FiltroContainer = styled.div`
  margin-bottom: 20px;
`;

export const SelectFiltro = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;
