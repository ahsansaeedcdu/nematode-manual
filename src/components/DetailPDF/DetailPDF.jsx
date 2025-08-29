// DetailPDF.jsx
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    color: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1d4ed8", // nice blue
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: "1pt solid #e5e7eb", // light divider
  },
  heading: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },
  text: {
    fontSize: 11,
    marginBottom: 4,
  },
  bullet: {
    fontSize: 11,
    marginLeft: 12,
    marginBottom: 2,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  imageWrapper: {
    marginRight: 10,
    marginBottom: 12,
    width: 150,
    alignItems: "center",
  },
  image: {
    width: 140,
    height: 100,
    borderRadius: 6,
  },
  caption: {
    fontSize: 9,
    marginTop: 4,
    color: "#4b5563",
    textAlign: "center",
  },
});

// Helper: split text into sentences
const splitIntoSentences = (text) => {
  if (!text) return [];
  return text.split(/\. (?=[A-Z])/).map((s, idx, arr) => 
    idx < arr.length - 1 ? s.trim() + "." : s.trim()
  );
}
// Mapping JSON keys → nice section titles
const SECTION_LABELS = {
  "Scientific Name": "Scientific Name",
  "Host Range": "Host Range",
  "Symptoms": "Symptoms",
  "Life Cycle": "Life Cycle",
  "Why They Matter": "Why They Matter",
  "Management Options": "Management Options",
  "Further Information": "References & Further Reading",
};

export default function DetailPDF({ aboutData, imageDetails }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>
          {aboutData?.Title || aboutData?.["Common Name"] || "Nematode Detail"}
        </Text>

        {/* Loop through known sections */}
        {Object.keys(SECTION_LABELS).map((key) => {
          if (!aboutData[key]) return null; // skip missing keys
          const val = aboutData[key];

          return (
            <View key={key} style={styles.section}>
              <Text style={styles.heading}>{SECTION_LABELS[key]}</Text>

              {/* Different formatting depending on section */}
              {key === "Symptoms" ? (
                Object.entries(val).map(([subKey, subVal], i) => (
                    <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: "bold", color: "#1d4ed8" }}>
                        {subKey}
                    </Text>
                    <Text style={styles.text}>{String(subVal)}</Text>
                    </View>
                ))
             ) : key === "Why They Matter" ? (
                splitIntoSentences(String(val)).map((line, i) => (
                  <Text key={i} style={styles.bullet}>• {line}</Text>
                ))
              ) : key === "Management Options" ? (
                (Array.isArray(val) ? val : [val]).map((line, i) => (
                  <Text key={i} style={styles.bullet}>• {String(line)}</Text>
                ))
              ) : key === "Further Information" ? (
                (Array.isArray(val) ? val : [val]).map((line, i) => (
                  <Text key={i} style={styles.text}>{String(line)}</Text>
                ))
              ) : (
                <Text style={styles.text}>{String(val)}</Text>
              )}
            </View>
          );
        })}

        {/* Images */}
        {imageDetails?.length > 0 && (
            <View style={styles.section}>
                <Text style={styles.heading}>Images</Text>
                <View style={styles.imageGrid}>
                {imageDetails.map(({ path, name }, i) => (
                    <View key={i} style={styles.imageWrapper} wrap={false}>
                    <Image src={path} style={styles.image} />
                    <Text style={styles.caption}>{name}</Text>
                    </View>
                ))}
                </View>
            </View>
            )}
      </Page>
    </Document>
  );
}

