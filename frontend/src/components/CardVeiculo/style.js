import styled from 'styled-components';

export const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

export const Titulo = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
`;

export const Categoria = styled.p`
  margin: 4px 0;
  color: #666;
`;

export const Preco = styled.p`
  font-weight: bold;
  color: #2196F3;
  margin-top: 8px;
`;