// Mapa.tsx
import React, { useEffect, useState, useCallback } from 'react';


const MapComponent = React.lazy(() => import('./MapComponent'));

interface BaseDado {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
  dia_sem_chuva?: string;
  precipitacao?: number;
  frp?: number;
  tipo: 'risco' | 'foco' | 'area_queimada';
}

interface Filtros {
  tipo: string;
  estado: string;
  bioma: string;
  inicio: string;
  fim: string;
  agrupamento: 'estado' | 'bioma';
}

interface MapaProps {
  tipo: string;
  filtros: Filtros;
}

const Mapa: React.FC<MapaProps> = ({ tipo, filtros }) => {
  const [dados, setDados] = useState<BaseDado[]>([]);

  const montarQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.bioma) params.append('bioma', filtros.bioma);
    if (filtros.inicio) params.append('inicio', filtros.inicio);
    if (filtros.fim) params.append('fim', filtros.fim);
    return params.toString();
  }, [filtros]);

  useEffect(() => {
    const fetchData = async () => {
      const query = montarQueryParams();
      const url =
        tipo === 'risco' ? `/api/risco?${query}` :
        tipo === 'foco_calor' ? `/api/foco_calor?${query}` :
        tipo === 'area_queimada' ? `/api/area_queimada?${query}` : '';

      try {
        const res = await fetch(`http://localhost:3000${url}`);
        const rawData = await res.json();

        if (Array.isArray(rawData)) {
          setDados(
            rawData.map((item: BaseDado) => ({
              latitude: item.latitude,
              longitude: item.longitude,
              estado: item.estado,
              bioma: item.bioma,
              risco_fogo: item.risco_fogo,
              data: item.data,
              dia_sem_chuva: item.dia_sem_chuva,
              precipitacao: item.precipitacao,
              frp: item.frp,
              tipo: tipo as 'risco' | 'foco' | 'area_queimada'
            }))
          );
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [tipo, filtros, montarQueryParams]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <React.Suspense fallback={<div style={{ padding: '2rem' }}>Carregando Mapa...</div>}>
        <MapComponent dados={dados} agrupamento={filtros.agrupamento} />
      </React.Suspense>
    </div>
  );
};

export default Mapa;
