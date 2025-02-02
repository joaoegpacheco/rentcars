import React, { useMemo, useState } from 'react';
import CardVeiculo from '../CardVeiculo';
import { FiltroContainer, SelectFiltro, ListaContainer } from './style';

function ListaVeiculos({ veiculos }) {

  const [categoriaFiltrada, setCategoriaFiltrada] = useState('');
  const categoriasUnicas = useMemo(() => {
  return ['Todos os veículos', ...new Set(Object.keys(veiculos))];
  }, [veiculos]);


  const veiculosFiltrados = useMemo(() => {
      if (!categoriaFiltrada || categoriaFiltrada === 'Todos os veículos') {
      return Object.values(veiculos).flat();
      }
      return veiculos[categoriaFiltrada] || [];
  }, [veiculos, categoriaFiltrada]);

  return (
    <>
      <FiltroContainer>
        <SelectFiltro
          value={categoriaFiltrada}
          onChange={(e) => setCategoriaFiltrada(e.target.value)}
        >
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