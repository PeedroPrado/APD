// App.tsx

import React, { useState, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Abas from './components/Abas';
import FiltroMapa from './components/FiltroMapa';
import FiltroGrafico from './components/FiltroGrafico';
import MapaVazio from './components/MapaVazio';
import Grafico from './components/Grafico';
import styled from 'styled-components';

// Lazy loading do Mapa
const Mapa = React.lazy(() => import('./components/Mapa'));

interface Filtros {
  tipo: string;
  estado: string;
  bioma: string;
  inicio: string;
  fim: string;
  agrupamento: 'estado' | 'bioma';
}

const App: React.FC = () => {
  const [ativo, setAtivo] = useState('mapa');
  const location = useLocation();

  const handleClick = (tipo: string) => {
    setAtivo(tipo);
  };

  const [filtros, setFiltros] = useState<Filtros>({
    tipo: 'Focos',
    estado: '',
    bioma: '',
    inicio: '',
    fim: '',
    agrupamento: 'estado',
  });

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Sidebar>
          <Abas onClick={handleClick} ativo={ativo} />
          {ativo === 'mapa' ? (
            <FiltroMapa onFiltrar={setFiltros} />
          ) : (
            <FiltroGrafico
              onFiltrar={(f) =>
                setFiltros((prev) => ({
                  ...prev,
                  tipo: f.tipo,
                  agrupamento: f.agrupamento,
                  inicio: f.inicio,
                  fim: f.fim,
                }))
              }
            />
          )}
        </Sidebar>

        <MapArea>
          <Suspense fallback={<div style={{ padding: '2rem' }}>Carregando o mapa...</div>}>
            {ativo === 'mapa' ? (
              location.pathname === '/risco' ? (
                <Mapa tipo="risco" filtros={filtros} />
              ) : location.pathname === '/foco_calor' ? (
                <Mapa tipo="foco_calor" filtros={filtros} />
              ) : location.pathname === '/area_queimada' ? (
                <Mapa tipo="area_queimada" filtros={filtros} />
              ) : (
                <MapaVazio />
              )
            ) : (
              <Grafico filtros={filtros} />
            )}
          </Suspense>
        </MapArea>
      </MainContent>
    </AppContainer>
  );
};

export default App;

// Estilos
const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

const MainContent = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  overflow: auto;
  background-color: #f5f5f5;
`;

const MapArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
`;
