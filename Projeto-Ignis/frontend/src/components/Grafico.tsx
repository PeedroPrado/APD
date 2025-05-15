// Grafico.tsx seguro
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

interface Filtros {
  tipo: string;
  estado: string;
  bioma: string;
  inicio: string;
  fim: string;
}

interface Dado {
  data?: string;
  estado: string;
  risco_fogo?: number;
  frp?: number;
  area_queimada?: number;
}

interface Props {
  filtros?: Filtros;
}

const Grafico: React.FC<Props> = ({ filtros }) => {
  const [dados, setDados] = useState<Dado[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!filtros || !['risco', 'foco_calor', 'area_queimada'].includes(filtros.tipo)) {
      console.warn('Tipo inválido ou filtros indefinidos.');
      setCarregando(false);
      return;
    }

    const fetchDados = async () => {
      setCarregando(true);

      const query = new URLSearchParams();
      if (filtros.estado) query.append('estado', filtros.estado);
      if (filtros.bioma) query.append('bioma', filtros.bioma);
      if (filtros.inicio) query.append('inicio', filtros.inicio);
      if (filtros.fim) query.append('fim', filtros.fim);

      const url =
        filtros.tipo === 'risco' ? `/api/risco` :
        filtros.tipo === 'foco_calor' ? `/api/foco_calor` :
        filtros.tipo === 'area_queimada' ? `/api/area_queimada` : null;

      try {
        const res = await fetch(`http://localhost:3000${url}?${query.toString()}`);

        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }

        const text = await res.text();

        if (!text.trim()) {
          console.warn('Resposta vazia do backend');
          setDados([]);
          return;
        }

        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          setDados(json);
        } else {
          console.warn('Resposta JSON inesperada:', json);
          setDados([]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        setDados([]);
      } finally {
        setCarregando(false);
      }
    };

    fetchDados();
  }, [filtros]);

  if (carregando) return <p style={{ padding: '2rem' }}>Carregando gráfico...</p>;
  if (!dados.length) return <p style={{ padding: '2rem' }}>Nenhum dado para exibir.</p>;

  const tipo =
    dados[0].area_queimada !== undefined
      ? 'area_queimada'
      : dados[0].frp !== undefined
      ? 'frp'
      : dados[0].risco_fogo !== undefined
      ? 'risco_fogo'
      : 'valor';

  const chartData = [
  ['Estado', 'FRP'],
  ...dados.map((d) => [d.estado, Number(d.frp)])
];

  const chartType = tipo === 'area_queimada' ? 'BarChart' : tipo === 'frp' ? 'ColumnChart' : 'LineChart';

  const options = {
    title: 'Dados filtrados',
    chartArea: { width: '80%' },
    hAxis: { title: 'Data' },
    vAxis: { title: tipo.toUpperCase(), minValue: 0 },
    legend: { position: 'none' },
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        width: '100%',
        height: '100%',
        marginLeft: '350px'
      }}
    >
      <div style={{ width: '60%', minWidth: '500px' }}>
        <Chart
  chartType="BarChart"
  width="100%"
  height="500px"
  data={chartData}
  options={{
    title: 'FRP por Estado',
    chartArea: { width: '70%' },
    hAxis: { title: 'FRP', minValue: 0 },
    vAxis: { title: 'Estado' },
    legend: { position: 'none' },
  }}
/>
      </div>
    </div>
  );
};

export default Grafico;
