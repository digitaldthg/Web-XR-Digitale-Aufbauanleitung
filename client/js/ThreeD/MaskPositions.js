const MaskPositions = {
  Schienenteile: {
    target : {
      x : 0, y: 0, z: -0.4328,
    },
    camera : {x: 0.33, y: 0.2, z: -0.13},
    radius: 0.1899,
    message : "mit zwei Verbindungsstiften zentriert und mit einem Schienenverbinder kraftschlüssig verbinden"
  },
  Zugwagen: {
    target : {
      x : 0, y: 0, z: 0,
    },
    camera: {x: 0.29, y: 0.26, z: 0.39},
    radius: 0.35,
    message : "in der Mitte gegenläufig auf jeweils einer Seite einsetzen"
  },
  Zweilaufradwagen: {
    target : {
      x : 0, y: 0, z: -0.9251,
    },
    camera :{x: 0.62, y: 0.19, z: -0.05},
    radius: 0.5472,
    message : "auf beiden Seiten je nach Länge anbringen"
  },
  Abstandshalter: {
    target : {
      x : 0, y: 0, z: -0.643,
    },
    camera : {x: 0.13, y: 0.23, z: -0.72},
    radius: 0.0986,
    message : "je nach Länge und Gewicht platzieren"
  },
  Umlenkrolle: {
    target : {
      x : 0, y: 0, z: -1.2956,
    },
    camera: {x: 0.19, y: 0.20, z: -1.14},
    radius: 0.1579,
    message : "auf jeweils einer Seite anbringen (Ableitrolle an dem Ende, an dem gezogen wird)"
  },
  Feststeller: {
    target : {
      x : 0, y: 0, z: -1.3108,
    },
    camera : {x: 0.25, y: 0.29, z: -1.06},
    radius: 0.158,
    message : "an beiden Enden anbringen"
  },
  Rohrhaken: {
    target : {
      x : 0, y: 0.1798, z: -0.2683,
    },
    camera :{x: 0.37, y: 0.30, z: 0.04},
    radius: 0.1963,
    message : "an den Abhängungen montieren"
  }
}


export default MaskPositions;