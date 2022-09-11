import { join } from "https://deno.land/std@0.155.0/path/mod.ts";
import { parse } from "https://deno.land/std@0.155.0/encoding/csv.ts";

interface Planet {
  [key: string]: string;
}

async function loadPlanetDataPeriods() {
  const path = join(".", "kepler_exoplanets_nasa.csv");
  const file = await Deno.open(path);
  const result = await parse(await Deno.readTextFile(path), {
    skipFirstRow: true,
    comment: "#",
  });

  Deno.close(file.rid);
  const planets = (result as Array<Planet>).filter((planet) => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const stellarRadius = Number(planet["koi_srad"]);
    const stellarMass = Number(planet["koi_smass"]);
    return (
      planet["koi_disposition"] === "CONFIRMED" &&
      planetaryRadius > 0.5 &&
      planetaryRadius < 1.5 &&
      stellarRadius > 0.99 &&
      stellarRadius < 1.01 &&
      stellarMass > 0.78 &&
      stellarMass < 1.04
    );
  });

  return planets.map((planet) => Number(planet["koi_period"]));
}

const newEarthPeriods = await loadPlanetDataPeriods();
const minPeriod = Math.min(...newEarthPeriods);
const maxPeriod = Math.max(...newEarthPeriods);
console.log(`${minPeriod} days was the shortest orbital period found!`);
console.log(`${maxPeriod} days was the longest orbital period found!`);
