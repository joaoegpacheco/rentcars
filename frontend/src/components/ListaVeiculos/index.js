import React, { useMemo, useState } from 'react';
import CardVeiculo from '../CardVeiculo';
import { FiltroContainer, SelectFiltro, ListaContainer } from './style';

function ListaVeiculos({ veiculos }) {
  const [categoriaFiltrada, setCategoriaFiltrada] = useState('');

  const veiculosFiltrados = useMemo(() => {
    if (!categoriaFiltrada) return veiculos;
    return veiculos.filter(v => v.categoria === categoriaFiltrada);
  }, [veiculos, categoriaFiltrada]);

  const categoriasUnicas = useMemo(() => {
    return [...new Set(veiculos.map(v => v.categoria))];
  }, [veiculos]);

  return (
    <>
      <FiltroContainer>
        <SelectFiltro
          value={categoriaFiltrada}
          onChange={(e) => setCategoriaFiltrada(e.target.value)}
        >
          <option value="">Todos os veículos</option>
          {categoriasUnicas.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </SelectFiltro>
      </FiltroContainer>

      <ListaContainer>
        {veiculosFiltrados.map(veiculo => (
          <CardVeiculo key={veiculo.id} veiculo={veiculo} />
        ))}
      </ListaContainer>
    </>
  );
}

export default ListaVeiculos;