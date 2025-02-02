import React from 'react';
import { Card, Titulo, Categoria, Preco } from './style';

function CardVeiculo({ veiculo }) {
  return (
    <Card>
      <Titulo>{veiculo.nome}</Titulo>
      <Categoria>Categoria: {veiculo.categoria}</Categoria>
      <Preco>R$ {veiculo.preco}/dia</Preco>
    </Card>
  );
}

export default CardVeiculo;