import React, { useState } from 'react';
import styled from 'styled-components';

interface FiltroGraficoProps {
  onAplicar: (filtros: {
    tipo: string;
    local: string;
    inicio: string;
    fim: string;
    estado: string;
    bioma: string;
  }) => void;
}

const estados = [
  { id: '11', nome: 'Rondônia' }, { id: '12', nome: 'Acre' }, { id: '13', nome: 'Amazonas' },
  { id: '14', nome: 'Roraima' }, { id: '15', nome: 'Pará' }, { id: '16', nome: 'Amapá' },
  { id: '17', nome: 'Tocantins' }, { id: '29', nome: 'Bahia' }, { id: '27', nome: 'Alagoas'},
  { id: '23', nome: 'Ceará'}, { id: '32', nome: 'Espirito Santo'}, { id: '52', nome: 'Goiás'},
  { id: '21', nome: 'Maranhão'}, { id: '51', nome:'Mato Grosso'}, { id: '50', nome: 'Mato Grosso do Sul'},
  { id: '31', nome:'Minas Gerais'}, { id: '25', nome:'Paraíba'}, { id: '41', nome:'Paraná'},
  { id: '26', nome:'Pernambuco'}, { id: '22', nome: 'Piauí'}, { id: '33', nome: 'Rio de Janeiro'},
  { id: '24', nome: 'Rio Grande do Norte'}, { id: '43', nome: 'Rio Grande do Sul'},
  { id: '42', nome: 'Santa Catarina'}, { id: '35', nome: 'São Paulo'}, { id: '28', nome: 'Sergipe'},
  { id: '53', nome: 'Distrito Federal'},
];

const biomas = [
  { id: '1', nome: 'Amazônia' }, { id: '2', nome: 'Cerrado' }, { id: '3', nome: 'Caatinga' },
  { id: '4', nome: 'Mata Atlântica' }, { id: '5', nome: 'Pampa' }, { id: '6', nome: 'Pantanal' },
];

const FiltroGrafico: React.FC<FiltroGraficoProps> = ({ onAplicar }) => {
  const [tipo, setTipo] = useState('Focos');
  const [local, setLocal] = useState('Estados');
  const [estado, setEstado] = useState('');
  const [bioma, setBioma] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');

  const aplicarFiltro = () => {
    onAplicar({ tipo, local, inicio, fim, estado, bioma });
  };

  const limparFiltros = () => {
    setTipo('Focos');
    setLocal('Estados');
    setEstado('');
    setBioma('');
    setInicio('');
    setFim('');
  };

  return (
    <FiltroContainer>
      <Filtros>
        <GrupoToggle>
          <ToggleWrapper>
            <ToggleLabel>Foco de Calor</ToggleLabel>
            <Switch ativo={tipo === 'Focos'} onClick={() => setTipo('Focos')} />
          </ToggleWrapper>
          <ToggleWrapper>
            <ToggleLabel>Área Queimada</ToggleLabel>
            <Switch ativo={tipo === 'Área Queimada'} onClick={() => setTipo('Área Queimada')} />
          </ToggleWrapper>
          <ToggleWrapper>
            <ToggleLabel>Risco de Fogo</ToggleLabel>
            <Switch ativo={tipo === 'Risco de Fogo'} onClick={() => setTipo('Risco de Fogo')} />
          </ToggleWrapper>
        </GrupoToggle>

        <Label>Estados</Label>
        <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Selecione um estado</option>
          {estados.map((e) => (
            <option key={e.id} value={e.id}>{e.nome}</option>
          ))}
        </Select>

        <Label>Biomas</Label>
        <Select value={bioma} onChange={(e) => setBioma(e.target.value)}>
          <option value="">Selecione um bioma</option>
          {biomas.map((b) => (
            <option key={b.id} value={b.id}>{b.nome}</option>
          ))}
        </Select>

        <Label>Datas:</Label>
        <LabelPequeno>Início</LabelPequeno>
        <Input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
        <LabelPequeno>Fim</LabelPequeno>
        <Input type="date" value={fim} onChange={(e) => setFim(e.target.value)} />

        <ButtonRow>
          <AplicarButton onClick={aplicarFiltro}>Aplicar</AplicarButton>
          <LimparButton onClick={limparFiltros}>Limpar</LimparButton>
        </ButtonRow>
      </Filtros>
    </FiltroContainer>
  );
};

export default FiltroGrafico;

const FiltroContainer = styled.div`
  font-weight: bold;
  padding: 20px;
  background-color: #d32f2f;
  height: 83vh;
  width: 350px;
  border-radius: 0px 8px 8px 8px;
  z-index: 1;
  margin-top: 2%;
  position: fixed;
  color: white;
`;

const Filtros = styled.div`
  padding: 10px 0;
`;

const GrupoToggle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const Switch = styled.div<{ ativo: boolean }>`
  width: 70px;
  height: 30px;
  background-color: ${({ ativo }) => (ativo ? '#eee' : '#666')};
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;

  &::before {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ ativo }) => (ativo ? '38px' : '3px')};
    width: 24px;
    height: 24px;
    background-color: #333;
    border-radius: 50%;
    transition: left 0.3s;
  }
`;

const ToggleLabel = styled.span`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 1rem;
  display: block;
  margin: 10px 0 5px 0;
`;

const LabelPequeno = styled.label`
  font-size: 0.9rem;
  margin-top: 8px;
  display: block;
`;

const Select = styled.select`
  width: 100%;
  padding: 6px;
  margin-bottom: 10px;
  background-color: #37474f;
  color: white;
  border: none;
  border-radius: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 6px;
  margin-bottom: 10px;
  background-color: #37474f;
  color: white;
  border: none;
  border-radius: 4px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const AplicarButton = styled.button`
  flex: 1;
  padding: 10px;
  background-color: #616161;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #388e3c;
  }
`;

const LimparButton = styled(AplicarButton)`
  background-color: #9e9e9e;
  &:hover {
    background-color: #757575;
  }
`;
