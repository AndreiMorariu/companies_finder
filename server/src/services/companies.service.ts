import database from "../database/db";
import { NotFoundError, BadRequestError } from "../utils/HttpErrors";
import { CompanyFilters } from "../types/companies";

export function getCompanyByCui(cui: string) {
  if (!cui || cui.trim() === "")
    throw new BadRequestError("CUI is required and cannot be empty");

  const getCompanyByCuiQuery = database.prepare(
    "SELECT * FROM Companies WHERE cui = ?"
  );

  const company = getCompanyByCuiQuery.get(cui);

  if (!company) throw new NotFoundError("Company not found");

  return company;
}

export function getCompaniesStatistics(filters: CompanyFilters) {
  const {
    cui,
    caen,
    active_imobilizate,
    active_circulante,
    stocuri,
    creante,
    casa_si_conturi_la_banci,
    cheltuieli_in_avans,
    datorii,
    venituri_in_avans,
    provizioane,
    capitaluri,
    capital_subcris_varsat,
    patrimoniul_regiei,
    cifra_de_afaceri_neta,
    venituri_totale,
    cheltuieli_totale,
    profit_brut,
    pierdere_bruta,
    profit_net,
    pierdere_neta,
    numar_mediu_de_salariati,
    denumire,
    telefon,
    judet
  } = filters;

  let query = `
    SELECT
      COUNT(*) as companii,
      SUM(cifra_de_afaceri_neta) AS cifra_de_afaceri_neta_totala,
      SUM(profit_net) AS profit_net_total,
      SUM(numar_mediu_de_salariati) AS numar_mediu_de_salariati_total
    FROM
      Companies
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (cui) {
    query += " AND cui = ?";
    params.push(cui);
  }

  if (caen) {
    const caenList = Array.isArray(caen) ? caen : caen.split(",");
    const placeholders = caenList.map(() => "?").join(",");
    query += ` AND caen IN (${placeholders})`;
    params.push(...caenList);
  }

  if (active_imobilizate) {
    query += " AND active_imobilizate >= ?";
    params.push(Number(active_imobilizate));
  }

  if (active_circulante) {
    query += " AND active_circulante >= ?";
    params.push(Number(active_circulante));
  }

  if (stocuri) {
    query += " AND stocuri >= ?";
    params.push(Number(stocuri));
  }

  if (creante) {
    query += " AND creante >= ?";
    params.push(Number(creante));
  }

  if (casa_si_conturi_la_banci) {
    query += " AND casa_si_conturi_la_banci >= ?";
    params.push(Number(casa_si_conturi_la_banci));
  }

  if (cheltuieli_in_avans) {
    query += " AND cheltuieli_in_avans >= ?";
    params.push(Number(cheltuieli_in_avans));
  }

  if (datorii) {
    query += " AND datorii >= ?";
    params.push(Number(datorii));
  }

  if (venituri_in_avans) {
    query += " AND venituri_in_avans >= ?";
    params.push(Number(venituri_in_avans));
  }

  if (provizioane) {
    query += " AND provizioane >= ?";
    params.push(Number(provizioane));
  }

  if (capitaluri) {
    query += " AND capitaluri >= ?";
    params.push(Number(capitaluri));
  }

  if (capital_subcris_varsat) {
    query += " AND capital_subcris_varsat >= ?";
    params.push(Number(capital_subcris_varsat));
  }

  if (patrimoniul_regiei) {
    query += " AND patrimoniul_regiei >= ?";
    params.push(Number(patrimoniul_regiei));
  }

  if (cifra_de_afaceri_neta) {
    query += " AND cifra_de_afaceri_neta >= ?";
    params.push(Number(cifra_de_afaceri_neta));
  }

  if (venituri_totale) {
    query += " AND venituri_totale >= ?";
    params.push(Number(venituri_totale));
  }

  if (cheltuieli_totale) {
    query += " AND cheltuieli_totale >= ?";
    params.push(Number(cheltuieli_totale));
  }

  if (profit_brut) {
    query += " AND profit_brut >= ?";
    params.push(Number(profit_brut));
  }

  if (pierdere_bruta) {
    query += " AND pierdere_bruta >= ?";
    params.push(Number(pierdere_bruta));
  }

  if (profit_net) {
    query += " AND profit_net >= ?";
    params.push(Number(profit_net));
  }

  if (pierdere_neta) {
    query += " AND pierdere_neta >= ?";
    params.push(Number(pierdere_neta));
  }

  if (numar_mediu_de_salariati) {
    query += " AND numar_mediu_de_salariati >= ?";
    params.push(Number(numar_mediu_de_salariati));
  }

  if (denumire) {
    query += " AND lower(denumire) LIKE lower(?)";
    params.push(`%${denumire}%`);
  }

  if (telefon) {
    query += " AND telefon LIKE ?";
    params.push(`%${telefon}%`);
  }

  if (judet) {
    const judetList = Array.isArray(judet) ? judet : judet.split(",");
    const placeholders = judetList.map(() => "?").join(",");
    query += ` AND lower(judet) IN (${placeholders})`;
    params.push(...judetList.map((j) => j.toLowerCase()));
  }

  const statistics = database.prepare(query).get(...params);

  return statistics;
}

export function getCompaniesByFilters(filters: CompanyFilters) {
  const {
    cui,
    caen,
    active_imobilizate,
    active_circulante,
    stocuri,
    creante,
    casa_si_conturi_la_banci,
    cheltuieli_in_avans,
    datorii,
    venituri_in_avans,
    provizioane,
    capitaluri,
    capital_subcris_varsat,
    patrimoniul_regiei,
    cifra_de_afaceri_neta,
    venituri_totale,
    cheltuieli_totale,
    profit_brut,
    pierdere_bruta,
    profit_net,
    pierdere_neta,
    numar_mediu_de_salariati,
    denumire,
    telefon,
    judet,
    limit = 10,
    offset = 0
  } = filters;

  let query = "SELECT * FROM Companies WHERE 1=1";
  const params: (string | number)[] = [];

  if (cui) {
    query += " AND cui = ?";
    params.push(cui);
  }

  if (caen) {
    const caenList = Array.isArray(caen) ? caen : caen.split(",");
    const placeholders = caenList.map(() => "?").join(",");
    query += ` AND caen IN (${placeholders})`;
    params.push(...caenList);
  }

  if (active_imobilizate) {
    query += " AND active_imobilizate >= ?";
    params.push(Number(active_imobilizate));
  }

  if (active_circulante) {
    query += " AND active_circulante >= ?";
    params.push(Number(active_circulante));
  }

  if (stocuri) {
    query += " AND stocuri >= ?";
    params.push(Number(stocuri));
  }

  if (creante) {
    query += " AND creante >= ?";
    params.push(Number(creante));
  }

  if (casa_si_conturi_la_banci) {
    query += " AND casa_si_conturi_la_banci >= ?";
    params.push(Number(casa_si_conturi_la_banci));
  }

  if (cheltuieli_in_avans) {
    query += " AND cheltuieli_in_avans >= ?";
    params.push(Number(cheltuieli_in_avans));
  }

  if (datorii) {
    query += " AND datorii >= ?";
    params.push(Number(datorii));
  }

  if (venituri_in_avans) {
    query += " AND venituri_in_avans >= ?";
    params.push(Number(venituri_in_avans));
  }

  if (provizioane) {
    query += " AND provizioane >= ?";
    params.push(Number(provizioane));
  }

  if (capitaluri) {
    query += " AND capitaluri >= ?";
    params.push(Number(capitaluri));
  }

  if (capital_subcris_varsat) {
    query += " AND capital_subcris_varsat >= ?";
    params.push(Number(capital_subcris_varsat));
  }

  if (patrimoniul_regiei) {
    query += " AND patrimoniul_regiei >= ?";
    params.push(Number(patrimoniul_regiei));
  }

  if (cifra_de_afaceri_neta) {
    query += " AND cifra_de_afaceri_neta >= ?";
    params.push(Number(cifra_de_afaceri_neta));
  }

  if (venituri_totale) {
    query += " AND venituri_totale >= ?";
    params.push(Number(venituri_totale));
  }

  if (cheltuieli_totale) {
    query += " AND cheltuieli_totale >= ?";
    params.push(Number(cheltuieli_totale));
  }

  if (profit_brut) {
    query += " AND profit_brut >= ?";
    params.push(Number(profit_brut));
  }

  if (pierdere_bruta) {
    query += " AND pierdere_bruta >= ?";
    params.push(Number(pierdere_bruta));
  }

  if (profit_net) {
    query += " AND profit_net >= ?";
    params.push(Number(profit_net));
  }

  if (pierdere_neta) {
    query += " AND pierdere_neta >= ?";
    params.push(Number(pierdere_neta));
  }

  if (numar_mediu_de_salariati) {
    query += " AND numar_mediu_de_salariati >= ?";
    params.push(Number(numar_mediu_de_salariati));
  }

  if (denumire) {
    query += " AND lower(denumire) LIKE lower(?)";
    params.push(`%${denumire}%`);
  }

  if (telefon) {
    query += " AND telefon LIKE ?";
    params.push(`%${telefon}%`);
  }

  if (judet) {
    const judetList = Array.isArray(judet) ? judet : judet.split(",");
    const placeholders = judetList.map(() => "?").join(",");
    query += ` AND lower(judet) IN (${placeholders})`;
    params.push(...judetList.map((j) => j.toLowerCase()));
  }

  const totalCompanies = database.prepare(query).all(...params);

  if (limit) {
    query += " LIMIT ?";
    params.push(Number(limit));
  }

  if (offset) {
    query += " OFFSET ?";
    params.push(Number(offset));
  }

  const companies = database.prepare(query).all(...params);

  return { companies, totalCompanies: totalCompanies.length };
}
