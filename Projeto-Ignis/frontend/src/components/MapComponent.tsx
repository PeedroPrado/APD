import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

interface BaseDado {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
  tipo: string;
  dia_sem_chuva?: string;
  precipitacao?: number;
  frp?: number;
}

interface Props {
  dados: BaseDado[];
}

const getColor = (valor: number): string => {
  if (valor >= 0.9) return '#800026';
  if (valor >= 0.7) return '#BD0026';
  if (valor >= 0.5) return '#FC4E2A';
  if (valor >= 0.3) return '#FD8D3C';
  if (valor >= 0.1) return '#FEB24C';
  return '#FFEDA0';
};

const MapComponent: React.FC<Props> = ({ dados }) => {
  if (!dados.length) return <p style={{ padding: '1rem' }}>Nenhum dado encontrado.</p>;

  const tipoAtual = dados[0].tipo;

  if (tipoAtual === 'risco') {
    const grupos = useMemo(() => {
      const agrupado: {
        [chave: string]: {
          total: number;
          lat: number;
          lng: number;
          count: number;
          exemplo: BaseDado;
        };
      } = {};

      dados.forEach(d => {
        const chave = d.estado;
        if (!agrupado[chave]) {
          agrupado[chave] = {
            total: 0,
            lat: 0,
            lng: 0,
            count: 0,
            exemplo: d
          };
        }
        agrupado[chave].total += d.risco_fogo;
        agrupado[chave].lat += d.latitude;
        agrupado[chave].lng += d.longitude;
        agrupado[chave].count++;
      });

      return Object.values(agrupado).map(g => ({
        media: g.total / g.count,
        lat: g.lat / g.count,
        lng: g.lng / g.count,
        exemplo: g.exemplo
      }));
    }, [dados]);

    return (
      <MapContainer center={[-15.78, -47.92]} zoom={4} style={{ height: '100vh', width: '100vw' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {grupos.map((g, i) => (
          <Marker
            key={i}
            position={[g.lat, g.lng]}
            icon={L.divIcon({
              className: 'custom-icon',
              html: `
                <div style="
                  background-color: ${getColor(g.media)};
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 11px;
                  font-weight: bold;
                  color: black;
                  border: 1px solid black;
                  box-shadow: 0 0 4px rgba(0,0,0,0.3);
                ">
                  ${g.media.toFixed(3)}
                </div>`
            })}
          >
            <Popup>
              <div style={{ color: 'black' }}>
                <strong>Estado:</strong> {g.exemplo.estado}<br />
                <strong>Média do risco de fogo:</strong> {g.media.toFixed(3)}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }

  return (
    <MapContainer center={[-15.78, -47.92]} zoom={4} style={{ height: '100vh', width: '100vw' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MarkerClusterGroup
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={true}
        removeOutsideVisibleBounds={true}
        iconCreateFunction={(cluster) => {
          const count = cluster.getChildCount();
          let size = 40;
          let color = '#eb7005';

          if (count >= 500) {
            size = 60;
            color = '#eb7005';
          } else if (count >= 200) {
            size = 50;
            color = '#eb7005';
          } else if (count >= 100) {
            size = 45;
            color = '#eb7005';
          } else if (count >= 50) {
            size = 40;
            color = '#eb7005';
          }

          return L.divIcon({
            html: `
              <div style="
                background-color: ${color};
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: black;
                font-weight: bold;
                font-size: 14px;
                border: 2px solid white;
                box-shadow: 0 0 5px rgba(0,0,0,0.5);
              ">
                ${count}
              </div>
            `,
            className: 'marker-cluster-custom',
            iconSize: L.point(size, size, true)
          });
        }}
      >
        {dados.map((item, idx) => (
          <Marker
            key={idx}
            position={[item.latitude, item.longitude]}
            icon={L.divIcon({
              className: 'custom-fire-icon',
              html: `
                <div style="
                  background-color:rgb(226, 34, 34);
                  color: white;
                  font-size: 18px;
                  width: 28px;
                  height: 28px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 0 3px rgba(0,0,0,0.3);
                ">🔥</div>
              `,
              iconSize: L.point(28, 28, true)
            })}
          >
            <Popup>
              <div style={{ color: 'black' }}>
                <strong>Data:</strong> {new Date(item.data).toLocaleDateString()}<br />
                <strong>Estado:</strong> {item.estado}<br />
                <strong>Bioma:</strong> {item.bioma}<br />
                {item.risco_fogo !== undefined && <><strong>Risco:</strong> {item.risco_fogo}<br /></>}
                {item.frp !== undefined && <><strong>FRP:</strong> {item.frp}<br /></>}
                {item.dia_sem_chuva && <><strong>Dias sem chuva:</strong> {item.dia_sem_chuva}<br /></>}
                {item.precipitacao !== undefined && <><strong>Precipitação:</strong> {item.precipitacao}<br /></>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapComponent;
