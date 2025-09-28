import React from "react";
import "./introduction.css"; // optional for styling

export default function introduction() {
  return (
    <div className="intro-page">
      <h1>
        Plant-Parasitic Nematodes – Biosecurity and Management in Northern
        Australia
      </h1>

      <section>
        <h2>1. Introduction</h2>

        <h3>1.1 What are nematodes </h3>
        <p>	Nematodes are tiny, worm-like  that live in soil and water. Most are harmless or beneficia, helping to break down organic matter. Plant-parasitic nematodes (PPNs) feed on plant roots, reducing water and nutrient uptake. Damage often looks like nutrient or water stress, but unlike those problems, 
        plants won’t recover after fertilising or watering. Most are too small to see without a microscope but can cause major yield losses.
        </p>

        <>{console.log("Introduction component loaded", Date.now())
        }</>


        <h3>1.2 Why biosecurity matters</h3>
        <p>Biosecurity is about preventing pathogens and pests from entering and spreading.PPNs can easily spread through soil on shoes, machinery, or tools, as well as via water flow and planting material. Once PPNs infest a paddock, they are usually only manageable, not eradicable. Prevention is the best defence.
        </p>

        <h3>1.3 Why nematodes matter to agriculture in Northern Australia</h3>
        <p>
          PPNs can reduce crop yield and quality, resulting in serious economic
          losses for growers. The region’s tropical climate and diverse cropping
          systems create ideal conditions for nematode outbreaks, highlighting
          the urgent need for effective and region-specific management
          strategies.
        </p>
      </section>

      <section>
        <h2>2. Key Plant-Parasitic Nematodes in Northern Australia</h2>

        <h3>2.1 Sedentary endoparasite</h3>
        <p>
          These nematodes develop specialised mechanisms for feeding within
          plant roots. Instead of remaining worm-like throughout their life
          cycle, they enter the root and develop into swollen females that are
          fully or partly embedded in root tissue.
        </p>

        <h4>2.1.1 Root-Knot Nematodes (Meloidogyne spp.)</h4>
        <ul>
          <li>
            <strong>Common Name:</strong> Root-knot nematodes
          </li>
          <li>
            <strong>Scientific Name:</strong> Meloidogyne spp.
          </li>
          <li>
            <strong>Distribution:</strong> Five species confirmed in the region:
            M. arenaria, M. incognita, M. javanica, M. thamesi, and M.
            enterolobii.
          </li>
          <li>
            <strong>Crops at Risk:</strong> Tomato, capsicum, watermelon,
            peanut, mungbean, cucumber, sweetpotato, eggplant, cotton, etc.
          </li>
          <li>
            <strong>Symptoms:</strong> Roots: Galling, swelling, rotting.
            Aboveground: Stunting, wilting, uneven growth.
          </li>
          <li>
            <strong>Life Cycle:</strong> 4–6 weeks at 24–28°C; females lay up to
            1,000 eggs.
          </li>
          <li>
            <strong>Why They Matter:</strong> Yield loss of 5–20% or more; M.
            enterolobii can overcome resistance genes.
          </li>
        </ul>

        <h4>2.1.2 Lesion Nematodes (Pratylenchus spp.)</h4>
        <ul>
          <li>
            <strong>Common Name:</strong> Cyst nematodes
          </li>
          <li>
            <strong>Scientific Name:</strong> Globodera spp. & Heterodera spp.
          </li>
          <li>
            <strong>Distribution:</strong> Limited detections in Northern
            Australia.
          </li>
          <li>
            <strong>Crops at Risk:</strong> Potato, sugarcane, cereals, legumes.
          </li>
          <li>
            <strong>Symptoms:</strong> Stunted roots, visible cysts; aboveground
            yellowing, patchy growth.
          </li>
          <li>
            <strong>Life Cycle:</strong> 5–8 weeks; cysts survive for years
            without a host.
          </li>
          <li>
            <strong>Management:</strong> Resistant varieties, crop rotation,
            biosecurity controls.
          </li>
        </ul>

        <h3>2.2 Sedentary semi-endoparasite</h3>
        <p>
          These nematodes keep their head inside the root while the rest remains
          outside. Eggs are laid in a gelatinous matrix on the root surface.
        </p>

        <h4>2.2.1 Reniform Nematodes (Rotylenchulus spp.)</h4>
        <ul>
          <li>
            <strong>Common Name:</strong> Reniform nematodes
          </li>
          <li>
            <strong>Scientific Name:</strong> Rotylenchulus spp.
          </li>
          <li>
            <strong>Distribution:</strong> Widespread across NT, Nth QLD, and
            Nth WA.
          </li>
          <li>
            <strong>Crops at Risk:</strong> Cotton, pineapple, capsicum, tomato,
            mungbean, sweetpotato, soybean.
          </li>
          <li>
            <strong>Symptoms:</strong> Reduced root volume, stunted growth,
            yellowing, wilting.
          </li>
          <li>
            <strong>Life Cycle:</strong> Under 3 weeks; females lay 40–100 eggs.
          </li>
          <li>
            <strong>Why They Matter:</strong> High reproductive potential, broad
            host range, subtle symptoms.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Preventing Nematode Spread</h2>
        <ul>
          <li>
            Clean and disinfect machinery, tools, and footwear between fields.
          </li>
          <li>Use certified nematode-free seeds and plants.</li>
          <li>Avoid moving soil from infested areas.</li>
          <li>Quarantine new plants before planting.</li>
        </ul>
      </section>

      <section>
        <h2>4. Integrated Nematode Management</h2>
        <ul>
          <li>
            <strong>Crop Rotation:</strong> Use non-host crops to break nematode
            cycles.
          </li>
          <li>
            <strong>Biological Controls:</strong> Introduce beneficial
            microorganisms.
          </li>
          <li>
            <strong>Soil Health:</strong> Maintain organic matter, use cover
            crops.
          </li>
          <li>
            <strong>Chemical Controls:</strong> Apply nematicides as last
            resort, follow labels.
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Resources for Growers</h2>
        <p>Contact your state diagnostic laboratory for testing and advice:</p>
        <ul>
          <li>
            <strong>NT:</strong> Northern Territory Department of Industry,
            Tourism and Trade
          </li>
          <li>
            <strong>QLD:</strong> [Insert Contact]
          </li>
          <li>
            <strong>WA:</strong> [Insert Contact]
          </li>
        </ul>
      </section>
    </div>
  );
}
