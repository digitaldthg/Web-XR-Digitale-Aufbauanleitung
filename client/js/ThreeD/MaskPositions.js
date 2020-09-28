const MaskPositions = {
  Schienenteile: {
    pos : {
      x : 0, y: 0, z: -0.4328,
    },
    radius: 0.1899,
    message : "mit zwei Verbindungsstiften zentriert und mit einem Schienenverbinder kraftschlüssig verbinden"
  },
  Zugwagen: {
    pos : {
      x : 0, y: 0, z: 0,
    },
    radius: 0.35,
    message : "in der Mitte gegenläufig auf jeweils einer Seite einsetzen"
  },
  Zweilaufradwagen: {
    pos : {
      x : 0, y: 0, z: -0.9251,
    },
    radius: 0.5472,
    message : "auf beiden Seiten je nach Länge anbringen"
  },
  Abstandshalter: {
    pos : {
      x : 0, y: 0, z: -0.643,
    },
    radius: 0.0986,
    message : "je nach Länge und Gewicht platzieren"
  },
  Umlenkrolle: {
    pos : {
      x : 0, y: 0, z: -1.2956,
    },
    radius: 0.1579,
    message : "auf jeweils einer Seite anbringen (Ableitrolle an dem Ende, an dem gezogen wird)"
  },
  Feststeller: {
    pos : {
      x : 0, y: 0, z: -1.3108,
    },
    radius: 0.158,
    message : "an beiden Enden anbringen"
  },
  Rohrhaken: {
    pos : {
      x : 0, y: 0.1798, z: -0.2683,
    },
    radius: 0.1963,
    message : "an den Abhängungen montieren"
  }
}


export default MaskPositions;