import React, { useState } from "react";
import axios from "axios";
import { toJpeg } from "html-to-image";

const App = () => {
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [universities, setUniversities] = useState([]);
  const [filteredUni, setfilteredUni] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const apiURL = "http://universities.hipolabs.com/search";

  
  const functionSearch = () => {
    if (country) {
      axios
        .get(apiURL, { params: { country } })
        .then((response) => {
          setUniversities(response.data);
          setfilteredUni(response.data);

          
          const uniqueProvinces = [
            ...new Set(response.data.map((uni) => uni["state-province"])),
          ].filter((prov) => prov); 
          setProvinces(uniqueProvinces);
        })
        .catch((error) => console.error("Error fetching universities:", error));
    }
  };

  
  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    if (selectedProvince) {
      setfilteredUni(
        universities.filter((uni) => uni["state-province"] === selectedProvince)
      );
    } else {
      setfilteredUni(universities);
    }
  };

  
  const downloadCard = (id) => {
    const node = document.getElementById(id);
    toJpeg(node, { quality: 0.95 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${id}.jpeg`;
        link.click();
      })
      .catch((err) => console.error("Error downloading card:", err));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>University Search</h1>

      <div>
        <label>
          Country:
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="search your desired country"
          />
        </label>
        <button onClick={functionSearch} style={{ marginLeft: "10px" }}>
          Search
        </button>
      </div>

      {provinces.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <label>
            State/Province:
            <select value={province} onChange={handleProvinceChange}>
              <option value="">All</option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "20px" }}>
        {filteredUni.map((uni) => (
          <div
            id={uni.name}
            key={uni.name}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              width: "300px",
              position: "relative",
            }}
          >
            <h3>{uni.name}</h3>
            
            <button onClick={() => downloadCard(uni.name)}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
