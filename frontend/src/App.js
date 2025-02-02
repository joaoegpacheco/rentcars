import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListaVeiculos from './components/ListaVeiculos';

function App() {
  const [veiculos, setVeiculos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    buscarVeiculos();
  }, []);

  const buscarVeiculos = async () => {
    try {
      const resposta = await axios.get('http://localhost:3001/pesquisa');
      setVeiculos(resposta.data);
      setCarregando(false);
    } catch (error) {
      setErro('Erro ao carregar os veículos disponíveis');
      setCarregando(false);
    }
  };

  return (
    <div className="container">
      <h1>Locadora de Veículos</h1>
      
      {carregando ? (
        <div className="loading">Carregando...</div>
      ) : erro ? (
        <div className="erro">{erro}</div>
      ) : (
        <ListaVeiculos veiculos={veiculos} />
      )}
    </div>
  );
}

export default App;