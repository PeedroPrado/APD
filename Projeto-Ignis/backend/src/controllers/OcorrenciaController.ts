import { Request, Response } from "express";
import { query } from "../database/db";

interface ResultadoQuery {
  latitude: number;
  longitude: number;
  estado: string;
  bioma: string;
  risco_fogo: number;
  data: string;
  dia_sem_chuva?: string;
  precipitacao?: string;
  frp?: string;
}

class OcorrenciaController {
  // 🔥 RISCO DE FOGO - MAPA
  public async Filtrar_risco_fogo(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim } = req.query;

      let baseQuery = `
        SELECT
          ST_Y(r.geometria) AS latitude,
          ST_X(r.geometria) AS longitude,
          e.estado,
          b.bioma,
          r.risco_fogo,
          r.data
        FROM Risco r
        JOIN Estados e ON r.estado_id = e.id_estado
        JOIN Bioma b ON r.bioma_id = b.id
        WHERE 1=1
      `;

      const values: any[] = [];

      if (estado) {
        baseQuery += ` AND r.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }
      if (bioma) {
        baseQuery += ` AND r.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }
      if (inicio) {
        baseQuery += ` AND r.data >= $${values.length + 1}`;
        values.push(inicio);
      }
      if (fim) {
        baseQuery += ` AND r.data <= $${values.length + 1}`;
        values.push(fim);
      }

      const resultado: ResultadoQuery[] = await query(baseQuery, values);
      res.json(resultado);
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao buscar risco de fogo", detalhes: err.message });
    }
  }

  // 🔥 ÁREA QUEIMADA - MAPA
  public async Filtrar_area_queimada(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim } = req.query;

      let baseQuery = `
        SELECT
          ST_Y(a.geom) AS latitude,
          ST_X(a.geom) AS longitude,
          e.estado,
          b.bioma,
          a.risco AS risco_fogo,
          a.data_pas AS data,
          a.frp,
          'area_queimada' AS tipo
        FROM Area_Queimada a
        JOIN Estados e ON a.estado_id = e.id_estado
        JOIN Bioma b ON a.bioma_id = b.id
        WHERE 1=1
      `;

      const values: any[] = [];

      if (estado) {
        baseQuery += ` AND a.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }
      if (bioma) {
        baseQuery += ` AND a.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }
      if (inicio) {
        baseQuery += ` AND a.data_pas >= $${values.length + 1}`;
        values.push(inicio);
      }
      if (fim) {
        baseQuery += ` AND a.data_pas <= $${values.length + 1}`;
        values.push(fim);
      }

      const resultado: ResultadoQuery[] = await query(baseQuery, values);
      res.json(resultado);
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao buscar área queimada", detalhes: err.message });
    }
  }

  // 🔥 FOCO DE CALOR - MAPA
  public async Filtrar_foco_calor(req: Request, res: Response): Promise<void> {
    try {
      const { estado, bioma, inicio, fim } = req.query;

      let baseQuery = `
        SELECT
          ST_Y(f.geometria) AS latitude,
          ST_X(f.geometria) AS longitude,
          e.estado,
          b.bioma,
          f.risco_fogo AS risco_fogo,
          f.data AS data,
          f.dia_sem_chuva AS dia_sem_chuva,
          f.precipitacao,
          f.frp
        FROM Foco_Calor f
        JOIN Estados e ON f.estado_id = e.id_estado
        JOIN Bioma b ON f.bioma_id = b.id
        WHERE 1=1
      `;

      const values: any[] = [];

      if (estado) {
        baseQuery += ` AND f.estado_id = $${values.length + 1}`;
        values.push(Number(estado));
      }
      if (bioma) {
        baseQuery += ` AND f.bioma_id = $${values.length + 1}`;
        values.push(Number(bioma));
      }
      if (inicio) {
        baseQuery += ` AND f.data >= $${values.length + 1}`;
        values.push(inicio);
      }
      if (fim) {
        baseQuery += ` AND f.data <= $${values.length + 1}`;
        values.push(fim);
      }

      const resultado: ResultadoQuery[] = await query(baseQuery, values);
      res.json(resultado);
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao buscar foco de calor", detalhes: err.message });
    }
  }

  // 🔥 RISCO DE FOGO - GRAFICO
  public async Grafico_risco_fogo(req: Request, res: Response): Promise<void> {
    try {
      const { inicio, fim, agrupamento } = req.query;
      const campoAgrupamento = agrupamento === 'bioma' ? 'b.bioma' : 'e.estado';

      const sql = `
         SELECT 
          e.estado,
          ROUND(AVG(r.risco_fogo), 2) AS risco_medio
        FROM Risco r
        JOIN Estados e ON r.estado_id = e.id_estado
        WHERE 1=1
        ${inicio ? 'AND r.data >= $1' : ''}
        ${fim ? 'AND r.data <= $2' : ''}
        GROUP BY e.estado
        ORDER BY risco_medio DESC
      

      `;

      const resultado = await query(sql, [inicio || null, fim || null]);
      res.json(resultado.rows);
    } catch (err: any) {
      res.status(500).json({ erro: 'Erro interno', detalhes: err.message });
    }
  }

  // 🔥 FOCO DE CALOR - GRAFICO
  public async Grafico_foco_calor(req: Request, res: Response): Promise<void> {
    try {
      const { inicio, fim, agrupamento } = req.query;
      const campoAgrupamento = agrupamento === 'bioma' ? 'b.bioma' : 'e.estado';

      const sql = `
       SELECT 
  e.estado,
  SUM(f.frp) AS frp_total
FROM Foco_Calor f
JOIN Estados e ON f.estado_id = e.id_estado
WHERE 1=1
  -- Opcional: filtro por bioma
  AND ($1::INT IS NULL OR f.bioma_id = $1)
  -- Opcional: filtro por data inicial
  AND ($2::DATE IS NULL OR f.data >= $2)
  -- Opcional: filtro por data final
  AND ($3::DATE IS NULL OR f.data <= $3)
GROUP BY e.estado
ORDER BY frp_total DESC;
      `;

      const resultado = await query(sql, [inicio || null, fim || null]);
      res.json(resultado.rows);
    } catch (err: any) {
      res.status(500).json({ erro: 'Erro interno', detalhes: err.message });
    }
  }

  // 🔥 ÁREA QUEIMADA - GRAFICO
  public async Grafico_area_queimada(req: Request, res: Response): Promise<void> {
    try {
      const { inicio, fim, agrupamento } = req.query;
      const campoAgrupamento = agrupamento === 'bioma' ? 'b.bioma' : 'e.estado';

      const sql = `
        SELECT ${campoAgrupamento} AS grupo, ROUND(SUM(aq.frp), 2) AS area_queimada
        FROM Area_Queimada aq
        JOIN Estados e ON aq.estado_id = e.id_estado
        JOIN Bioma b ON aq.bioma_id = b.id
        WHERE ($1::DATE IS NULL OR aq.data_pas >= $1::DATE)
        AND ($2::DATE IS NULL OR aq.data_pas <= $2::DATE)
        GROUP BY grupo
        ORDER BY area_queimada DESC
      `;

      const resultado = await query(sql, [inicio || null, fim || null]);
      res.json(resultado.rows);
    } catch (err: any) {
      res.status(500).json({ erro: 'Erro interno', detalhes: err.message });
    }
  }
}

export default new OcorrenciaController();
