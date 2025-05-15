// Grafico.tsx
import React, { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';

interface Filtros {
  tipo: string;
  estado: string;
  bioma: string;
  inicio: string;
  fim: string;
  agrupamento: 'estado' | 'bioma';
}

interface Dado {
  data: string;
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
    if (!filtros) return;

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

      if (!url) {
        console.warn('Tipo inválido para gráfico.');
        setCarregando(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000${url}?${query.toString()}`);
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const json = await res.json();
          if (Array.isArray(json)) setDados(json);
        } else {
          console.error('Resposta não é JSON válida');
        }
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
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
    ['Data', tipo.toUpperCase()],
    ...dados.map((d) => [
      new Date(d.data).toLocaleDateString('pt-BR'),
      Number(d[tipo as keyof Dado])
    ])
  ];

  const options = {
    title: 'Dados filtrados',
    chartArea: { width: '80%' },
    hAxis: { title: 'Data' },
    vAxis: { title: tipo.toUpperCase() },
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
      }}
    >
      <div style={{ width: '60%', minWidth: '500px' }}>
        <Chart
          chartType="BarChart"
          width="100%"
          height="300px"
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default Grafico;
