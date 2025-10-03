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
    color: "#1d4ed8",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: "1pt solid #e5e7eb",
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
    // (react-pdf doesn't officially support 'gap', but margins below achieve spacing)
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
};

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

export default function DetailPDF({
  aboutData = {},
  imageDetails = [],
}) {
  const safeAbout =
    aboutData && typeof aboutData === "object" ? aboutData : {};
  const safeImages = Array.isArray(imageDetails)
    ? imageDetails.filter((x) => x && typeof x === "object" && x.path)
    : [];

  // Only include sections that actually have a value
  const sectionKeys = Object.keys(SECTION_LABELS).filter((key) => {
    const v = safeAbout?.[key];
    return v !== null && v !== undefined && String(v).trim() !== "";
  });

  const toSentences = (val) =>
    typeof splitIntoSentences === "function"
      ? splitIntoSentences(String(val))
      : String(val).split(/(?<=[.!?])\s+/).filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>
          {safeAbout?.Title ||
            safeAbout?.["Common Name"] ||
            "Nematode Detail"}
        </Text>

        {/* Sections */}
        {sectionKeys.map((key) => {
          const val = safeAbout[key];

          // --- Special layout for Symptoms: IMAGES go right under the heading ---
          if (key === "Symptoms") {
            const isObj =
              val && typeof val === "object" && !Array.isArray(val);

            return (
              <View key={key} style={styles.section}>
                <Text style={styles.heading}>{SECTION_LABELS[key]}</Text>

                {/* Images directly under the Symptoms heading */}
                {safeImages.length > 0 && (
                  <View style={{ marginBottom: 8 }}>
                    <View style={styles.imageGrid}>
                      {safeImages.map(({ path, name }, i) => (
                        <View key={i} style={styles.imageWrapper} wrap={false}>
                          <Image src={String(path)} style={styles.image} />
                          {name ? (
                            <Text style={styles.caption}>{String(name)}</Text>
                          ) : null}
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Then the symptoms text/content */}
                {isObj
                  ? Object.entries(val).map(([subKey, subVal], i) => (
                      <View key={i} style={{ marginBottom: 6 }}>
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: "bold",
                            color: "#1d4ed8",
                          }}
                        >
                          {String(subKey)}
                        </Text>
                        <Text style={styles.text}>
                          {String(subVal ?? "—")}
                        </Text>
                      </View>
                    ))
                  : <Text style={styles.text}>{String(val)}</Text>}
              </View>
            );
          }

          // --- Default rendering for other sections ---
          return (
            <View key={key} style={styles.section}>
              <Text style={styles.heading}>{SECTION_LABELS[key]}</Text>

              {key === "Why They Matter" ? (
                toSentences(val).map((line, i) => (
                  <Text key={i} style={styles.bullet}>
                    • {line}
                  </Text>
                ))
              ) : key === "Management Options" ? (
                (Array.isArray(val) ? val : [val])
                  .filter((x) => x != null)
                  .map((line, i) => (
                    <Text key={i} style={styles.bullet}>
                      • {String(line)}
                    </Text>
                  ))
              ) : key === "Further Information" ? (
                (Array.isArray(val) ? val : [val])
                  .filter((x) => x != null)
                  .map((line, i) => (
                    <Text key={i} style={styles.text}>
                      {String(line)}
                    </Text>
                  ))
              ) : (
                <Text style={styles.text}>{String(val)}</Text>
              )}
            </View>
          );
        })}

        {/* Removed the standalone Images section */}
      </Page>
    </Document>
  );
}
