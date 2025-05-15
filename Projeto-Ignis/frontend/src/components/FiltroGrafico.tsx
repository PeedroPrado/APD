// FiltroGrafico.tsx seguro com navegação de rota ao aplicar
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface FiltroGraficoProps {
  onFiltrar: (filtros: {
    tipo: 'foco_calor' | 'area_queimada' | 'risco';
    estado: string;
    bioma: string;
    inicio: string;
    fim: string;
  }) => void;
}

const FiltroGrafico: React.FC<FiltroGraficoProps> = ({ onFiltrar }) => {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState<'foco_calor' | 'area_queimada' | 'risco'>('foco_calor');
  const [estado, setEstado] = useState('');
  const [bioma, setBioma] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');

  const aplicarFiltro = () => {
    onFiltrar({ tipo, estado, bioma, inicio, fim });
    const rota = tipo === 'foco_calor' ? '/foco_calor' : tipo === 'area_queimada' ? '/area_queimada' : '/risco';
    navigate(rota);
  };

  const limparFiltro = () => {
    setTipo('foco_calor');
    setEstado('');
    setBioma('');
    setInicio('');
    setFim('');
    onFiltrar({ tipo: 'foco_calor', estado: '', bioma: '', inicio: '', fim: '' });
    navigate('/foco_calor');
  };

  return (
    <FiltroContainer>
      <Filtros>
        <label>Tipo de dado</label>
        <Select value={tipo} onChange={(e) => setTipo(e.target.value as 'foco_calor' | 'area_queimada' | 'risco')}>
          <option value="foco_calor">Foco de Calor</option>
          <option value="area_queimada">Área Queimada</option>
          <option value="risco">Risco de Fogo</option>
        </Select>

        <label>Estados</label>
        <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="">Selecione um estado</option>
          <option value="12">Acre</option>
          <option value="27">Alagoas</option>
          <option value="16">Amapá</option>
          <option value="13">Amazonas</option>
          <option value="29">Bahia</option>
          <option value="23">Ceará</option>
          <option value="32">Espírito Santo</option>
          <option value="52">Goiás</option>
          <option value="21">Maranhão</option>
          <option value="51">Mato Grosso</option>
          <option value="50">Mato Grosso do Sul</option>
          <option value="31">Minas Gerais</option>
          <option value="15">Pará</option>
          <option value="25">Paraíba</option>
          <option value="41">Paraná</option>
          <option value="26">Pernambuco</option>
          <option value="22">Piauí</option>
          <option value="33">Rio de Janeiro</option>
          <option value="24">Rio Grande do Norte</option>
          <option value="43">Rio Grande do Sul</option>
          <option value="11">Rondônia</option>
          <option value="14">Roraima</option>
          <option value="42">Santa Catarina</option>
          <option value="35">São Paulo</option>
          <option value="28">Sergipe</option>
          <option value="17">Tocantins</option>
          <option value="53">Distrito Federal</option>
        </Select>

         <label>Biomas</label>
        <Select value={bioma} onChange={(e) => setBioma(e.target.value)}>
          <option value="">Selecione um bioma</option>
          <option value="3">Cerrado</option>
          <option value="2">Caatinga</option>
          <option value="6">Pantanal</option>
          <option value="4">Mata Atlântica</option>
          <option value="5">Pampa</option>
          <option value="1">Amazônia</option>
        </Select>

         <Datas>
          <Label>Datas:</Label>
          <InputGroup>
            <InputContainer>
              <Label>Início</Label>
              <Input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
            </InputContainer>
            <InputContainer>
              <Label>Fim</Label>
              <Input type="date" value={fim} onChange={(e) => setFim(e.target.value)} />
            </InputContainer>
          </InputGroup>
        </Datas>

        <AplicarButton onClick={aplicarFiltro}>Aplicar</AplicarButton>
        <LimparButton onClick={limparFiltro}>Limpar</LimparButton>
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
`;

const Filtros = styled.div`
  padding: 10px 0;
`;

const Select = styled.select`
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const Datas = styled.div`
  margin-top: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 1rem;
  display: block;
  margin-bottom: 5px;
`;

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
`;

const Input = styled.input`
  padding: 8px;
  width: 150px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-top: 5px;
`;

const AplicarButton = styled.button`
  margin-top: 10px;
  margin-left: 250px;
  width: 100px;
  padding: 8px;
  background-color: #616161;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #388E3C;
  }
`;

const LimparButton = styled.button`
  margin-top: 5px;
  margin-left: 10px;
  width: 100px;
  padding: 8px;
  background-color: #616161;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #388E3C;
  }
`;
